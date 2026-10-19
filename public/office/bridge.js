'use strict';
// Real state from the team session (Atlas is the root agent; the others are his specialists).
let mayaRealState = 'ready'; // session state of the Atlas conversation (name kept for life.js)
let teamActive = []; // specialists Atlas is delegating to right now, from real task events
const sessionStates = { ready: 'Disponível', submitted: 'Pedido recebido', streaming: 'Coordenando a equipe', resuming: 'Recuperando conversa', error: 'Execução interrompida' };
const specialists = { maya: 'Maya', hunter: 'Hunter', pulse: 'Pulse', nexus: 'Nexus' };
function openMaya(brief = '') { window.parent.postMessage({ type: 'open-maya', brief }, location.origin); }
function briefFor(id, text = '') { return id === 'atlas' ? text : `${specialists[id]}, ${text}`; }

const previousRenderAgent = renderAgent;
renderAgent = function () {
  previousRenderAgent();
  const a = agents.find(a => a.id === selected);
  document.querySelector('.inspector .mini-badge').textContent = 'IA';
  const working = selected === 'atlas' ? mayaRealState !== 'ready' : teamActive.includes(selected);
  const label = selected === 'atlas' ? sessionStates[mayaRealState] : working ? 'Trabalhando para o Atlas' : 'Disponível';
  document.querySelector('#agent-info .status').textContent = label;
  const detail = selected === 'atlas'
    ? 'Atlas recebe seus pedidos, distribui entre os especialistas e junta as entregas.'
    : working ? 'Atlas delegou uma parte do seu pedido. A entrega volta para ele.' : 'Chame diretamente começando a mensagem com o nome, ou peça ao Atlas.';
  $('#agent-activity').innerHTML = `<div class="activity-box">${esc(label)}<small>${esc(detail)}</small></div><button id="open-maya" class="primary full" style="margin-top:12px">✦ ${selected === 'atlas' ? 'Conversar com Atlas' : 'Pedir para ' + esc(a.name)}</button>`;
  $('#open-maya').onclick = () => openMaya(briefFor(selected));
};
const previousRenderBoard = renderBoard;
renderBoard = function () {
  previousRenderBoard();
  document.querySelectorAll('[data-status]').forEach(select => {
    const task = tasks.find(t => t.id === select.dataset.status);
    if (!task) return;
    const name = agents.find(a => a.id === task.agent)?.name || 'equipe';
    const button = document.createElement('button'); button.className = 'outline full'; button.style.marginTop = '9px'; button.textContent = `✦ Preparar com ${name}`;
    button.onclick = () => openMaya(briefFor(task.agent, `${task.title}\n\n${task.details}`.trim())); select.parentElement.appendChild(button);
  });
};
const previousShowView = showView;
showView = function (view) { previousShowView(view); if (view === 'connections') {
  $('#connections-view').innerHTML = `<div class="section-intro"><h2>Uma equipe de agentes de IA.</h2><p>Atlas coordena e os especialistas executam. Tudo roda no motor de IA configurado na hospedagem; uma etapa só aparece como concluída depois que a resposta chega.</p></div><div class="connection-grid"><article class="connection-card"><div class="integration-icon">✦</div><span class="chip">ATLAS · GESTOR</span><h3>Um pedido, várias entregas</h3><p>Peça uma campanha e o Atlas chama Maya, Hunter, Pulse e Nexus conforme a necessidade. Para falar com um só, comece com o nome dele.</p><button class="primary" onclick="openMaya()" style="margin-top:20px">Abrir conversa</button></article><article class="connection-card"><div class="integration-icon">↺</div><span class="chip">SESSÕES</span><h3>Continue de onde parou</h3><p>As conversas são recuperadas do servidor pelo link. Os atalhos e o quadro de tarefas ficam neste navegador. Exporte suas tarefas para guardar uma cópia.</p></article><article class="connection-card"><div class="integration-icon">◈</div><span class="chip">LIMITES</span><h3>Pensam e escrevem</h3><p>Sem acesso à internet, ClickUp, CRM, redes sociais ou contas de anúncios. Hunter não pesquisa empresas reais e Pulse só analisa números que você enviar.</p></article></div>`;
} };
window.addEventListener('message', event => {
  if (event.origin !== location.origin || event.source !== parent) return;
  if (event.data?.type === 'maya-status' && Object.hasOwn(sessionStates, event.data.status)) {
    const changed = mayaRealState !== event.data.status;
    mayaRealState = event.data.status;
    renderAgent();
    if (changed) log(`Atlas: ${sessionStates[mayaRealState].toLowerCase()}.`, 'Evento real da equipe');
  }
  if (event.data?.type === 'team-activity' && Array.isArray(event.data.active)) {
    const next = event.data.active.filter(id => Object.hasOwn(specialists, id));
    for (const id of next) if (!teamActive.includes(id)) log(`Atlas chamou ${specialists[id]}.`, 'Evento real da equipe');
    for (const id of teamActive) if (!next.includes(id)) log(`${specialists[id]} entregou para o Atlas.`, 'Evento real da equipe');
    teamActive = next;
    renderAgent();
  }
});
document.querySelector('.demo-tag').innerHTML = '<i></i> Equipe com IA · movimento ilustrativo';
renderAgent(); renderBoard();
