# Verificação — 19/10/2026

## Em produção
- URL: https://igor-ai-office.vercel.app (projeto Vercel `igor-ai-office`, conta pessoal Hobby).
- Variáveis de produção configuradas: `OFFICE_ACCESS_KEY` (secreta) e `OFFICE_ORIGIN`.
- IA via Vercel AI Gateway com OIDC, modelo `openai/gpt-5-mini` (plano gratuito; cartão cadastrado).

## Verificado em produção
- Página inicial: 200.
- `POST /eve/v1/session` sem login: 401. Login com código errado: 401. Com o código certo: 200.
- Conversa real com a Maya: consultou `brand_brief` e entregou texto (turn.completed).
- Falha de modelo (sem cartão / modelo bloqueado) é exibida como erro, sem marcar a tarefa como concluída.

## Ainda não verificado
- Teste visual completo no navegador, cancelamento e retomada pelo link em produção.

## Limitações conhecidas
- O plano gratuito do AI Gateway bloqueia modelos novos (gpt-6-luna, Claude 5.5, Gemini 3). Para usá-los, comprar créditos e trocar o modelo em `agent/agent.ts`.
- Atlas, Hunter, Pulse e Nexus continuam demonstrativos.
- Desenvolvimento local alternativo: `chatgpt()` de `eve/models/openai` com `/login` no `eve dev` usa a assinatura do ChatGPT, mas não funciona em produção.
