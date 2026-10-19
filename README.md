# Igor AI Office — Maya

Escritório visual de Igor Ruan com uma agente de conteúdo baseada em **eve 0.80.1**, Next.js e Vercel AI Gateway. O projeto preserva a interface isométrica, agora com um painel para enviar briefings, acompanhar estados reais, cancelar a execução, exportar texto e retomar sessões pelo link.

## Estado da entrega

- Código da Maya, autenticação do proprietário e interface implementados.
- A execução real requer publicação, configuração do acesso e autorização/saldo no AI Gateway.
- Atlas, Hunter, Pulse e Nexus continuam demonstrativos.
- O quadro de tarefas e o índice de links ficam no navegador. Não são sincronizados entre dispositivos.
- As sessões da Maya usam a persistência do eve/Workflow no servidor. O link permite retomá-las após login, inclusive em outro dispositivo, enquanto os dados forem retidos pelo serviço.
- Nenhuma rede social, conta de anúncio ou CRM é acessada; não há publicação automática.

## Executar localmente

Requer Node.js 24 e npm. Instale com `npm ci` e configure `.env.local` com base em `.env.example`.

1. Defina `OFFICE_ACCESS_KEY` com um valor aleatório de pelo menos 32 caracteres. Esse é o código usado pelo proprietário na tela de entrada. Nunca envie o código para o chat nem o versione.
2. Defina `OFFICE_ORIGIN=http://localhost:3000`.
3. Para execução local, configure `AI_GATEWAY_API_KEY` na máquina, ou use a autenticação local documentada do eve. Não reutilize credenciais de outras aplicações sem autorização.
4. Execute `npm run dev` e acesse a porta indicada.

## Publicar na Vercel

Repositório: https://github.com/igornjr10/escritorio- . A publicação na Vercel ainda depende de acesso autorizado ao workspace e da configuração das variáveis abaixo.

Quando o acesso estiver disponível:

1. Clone este repositório e execute `npm ci`. Não versione node_modules, .env.local, .eve, .next ou .vercel.
2. Vincule o novo projeto por `npx eve link --non-interactive --project igor-ai-office --team <seu-workspace>`, em um terminal autenticado nessa equipe, ou importe o repositório pela Vercel.
3. Defina `OFFICE_ACCESS_KEY` como variável secreta de execução. Defina `OFFICE_ORIGIN` com a origem HTTPS final, sem barra. O valor precisa ser o mesmo para os serviços frontend e eve.
4. Use Node 24, `npm ci` e `npm run build`. O `withEve` configura os serviços do agente e as rotas do Workflow.
5. Habilite o acesso do projeto ao AI Gateway/OIDC e confira sua disponibilidade/saldo. Nenhuma chave do provedor é colocada no navegador. Não há custo zero garantido.
6. Publique e faça o teste completo abaixo. Não afirme que a IA está ativa apenas porque o deploy compilou.

O modelo atual é `openai/gpt-5-mini`, disponível no plano gratuito do AI Gateway. Modelos mais novos (como `openai/gpt-6-luna-fast`) exigem créditos pagos. Limites de sessão do eve são limites de uso com pausa, não um teto rígido de cobrança; a chamada que ultrapassa o orçamento pode terminar, e custos de infraestrutura são separados.

## Teste de aceitação após publicação

- Sem cookie: `POST /eve/v1/session` deve responder 401.
- Sem `OFFICE_ACCESS_KEY` válido: login deve falhar fechado.
- Entrar com o código, clicar na Maya e pedir um roteiro.
- Confirmar estados enviado/gerando e entrega real, sem mensagens de demonstração para Maya.
- Recarregar o link da conversa e confirmar histórico e retomada.
- Cancelar uma execução em andamento e confirmar interrupção no servidor.
- Testar credencial/saldo indisponível: exibir erro sem marcar tarefa concluída.
- Confirmar que os outros agentes continuam claramente demonstrativos.

## Verificações

`npm test` cobre assinatura, expiração, adulteração, rotação de credenciais, proteção de origem e atributos dos cookies. `npm run typecheck` verifica contratos TypeScript; `npm run build` verifica a aplicação; `npm run build:agent` compila a definição do agente.

## Autenticação

Aplicação de um único proprietário. O código aleatório é verificado no servidor e emite cookie HttpOnly, Secure em produção, SameSite=Strict, assinado, com duração de 12 horas. As rotas do agente verificam o cookie independentemente da interface. Sem fallback anônimo, sem ferramentas de terminal, arquivos ou publicação. O único tool próprio lê o briefing estático da marca.

## Arquitetura

- `public/office`: cena e quadro de tarefas existentes; comunicação com o painel por postMessage validado por origem e janela.
- `components/Office.tsx`: login, sessão durável, streaming, histórico e exportação.
- `agent/instructions.md`: comportamento da Maya.
- `agent/tools/brand_brief.ts`: posicionamento da marca.
- `agent/channels/eve.ts`: autenticação das rotas da agente.
- `agent/lib/office-auth.mjs`: assinatura e validação de sessão.
- `app/api`: entrada, saída e verificação de acesso.
