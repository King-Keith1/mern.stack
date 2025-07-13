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
  })
  .then(res => res.json())
  .then(data => {
    console.log('Register Response:', data);
    alert('Registered! Now log in.');
  })
  .catch(err => console.error('Register Error:', err));
}

function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  .then(async res => {
    const data = await res.json();
    console.log('Login Response:', data);
    if (res.ok) {
      token = data.token;
      document.getElementById('auth').style.display = 'none';
      document.getElementById('game').style.display = 'block';
      loadLeaderboard(); // show scores
    } else {
      alert(data.msg || 'Login failed');
    }
  })
  .catch(err => console.error('Login Error:', err));
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
      alert('Time’s up! Score submitted.');

      fetch('http://localhost:3000/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: document.getElementById('username').value,
          score: Math.floor(Math.random() * 200), // random score for demo
          difficulty
        })
      }).then(() => loadLeaderboard());
    }
  }, 1000);
}

const mouse = document.getElementById('mouse');
const arena = document.getElementById('arena');

const mouseSize = 30;
const step = 10;

document.addEventListener('keydown', e => {
  const key = e.key?.toLowerCase?.();
  if (!key) return;

  const m = document.getElementById('mouse');
  const msg = document.getElementById('message');
  if (!m || !msg) return;

  if (difficulty === 'easy' && !['w','a','s','d'].includes(key)) return;
  if (difficulty === 'medium' && !['w','a','s','d',' '].includes(key)) return;

  switch (key) {
    case 'w': position.y -= speed; break;
    case 'a': position.x -= speed; break;
    case 's': position.y += speed; break;
    case 'd': position.x += speed; break;
    case ' ': msg.innerText = 'Jumped!'; break;
    case 'shift': msg.innerText = 'Dashed!'; break;
    case 'control': msg.innerText = 'Crouched!'; break;
    default: return;
  }

  const arenaRect = arena.getBoundingClientRect();
  const arenaWidth = arena.offsetWidth;
  const arenaHeight = arena.offsetHeight;

  let top = parseInt(mouse.style.top) || 0;
  let left = parseInt(mouse.style.left) || 0;

  if (e.key === 'w' || e.key === 'ArrowUp') {
    top = Math.max(0, top - step);
  } else if (e.key === 's' || e.key === 'ArrowDown') {
    top = Math.min(arenaHeight - mouseSize, top + step);
  } else if (e.key === 'a' || e.key === 'ArrowLeft') {
    left = Math.max(0, left - step);
  } else if (e.key === 'd' || e.key === 'ArrowRight') {
    left = Math.min(arenaWidth - mouseSize, left + step);
  }

  mouse.style.top = top + 'px';
  mouse.style.left = left + 'px';

  moveMouse();
});

function moveMouse() {
  const m = document.getElementById('mouse');
  m.style.left = position.x + 'px';
  m.style.top = position.y + 'px';
}

function loadLeaderboard() {
  const diff = document.getElementById('boardDiff')?.value || 'easy';
  fetch(`http://localhost:3000/api/score/${diff}`)
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById('leaderboard');
      if (!list) return;
      list.innerHTML = '';
      data.forEach((entry, i) => {
        const item = document.createElement('li');
        item.textContent = `#${i + 1} ${entry.username} — ${entry.score} pts`;
        list.appendChild(item);
      });
    });
}
