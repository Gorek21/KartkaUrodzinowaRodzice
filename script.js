const photoIntro = document.querySelector("#photoIntro");
const mainContent = document.querySelector("#mainContent");
const enterCardButton = document.querySelector("[data-enter-card]");
const envelope = document.querySelector("#envelope");

const revealButton = document.querySelector("[data-reveal]");
const backButton = document.querySelector("[data-back]");
const flipCard = document.querySelector("[data-flip-card]");
const details = document.querySelector("#details");
const start = document.querySelector("#start");

function openCardFromPhoto() {
  if (!photoIntro || !mainContent) return;

  envelope?.classList.add("is-open");

  window.setTimeout(() => {
    photoIntro.classList.add("is-leaving");
  }, 520);

  window.setTimeout(() => {
    photoIntro.hidden = true;
    mainContent.hidden = false;

    requestAnimationFrame(() => {
      start?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, 1040);
}

function openSecret() {
  if (!details) return;

  details.hidden = false;
  document.body.classList.add("is-revealed");
  fireConfetti();

  requestAnimationFrame(() => {
    details.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function closeSecret() {
  if (!details || !start) return;

  document.body.classList.remove("is-revealed");
  start.scrollIntoView({ behavior: "smooth", block: "start" });

  window.setTimeout(() => {
    details.hidden = true;
  }, 360);
}

enterCardButton?.addEventListener("click", openCardFromPhoto);
revealButton?.addEventListener("click", openSecret);
backButton?.addEventListener("click", closeSecret);

flipCard?.addEventListener("click", () => {
  const isFlipped = flipCard.classList.toggle("is-flipped");
  flipCard.setAttribute("aria-expanded", String(isFlipped));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && details && !details.hidden) {
    closeSecret();
  }
});

/* Konfetti – kleiner Wow-Moment beim Enthüllen des Geschenks */

function fireConfetti() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const canvas = document.createElement("canvas");
  canvas.className = "confetti-canvas";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const colors = ["#0f8f86", "#c98a2c", "#f0c987", "#d7f1ec", "#0a5f58"];

  function resize() {
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();

  const pieceCount = 90;
  const pieces = Array.from({ length: pieceCount }, () => ({
    x: window.innerWidth / 2 + (Math.random() - 0.5) * 60,
    y: window.innerHeight * 0.32,
    vx: (Math.random() - 0.5) * 9,
    vy: -Math.random() * 10 - 4,
    size: Math.random() * 7 + 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * Math.PI,
    spin: (Math.random() - 0.5) * 0.3,
    shape: Math.random() > 0.5 ? "petal" : "circle",
  }));

  const gravity = 0.32;
  const drag = 0.985;
  let frame = 0;
  const maxFrames = 130;
  let rafId;

  function tick() {
    frame += 1;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    pieces.forEach((p) => {
      p.vx *= drag;
      p.vy = p.vy * drag + gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.spin;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = frame > maxFrames - 30 ? Math.max(0, (maxFrames - frame) / 30) : 1;

      if (p.shape === "petal") {
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size / 2, p.size / 3.2, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2.6, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });

    if (frame < maxFrames) {
      rafId = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(rafId);
      canvas.remove();
    }
  }

  tick();
}
