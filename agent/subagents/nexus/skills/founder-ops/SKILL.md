---
name: founder-ops
description: >-
  Your operations manager. Works out how the business actually runs on day one:
  suppliers and what they cost, who works when, the step-by-step routines for
  opening, serving or shipping and closing, the tools to run it, the licences and
  permits to check, and a risk register with what to do when each thing goes
  wrong. Feeds real costs back to the CFO. Use when the user says "how do I run
  this", "operations", "suppliers", "staffing", "SOPs", "what do I need to open",
  "permits", or "day one".
argument-hint: "[city or country]"
---

> **Adaptação para o escritório (Nexus, eve).** Este método veio do pacote Founder skill (MIT, Jake Schincariol) e foi escrito para o Claude Code. Aqui, siga-o com estes limites, que têm prioridade sobre o texto abaixo:
> - Escreva em português brasileiro. Sua entrega volta para o Atlas, que a repassa a Igor. Você não conversa com Igor, então não pare para perguntar: quando faltar um dado, assuma uma hipótese identificada como tal ou liste o que Igor precisa trazer.
> - Não há arquivos, pasta `founder/`, Python nem terminal. Não tente rodar scripts: faça as contas no texto, passo a passo, mostrando cada fórmula e cada entrada, e entregue o resultado na própria resposta para Igor copiar. Nunca diga que salvou ou entregou arquivos: quando o método citar um arquivo (como `founder/idea.md`), use o nome só como título de seção.
> - Não há internet. Nunca invente concorrentes, preços, avaliações, links, leis ou dados de mercado. Liste esses dados como pendências ou entregue a lista do que Igor deve verificar e onde.
> - Não existe a ferramenta Agent para criar cópias. Os membros do conselho e os compradores simulados são perspectivas que você mesmo escreve, separadas e identificadas. O painel de consumidores usa no máximo 12 compradores por análise, para controlar o custo.
> - Quando uma etapa pedir algo de outra skill (o CFO, o painel etc.), use o que o Atlas mandou na mensagem ou registre como pendência; não finja ter lido arquivos.
> - Você não delega a outros especialistas. Se uma etapa for de outra área (conteúdo, prospecção, números, projetos), faça só a sua parte e diga ao Atlas quem deve completar o resto.


# founder-ops

A plan that works on paper fails at 7am on a Monday. This skill makes sure the
first day, week and month can actually be run, and that the CFO's numbers include
what running it really costs.

## Step 1: what the business has to do every day

From `founder/idea.md`, `founder/offer.md` and `founder/numbers.json`, write the
daily cycle as a list of steps from first thing to last (for a café: deliveries,
prep, open, serve, clean, cash up, order; for an online store: orders in, pick,
pack, ship, returns, support). Mark which steps a customer sees.

## Step 2: suppliers

For every input in the CFO's variable costs and every piece of equipment: two or
three real suppliers the user can contact, their public prices or how to get a
quote, minimum orders, lead times and payment terms. Link the sources. Where only
a quote will tell, say so and add it to the open questions. If a real price
differs from `founder/numbers.json`, update it and say the CFO should re-run.

## Step 3: people

Who does what, when: a weekly rota for the planned volume and for the slow first
month. The roles, the hours, and the wage assumption (from the user, or a public
source for the local minimum and typical pay, linked). Payroll costs beyond wages
vary by country; flag them for the accountant.

## Step 4: routines (SOPs)

Short, numbered routines for the moments that make or break the business: opening,
the core service or fulfilment, handling a complaint, closing, and a weekly
reorder. Each fits on one page someone could follow on their first day.

## Step 5: tools

The smallest stack that runs it: payments, point of sale or store, scheduling,
bookkeeping, inventory. Real products with their published prices, and why each.

## Step 6: licences, permits and insurance

A checklist of what businesses of this type usually need in the user's city or
country (registration, tax numbers, health or food permits, signage permits,
insurance), each with the official page to confirm it. Say plainly that rules
differ by place and change, and the user must confirm each with the authority or a
professional. Not legal advice.

## Step 7: risk register

The ten things most likely to go wrong (a supplier runs out, a key person is sick,
the card terminal fails, a bad review, a slow month), each with how likely, how
bad, and the plan.

## Output

`founder/ops.md`, plus updated `founder/numbers.json` if real costs changed. Next:
`/founder-launch`.
