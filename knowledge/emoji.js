
  const emojis = ['🍎', '🍌', '🍓', '🍉', '🍍']; // ← 5 emojis
  const flipSound = document.getElementById('flipSound');
  const matchSound = document.getElementById('matchSound');
  const winSound = document.getElementById('winSound');

  let cards = [];
  let firstCard = null;
  let lockBoard = false;
  let matched = 0;
  let moves = 0;
  let time = 0;
  let timerStarted = false;
  let timerInterval;

  const game = document.getElementById('game');
  const message = document.getElementById('message');
  const timerDisplay = document.getElementById('timer');
  const movesDisplay = document.getElementById('moves');
  const restartButton = document.getElementById('restart');
  const previewButton = document.getElementById('preview');

  restartButton.addEventListener('click', startGame);
  previewButton.addEventListener('click', previewCards);

  function startGame() {
    clearInterval(timerInterval);
    game.innerHTML = '';
    message.innerText = '';
    cards = [...emojis, ...emojis]; // 5 pairs → 10 cards
    cards.sort(() => 0.5 - Math.random());
    firstCard = null;
    lockBoard = false;
    matched = 0;
    moves = 0;
    time = 0;
    timerStarted = false;
    timerDisplay.innerText = 0;
    movesDisplay.innerText = 0;

    cards.forEach((symbol, index) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.dataset.symbol = symbol;
      card.dataset.index = index;
      const span = document.createElement('span');
      span.innerText = '?';
      card.appendChild(span);
      card.addEventListener('click', () => flipCard(card));
      game.appendChild(card);
    });
  }

  function flipCard(card) {
    if (lockBoard || card.classList.contains('flipped')) return;

    if (!timerStarted) {
      startTimer();
      timerStarted = true;
    }

    flipSound.play();
    card.classList.add('flipped');
    card.querySelector('span').innerText = card.dataset.symbol;

    if (!firstCard) {
      firstCard = card;
    } else {
      moves++;
      movesDisplay.innerText = moves;

      if (firstCard.dataset.symbol === card.dataset.symbol && firstCard !== card) {
        matchSound.play();
        matched++;
        firstCard = null;

        if (matched === cards.length / 2) {
          clearInterval(timerInterval);
          message.innerText = `🎉 You won in ${time} seconds and ${moves} moves! Restarting...`;
          winSound.play();
          setTimeout(startGame, 3000); // ← Auto restart after 3 seconds
        }
      } else {
        lockBoard = true;
        setTimeout(() => {
          card.classList.remove('flipped');
          card.querySelector('span').innerText = '?';
          firstCard.classList.remove('flipped');
          firstCard.querySelector('span').innerText = '?';
          firstCard = null;
          lockBoard = false;
        }, 800);
      }
    }
  }

  function startTimer() {
    timerInterval = setInterval(() => {
      time++;
      timerDisplay.innerText = time;
    }, 1000);
  }

  function previewCards() {
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => {
      card.classList.add('flipped');
      card.querySelector('span').innerText = card.dataset.symbol;
    });

    setTimeout(() => {
      allCards.forEach(card => {
        if (!card.classList.contains('matched')) {
          card.classList.remove('flipped');
          card.querySelector('span').innerText = '?';
        }
      });
    }, 1000);
  }

  // Start game on load
  startGame();
  window.addEventListener('DOMContentLoaded', startGame);

