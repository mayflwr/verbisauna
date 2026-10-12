import { PERSON_EMOJIS, STANDARD_PRONOUNS, COLLOQUIAL_PRONOUNS, EN_PRONOUNS, level } from "./verbs.js";
import { createGame } from "./game.js";

const game = createGame();
const $ = (id) => document.getElementById(id);
const state = game.state;

function show(id, visible) {
  $(id).classList.toggle("hide", !visible);
  if (id === "game") document.body.classList.toggle("playing", visible);
}

function renderBench() {
  $("bench").innerHTML = STANDARD_PRONOUNS.map((_, index) => (
    `<div class="seat"><div class="emoji">${PERSON_EMOJIS[index]}</div>`
    + `<div class="pl">${(state.puheMode ? COLLOQUIAL_PRONOUNS : STANDARD_PRONOUNS)[index]}</div>`
    + `<div class="mut en">${EN_PRONOUNS[index]}</div></div>`
  )).join("");
}

function update() {
  $("pts").textContent = state.pts;
  $("streak").textContent = state.streak;
  $("temp").textContent = state.temp;
  $("bar").style.width = `${Math.min(100, (state.temp - 40) / 60 * 100)}%`;
  $("lvl").textContent = level(state.pts)[1];
  $("rd").textContent = `${state.done}/${state.size}`;
}

function nextTask() {
  game.nextTask();
  update();
  $("next").textContent = "Next round";
  show("results", false);
  show("taskCard", true);
  document.querySelectorAll(".seat").forEach((seat) => seat.classList.remove("on", "ice"));
  $("ans").value = "";
  show("fb", false);
  show("next", false);
  show("selfRate", false);
  show("taskBody", false);
  show("ladleBox", true);
  $("ladle").disabled = false;
}

function puff(id) {
  const box = $(id || "steam");
  for (let index = 0; index < 7; index += 1) {
    const particle = document.createElement("span");
    particle.textContent = index % 2 ? "💨" : "☁️";
    particle.className = "p";
    particle.style.left = `${8 + Math.random() * 80}%`;
    particle.style.animationDuration = `${1 + Math.random() * 1.2}s`;
    box.appendChild(particle);
    setTimeout(() => particle.remove(), 2400);
  }
}

function coldShock() {
  for (const [id, className] of [["flash", "go2"], ["brrr", "go"]]) {
    const element = $(id);
    element.classList.remove(className);
    void element.offsetWidth;
    element.classList.add(className);
  }
  const taskCard = $("taskCard");
  taskCard.classList.remove("shake");
  void taskCard.offsetWidth;
  taskCard.classList.add("shake");
  try {
    navigator.vibrate && navigator.vibrate(200);
  } catch (error) {
    console.warn("Vibration is unavailable:", error);
  }
}

function reveal() {
  const { p, v, neg } = state.cur;
  game.reveal();
  show("ladleBox", false);
  show("taskBody", true);
  $("currentPronoun").textContent = (state.puheMode ? COLLOQUIAL_PRONOUNS : STANDARD_PRONOUNS)[p];
  $("verb").textContent = v.fi;
  $("verben").textContent = state.puheMode ? "🧖 spoken Finnish (puhekieli)" : "";
  show("negBadge", neg);
  $("negBadge").textContent = "🧊 Avanto (ice hole)! Jump in and scream NO!";
  if (neg) {
    update();
    coldShock();
  }
  document.querySelectorAll(".seat")[p].classList.toggle("ice", !!neg);
  show("writeBox", state.mode === "write");
  show("speakBox", state.mode === "speak");
  if (state.mode === "write") $("ans").focus();
}

function feedback(kind, head) {
  const element = $("fb");
  element.className = `fb ${kind === "good" ? "good" : "wrong"}`;
  const { p, v, neg } = state.cur;
  const strong = p === 2 || p === 5;
  element.innerHTML = head
    + `<div class="sol">${neg ? `${game.solution().toUpperCase()}!` : game.solution()}</div>`
    + `<div>🇬🇧 ${game.englishText()}</div>`
    + `<div class="mut">Gradation: ${v.g} (${neg
      ? "negative: weak-grade stem for every person, even hän/he"
      : strong
        ? "vahva aste – strong grade in 3rd person"
        : "heikko aste – weak grade"})</div>`
    + (state.puheMode && (p === 3 || p === 5)
      ? `<div class="mut">Spoken Finnish (puhekieli): ${p === 3
        ? "me → passive form (-taan/-tään)"
        : "ne → 3rd person singular form"}</div>`
      : "");
  show("fb", true);
  if ($("tts").checked && "speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(game.solution());
    utterance.lang = "fi-FI";
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  }
}

