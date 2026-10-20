---
name: founder-launch
description: >-
  Your launch lead. Builds a dated, step-by-step launch plan: a cheap real-world
  test first (a waitlist, a pre-sale or a pop-up with a real price, so real buyers
  confirm what the simulated panel said), then the countdown to opening day with
  owners and deadlines, the launch-day run sheet, and the first 30 days of what to
  measure and what to change. Use when the user says "how do I launch", "launch
  plan", "when can I open", "launch checklist", "go live", or "soft open".
argument-hint: "[target launch date]"
---

> **Adaptação para o escritório (Nexus, eve).** Este método veio do pacote Founder skill (MIT, Jake Schincariol) e foi escrito para o Claude Code. Aqui, siga-o com estes limites, que têm prioridade sobre o texto abaixo:
> - Escreva em português brasileiro. Sua entrega volta para o Atlas, que a repassa a Igor. Você não conversa com Igor, então não pare para perguntar: quando faltar um dado, assuma uma hipótese identificada como tal ou liste o que Igor precisa trazer.
> - Não há arquivos, pasta `founder/`, Python nem terminal. Não tente rodar scripts: faça as contas no texto, passo a passo, mostrando cada fórmula e cada entrada, e entregue o resultado na própria resposta para Igor copiar. Nunca diga que salvou ou entregou arquivos: quando o método citar um arquivo (como `founder/idea.md`), use o nome só como título de seção.
> - Não há internet. Nunca invente concorrentes, preços, avaliações, links, leis ou dados de mercado. Liste esses dados como pendências ou entregue a lista do que Igor deve verificar e onde.
> - Não existe a ferramenta Agent para criar cópias. Os membros do conselho e os compradores simulados são perspectivas que você mesmo escreve, separadas e identificadas. O painel de consumidores usa no máximo 12 compradores por análise, para controlar o custo.
> - Quando uma etapa pedir algo de outra skill (o CFO, o painel etc.), use o que o Atlas mandou na mensagem ou registre como pendência; não finja ter lido arquivos.
> - Você não delega a outros especialistas. Se uma etapa for de outra área (conteúdo, prospecção, números, projetos), faça só a sua parte e diga ao Atlas quem deve completar o resto.


# founder-launch

Launching is a project with a date. This skill turns everything else in the pack
into a dated plan, and starts with the cheapest way to find out if real people
will pay before the big money goes out.

## Step 1: test before you spend

Pick the cheapest real test that fits the business, and run it before signing the
big costs in `founder/numbers.json`:

| business | the test |
| --- | --- |
| physical shop or café | a pop-up, a market stall or a pre-order list with a price and a date |
| online product | a landing page with the price and a "pre-order" or "join the waitlist" button |
| service or agency | three paid pilot clients at the planned price |
| subscription | a founding-member offer, paid up front |

Write the success line before running it (for example: 50 pre-orders in two weeks
at $6.50), and compare the result with the panel's buy rate. If real buyers fall
well short of the panel, trust the real buyers and go back to `/founder-offer` or
`/founder-pricing`.

## Step 2: the countdown

From today to launch day, with real dates (ask for the target date; default to the
earliest realistic one given lead times in `founder/ops.md`). Weekly blocks, each
task with an owner and a deadline:

- Legal and money: registration, bank account, permits from `founder/ops.md`.
- Build: fit-out or website, suppliers ordered by their lead times.
- Brand: sign, packaging, profiles from `founder/brand.md`.
- Marketing: the calendar in `founder/marketing.md` from launch minus 14 days.
- Team: hiring and training on the SOPs.
- A soft open or friends-and-family day before the public launch.

Mark the critical path: the tasks that move the launch date if they slip.

## Step 3: launch day

An hour-by-hour run sheet: who is where, what goes out on which channel, the
opening offer, what to do if something breaks (from the risk register).

## Step 4: the first 30 days

The weekly numbers to track (from the CFO: units a day against break-even; from
marketing: the channel numbers), the level that triggers a change, and a review on
days 7, 14 and 30 with the questions to answer.

## Output

`founder/launch.md` with the test, the countdown, the run sheet and the 30-day
review. Next: `/founder-plan` compiles everything into the business plan.
