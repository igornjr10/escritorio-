---
name: founder-board
description: >-
  Your board of directors. Puts a business idea in front of a three-member board,
  each a sub-agent reading the idea through one published framework: the Offers
  lens (from Alex Hormozi's $100M Offers), the Monopoly lens (from Peter Thiel's
  Zero to One) and the Product lens (from Walter Isaacson's biography of Steve
  Jobs). Each member scores the idea, names the risks that would kill it and votes
  fund, fund with conditions, or pass. Use when the user says "test my business
  idea", "would this work", "pressure-test this", "what would a board say", "is
  this a good business", or starts the founder pack on a new idea.
argument-hint: "<the business idea, or leave blank to use the conversation>"
---

> **Adaptação para o escritório (Atlas, eve).** Este método veio do pacote Founder skill (MIT, Jake Schincariol) e foi escrito para o Claude Code. Aqui, siga-o com estes limites, que têm prioridade sobre o texto abaixo:
> - Responda a Igor em português brasileiro.
> - Não há arquivos, pasta `founder/`, Python nem terminal. Não tente rodar scripts: faça as contas no texto, passo a passo, mostrando cada fórmula e cada entrada, e entregue o resultado na própria resposta para Igor copiar. Nunca diga que salvou ou entregou arquivos: quando o método citar um arquivo (como `founder/idea.md`), use o nome só como título de seção.
> - Não há internet. Nunca invente concorrentes, preços, avaliações, links, leis ou dados de mercado. Peça esses dados a Igor ou entregue a lista do que ele deve verificar e onde.
> - Não existe a ferramenta Agent para criar cópias. Os membros do conselho e os compradores simulados são perspectivas que você mesmo escreve, separadas e identificadas. O painel de consumidores usa no máximo 12 compradores por análise, para controlar o custo.
> - Quando uma etapa pedir algo de outra skill (o CFO, o painel etc.), use o que já estiver nesta conversa ou peça a Igor; não finja ter lido arquivos.
> - Se fizer sentido, você pode delegar partes aos especialistas da equipe (Maya, Hunter, Pulse, Nexus), como de costume.


# founder-board

The first meeting. Before anyone builds a website or signs a lease, three board
members tear the idea apart, each from a different angle, and vote.

What the user typed after `/founder-board`: `$ARGUMENTS`. If that is blank, take
the idea from the conversation.

## The rule about the three names

The lenses are summaries of **published frameworks**, nothing more. The board
members are not those people, never speak as them, never quote them, never claim
they would endorse anything. Write "the Offers lens", never "Alex Hormozi says".
If the user asks what one of them really thinks, say you can only apply their
public frameworks.

## Step 0: the idea file

Everything in the founder pack reads `founder/idea.md` in the user's project. If
it does not exist, write it now from the conversation:

```markdown
# <business name, or a working name>

- What it is: one sentence.
- Who it is for: the target customer, as specific as the user can make it.
- What it sells, at what price: the core product and its price.
- Where and how: city or online, how customers find it, how it is delivered.
- Budget and constraints: money, time, skills, anything already decided.
```

If the name, the customer, the product or the price is missing, ask for those (at
most three questions in one message), then write the file. Do not invent a
budget, a market size or a competitor.

## Step 1: brief the board

Write `founder/board/brief.md`: the idea file plus anything else the user said
that a stranger would need. **Sub-agents cannot see this conversation**, so the
brief must stand on its own. Do not add your own opinion of the idea to it.

## Step 2: convene

Launch three sub-agents in ONE message (Agent tool, `subagent_type:
general-purpose`, one per member), each told: `Read founder/board/brief.md and
founder-board's lenses.md (path below), apply ONLY the <lens> lens, and write
your memo to founder/board/<lens>.md.` The lens file is `lenses.md` in this
skill's folder (`${CLAUDE_SKILL_DIR}/lenses.md`; if that path is not expanded,
use the base directory Claude Code printed for this skill).

Each memo, in this shape:

```markdown
# <Lens> lens
Score: <1-10> | Vote: FUND / FUND IF / PASS
## What is strong
## What would kill it (the top 3, most dangerous first)
## The questions I would ask the founder
## If FUND IF: the conditions
```

## Step 3: the chair's summary

Read the three memos (they are short) and write `founder/board.md`:

1. The vote, e.g. "2 fund if, 1 pass", and the average score.
2. The risks more than one member raised: these go first.
3. Every condition, merged, as a checklist the rest of the pack can tick off
   (the CFO, the consumer panel and pricing will test most of them).
4. One paragraph: the strongest version of this business the board can see.
   It may differ from what the user pitched; say so plainly.

Keep the members' disagreements. A board that agrees on everything was not doing
its job.

## Rules

- Score the business, not the founder.
- No made-up facts. If a lens needs a number nobody has yet (market size, cost of
  acquiring a customer), name it as an open question and say which skill answers
  it (`/founder-competitors`, `/founder-consumer`, `/founder-cfo`).
- A PASS is a result, not a failure. Say it plainly.

## Output

`founder/idea.md`, `founder/board/` (brief and three memos), `founder/board.md`.
Then say the vote in one line and suggest the next step: `/founder-competitors`
to see who is already there, or `/founder-consumer` to put it in front of 100
simulated buyers.

## Where the pack goes next

```
board -> competitors -> consumer -> pricing -> offer -> cfo -> marketing -> brand -> ops -> launch -> plan
```

Every skill can also run on its own; each reads whatever is already in `founder/`.


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
