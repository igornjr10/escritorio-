'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { openConversationInputs, useEveAgent } from 'eve/react';
import type { ClientSessionState } from 'eve/client';
import { replyState, safeDiagnostic } from './maya-feedback.mjs';

type RecordEntry = { id: string; title: string; updatedAt: string };
const CURRENT = 'igor-office-maya-session-v1', HISTORY = 'igor-office-maya-history-v1';
function readHistory(): RecordEntry[] { try { const parsed = JSON.parse(localStorage.getItem(HISTORY) || '[]'); return Array.isArray(parsed) ? parsed.filter(x => typeof x.id === 'string' && typeof x.title === 'string').slice(0, 40) : []; } catch { return []; } }
function startingSession(): ClientSessionState | undefined {
  const linked = new URLSearchParams(location.search).get('session');
  if (linked && /^[a-zA-Z0-9_-]{1,200}$/.test(linked)) return { sessionId: linked, streamIndex: 0 };
  try { const saved = JSON.parse(localStorage.getItem(CURRENT) || 'null'); if (saved && typeof saved.sessionId === 'string') return { sessionId: saved.sessionId, streamIndex: 0 }; } catch {}
}
function errorLabel(error: unknown): string {
  const text = error instanceof Error ? error.message : String(error || '');
  if (/401|unauthor|authentica/i.test(text)) return 'Sua sessão expirou ou a autenticação da IA precisa ser configurada. Entre novamente e confira o acesso ao modelo.';
  if (/429|quota|credit|billing|balance/i.test(text)) return 'A execução foi interrompida por limite de uso ou saldo da IA. Verifique a conta antes de tentar novamente.';
  return 'Não foi possível concluir a execução. Confira a conexão e a configuração da IA. Nenhuma entrega foi marcada como concluída.';
}

export default function Office() {
  const [access, setAccess] = useState<{ configured: boolean; authenticated: boolean } | null>(null);
  const [accessKey, setAccessKey] = useState('');
  const [error, setError] = useState('');
  const [loginBusy, setLoginBusy] = useState(false);
  const [opened, setOpened] = useState(false);
  const [brief, setBrief] = useState('');
  const [status, setStatus] = useState('ready');
  const frame = useRef<HTMLIFrameElement>(null);
  const closeMaya = useCallback(() => setOpened(false), []);
  const refresh = useCallback(async () => { try { const r = await fetch('/api/session', { cache: 'no-store' }); if (!r.ok) throw new Error(); setAccess(await r.json()); setError(''); } catch { setError('Não foi possível verificar o acesso. Tente novamente.'); } }, []);
  useEffect(() => { void refresh(); }, [refresh]);
  useEffect(() => {
    const listener = (event: MessageEvent) => {
      if (event.origin !== location.origin || event.source !== frame.current?.contentWindow || event.data?.type !== 'open-maya') return;
      setBrief(typeof event.data.brief === 'string' ? event.data.brief.slice(0, 8000) : ''); setOpened(true);
    };
    addEventListener('message', listener); return () => removeEventListener('message', listener);
  }, []);
  const transmit = useCallback((value: string) => frame.current?.contentWindow?.postMessage({ type: 'maya-status', status: value }, location.origin), []);
  const updateStatus = useCallback((value: string) => { setStatus(value); transmit(value); }, [transmit]);
  async function login(event: React.FormEvent) {
    event.preventDefault(); setError(''); setLoginBusy(true);
    try { const r = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: accessKey }) }); const data = await r.json(); if (!r.ok) throw new Error(data.error); setAccessKey(''); await refresh(); }
    catch (e) { setError(e instanceof Error ? e.message : 'Falha ao entrar.'); }
    finally { setLoginBusy(false); }
  }
  async function logout() {
    const r = await fetch('/api/logout', { method: 'POST' }); if (r.ok) { setAccess({ configured: true, authenticated: false }); setOpened(false); } else setError('Não foi possível sair. Tente novamente.');
  }
  if (!access) return <div className="login-page"><div className="login-card"><p>Preparando seu escritório…</p>{error && <><p role="alert">{error}</p><button onClick={() => void refresh()}>Tentar novamente</button></>}</div></div>;
  if (!access.authenticated) return <main className="login-page"><form className="login-card" onSubmit={login}><div className="wordmark">igor<span>office</span></div><span className="eyebrow">SEU ESCRITÓRIO DE AGENTES</span><h1>Entre. A próxima ideia<br />começa aqui.</h1><p>Um espaço privado para trabalhar com a Maya e organizar sua equipe.</p>{!access.configured ? <div className="notice">O escritório está preparado, mas o acesso ainda não foi configurado na hospedagem. Nenhuma execução de IA está liberada.</div> : <><label htmlFor="access">Código de acesso do escritório</label><input id="access" type="password" value={accessKey} onChange={e => setAccessKey(e.target.value)} autoComplete="current-password" required maxLength={512} /><button className="primary" disabled={loginBusy}>{loginBusy ? 'Entrando…' : 'Abrir meu escritório →'}</button></>}{error && <p className="error" role="alert">{error}</p>}<small>Maya: conteúdo com IA · Outros agentes: demonstração</small></form></main>;
  return <><iframe ref={frame} src="/office/index.html" title="Escritório visual de Igor Ruan" className="office-frame" onLoad={() => transmit(status)} /><div className="maya-launch"><button onClick={() => setOpened(true)}>✦ Conversar com Maya</button><button className="signout" onClick={() => void logout()}>Sair</button></div><Maya opened={opened} onClose={closeMaya} brief={brief} onStatus={updateStatus} />{error && <p role="alert" className="global-error">{error}</p>}</>;
}

