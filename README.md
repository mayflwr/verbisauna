# VerbiSauna 🧖

A sauna-themed browser game for practising Finnish verb conjugation and type 1 consonant gradation (*astevaihtelu*). Throw löyly to pick the person, then build the sentence.

**Play:** https://mayflwr.github.io/verbisauna/

## Run locally

The game uses JavaScript modules, so serve the repository over HTTP rather than opening `index.html` directly with `file://`. From the repository root, run:

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## How to play

- **Write it** – type the sentence. **Say it** – speak out loud, then reveal the answer and rate yourself.
- **🧖 Lauteilla** – spoken Finnish (*puhekieli*): mä, sä, se, me, te, ne.
- **🧊 Avanto** – negative sentences (en, et, ei …).

### Length modes

| Mode | Behaviour |
|---|---|
| 10 verbs – one pass | Each verb once; mistakes are listed at the end. |
| 20 verbs – up to 3 tries | Wrong verbs go back into the bag, max. 3 attempts; verbs still wrong after the 3rd try are listed |
| All verbs – until you nail them | Wrong verbs keep returning until you get them right; every verb you ever got wrong is listed |

Verbs are drawn from a shuffle bag, so none repeat until the bag is empty.

## Project structure

- `index.html` contains the page markup.
- `favicon.svg` contains the sauna-themed browser tab icon.
- `verbisauna/styles.css` contains the styling.
- `verbisauna/js/verbs.js` contains verb data, conjugation rules, and the reference-form self-test.
- `verbisauna/js/game.js` contains game state and rules.
- `verbisauna/js/app.js` connects the game logic to the page.

The app has no dependencies, build step, or server-side component; any static HTTP server can serve it.

## Adding verbs

Add a verb to the `RAW` array in `verbisauna/js/verbs.js`, following the existing entries:

```js
{fi:"antaa",type:1,en:["give","gives"],kpt:{weak:"anna",label:"nt → nn"}},
```

- `fi` – infinitive; keep it unique.
- `type` – Finnish verb type. The current rule engine supports type 1.
- `en` – English base form and third-person singular.
- `kpt` – optional consonant gradation, with the weak-grade stem and feedback label.

The generated forms are checked against the hand-written `LEGACY` reference fixture in the same file. Add the new verb's expected forms to that fixture too so the self-test covers it:
```js
{fi:"antaa",c:"annetaan",en:["give","gives"],g:"nt → nn",f:["annan","annat","antaa","annamme","annatte","antavat"]},
```

- `fi` – infinitive (keep it unique)
- `c` – colloquial *me* form (passive)
- `f` – six forms: minä, sinä, hän, me, te, he
- `en` – English base form and 3rd person singular
- `g` – the verb type 1 consonant gradation


## Sources ❤️

VerbiSauna stands on the shoulders of people who share what they know:

- [Uusi kielemme](https://uusikielemme.fi/finnish-grammar/consonant-gradation/verbtype-1-consonant-gradation): the verb types and consonant gradation
- [Wikisanakirja](https://fi.wiktionary.org/wiki/Wikisanakirja:Etusivu): for checking forms
- [Glosbe](https://glosbe.com/): translations
- My Finnish teacher

Kiitos.

I am because you are.
Love,
mayflwr