---
name: founder-plan
description: >-
  Your business planner. Compiles everything the other founder skills wrote (the
  board's verdict, the competitors, the buyer panel, pricing, the offer, the CFO's
  numbers, marketing, brand, operations and the launch plan) into one business
  plan with a verdict at the top that is computed from the numbers, never written
  by hand: Profitable, Not yet (with the failing numbers) or Incomplete. Adds an
  executive summary and a one-page version for a partner, lender or investor. Use
  when the user says "write my business plan", "put it all together", "is it
  profitable", "give me the plan", or at the end of the founder pack.
argument-hint: "[--min-buy-rate 0.25]"
---

> **Adaptação para o escritório (Atlas, eve).** Este método veio do pacote Founder skill (MIT, Jake Schincariol) e foi escrito para o Claude Code. Aqui, siga-o com estes limites, que têm prioridade sobre o texto abaixo:
> - Responda a Igor em português brasileiro.
> - Não há arquivos, pasta `founder/`, Python nem terminal. Não tente rodar scripts: faça as contas no texto, passo a passo, mostrando cada fórmula e cada entrada, e entregue o resultado na própria resposta para Igor copiar. Nunca diga que salvou ou entregou arquivos: quando o método citar um arquivo (como `founder/idea.md`), use o nome só como título de seção.
> - Não há internet. Nunca invente concorrentes, preços, avaliações, links, leis ou dados de mercado. Peça esses dados a Igor ou entregue a lista do que ele deve verificar e onde.
> - Não existe a ferramenta Agent para criar cópias. Os membros do conselho e os compradores simulados são perspectivas que você mesmo escreve, separadas e identificadas. O painel de consumidores usa no máximo 12 compradores por análise, para controlar o custo.
> - Quando uma etapa pedir algo de outra skill (o CFO, o painel etc.), use o que já estiver nesta conversa ou peça a Igor; não finja ter lido arquivos.
> - Se fizer sentido, você pode delegar partes aos especialistas da equipe (Maya, Hunter, Pulse, Nexus), como de costume.


# founder-plan

The last step. One document a founder can act on, or hand to a partner or a
lender, built only from what the pack found.

Tool in this folder:

```bash
python3 "${CLAUDE_SKILL_DIR}/compile.py" --dir founder
```

## Step 1: see what is there

```bash
python3 "${CLAUDE_SKILL_DIR}/compile.py" --dir founder --check
```

prints the verdict and each check. The checks, all computed:

1. Each unit earns money before fixed costs (`founder/numbers.json`).
2. Year 1 makes an operating profit.
3. The break-even fits inside capacity, if a capacity was given.
4. Enough simulated buyers buy (`founder/panel/results.json`; default bar 25%,
   change it with `--min-buy-rate` and say why).

If there are no numbers, the verdict is Incomplete: offer to run `/founder-cfo`.
List the other missing sections with the skill that fills each. Do not fill a
missing section yourself from guesses.

## Step 2: the summary

Write `founder/summary.md`, half a page, plain words:

- What the business is and who it is for, in two sentences.
- The verdict and the three numbers behind it (margin, break-even, year 1).
- What the buyer panel and the board agreed on, and where they disagreed.
- The biggest risk and what will be done about it.
- What the founder needs to start (cash from the CFO, the first test from launch).
- The one thing to do this week.

If the verdict is Not yet, the summary leads with what has to change and which skill
changes it. Never soften a failing check.

## Step 3: compile

```bash
python3 "${CLAUDE_SKILL_DIR}/compile.py" --dir founder
```

writes `founder/business-plan.md`: title, the verdict and its checks, the key numbers
table, the idea, then every section the pack produced (summary, board, competition,
panel, pricing, offer, numbers, marketing, brand, operations, launch), and what is
not done yet.

## Step 4: the one-pager

Write `founder/one-pager.md` for someone deciding in two minutes: the problem, the
customer, the offer and price, the numbers table, the evidence (panel result,
competitor gap, any real test), what the money is for, and the ask. Same numbers as
the plan, word for word.

## Rules

- The verdict comes from `compile.py`. Never write Profitable by hand, and never
  round a failing number into a passing one.
- Say once, clearly: the panel is simulated buyers and the numbers are projections;
  real customers and real quotes confirm them. Not financial, legal or tax advice.
- If the user wants a PDF or a deck, offer to export the plan, but keep the
  markdown as the source of truth.

## Output

`founder/summary.md`, `founder/business-plan.md`, `founder/one-pager.md`. Then give
the user the verdict in one line and the one thing to do this week.
