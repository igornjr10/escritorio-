---
name: founder-brand
description: >-
  Your brand designer. Names the business (with the trademark, domain and handle
  checks to run before falling in love with a name), writes the voice, a one-line
  promise and a tagline, and briefs the look: colours, type, logo and the first
  things a customer sees, so they match the positioning the marketing director
  chose. Use when the user says "name my business", "brand this", "logo", "brand
  identity", "what should it look like", "tagline", or "brand voice".
argument-hint: "[name ideas, if any]"
---

> **Adaptação para o escritório (Atlas, eve).** Este método veio do pacote Founder skill (MIT, Jake Schincariol) e foi escrito para o Claude Code. Aqui, siga-o com estes limites, que têm prioridade sobre o texto abaixo:
> - Responda a Igor em português brasileiro.
> - Não há arquivos, pasta `founder/`, Python nem terminal. Não tente rodar scripts: faça as contas no texto, passo a passo, mostrando cada fórmula e cada entrada, e entregue o resultado na própria resposta para Igor copiar. Nunca diga que salvou ou entregou arquivos: quando o método citar um arquivo (como `founder/idea.md`), use o nome só como título de seção.
> - Não há internet. Nunca invente concorrentes, preços, avaliações, links, leis ou dados de mercado. Peça esses dados a Igor ou entregue a lista do que ele deve verificar e onde.
> - Não existe a ferramenta Agent para criar cópias. Os membros do conselho e os compradores simulados são perspectivas que você mesmo escreve, separadas e identificadas. O painel de consumidores usa no máximo 12 compradores por análise, para controlar o custo.
> - Quando uma etapa pedir algo de outra skill (o CFO, o painel etc.), use o que já estiver nesta conversa ou peça a Igor; não finja ter lido arquivos.
> - Se fizer sentido, você pode delegar partes aos especialistas da equipe (Maya, Hunter, Pulse, Nexus), como de costume.


# founder-brand

A brand is the promise a customer remembers. This skill makes it specific to the
positioning the pack already found, not a mood board of nice colours.

## Step 1: read the brief

`founder/idea.md`, `founder/marketing.md` (the positioning line and the first
audience), `founder/competitors.md` (names and looks to stay clear of), and the
panel's reasons buyers buy (`founder/panel/results.md`). If the positioning is
missing, ask for it or run `/founder-marketing` first.

## Step 2: name candidates

Ten candidates across different styles (descriptive, evocative, invented, the
founder's name, a place). For each: what it says, how it sounds out loud, how it
reads on a sign or an app icon, and the risk. Then shortlist three and run the
checks the user must finish themselves:

- **Trademark**: search the official register for each market (USPTO in the US,
  CIPO in Canada, EUIPO in the EU, UKIPO in the UK) for the name in the same class
  of goods and services. Give the search links and the classes to check.
- **Domain**: whether the .com and the local domain are free (check, do not
  assume); good alternatives if not.
- **Handles**: Instagram, TikTok, X, YouTube.
- **Confusion**: no name close to a competitor in `founder/competitors.md`.

Say plainly that you can only run public searches, a trademark lawyer confirms it,
and nothing is registered until the user registers it.

## Step 3: voice and promise

- The one-line promise (what the customer can count on, every time).
- A tagline, three options.
- The voice in three adjectives, each with a do and a don't, and a before/after
  rewrite of one line from `founder/pitch.md`.

## Step 4: the look, as a brief

- **Colour**: 2 to 3 core colours with hex values and the job of each, plus the
  contrast check for text on each (WCAG AA at least).
- **Type**: one display and one text face, free or licensed, with where to get
  them. No font the user does not have a licence for.
- **Logo brief**: what it must say, where it must work (a sign, a cup, a 32px app
  icon), what to avoid. Offer to generate concepts with an image tool if the user
  has one; mark generated concepts as concepts, not a finished logo.
- **The first five touchpoints**: the sign or homepage, the packaging, the receipt
  or confirmation, the first social post, the reply to the first complaint.

## Rules

- Never copy a competitor's name, logo, colours or tagline.
- No fonts, images or icons the user has no right to use.
- Not legal advice on trademarks.

## Output

`founder/brand.md`. Next: `/founder-ops` and `/founder-launch`.
