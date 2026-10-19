---
name: founder-offer
description: >-
  Builds an offer too good to refuse. Lists every problem the buyer hits on the way
  to the result they want, turns each into a solution, trims to what is cheap to
  deliver and valuable to the buyer, and stacks it with honest bonuses, a guarantee
  the CFO can afford, real urgency and a clear name. Scores it on the value
  equation (outcome, likelihood, time, effort) and re-tests it on a quick buyer
  panel. Use when the user says "make my offer better", "why won't people buy",
  "what should I include", "guarantee", "bonuses", "grand slam offer", or after the
  panel shows people passing.
argument-hint: "[what you sell]"
---

> **Adaptação para o escritório (Atlas, eve).** Este método veio do pacote Founder skill (MIT, Jake Schincariol) e foi escrito para o Claude Code. Aqui, siga-o com estes limites, que têm prioridade sobre o texto abaixo:
> - Responda a Igor em português brasileiro.
> - Não há arquivos, pasta `founder/`, Python nem terminal. Não tente rodar scripts: faça as contas no texto, passo a passo, mostrando cada fórmula e cada entrada, e entregue o resultado na própria resposta para Igor copiar. Nunca diga que salvou ou entregou arquivos: quando o método citar um arquivo (como `founder/idea.md`), use o nome só como título de seção.
> - Não há internet. Nunca invente concorrentes, preços, avaliações, links, leis ou dados de mercado. Peça esses dados a Igor ou entregue a lista do que ele deve verificar e onde.
> - Não existe a ferramenta Agent para criar cópias. Os membros do conselho e os compradores simulados são perspectivas que você mesmo escreve, separadas e identificadas. O painel de consumidores usa no máximo 12 compradores por análise, para controlar o custo.
> - Quando uma etapa pedir algo de outra skill (o CFO, o painel etc.), use o que já estiver nesta conversa ou peça a Igor; não finja ter lido arquivos.
> - Se fizer sentido, você pode delegar partes aos especialistas da equipe (Maya, Hunter, Pulse, Nexus), como de costume.


# founder-offer

