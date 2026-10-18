'use strict';
let mayaRealState = 'ready';
const mayaStates = { ready: 'Disponível', submitted: 'Solicitação enviada', streaming: 'Gerando conteúdo', resuming: 'Recuperando conversa', error: 'Execução interrompida' };
function openMaya(brief = '') { window.parent.postMessage({ type: 'open-maya', brief }, location.origin); }
const previousRenderAgent = renderAgent;
renderAgent = function () {
  previousRenderAgent();
  document.querySelector('.inspector .mini-badge').textContent = 'DEMO';
  if (selected !== 'maya') return;
  const statusEl = document.querySelector('#agent-info .status');
  statusEl.textContent = mayaStates[mayaRealState];
  document.querySelector('.inspector .mini-badge').textContent = 'IA';
  $('#agent-activity').innerHTML = `<div class="activity-box">${esc(mayaStates[mayaRealState])}<small>Estado recebido da sessão da Maya. O quadro de tarefas é atualizado manualmente.</small></div><button id="open-maya" class="primary full" style="margin-top:12px">✦ Conversar com Maya</button>`;
  $('#open-maya').onclick = () => openMaya();
};
const previousRenderBoard = renderBoard;
renderBoard = function () {
  previousRenderBoard();
  document.querySelectorAll('[data-status]').forEach(select => {
    const task = tasks.find(t => t.id === select.dataset.status);
    if (task?.agent !== 'maya') return;
    const button = document.createElement('button'); button.className = 'outline full'; button.style.marginTop = '9px'; button.textContent = '✦ Preparar com Maya';
    button.onclick = () => openMaya(`${task.title}\n\n${task.details}`.trim()); select.parentElement.appendChild(button);
  });
};
const previousShowView = showView;
showView = function (view) { previousShowView(view); if (view === 'connections') {
  $('#connections-view').innerHTML = `<div class="section-intro"><h2>Seu primeiro agente conectado à interface.</h2><p>Maya usa o motor de IA configurado na hospedagem. A execução só é confirmada após o recebimento dos eventos e da resposta.</p></div><div class="connection-grid"><article class="connection-card"><div class="integration-icon">✦</div><span class="chip">MAYA · CONTEÚDO</span><h3>Da ideia ao roteiro</h3><p>Envie um briefing, acompanhe o status e receba texto. Falhas de conexão ou de acesso ao modelo aparecem no painel.</p><button class="primary" onclick="openMaya()" style="margin-top:20px">Abrir Maya</button></article><article class="connection-card"><div class="integration-icon">↺</div><span class="chip">SESSÕES</span><h3>Continue de onde parou</h3><p>As conversas são recuperadas do servidor pelo link. Os atalhos e o quadro de tarefas ficam neste navegador. Exporte suas tarefas para guardar uma cópia.</p></article><article class="connection-card"><div class="integration-icon">◈</div><span class="chip">PRÓXIMAS ETAPAS</span><h3>Ampliar a equipe</h3><p>Atlas, Hunter, Pulse e Nexus permanecem em demonstração. Não há conexão com ClickUp, CRM, redes sociais ou contas de anúncios nesta etapa.</p></article></div>`;
} };
window.addEventListener('message', event => {
  if (event.origin !== location.origin || event.source !== parent || event.data?.type !== 'maya-status' || !Object.hasOwn(mayaStates, event.data.status)) return;
  const changed = mayaRealState !== event.data.status;
  mayaRealState = event.data.status;
  if (selected === 'maya') renderAgent();
  const dot = document.querySelector('[data-agent="maya"] circle'); if (dot) dot.setAttribute('fill', mayaRealState === 'error' ? '#f392aa' : ['submitted','streaming'].includes(mayaRealState) ? '#c4a2f4' : '#b6ed88');
  if (changed) log(`Maya: ${mayaStates[mayaRealState].toLowerCase()}.`, 'Evento da sessão de IA');
});
renderAgent(); renderBoard();
