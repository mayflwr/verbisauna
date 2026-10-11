# VerbiSauna 🧖

A sauna-themed browser game for practising Finnish verb conjugation and consonant gradation (*astevaihtelu*). Throw löyly to pick the person, then build the sentence.

Single HTML file, no dependencies, no build step.

**Play:** https://mayflwr.github.io/verbisauna/

## How to play

Open `index.html` in a browser, or use the link above.

- **Write it** – type the sentence. **Say it** – speak out loud, then reveal the answer and rate yourself.
- **🧖 Lauteilla** – spoken Finnish (*puhekieli*): mä, sä, se, me, te, ne
- **🧊 Avanto** – negative sentences (en, et, ei …)

### Length modes

| Mode | Behaviour |
|---|---|
| 10 verbs – one pass | Each verb once; mistakes are listed at the end |
| 20 verbs – up to 3 tries | Wrong verbs go back into the bag, max. 3 attempts; verbs still wrong after the 3rd try are listed |
| All verbs – until you nail them | Wrong verbs keep returning until you get them right; every verb you ever got wrong is listed |

Verbs are drawn from a shuffle bag, so none repeat until the bag is empty.

## Adding verbs

Add an entry to the `VERBS` array in `index.html`:

```js
{fi:"antaa",c:"annetaan",en:["give","gives"],g:"nt → nn",f:["annan","annat","antaa","annamme","annatte","antavat"]},
```

- `fi` – infinitive (keep it unique)
- `c` – colloquial *me* form (passive)
- `f` – six forms: minä, sinä, hän, me, te, he
- `en` – English base form and 3rd person singular
- `g` – the consonant gradation
