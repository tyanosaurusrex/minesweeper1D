var boardLength = document.querySelector('.boardLength');
var numberOfBombs = document.querySelector('.numberOfBombs');
var saveBtn = document.querySelector('.saveBtn');
var showCheat = document.querySelector('.cheatBtn');
var cheatingBoard = document.querySelector('.cheatingBoard');
cheatingBoard.style.whiteSpace = 'pre';
var playingBoard = document.querySelector('.playingBoard');
playingBoard.style.whiteSpace = 'pre';

var indexToOpen = document.querySelector('.indexToOpen');
var openBtn = document.querySelector('.openBtn');
var resetBtn = document.querySelector('.resetBtn');

var boards;
var length;
var bombs;
var boardToPlay;

init();

function init() {
  boards = [];
  boardToPlay = [];
  boardLength.disabled = false;
  numberOfBombs.disabled = false;
  saveBtn.disabled = false;
  showCheat.textContent = "Show Cheat"

  boardLength.value = '';
  boardLength.focus();
  numberOfBombs.value = '';

  cheatingBoard.textContent = '';
  playingBoard.textContent = '';

  indexToOpen.disabled = true;
  openBtn.disabled = true;
}

function checkAndBuildBoard() {
  length = boardLength.value;
  bombs = numberOfBombs.value;

  if (length == '' || bombs == '') {
    alert('Isi jumlah kotak dan jumlah bom');
  } else {
    if (length < 1 || bombs < 0) {
      alert('Jumlah kotak atau bom tidak boleh negatif atau nol');
    } else {
      var maxBombs = Math.ceil(length / 3);
      if (Number(bombs) === 0) {
        alert('Kamu menang');
        gameOver();
      } else if (bombs > maxBombs) {
        alert('Bom terlalu banyak. Maksimal jumlah bom adalah sepertiga dari jumlah kotak');
      } else {
        boards = createNewBoard();
        placingBombs();

        for (var i = 1; i <= length; i++) {
          boardToPlay[i] = '';
        }

        playingBoard.textContent = printBoard(boardToPlay);

        boardLength.disabled = true;
        numberOfBombs.disabled = true;
        saveBtn.disabled = true;

        indexToOpen.disabled = false;
        openBtn.disabled = false;
      }
    }
  }
}

function createNewBoard() {
  for (var i = 1; i <= length; i++) {
    boards[i] = 0;
  }
  return boards;
}

function placingBombs() {
  var i = bombs;
  while (i > 0) {
    var randomPlace = Math.floor(Math.random() * length) + 1;
    while (boards[randomPlace] === '*') {
      randomPlace = Math.floor(Math.random() * length) + 1;
    }

    boards[randomPlace] = '*';
    countBombAround(randomPlace);
    i--;
  }
  return boards;
}

function countBombAround(randomPlace) {
  if ((randomPlace - 1) > 0 && boards[randomPlace - 1] !== '*') {
    boards[randomPlace - 1] += 1;
  }

  if ((randomPlace + 1) <= length && boards[randomPlace + 1] !== '*') {
    boards[randomPlace + 1] += 1;
  }

  return boards;
}

function printBoard(boards) {
  var printBoard = '';
  for (var i = 0; i < 2; i++) {
    for (var j = 1; j <= length; j++) {
      if (i == 0) {
        printBoard += String(j).padEnd(4, ' ');
      } else {
        var board = (boards[j] !== '') ? String(boards[j]) : '_';
        printBoard += board.padEnd(4, ' ');
      }
    }
    printBoard += '\n';
  }
  return printBoard;
}

saveBtn.addEventListener('click', checkAndBuildBoard)
showCheat.addEventListener('click', showCheatBoard)

function showCheatBoard() {
  if (cheatingBoard.textContent != "") {
    cheatingBoard.textContent = ""
    showCheat.textContent = "Show Cheat"
  } else {
    cheatingBoard.textContent = printBoard(boards);
    showCheat.textContent = "Hide Cheat"
  }
}

function openTile() {
  var indexNumber = Number(indexToOpen.value);
  if (indexNumber === 0) {
    alert('Isi kotak yang ingin dibuka.');
  } else {
    if (indexNumber < 1 || indexNumber > length) {
      alert('Tidak boleh kurang dari 1 dan tidak boleh lebih dari panjang papan');
    } else if (boardToPlay[indexNumber] !== ''){
      alert('Sudah dibuka');
    } else {
      if (boards[indexNumber] === '*') {
        for (var i = 1; i <= length; i++) {
          if (boards[i] === '*') {
            boardToPlay[i] = '*';
          }
        }
        alert('Game Over');
        gameOver();
      } else if (boards[indexNumber] > 0) {
        boardToPlay[indexNumber] = boards[indexNumber];
      } else if (boards[indexNumber] === 0) {
        boardToPlay[indexNumber] = boards[indexNumber];

        openRightAndLeft(indexNumber);
      }
    }
  }

  if (checkWin()) {
    alert('Kamu menang');
    gameOver();
  }

  indexToOpen.value = '';
  indexToOpen.focus();
  playingBoard.textContent = printBoard(boardToPlay);
}

function openRightAndLeft(indexNumber) {
  if (boards[indexNumber - 1] !== '*' && boardToPlay[indexNumber - 1] === '') {
    boardToPlay[indexNumber - 1] = boards[indexNumber - 1];
    openRightAndLeft(indexNumber - 1);
  }

  if (boards[indexNumber + 1] !== '*' && boardToPlay[indexNumber + 1] === '') {
    boardToPlay[indexNumber + 1] = boards[indexNumber + 1];
    openRightAndLeft(indexNumber + 1);
  }
}

function checkWin() {
  return boardToPlay.filter(el => el === '').length === Number(bombs) ? true : false;
}

openBtn.addEventListener('click', openTile);

function gameOver() {
  boardLength.disabled = true;
  numberOfBombs.disabled = true;
  saveBtn.disabled = true;
  indexToOpen.disabled = true;
  openBtn.disabled = true;
}

resetBtn.addEventListener('click', init);