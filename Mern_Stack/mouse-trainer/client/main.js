let token = '';
let position = { x: 180, y: 180 };
let speed = 10;
let difficulty = 'easy';
let time = 30;
let timer;

function register() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  fetch('http://localhost:3000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  }).then(res => res.json()).then(alertMsg);
}

function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  }).then(res => res.json()).then(data => {
    token = data.token;
    document.getElementById('auth').style.display = 'none';
    document.getElementById('game').style.display = 'block';
  });
}

function startGame(diff) {
  difficulty = diff;
  position = { x: 180, y: 180 };
  moveMouse();

  time = 30;
  document.getElementById('info').innerText = `Time left: ${time}s`;

  clearInterval(timer);
  timer = setInterval(() => {
    time--;
    document.getElementById('info').innerText = `Time left: ${time}s`;
    if (time <= 0) {
      clearInterval(timer);
      alert('Time’s up! Score sent.');
      fetch('http://localhost:3000/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: document.getElementById('username').value, score: 100, difficulty })
      });
    }
  }, 1000);
}

document.addEventListener('keydown', e => {
  const m = document.getElementById('mouse');
  if (!m) return;

  const msg = document.getElementById('message');
  switch (e.key.toLowerCase()) {
    case 'w': position.y -= speed; break;
    case 'a': position.x -= speed; break;
    case 's': position.y += speed; break;
    case 'd': position.x += speed; break;
    case ' ': msg.innerText = 'Jumped!'; break;
    case 'shift': msg.innerText = 'Dashed!'; break;
    case 'control': msg.innerText = 'Crouched!'; break;
  }
  moveMouse();
});

function moveMouse() {
  const m = document.getElementById('mouse');
  m.style.left = position.x + 'px';
  m.style.top = position.y + 'px';
}

function alertMsg(res) {
  alert('Done. You can log in now.');
}
