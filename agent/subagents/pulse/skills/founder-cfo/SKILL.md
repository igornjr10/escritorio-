---
name: founder-cfo
description: >-
  Your CFO. Builds the unit economics of a business before money is spent: what
  one unit earns after its direct costs, the real profit margin at the planned
  volume, the break-even point in units a day, year 1 month by month, the cash
  needed before it pays for itself, how long the startup spend takes to earn back,
  and what happens if the price drops, sales come in low or costs rise. Every
  number traces to an input the user can check. Use when the user says "find the
  profit margins", "do the numbers", "is this profitable", "break-even", "unit
  economics", "how much do I need to start", or "run the CFO".
argument-hint: "[path to numbers.json]"
---

> **Adaptação para o escritório (Pulse, eve).** Este método veio do pacote Founder skill (MIT, Jake Schincariol) e foi escrito para o Claude Code. Aqui, siga-o com estes limites, que têm prioridade sobre o texto abaixo:
> - Escreva em português brasileiro. Sua entrega volta para o Atlas, que a repassa a Igor. Você não conversa com Igor, então não pare para perguntar: quando faltar um dado, assuma uma hipótese identificada como tal ou liste o que Igor precisa trazer.
> - Não há arquivos, pasta `founder/`, Python nem terminal. Não tente rodar scripts: faça as contas no texto, passo a passo, mostrando cada fórmula e cada entrada, e entregue o resultado na própria resposta para Igor copiar. Nunca diga que salvou ou entregou arquivos: quando o método citar um arquivo (como `founder/idea.md`), use o nome só como título de seção.
> - Não há internet. Nunca invente concorrentes, preços, avaliações, links, leis ou dados de mercado. Liste esses dados como pendências ou entregue a lista do que Igor deve verificar e onde.
> - Não existe a ferramenta Agent para criar cópias. Os membros do conselho e os compradores simulados são perspectivas que você mesmo escreve, separadas e identificadas. O painel de consumidores usa no máximo 12 compradores por análise, para controlar o custo.
> - Quando uma etapa pedir algo de outra skill (o CFO, o painel etc.), use o que o Atlas mandou na mensagem ou registre como pendência; não finja ter lido arquivos.
> - Você não delega a outros especialistas. Se uma etapa for de outra área (conteúdo, prospecção, números, projetos), faça só a sua parte e diga ao Atlas quem deve completar o resto.


# founder-cfo

The person who asks "and what does that cost?" Margins decide whether a good idea
is a business. This skill finds them, with every number traceable to an input.

Tool in this folder:

```bash
python3 "${CLAUDE_SKILL_DIR}/unit_economics.py" founder/numbers.json --out founder/cfo.md
```

## Step 1: gather the inputs

Write `founder/numbers.json` (shape: `example.json` in this folder, a walk-in
matcha café). It needs:

| field | what goes in it |
| --- | --- |
| `unit` | what one sale is: a cup, an order, a client-month, a seat |
| `price` | price per unit before tax |
| `variable` | the cost of ONE unit: ingredients, packaging, shipping, card fees, per-sale commissions |
| `fixed_monthly` | what you pay every month regardless: rent, salaries, software, insurance |
| `startup` | one-off spend before opening: deposits, build-out, equipment, first inventory, launch ads |
| `plan_per_day` | the volume once it is up and running |
| `ramp_per_day` | 12 numbers: realistic volume in each month of year 1 |
| `capacity_per_day` | the most you can physically sell in a day, if there is a limit |

Where the numbers come from, in this order:

1. The user's own quotes, invoices, leases and supplier price lists.
2. Public prices the user can check (a supplier's price list, a landlord's listing,
   a payment processor's published fees). Write the source next to the number in
   `founder/cfo-sources.md`.
3. Your estimate, clearly marked as an estimate, with the reasoning. Never present
   an estimate as a fact.

Ask the user for anything only they know (rent quoted, wages they will pay). Use the
price from `founder/pricing.md` or `founder/pitch.md` if those exist.

**The ramp is where plans lie.** Month 1 is almost never the plan volume. If the
buyer panel ran, use its buy rate and first-month purchases to sanity-check the
ramp (`founder/panel/results.md`), and say how you did it.

## Step 2: run it

```bash
python3 "${CLAUDE_SKILL_DIR}/unit_economics.py" founder/numbers.json --out founder/cfo.md
```

It writes: the per-unit table and the contribution (what each sale leaves after
its own costs), fixed costs, the break-even in units a day, the profit margin at
the plan volume, year 1 month by month, the year 1 operating profit and the result
after the startup spend, the cash needed before it pays for itself, the month the
startup money is earned back, and a what-if table (price -10%, volume -20%, unit
costs +15%). It flags a price below variable cost, a break-even above capacity, a
losing year 1 and a payback beyond 12 months.

What-ifs without editing the file:

```bash
python3 "${CLAUDE_SKILL_DIR}/unit_economics.py" founder/numbers.json --price 7.00
python3 "${CLAUDE_SKILL_DIR}/unit_economics.py" founder/numbers.json --volume 0.8
```

## Step 3: the CFO's note

Add a short section at the top of `founder/cfo.md`, in plain words:

- **The margin**: the profit margin at plan, and the contribution per unit.
- **The line to watch**: the one cost or assumption that moves the result most
  (usually the ramp, rent or the price), with the what-if that proves it.
- **Cash**: how much money the founder needs before it pays for itself.
- **Three ways to improve the margin**, each with the number it changes and by how
  much (run the what-if, do not guess).
- Whether the board's conditions about money (`founder/board.md`) are met.

## Rules

- Every number in your note comes from the tool's output or an input you can name.
- Revenue is before tax; say if the user's market adds sales tax on top.
- Not financial, tax or legal advice. Say once that an accountant should check the
  structure, payroll costs and tax before money moves.

## Output

`founder/numbers.json`, `founder/cfo.md`, `founder/cfo-sources.md`. Next:
`/founder-plan` uses these numbers for the verdict; `/founder-pricing` if the
margin is thin.
