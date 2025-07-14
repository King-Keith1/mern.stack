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

  // ⏺️ REGISTER
  function register() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  fetch('http://localhost:3000/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        mutation Register($username: String!, $password: String!) {
          register(username: $username, password: $password) {
            token
            user {
              username
            }
          }
        }
      `,
      variables: { username, password }
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.errors) {
      alert(data.errors[0].message || 'Register failed');
      return;
    }

    token = data.data.register.token;
    alert(`✅ Registered as ${data.data.register.user.username}`);
    document.getElementById('auth').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    loadLeaderboard();
  })
  .catch(console.error);
}

  // 🔐 LOGIN
  function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  fetch('http://localhost:3000/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        mutation Login($username: String!, $password: String!) {
          login(username: $username, password: $password) {
            token
            user {
              username
            }
          }
        }
      `,
      variables: { username, password }
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.errors) {
      alert(data.errors[0].message || 'Login failed');
      return;
    }

    token = data.data.login.token;
    alert(`✅ Logged in as ${data.data.login.user.username}`);
    document.getElementById('auth').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    loadLeaderboard();
  })
  .catch(err => {
    console.error('Login error:', err);
    alert('Login failed. Try again.');
  });
}

  // ▶️ START GAME
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

        const username = document.getElementById('username').value;
        const score = Math.floor(Math.random() * 200);

        fetch('http://localhost:3000/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            query: `
              mutation {
                addScore(username: "${username}", score: ${score}, difficulty: "${difficulty}") {
                  username
                  score
                }
              }
            `
          })
        }).then(() => loadLeaderboard());
      }
    }, 1000);
  }

  // 🐭 MOVE MOUSE
  function moveMouse() {
    if (!mouse) return;
    mouse.style.left = position.x + 'px';
    mouse.style.top = position.y + 'px';
  }

  // ⌨️ HANDLE KEYBOARD INPUT
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

  // 🏆 LOAD LEADERBOARD
  function loadLeaderboard() {
    const diff = document.getElementById('boardDiff')?.value || 'easy';

    fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query {
            scores(difficulty: "${diff}") {
              username
              score
            }
          }
        `
      })
    })
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById('leaderboard');
      if (!list || !data.data) return;

      list.innerHTML = '';
      data.data.scores.forEach((entry, i) => {
        const item = document.createElement('li');
        item.textContent = `#${i + 1} ${entry.username} — ${entry.score} pts`;
        list.appendChild(item);
      });
    });
  }

  // 🧠 MAKE FUNCTIONS GLOBAL FOR BUTTON ONCLICKS
  window.register = register;
  window.login = login;
  window.startGame = startGame;
});
