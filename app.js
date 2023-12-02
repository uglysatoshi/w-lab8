const gameBoard = document.querySelector('#board');
const activePlayer = document.querySelector('#player');
const infoDisplay = document.querySelector('#information');
const width = 8;

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