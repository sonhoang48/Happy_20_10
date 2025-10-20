// ========== DOM ==========
const body = document.body;
const audio = document.getElementById('bg-music');
const playPauseBtn = document.getElementById('playPauseBtn');
const typewriterEl = document.getElementById('typewriter');
const openCardBtn = document.getElementById('openCardBtn');
const closeCardBtn = document.getElementById('closeCardBtn');
const popupCard = document.getElementById('popupCard');
const effectsCanvas = document.getElementById('effectsCanvas');
const ctx = effectsCanvas.getContext ? effectsCanvas.getContext('2d') : null;

effectsCanvas.width = window.innerWidth;
effectsCanvas.height = window.innerHeight;

// ========== Phát nhạc an toàn ==========
function tryPlayAudio() {
  if (!audio) return;
  const p = audio.play();
  if (p !== undefined) {
    p.catch(() => {
      window.addEventListener('click', () => audio.play().catch(()=>{}), { once: true });
    });
  }
}

// ==== Nút Play / Pause nhạc ====
const playPauseBtn = document.getElementById("playPauseBtn");

if (playPauseBtn && audio) {
  playPauseBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play().then(() => {
        playPauseBtn.textContent = "⏸ Tạm dừng nhạc";
      }).catch(err => console.log("Không thể phát nhạc:", err));
    } else {
      audio.pause();
      playPauseBtn.textContent = "🎵 Bật nhạc";
    }
  });
}


// ========== Bắt đầu hiệu ứng ==========
window.onload = () => {
  setTimeout(() => {
    body.classList.remove('not-loaded');
    tryPlayAudio();
  }, 600);
};

// ========== Typewriter ==========
const text = "I love you, Võ Nguyễn Ngọc Diệp 💖";
let idx = 0;
function showTypewriter() {
  typewriterEl.classList.remove('hidden');
  function step() {
    if (idx < text.length) {
      typewriterEl.innerHTML += text.charAt(idx);
      idx++;
      setTimeout(step, 100);
    } else {
      openCardBtn.classList.remove('hidden');
    }
  }
  step();
}

// ========== Popup ==========
if (openCardBtn) openCardBtn.addEventListener('click', () => popupCard.style.display = 'flex');
if (closeCardBtn) closeCardBtn.addEventListener('click', () => popupCard.style.display = 'none');

// ========== Resize canvas ==========
window.addEventListener('resize', () => {
  effectsCanvas.width = window.innerWidth;
  effectsCanvas.height = window.innerHeight;
});

// ========== Petals, Hearts, Hello Kitty ==========
const hearts = [];
const petals = [];
const kitties = [];

function createHeart() {
  return {
    x: Math.random() * effectsCanvas.width,
    y: Math.random() * effectsCanvas.height - effectsCanvas.height,
    size: Math.random() * 10 + 6,
    speed: Math.random() * 0.8 + 0.6,
    opacity: Math.random() * 0.6 + 0.4,
    sway: (Math.random() * 2 - 1) * 0.5
  };
}
function createPetal() {
  return {
    x: Math.random() * effectsCanvas.width,
    y: -Math.random() * effectsCanvas.height,
    size: Math.random() * 14 + 6,
    speed: Math.random() * 1.2 + 0.8,
    angle: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() * 0.6 - 0.3),
    opacity: Math.random() * 0.6 + 0.4
  };
}
function createKitty() {
  return {
    x: Math.random() * effectsCanvas.width,
    y: -Math.random() * 400,
    size: Math.random() * 40 + 30,
    speed: Math.random() * 0.7 + 0.4,
    sway: (Math.random() - 0.5) * 1.2,
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.02
  };
}
for (let i = 0; i < 18; i++) hearts.push(createHeart());
for (let i = 0; i < 28; i++) petals.push(createPetal());
for (let i = 0; i < 10; i++) kitties.push(createKitty());

// Ảnh Hello Kitty
const kittyImage = new Image();
kittyImage.src = "img/hello_kitty.png";

// Vẽ
function drawHeart(h) {
  ctx.save();
  ctx.globalAlpha = h.opacity;
  ctx.fillStyle = 'rgba(255,120,170,0.95)';
  ctx.beginPath();
  const topCurveHeight = h.size * 0.3;
  ctx.moveTo(h.x, h.y + topCurveHeight);
  ctx.bezierCurveTo(h.x - h.size / 2, h.y - h.size / 2, h.x - h.size, h.y + topCurveHeight / 2, h.x, h.y + h.size);
  ctx.bezierCurveTo(h.x + h.size, h.y + topCurveHeight / 2, h.x + h.size / 2, h.y - h.size / 2, h.x, h.y + topCurveHeight);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
function drawPetal(p) {
  ctx.save();
  ctx.globalAlpha = p.opacity;
  ctx.translate(p.x, p.y);
  ctx.rotate(p.angle);
  ctx.beginPath();
  ctx.ellipse(0, 0, p.size * 0.6, p.size * 0.35, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#ffd1e6';
  ctx.fill();
  ctx.restore();
}
function drawKitty(k) {
  if (!kittyImage.complete) return;
  ctx.save();
  ctx.translate(k.x, k.y);
  ctx.rotate(k.rotation);
  ctx.globalAlpha = 0.8;
  ctx.drawImage(kittyImage, -k.size / 2, -k.size / 2, k.size, k.size);
  ctx.restore();
}

// Hiệu ứng rơi
let falling = false;
function animateFalling() {
  if (!ctx) return;
  ctx.clearRect(0, 0, effectsCanvas.width, effectsCanvas.height);

  hearts.forEach(h => {
    drawHeart(h);
    h.y += h.speed;
    h.x += Math.sin(h.y * 0.01) * 0.6 + h.sway;
    if (h.y > effectsCanvas.height + 50) Object.assign(h, createHeart());
  });

  petals.forEach(p => {
    drawPetal(p);
    p.y += p.speed;
    p.x += Math.sin(p.y * 0.01) * 0.7;
    p.angle += p.rotSpeed * 0.03;
    if (p.y > effectsCanvas.height + 60) Object.assign(p, createPetal());
  });

  kitties.forEach(k => {
    drawKitty(k);
    k.y += k.speed;
    k.x += Math.sin(k.y * 0.01) * 0.6 + k.sway;
    k.rotation += k.rotSpeed;
    if (k.y > effectsCanvas.height + 100) Object.assign(k, createKitty());
  });

  if (falling) requestAnimationFrame(animateFalling);
}

// ========== Chạy trình tự ==========
const BLOOM_DURATION_MS = 5200;
setTimeout(() => {
  falling = true;
  animateFalling();
  setTimeout(showTypewriter, 900);
  tryPlayAudio();
}, BLOOM_DURATION_MS);

// ========== Auto play khi click ==========
document.addEventListener('click', () => audio.play().catch(()=>{}), { once: true });

// ========== Giảm tốc khi popup mở ==========
const observer = new MutationObserver(() => {
  if (popupCard && getComputedStyle(popupCard).display === 'flex') {
    petals.forEach(p => p.speed *= 0.18);
    hearts.forEach(h => h.speed *= 0.18);
    kitties.forEach(k => k.speed *= 0.18);
  } else {
    petals.forEach(p => p.speed = Math.random() * 1.2 + 0.8);
    hearts.forEach(h => h.speed = Math.random() * 0.8 + 0.6);
    kitties.forEach(k => k.speed = Math.random() * 0.7 + 0.4);
  }
});
observer.observe(document.body, { attributes: true, subtree: true });

