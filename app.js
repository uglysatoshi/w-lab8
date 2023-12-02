const gameBoard = document.querySelector('#board');
const activePlayer = document.querySelector('#player');
const infoDisplay = document.querySelector('#information');

const width = 8;
let playerGo = 'white';
activePlayer.textContent = 'white';
let startPosition;
let draggedFigure;

const startFigurePosition = [
    rook, knight, bishop, queen, king, bishop, knight, rook,
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    rook, knight, bishop, queen, king, bishop, knight, rook
];

function createBoard() {
    startFigurePosition.forEach((startFigure, i) => {
        const square = document.createElement('div');
        square.classList.add('square');
        square.innerHTML = startFigure;
        square.firstChild && square.firstChild.setAttribute('draggable', true);
        square.setAttribute('square-id', i);
        square.classList.add('beige');
        const row = Math.floor((63 - i) / 8) + 1;
        if(row % 2 === 0) {
            square.classList.add(i % 2 === 0 ? 'beige' : 'brown')
        } else {
            square.classList.add(i % 2 === 0 ? 'brown' : 'beige')
        }
        if (i <= 15) {
            square.firstChild.classList.add('black');
        }
        if (i >= 48) {
            square.firstChild.classList.add('white');
        }
        gameBoard.append(square);
    })
}
createBoard()
const allSquares = document.querySelectorAll(".square")

allSquares.forEach(square => {
    square.addEventListener('dragstart', dragStart);
    square.addEventListener('dragover', dragOver);
    square.addEventListener('drop', dragDrop)
})

function dragStart (event) {
    startPosition = event.target.parentNode.getAttribute('square-id');
    draggedFigure = event.target;
}

function dragOver (event) {
    event.preventDefault();
}


function dragDrop (event) {
    event.stopPropagation();
    const correctTarget = draggedFigure.classList.contains(playerGo);
    console.log(draggedFigure.classList.contains(playerGo));
    const taken = event.target.classList.contains('figure');
    const opponentTarget = playerGo === 'white' ? 'black' : 'white';
    const valid = validateMove(draggedFigure);
    const takenByOpponent = event.target?.classList.contains(opponentTarget);

    if(correctTarget) {
        if(takenByOpponent && valid) {
            event.target.parentNode.append(draggedFigure);
            event.target.remove();
            changePlayer();
            return;
        }
        if(taken && !takenByOpponent) {
            infoDisplay.textContent = "This move isn't valid!";
            setTimeout(() => infoDisplay.textContent = "", 2000);
            return;
        }
        if(valid) {
            event.target.append(draggedFigure);
            changePlayer();
        }
    }
}

function changePlayer() {
    if (playerGo === 'black') {
        reverseIDs();
        playerGo = 'white';
        activePlayer.textContent = 'white';
    } else {
        revertIDs();
        playerGo = 'black';
        activePlayer.textContent = 'black';
    }
}

function reverseIDs() {
    const allSquares = document.querySelectorAll('.square')
    allSquares.forEach((square, i) =>
        square.setAttribute('square-id', (width * width - 1) - i)
    );
}

function revertIDs() {
    const allSquares = document.querySelectorAll('.square')
    allSquares.forEach((square, i) =>
        square.setAttribute('square-id',  i)
    );
}

function validateMove(target) {
    return true;
}