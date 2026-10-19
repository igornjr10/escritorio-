/**
 * Derives UI feedback from the public conversation projection.
 * Never includes prompt, reasoning, tool input/output, or provider error text.
 * @param {import('eve/react').ConversationState} conversation
 * @param {string} status
 */
export function replyState(conversation, status) {
  const messages = conversation.messages;
  let start = -1;
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === 'user') { start = i; break; }
  }
  if (start === -1) return 'none';
  const replies = messages.slice(start + 1).filter(m => m.role === 'assistant');
  const turnId = messages[start].metadata?.turnId || replies[replies.length - 1]?.metadata?.turnId;
  const turn = turnId ? conversation.turns[turnId] : undefined;
  if (status === 'error' || turn?.status === 'failed') return 'failed';
  if (turn?.status === 'cancelled') return 'cancelled';
  if (replies.some(m => m.parts.some(p => p.type === 'authorization' && p.state === 'required')) ||
      Object.values(conversation.inputs).some(input => input.status === 'open')) return 'pending';
  if (status === 'submitted' || status === 'streaming' || status === 'resuming' || turn?.status === 'active') return 'working';
  if (replies.some(m => m.parts.some(p => p.type === 'text' && p.text.trim().length > 0))) return 'answered';
  return 'empty';
}

/**
 * Only explicit structural fields leave the conversation through this diagnostic.
 * @param {import('eve/react').ConversationState} conversation
 * @param {readonly import('eve/client').MessageStreamEvent[]} events
 * @param {string} status
 */
export function safeDiagnostic(conversation, events, status) {
  return {
    version: 'maya-feedback-v2',
    latestFailure: latestFailure(events),
    status,
    replyState: replyState(conversation, status),
    turns: Object.values(conversation.turns).map(t => ({ status: t.status, waiting: t.waiting === true })),
    messages: conversation.messages.map(m => ({
      role: m.role,
      status: m.metadata?.status,
      parts: m.parts.map(p => ({
        type: p.type,
        ...('state' in p ? { state: p.state } : {}),
        ...(p.type === 'text' ? { characters: p.text.length } : {}),
      })),
    })),
    events: events.slice(-30).map(event => ({
      type: event.type,
      ...((event.type === 'step.failed' || event.type === 'turn.failed' || event.type === 'session.failed')
        ? { failure: failureSummary(event.data) } : {}),
      ...(event.type === 'step.completed' || event.type === 'message.completed'
        ? { finishReason: event.data.finishReason } : {}),
    })),
  };
}

/**
 * Classify lifecycle failures without exposing the original error, request or provider payload.
 * Labels are clues from the error, not an independently verified account diagnosis.
 * @param {{code?: unknown, message?: unknown, details?: unknown}} data
 */
export function failureSummary(data) {
  const rawCode = typeof data.code === 'string' ? data.code : '';
  const code = /^[A-Z][A-Z0-9_]{1,63}$/.test(rawCode) ? rawCode : 'UNCLASSIFIED';
  const snippets = [rawCode, typeof data.message === 'string' ? data.message : ''];
  /** @type {number | undefined} */
  let httpStatus;
  /** @param {unknown} value @param {number} depth */
  function inspect(value, depth) {
    if (!value || typeof value !== 'object' || depth > 3) return;
    const object = /** @type {Record<string, unknown>} */ (value);
    for (const key of ['message', 'code', 'name']) {
      if (typeof object[key] === 'string') snippets.push(object[key].slice(0, 4000));
    }
    for (const key of ['statusCode', 'status']) {
      const n = object[key];
      if (typeof n === 'number' && Number.isInteger(n) && n >= 400 && n <= 599) httpStatus = n;
    }
    inspect(object.cause, depth + 1);
    inspect(object.error, depth + 1);
  }
  inspect(data.details, 0);
  const text = snippets.join(' ');
  let category = 'unknown';
  let hint = 'O evento não identificou uma causa conhecida. Consulte o erro desta execução nos Logs da Vercel.';
  if (/insufficient.?quota|credit|billing|balance|payment.required|insufficient.funds/i.test(text) || httpStatus === 402) {
    category = 'billing_or_quota'; hint = 'O erro indica saldo ou limite de uso. Confira o AI Gateway da equipe.';
  } else if (/unauthor|authentication|invalid.api.key|missing.api.key|no.api.key|credential|oidc/i.test(text) || httpStatus === 401) {
    category = 'authentication'; hint = 'O erro indica autenticação do serviço de IA. Confira o acesso do projeto ao AI Gateway.';
  } else if (/model.{0,100}(not.found|not.available|does.not.exist|not.supported)|unknown.model|invalid.model|unsupported.model|no.such.model/i.test(text)) {
    category = 'model_unavailable'; hint = 'O erro indica que o modelo configurado não está disponível nessa conexão.';
  } else if (/rate.limit|too.many.requests/i.test(text) || httpStatus === 429) {
    category = 'rate_limit'; hint = 'O serviço informou limite de requisições. Aguarde antes de tentar novamente.';
  } else if (/forbidden|permission|access.denied|not.allowed/i.test(text) || httpStatus === 403) {
    category = 'permission'; hint = 'O serviço recusou acesso. Confira as permissões do projeto e do modelo.';
  } else if (/unsupported|not.supported|invalid.parameter|invalid.argument|invalid.request/i.test(text) || httpStatus === 400 || httpStatus === 422) {
    category = 'request_configuration'; hint = 'O serviço rejeitou uma configuração da chamada. O código do erro ajuda a localizar o parâmetro.';
  } else if (/timeout|timed.out|ETIMEDOUT/i.test(text) || httpStatus === 408 || httpStatus === 504) {
    category = 'timeout'; hint = 'A chamada excedeu o tempo de espera.';
  } else if (/fetch.failed|ENOTFOUND|ECONN|network/i.test(text)) {
    category = 'connection'; hint = 'O erro indica uma falha de conexão com o serviço de IA.';
  } else if (/workflow|sandbox|queue|blob/i.test(text)) {
    category = 'infrastructure'; hint = 'O erro indica um recurso de execução. Consulte os Logs da Vercel.';
  }
  return { code, category, ...(httpStatus === undefined ? {} : { httpStatus }), hint };
}

/** @param {readonly import('eve/client').MessageStreamEvent[]} events */
export function latestFailure(events) {
  for (let i = events.length - 1; i >= 0; i--) {
    const event = events[i];
    if (event.type === 'step.failed' || event.type === 'turn.failed' || event.type === 'session.failed') {
      const summary = failureSummary(event.data);
      // A wrapper can hide the useful cause recorded by the immediately preceding step.
      if (summary.category === 'unknown' && event.type === 'turn.failed') {
        for (let j = i - 1; j >= 0; j--) {
          const previous = events[j];
          if (previous.type === 'turn.started' || previous.type === 'turn.completed' || previous.type === 'turn.cancelled') break;
          if (previous.type === 'step.failed' && previous.data.turnId === event.data.turnId) {
            const step = failureSummary(previous.data);
            if (step.category !== 'unknown') return step;
            break;
          }
        }
      }
      return summary;
    }
  }
  return undefined;
}
