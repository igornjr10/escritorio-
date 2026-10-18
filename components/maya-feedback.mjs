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
    version: 'maya-feedback-v1',
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
      ...(event.type === 'step.completed' || event.type === 'message.completed'
        ? { finishReason: event.data.finishReason } : {}),
    })),
  };
}
