document.addEventListener('DOMContentLoaded', () => {
  let token = '';
  let position = { x: 180, y: 180 };
  let speed = 10;
  let difficulty = 'easy';
  let time = 30;
  let timer;

  const arena = document.getElementById('arena');
  const mouse = document.getElementById('mouse');
  const mouseSize = 30;

  function register() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  fetch('http://localhost:3000/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        mutation {
          register(username: "${username}", password: "${password}") {
            username
          }
        }
      `
    })
  })
    .then(res => res.json())
    .then(data => {
      alert(`Registered ${data.data.register.username}`);
    })
    .catch(console.error);
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
          loadLeaderboard();
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
            score: Math.floor(Math.random() * 200),
            difficulty
          })
        }).then(() => loadLeaderboard());
      }
    }, 1000);
  }

  function moveMouse() {
    if (!mouse) return;
    mouse.style.left = position.x + 'px';
    mouse.style.top = position.y + 'px';
  }

  document.addEventListener('keydown', e => {
    const key = e.key?.toLowerCase?.();
    if (!key || !arena || !mouse) return;

    const msg = document.getElementById('message');
    if (!msg) return;

    const allowedKeys = {
      easy: ['w', 'a', 's', 'd'],
      medium: ['w', 'a', 's', 'd', ' '],
      hard: ['w', 'a', 's', 'd', ' ', 'shift', 'control']
    };

    if (!allowedKeys[difficulty]?.includes(key)) return;

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

    const maxX = arena.offsetWidth - mouseSize;
    const maxY = arena.offsetHeight - mouseSize;

    position.x = Math.max(0, Math.min(position.x, maxX));
    position.y = Math.max(0, Math.min(position.y, maxY));

    moveMouse();
  });

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

  // Expose login/register/startGame globally for button onclicks
  window.register = register;
  window.login = login;
  window.startGame = startGame;
});