Most businesses sell a product. Good ones sell an offer: the product plus
everything that makes buying it an easy yes. This skill builds that, using the
Offers lens in `../founder-board/lenses.md` as the method (a summary of the
framework in Alex Hormozi's *$100M Offers*; never present it as his words).

## Step 1: read what is already known

- `founder/idea.md` and `founder/pitch.md`: what is sold today.
- `founder/panel/results.md`: why buyers pass, in their words. This is the raw
  material: every top objection should be answered by something in the offer.
- `founder/numbers.json`: what each extra costs, so the stack stays profitable.
- `founder/board.md`: the board's conditions.

## Step 2: the problem list

Write every obstacle between the buyer and the result they want, in the buyer's
words: before buying (doubt, price, effort to switch), during (waiting, learning,
inconvenience), after (does it last, what if it fails). Aim for 15 to 30. Pull
from the panel objections and the competitor complaints first.

## Step 3: solutions, trimmed and stacked

Turn each problem into a solution (a feature, a service, a guarantee, a format).
Score each on value to the buyer (1 to 5) and cost to deliver (1 to 5, from the
CFO's numbers). Keep high value, low cost. Stack what is left into:

- **The core**: the thing itself, described by the outcome, not the ingredients.
- **Bonuses**: two or three, each killing one specific objection.
- **The guarantee**: what happens if it does not deliver. Model what it costs at a
  realistic claim rate with the CFO's tool before promising it.
- **Urgency and scarcity**: only if they are true (a launch week, a limited first
  batch). Never fake a countdown or a "only 3 left".
- **The name**: a clear, specific name for the offer, not the company.

## Step 4: score it

On the value equation, before and after, 1 to 10 each: dream outcome, perceived
likelihood of getting it, time to the result, effort and sacrifice. Say which
element of the stack moves which score.

## Step 5: re-test it

Write the new offer into `founder/pitch.md` (keep the old one as
`founder/pitch-v1.md`) and run `/founder-consumer --quick` with the same seed.
Report the buy rate before and after and which objections dropped. If nothing
moved, say so: the problem may be the market or the price, not the offer.

## Rules

- Every promise must be deliverable and affordable; check costs with the CFO.
- No fake reviews, testimonials, scarcity, discounts or "as seen on".
- Follow the advertising and consumer-protection rules of the user's market for
  guarantees and claims (health claims especially). Not legal advice.

## Output

`founder/offer.md` (problem list, the stack, costs, the value-equation scores, the
re-test result) and the updated `founder/pitch.md`. Next: `/founder-cfo` to re-run
the numbers with the stack, then `/founder-marketing`.


---

## Anexo: lenses.md (o arquivo citado acima, incluído aqui)

# The three lenses

Summaries of published frameworks, in our own words. A board member applies ONE
lens and never speaks as the person the framework comes from.

## The Offers lens

Source: Alex Hormozi, *$100M Offers* (2021).

**Pick the market first.** The best offer fails in a bad market. Score the market
on four things: the pain is massive, the buyers have money to spend, they are
easy to find and reach, and the market is growing. A weak market is the most
common reason this lens passes.

**The value equation.** How much a buyer values an offer goes up with the dream
outcome and the perceived likelihood of getting it, and down with the time it
takes and the effort and sacrifice it asks. Score each of the four for this
business. Most offers fail on likelihood (no proof) or effort (too much asked of
the buyer).

**Do not compete on price.** If the only difference is being cheaper, it is a
commodity. Ask what would make this so good that people feel stupid saying no:
more of the outcome, faster, with less effort, with a guarantee.

**Build the stack.** List every problem the buyer hits on the way to the outcome,
turn each into a solution, keep the ones that are cheap to deliver and valuable
to the buyer, and stack them. Then strengthen it with real scarcity or urgency
(never fake), bonuses, a guarantee and a clear name.

Questions this lens asks: Who exactly has this pain and money? Why would they
believe it works? How fast do they get a result? What is the guarantee? Could you
double the price and still be the obvious choice?

## The Monopoly lens

Source: Peter Thiel with Blake Masters, *Zero to One* (2014).

**Competition destroys profit.** A business in a crowded market fights for thin
margins. The goal is a small market you can dominate, then expand from.

**What makes a durable business:** proprietary technology or know-how roughly ten
times better than the next option on something that matters; network effects;
economies of scale; a brand. Most small businesses have none of these, so ask
which one this could build.

**The seven questions:** the engineering question (is it a breakthrough, or an
incremental improvement?), timing (why now?), monopoly (does it start with a big
share of a small market?), people (is this the right team?), distribution (is
there a way to reach buyers, not just a product?), durability (will it still hold
its position in ten years?), and the secret (what does the founder know that
others do not?).

**Distribution is half of it.** A good product with no way to reach customers is
not a business. Ask how the first 100 customers arrive and what each one costs.

Questions this lens asks: Who else sells this within reach of the same buyer?
What is the small market this can own first? What is the secret? What stops a
copycat in month six?

## The Product lens

Source: Walter Isaacson, *Steve Jobs* (2011), and the public record of how Apple
built products.

**Focus means saying no.** Most ideas do too many things. Ask what to cut until
what is left is the one thing the business must do brilliantly.

**Start from the experience and work back.** Describe the moment the customer
uses the product, then work back to what has to be true to deliver it. Not the
other way round.

**Own the whole experience.** Every touchpoint the buyer sees, from the first ad to
the receipt to the follow-up, is the product. Seams are where it breaks.

**Taste and craft, including the parts nobody sees.** Quality shows up in details;
a business that cuts corners where customers cannot look will cut them where they
can.

**Simplicity is the hard part.** If the pitch needs a paragraph, the product is not
clear yet. Ask for it in one sentence.

Questions this lens asks: What is the one thing? What does the first five minutes
with this feel like for the customer? What would you cut? Where is the experience
handed between people or systems, and what goes wrong there?