function Maya({ opened, onClose, brief, onStatus }: { opened: boolean; onClose: () => void; brief: string; onStatus: (status: string) => void }) {
  const [initial] = useState(startingSession);
  const [draft, setDraft] = useState('');
  const [history, setHistory] = useState<RecordEntry[]>(readHistory);
  const [notice, setNotice] = useState('');
  const [currentError, setCurrentError] = useState('');
  const [syncBusy, setSyncBusy] = useState(false);
  const [diagnostic, setDiagnostic] = useState('');
  const titleRef = useRef('Conversa com Maya');
  const bottom = useRef<HTMLDivElement>(null);
  const pane = useRef<HTMLElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const agent = useEveAgent({
    initialSession: initial,
    resume: !!initial,
    followIdle: false,
    onSessionChange(session) {
      try {
        if (session) {
          localStorage.setItem(CURRENT, JSON.stringify(session));
          const old = readHistory(); const entry = old.find(x => x.id === session.sessionId);
          const next = [{ id: session.sessionId, title: entry?.title || titleRef.current, updatedAt: new Date().toISOString() }, ...old.filter(x => x.id !== session.sessionId)].slice(0, 40);
          localStorage.setItem(HISTORY, JSON.stringify(next)); setHistory(next);
          const url = new URL(location.href); url.searchParams.set('session', session.sessionId); window.history.replaceState(null, '', url);
        } else { localStorage.removeItem(CURRENT); const url = new URL(location.href); url.searchParams.delete('session'); window.history.replaceState(null, '', url); }
      } catch { setNotice('Não foi possível salvar o atalho local. Copie o link da conversa para retomar depois.'); }
    },
    onError(error) { setCurrentError(errorLabel(error)); },
  });
  const outcome = replyState(agent.data, agent.status);
  const effectiveStatus = outcome === 'failed' ? 'error' : outcome === 'working' && agent.status === 'ready' ? 'streaming' : agent.status;
  const busy = effectiveStatus === 'submitted' || effectiveStatus === 'streaming';
  const resuming = agent.status === 'resuming' || syncBusy;
  const inputs = openConversationInputs(agent.data).map(input => input.request);
  useEffect(() => { if (brief) setDraft(brief); }, [brief]);
  useEffect(() => { onStatus(effectiveStatus); }, [effectiveStatus, onStatus]);
  useEffect(() => { if (opened) bottom.current?.scrollIntoView({ block: 'end' }); }, [agent.data.messages, opened]);
  useEffect(() => {
    if (!opened) return;
    previousFocus.current = document.activeElement as HTMLElement;
    pane.current?.querySelector<HTMLButtonElement>('button')?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); }
      if (event.key !== 'Tab') return;
      const focusable = pane.current?.querySelectorAll<HTMLElement>('button:not(:disabled), textarea:not(:disabled), select:not(:disabled), a[href]');
      if (!focusable?.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', keydown); return () => { document.removeEventListener('keydown', keydown); previousFocus.current?.focus(); };
  }, [opened, onClose]);
  async function send(event: React.FormEvent) {
    event.preventDefault(); const text = draft.trim(); if (!text || busy || resuming) return;
    titleRef.current = text.slice(0, 75); setCurrentError(''); setNotice(''); setDraft('');
    try { await agent.send(text); } catch (e) { setCurrentError(errorLabel(e)); setDraft(text); }
  }
  async function recover() {
    if (syncBusy || agent.status === 'resuming' || agent.status === 'submitted' || agent.status === 'streaming') return;
    setSyncBusy(true); setCurrentError(''); setNotice('');
    try { await agent.resume(); }
    catch (e) { setCurrentError(errorLabel(e)); }
    finally { setSyncBusy(false); }
  }
  async function copyDiagnostic() {
    const report = JSON.stringify(safeDiagnostic(agent.data, agent.events, agent.status), null, 2);
    setDiagnostic(report);
    try { await navigator.clipboard.writeText(report); setNotice('Diagnóstico copiado. Ele contém apenas estados e tipos de eventos, sem mensagens, senha ou conteúdo interno da IA.'); }
    catch { setNotice('Não foi possível copiar automaticamente. Abra o diagnóstico abaixo e copie o texto.'); }
  }
  function download() {
    const text = agent.data.messages.map(m => `${m.role === 'user' ? 'IGOR' : 'MAYA'}\n${m.parts.filter(p => p.type === 'text').map(p => p.type === 'text' ? p.text : '').join('\n')}`).filter(Boolean).join('\n\n---\n\n');
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' })); const link = document.createElement('a'); link.href = url; link.download = 'maya-conversa.txt'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const stateLabel = syncBusy ? 'Recuperando a conversa' : outcome === 'empty' ? 'Sem resposta de texto' : outcome === 'cancelled' ? 'Execução cancelada' : outcome === 'pending' ? 'Aguardando uma ação sua' : { ready: 'Pronta para receber um tema', submitted: 'Solicitação enviada', streaming: 'Trabalhando na sua solicitação', resuming: 'Recuperando a conversa', error: 'Execução interrompida' }[effectiveStatus];
  return <div className={`maya-overlay ${opened ? '' : 'closed'}`}><button className="backdrop" aria-label="Voltar ao escritório" onClick={onClose} tabIndex={-1}/><section ref={pane} role="dialog" aria-modal="true" aria-labelledby="maya-title" className="maya-pane"><header className="maya-header"><div className="maya-avatar">M</div><div><h2 id="maya-title">Maya <span>CONTEÚDO</span></h2><p aria-live="polite">{stateLabel}</p></div><button className="icon-button" aria-label="Fechar painel" onClick={onClose}>×</button></header><div className="chat-tools"><button disabled={busy || resuming} onClick={() => { agent.reset(); setDraft(''); setCurrentError(''); setNotice(''); setDiagnostic(''); }}>＋ Nova conversa</button><button disabled={!agent.data.messages.length} onClick={download}>Exportar</button><button disabled={!agent.session} onClick={() => { void navigator.clipboard.writeText(location.href).then(() => setNotice('Link copiado. Ele exige o código de acesso do escritório.'), () => setNotice('Copie a URL da barra do navegador.')); }}>Copiar link</button><button disabled={!agent.session} onClick={() => void copyDiagnostic()}>Copiar diagnóstico</button></div><div className="history"><label htmlFor="history">Retomar conversa</label><select id="history" value={agent.session?.sessionId || ''} disabled={busy || resuming} onChange={e => { if (e.target.value) location.href = '/?session=' + encodeURIComponent(e.target.value); }}><option value="">Selecione uma conversa</option>{history.map(h => <option key={h.id} value={h.id}>{h.title}</option>)}</select><small>Atalhos neste navegador. Conversas recuperadas do servidor pelo link.</small></div><div className="messages">{!agent.data.messages.length && <div className="chat-empty"><span>✦</span><h3>Da ideia ao conteúdo.</h3><p>Me diga o tema e o público. Eu preparo um roteiro com gancho, cenas, falas e CTA.</p><button onClick={() => setDraft('Crie um Reels de 45 segundos para empresários mostrando como um agente de IA pode organizar leads que chegam pelo WhatsApp. Use um exemplo hipotético e um CTA para minha DM.')}>Começar com IA no WhatsApp ↗</button><small>Esta versão não pesquisa notícias nem publica nas redes.</small></div>}{agent.data.messages.map(message => <article className={`message ${message.role}`} key={message.id}>
  <b>{message.role === 'user' ? 'Você' : 'Maya'}</b>
  {message.parts.map((part, i) => {
    if (part.type === 'text') return <div className="message-text" key={part.id || i}>{part.text}</div>;
    if (part.type === 'dynamic-tool') return <div className={part.state === 'output-error' ? 'error' : 'notice'} key={part.toolCallId}>
      <span>{part.toolMetadata?.eve?.label || 'Consultando informações para sua resposta'}</span>
      <small style={{ display: 'block' }}>{part.state === 'output-error' ? 'Esta etapa falhou. Copie o diagnóstico para investigar.' : part.state === 'output-available' ? 'Informações recebidas.' : part.state === 'output-denied' ? 'Etapa não autorizada.' : part.state === 'approval-requested' || part.state === 'approval-responded' ? 'Aguardando autorização.' : 'Processando esta etapa…'}</small>
    </div>;
    if (part.type === 'authorization') return <p className="notice" key={part.attemptId || i}>{part.state === 'required' ? 'Há uma autorização pendente para continuar esta execução.' : 'A etapa de autorização foi encerrada.'}</p>;
    return null;
  })}
  {message.role === 'assistant' && !message.parts.some(part => (part.type === 'text' && part.text.trim()) || part.type === 'dynamic-tool' || part.type === 'authorization') && <p className="notice">{message.metadata?.turnId && agent.data.turns[message.metadata.turnId]?.status === 'active' ? 'A Maya está preparando a resposta…' : 'Nenhuma resposta de texto foi recebida nesta execução.'}</p>}
</article>)}{busy && <div className="working" role="status"><i/> Aguardando os próximos eventos da Maya…</div>}{(currentError || agent.error) && <p className="error" role="alert">{currentError || errorLabel(agent.error)}</p>}
{(outcome === 'empty' || outcome === 'failed') && <div className="notice" role="status">
  <p>{outcome === 'failed' ? 'A execução falhou antes de entregar uma resposta completa.' : 'Sua mensagem está registrada, mas ainda não recebemos uma resposta de texto. Isso não confirma uma entrega da IA.'}</p>
  <button type="button" disabled={resuming} onClick={() => void recover()}>{resuming ? 'Consultando…' : 'Recuperar resposta'}</button>
  <p><small>Esse botão consulta a conversa existente sem enviar outra tarefa à IA. Se continuar sem resposta, use “Copiar diagnóstico”.</small></p>
</div>}
{diagnostic && <details className="notice"><summary>Ver diagnóstico sem conteúdo da conversa</summary><pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', fontSize: 12 }}>{diagnostic}</pre></details>}{notice && <p className="notice" role="status">{notice}</p>}{inputs.map(input => <div className="approval" key={input.requestId}><p>{input.prompt}</p>{input.options?.map(option => <button disabled={resuming} key={option.id} onClick={() => { void agent.respond([{ requestId: input.requestId, optionId: option.id }]).catch(e => setCurrentError(errorLabel(e))); }}>{option.label}</button>)}</div>)}<div ref={bottom}/></div><form className="composer" onSubmit={send}><label htmlFor="brief">Seu próximo conteúdo</label><textarea id="brief" value={draft} onChange={e => setDraft(e.target.value)} placeholder="Ex.: Um Reels para donos de lojas que perdem leads no WhatsApp…" maxLength={8000} rows={3} disabled={resuming}/><div><span>{draft.length}/8000</span>{busy ? <button type="button" className="cancel" onClick={() => { void agent.cancel().catch(e => setCurrentError(errorLabel(e))); }}>Cancelar execução</button> : <button className="primary" disabled={!draft.trim() || resuming}>Enviar para Maya ↗</button>}</div><small>Fechar o painel não cancela a execução. Revise o conteúdo antes de publicar.</small></form></section></div>;
}