function updateNextLabel() {
  $("next").textContent = state.queue.length ? "Next round" : "See results";
}

function check() {
  const result = game.submit($("ans").value);
  if (!result) return;
  updateNextLabel();
  update();
  feedback(result.kind, result.head);
  show("next", true);
  $("ans").blur();
  $("fb").scrollIntoView({ behavior: "smooth", block: "center" });
}

function start(mode = state.mode) {
  game.start({
    mode,
    puheMode: $("puheMode").checked,
    negMode: $("negMode").checked,
    total: +$("rounds").value,
  });
  show("results", false);
  show("sumLine", false);
  show("start", false);
  show("game", true);
  update();
  renderBench();
  nextTask();
}

function finish() {
  show("taskCard", false);
  const { accuracy, review, heading, rank, level } = game.summary();
  $("results").innerHTML = `<div class="big result-rank">${rank[0]} ${rank[1]}</div>`
    + `<p class="mut result-subtitle">${rank[2]}</p>`
    + '<div class="steam" id="steam"><span>☁️</span><span>☁️</span><span>☁️</span></div>'
    + (review.length
      ? `<p><b>${heading}</b></p><ul>${review.map((item) => (
        `<li><b>${item.v.fi}</b> <span class="mut">(${item.v.en[0]})</span><br>`
        + `${item.forms.map((form) => `${form.sol} – <span class="mut">${form.en}</span>`).join("<br>")}</li>`
      )).join("")}</ul>`
      : "")
    + '<div class="row result-action-row"><button id="loyly" class="sec">Heitä löylyä!</button></div>'
    + '<p class="result-thanks"><b>Kiitos löylystä!</b><br><span class="mut">Thanks for the steam – the traditional thank-you when leaving the sauna.</span></p>'
    + '<div class="row"><button id="again">Play again</button><button id="menu" class="sec">Change mode</button></div>';
  $("sumLine").innerHTML = `<span class="summary-line">✅ ${state.firstOk} / ${state.firstTotal} first try · ${accuracy} % · 🔥 best streak ${state.best}</span><br>${level[2]}`;
  show("sumLine", true);
  show("results", true);
  $("loyly").onclick = () => puff("steam");
  $("again").onclick = () => start();
  $("menu").onclick = () => {
    show("game", false);
    show("start", true);
  };
}

function next() {
  if (state.queue.length) nextTask();
  else finish();
}

$("mW").onclick = () => {
  state.mode = "write";
  start();
};
$("mS").onclick = () => {
  state.mode = "speak";
  start();
};
$("back").onclick = (event) => {
  event.preventDefault();
  show("game", false);
  show("start", true);
};
$("check").onclick = check;
$("ans").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    if (state.answered) next();
    else check();
  }
});
document.querySelectorAll("[data-ch]").forEach((button) => {
  button.onclick = () => {
    const input = $("ans");
    input.value += button.dataset.ch;
    input.focus();
  };
});
$("reveal").onclick = () => {
  show("speakBox", false);
  feedback("good", "");
  $("fb").className = "fb";
  show("selfRate", true);
  $("fb").scrollIntoView({ behavior: "smooth", block: "center" });
};
$("knew").onclick = () => {
  const message = game.selfRate(true);
  update();
  show("selfRate", false);
  if (message) $("fb").insertAdjacentHTML("afterbegin", message);
  updateNextLabel();
  show("next", true);
};
$("didnt").onclick = () => {
  game.selfRate(false);
  update();
  show("selfRate", false);
  updateNextLabel();
  show("next", true);
};
$("next").onclick = next;
$("ladle").onclick = () => {
  $("ladle").disabled = true;
  puff("steamTop");
  const seats = document.querySelectorAll(".seat");
  const { p } = state.cur;
  const count = 13 + p;
  let index = 0;
  (function step() {
    seats.forEach((seat) => seat.classList.remove("on"));
    seats[index % 6].classList.add("on");
    if (index === count - 1) {
      setTimeout(reveal, 350);
      return;
    }
    index += 1;
    setTimeout(step, 70 + index * 9);
  }());
};
$("finish").onclick = (event) => {
  event.preventDefault();
  finish();
};
