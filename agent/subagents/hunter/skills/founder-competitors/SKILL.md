---
name: founder-competitors
description: >-
  Maps every competitor and the gap they leave. Finds the direct competitors,
  indirect ones and the substitutes a buyer would use instead, from public
  sources only, and records what each sells, at what price, how they position
  themselves and what their customers complain about in public reviews, every fact
  with a link. Ends with a positioning map and the gap the new business can own.
  Use when the user says "who are my competitors", "is this market crowded", "what
  else is out there", "competitor analysis", "find the gap", or "who am I up
  against".
argument-hint: "[city or market]"
---

> **Adaptação para o escritório (Hunter, eve).** Este método veio do pacote Founder skill (MIT, Jake Schincariol) e foi escrito para o Claude Code. Aqui, siga-o com estes limites, que têm prioridade sobre o texto abaixo:
> - Escreva em português brasileiro. Sua entrega volta para o Atlas, que a repassa a Igor. Você não conversa com Igor, então não pare para perguntar: quando faltar um dado, assuma uma hipótese identificada como tal ou liste o que Igor precisa trazer.
> - Não há arquivos, pasta `founder/`, Python nem terminal. Não tente rodar scripts: faça as contas no texto, passo a passo, mostrando cada fórmula e cada entrada, e entregue o resultado na própria resposta para Igor copiar. Nunca diga que salvou ou entregou arquivos: quando o método citar um arquivo (como `founder/idea.md`), use o nome só como título de seção.
> - Não há internet. Nunca invente concorrentes, preços, avaliações, links, leis ou dados de mercado. Liste esses dados como pendências ou entregue a lista do que Igor deve verificar e onde.
> - Não existe a ferramenta Agent para criar cópias. Os membros do conselho e os compradores simulados são perspectivas que você mesmo escreve, separadas e identificadas. O painel de consumidores usa no máximo 12 compradores por análise, para controlar o custo.
> - Quando uma etapa pedir algo de outra skill (o CFO, o painel etc.), use o que o Atlas mandou na mensagem ou registre como pendência; não finja ter lido arquivos.
> - Você não delega a outros especialistas. Se uma etapa for de outra área (conteúdo, prospecção, números, projetos), faça só a sua parte e diga ao Atlas quem deve completar o resto.


# founder-competitors

Every buyer already solves this problem somehow. This skill finds out how, what
they pay, and what they hate about it, so the new business starts with a gap
instead of a guess.

## The rules

- **Public sources only, every fact linked.** Websites, price pages, menus, app
  store and Google Maps listings, review sites, Reddit, news. If a source cannot be
  reached, say so. Never invent a competitor, a price, a rating or a review.
- **Read, do not scrape.** Read pages as a person would. Respect each site's terms.
- **Quotes are verbatim**, short, with the link. They are research, never
  testimonials.

## Step 1: who is there

From `founder/idea.md` (write it first if missing; see `/founder-board` step 0):

| type | what it means | example for a matcha café |
| --- | --- | --- |
| Direct | sells the same thing to the same buyer | other matcha bars within walking distance |
| Indirect | a different product for the same job | the coffee shops on the same street |
| Substitute | how buyers solve it without a business | matcha powder at home, canned drinks |

Aim for 5 to 10 direct and indirect, plus the main substitutes. For a local
business, search the map for the exact area; for online, search how a buyer would
("best <thing> for <who>", "<thing> alternative").

## Step 2: the facts

One row per competitor in `founder/competitors.csv`:

`name,type,url,location_or_channel,price_of_comparable_item,what_it_sells,positioning_line,rating,review_count,source_date`

`positioning_line` is their own headline or tagline, copied. Price is for the item
closest to what the new business sells, with what it includes.

## Step 3: what their customers say

For the top 3 to 5, read their reviews (1 to 3 stars first, then the "love it,
but..." 4 stars). Note recurring complaints as themes with counts and one or two
linked quotes each. Mark a theme thin if it has under three reviews.

## Step 4: the map and the gap

Write `founder/competitors.md`:

1. The table (from the CSV), sorted by how directly each competes.
2. Price range: lowest, median, highest for the comparable item.
3. A positioning map in text: two axes that matter to this buyer (price and
   convenience, quality and speed...), where each competitor sits.
4. The complaints, ranked, with links.
5. **The gap**: what nobody does well that this business could, tied to the
   evidence. If there is no gap, say so plainly; that is the most useful result
   this skill can give.
6. The threat: who could copy the new business fastest, and how.

## Output

`founder/competitors.csv`, `founder/competitors.md`. Next: `/founder-consumer`
uses the complaints to write real objections; `/founder-pricing` uses the price
range.
