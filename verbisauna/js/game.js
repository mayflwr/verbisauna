import { NEG, PEN, PRON, PRON_C, VERBS, level } from "./verbs.js";

function shuffle(items) {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

function normalize(value) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function stripDiacritics(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function createGame() {
  const state = {
    total: 10,
    played: 0,
    correct: 0,
    best: 0,
    policy: "once",
    queue: [],
    size: 0,
    done: 0,
    tries: {},
    missed: {},
    mastered: {},
    firstTotal: 0,
    firstOk: 0,
    puheMode: false,
    negMode: false,
    mode: "write",
    pts: 0,
    streak: 0,
    temp: 40,
    cur: null,
    answered: false,
  };

  function start({ mode, puheMode, negMode, total }) {
    state.mode = mode;
    state.puheMode = puheMode;
    state.negMode = negMode;
    state.total = total;
    state.policy = total === 10 ? "once" : total === 20 ? "three" : "mastery";
    state.queue = shuffle(VERBS.slice());
    if (total > 0) state.queue = state.queue.slice(0, total);
    state.size = state.queue.length;
    state.done = 0;
    state.tries = {};
    state.missed = {};
    state.mastered = {};
    state.firstTotal = 0;
    state.firstOk = 0;
    state.played = 0;
    state.correct = 0;
    state.best = 0;
    state.pts = 0;
    state.streak = 0;
    state.temp = 40;
  }

  function nextTask() {
    state.answered = false;
    const p = Math.floor(Math.random() * 6);
    const v = state.queue.shift();
    state.cur = { p, v, neg: state.negMode && Math.random() < 0.4 };
    return state.cur;
  }

  function connegative(verb) {
    return verb.f[0].slice(0, -1);
  }

  function standardForm() {
    const { p, v, neg } = state.cur;
    return neg ? `${NEG[p]} ${connegative(v)}` : v.f[p];
  }

  function spokenForm() {
    const { p, v, neg } = state.cur;
    if (p === 3) return neg ? `ei ${v.c.slice(0, -2)}` : v.c;
    if (p === 5) return neg ? `ei ${connegative(v)}` : v.f[2];
    return standardForm();
  }

  function form() {
    return state.puheMode ? spokenForm() : standardForm();
  }

  function solution() {
    const pronouns = state.puheMode ? PRON_C : PRON;
    return `${pronouns[state.cur.p]} ${form()}`;
  }

  function englishText() {
    const { p, v, neg } = state.cur;
    return neg
      ? `${PEN[p]} ${p === 2 ? "doesn't" : "don't"} ${v.en[0]}`
      : `${PEN[p]} ${p === 2 ? v.en[1] : v.en[0]}`;
  }

  function requeue(verb) {
    const index = Math.min(state.queue.length, 2 + Math.floor(Math.random() * 3));
    state.queue.splice(index, 0, verb);
  }

  function track(ok) {
    const verb = state.cur.v;
    const key = verb.fi;
    state.tries[key] = (state.tries[key] || 0) + 1;
    if (state.tries[key] === 1) {
      state.firstTotal += 1;
      if (ok) state.firstOk += 1;
    }

    if (ok) {
      state.mastered[key] = 1;
      state.done += 1;
      return;
    }

    state.missed[key] = state.missed[key] || { v: verb, forms: [] };
    const currentSolution = solution();
    if (!state.missed[key].forms.some((item) => item.sol === currentSolution)) {
      state.missed[key].forms.push({ sol: currentSolution, en: englishText() });
    }
    if (state.policy === "once" || (state.policy === "three" && state.tries[key] >= 3)) {
      state.done += 1;
    } else {
      requeue(verb);
    }
  }

  function award(ok) {
    track(ok);
    state.played += 1;

    let message = "";
    if (ok) {
      state.streak += 1;
      state.correct += 1;
      state.best = Math.max(state.best, state.streak);
      const gain = 10 + Math.min(state.streak - 1, 5) * 2 + (state.cur.neg ? 5 : 0);
      state.pts += gain;
      state.temp += 12 + (state.cur.neg ? 10 : 0);
    } else {
      state.streak = 0;
      state.temp = Math.max(40, state.temp - 15);
    }

    if (state.temp >= 100) {
      state.pts += 25;
      state.temp = 40;
      message = "🧖 Sauna is hot! Löyly bonus +25 ⭐";
    }
    return message;
  }

  function submit(answer) {
    if (state.answered) return null;
    const given = normalize(answer)
      .replace(/^mie\b/, "mä")
      .replace(/^sie\b/, "sä");
    if (!given) return null;
    state.answered = true;

    const right = normalize(form());
    const full = normalize(solution());
    const standard = normalize(standardForm());
    const standardFull = normalize(`${PRON[state.cur.p]} ${standardForm()}`);
    const spokenFull = normalize(`${PRON_C[state.cur.p]} ${spokenForm()}`);
    const pronounRequired = state.cur.p === 2 || state.cur.p === 5;
    const acceptsPronounless = !pronounRequired;

    if (given === full || (acceptsPronounless && given === right)) {
      const bonus = award(true);
      const praise = state.streak > 1 ? `🔥 ${state.streak} in a row! ` : "";
      return {
        kind: "good",
        head: `Oikein! ${state.cur.neg ? "Back in the sauna! " : ""}${praise}${bonus}`,
      };
    }

    const pronounlessSpoken = normalize(spokenForm());
    if (!state.puheMode && (
      (spokenFull !== full && given === spokenFull)
      || (acceptsPronounless && pronounlessSpoken !== right && given === pronounlessSpoken)
    )) {
      award(false);
      return {
        kind: "bad",
        head: "Correct spoken Finnish (puhekieli) – but you're in standard Finnish mode. ",
      };
    }

    if (state.puheMode && ((given === standardFull && standardFull !== full)
      || (standard !== right && acceptsPronounless && given === standard))) {
      requeue(state.cur.v);
      return {
        kind: "bad",
        head: "Correct standard Finnish – but you're in spoken Finnish (puhekieli) mode. ",
      };
    }
    if (stripDiacritics(given) === stripDiacritics(full)
      || (acceptsPronounless && stripDiacritics(given) === stripDiacritics(right))) {
      award(false);
      return { kind: "bad", head: "Almost – watch the ä/ö. " };
    }

    award(false);
    return { kind: "bad", head: "Not quite. " };
  }

  function reveal() {
    if (state.cur.neg) state.temp = Math.max(40, state.temp - 10);
  }

  function selfRate(known) {
    return award(known);
  }

  function summary() {
    const accuracy = state.firstTotal
      ? Math.round(state.firstOk / state.firstTotal * 100)
      : 0;
    const review = Object.keys(state.missed)
      .filter((key) => state.policy !== "three" || !state.mastered[key])
      .map((key) => state.missed[key]);
    const heading = state.policy === "mastery"
      ? "Tricky ones – wrong at least once:"
      : state.policy === "three"
        ? "Still cold after 3 tries:"
        : "Review these:";
    const rank = accuracy >= 90
      ? ["🔥", "Täydet löylyt", "täydet löylyt = perfect steam"]
      : accuracy >= 70
        ? ["♨️", "Kuuma löyly", "kuuma löyly = hot steam"]
        : accuracy >= 40
          ? ["🪵", "Lämpiää", "lämpiää = warming up"]
          : ["🥶", "Kylmä sauna", "kylmä sauna = cold sauna"];

    return { accuracy, review, heading, rank, level: level(state.pts) };
  }

  return {
    state,
    start,
    nextTask,
    form,
    standardForm,
    solution,
    englishText,
    submit,
    reveal,
    selfRate,
    summary,
  };
}
