const gameBoard = document.querySelector('#board'); // Объявление игровой доски
const activePlayer = document.querySelector('#player'); // Активный игрок на данных ход
const infoDisplay = document.querySelector('#information'); // Вывод информации о ошибках

const width = 8; // Размер шахматной доски
let playerGo = 'black'; // Объявление первого игрока
activePlayer.textContent = 'black'; // Запись активного игрока
let startPosition; // Позиция с которой мы начинаем ход
let draggedFigure; // Фигура для хода

// Объявление фигур на шахматном поле
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

// Функция создания доски
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

createBoard(); // Создаем доску
changePlayer(); // Изменяем игрока и индексы, чтобы первый ход был у белых
const allSquares = document.querySelectorAll(".square") // Записываем массив всех ячеек

// Информация о неправильном ходе
function info() {
    infoDisplay.textContent = "This move isn't valid!";
    setTimeout(() => infoDisplay.textContent = "", 2000);
}

// Добавляем листенеры для каждой ячейки
allSquares.forEach(square => {
    square.addEventListener('dragstart', dragStart);
    square.addEventListener('dragover', dragOver);
    square.addEventListener('drop', dragDrop)
})

// Ивент при взятии фигуры
function dragStart (event) {
    startPosition = event.target.parentNode.getAttribute('square-id');
    draggedFigure = event.target;
}

// Ивент при остановке взятия фигуры
function dragOver (event) {
    event.preventDefault();
}

// Ивент при дропе фигуры с логикой перемещения фигуры
function dragDrop (event) {
    event.stopPropagation();
    const correctTarget = draggedFigure.classList.contains(playerGo);
    const taken = event.target.classList.contains('figure');
    const opponentTarget = playerGo === 'white' ? 'black' : 'white';
    const valid = validateMove(event.target);
    const takenByOpponent = event.target?.classList.contains(opponentTarget);

    if(correctTarget) {
        if(takenByOpponent && valid) {
            event.target.parentNode.append(draggedFigure);
            event.target.remove();
            changePlayer();
            return;
        }
        if(taken && !takenByOpponent) {
            info();
            return;
        }
        if(valid) {
            event.target.append(draggedFigure);
            changePlayer();
        }
    }
}

function validateMove(target) {
    const targetID = Number(target.getAttribute('square-id')) || Number(target.parentNode.getAttribute('square-id'));
    const startID = Number(startPosition);
    const figure = draggedFigure.id;

    switch (figure) {
        case 'pawn':
            // Объявляем стартовую позицию пешек
            let startRow = [8, 9, 10, 11, 12, 13, 14, 15];
            if (
                // Ход на две ячейки со стартовой позиции
                startRow.includes(startID) && startID + width * 2 === targetID ||
                // Ход на одну ячейку вперед
                startID + width === targetID && !target.classList.contains('figure') ||
                // Срубить фигуру справа/слева
                startID + width - 1 === targetID && document.querySelector(`[square-id="${startID + width - 1}"]`).firstChild ||
                startID + width + 1 === targetID && document.querySelector(`[square-id="${startID + width + 1}"]`).firstChild
            ) return true;
            else info();
            break;
        case 'knight':
            if (
                startID + width * 2 - 1 === targetID ||
                startID + width * 2 + 1 === targetID ||
                startID + width - 2 === targetID ||
                startID + width + 2 === targetID ||
                startID - width * 2 - 1 === targetID ||
                startID - width * 2 + 1 === targetID ||
                startID - width - 2 === targetID ||
                startID - width + 2 === targetID
            ) return true;
            else info();
            break;
        case 'bishop':
            const bishopMove = Math.abs(targetID - startID);
            // Проверяем идет ли ход по диагонали
            if (bishopMove % (width + 1) === 0 || bishopMove % (width - 1) === 0) {
                const step = bishopMove % (width + 1) === 0 ? (width + 1) : (width - 1);
                // Находим в какую сторону по диагонали идет ход
                const bishopDirection = targetID > startID ? 1 : -1;
                // Проверяем каждую ячейку по диагонали на наличие фигур
                for (let i = startID + step * bishopDirection; i !== targetID; i += step * bishopDirection) {
                    const square = document.querySelector(`[square-id="${i}"]`);
                    // Если ячейка содержит фигуру
                    if (square.firstChild) {
                        info();
                        return false;
                    }
                }
                return true;
            } else info();
            break;
        case 'rook':
            const rookMove = Math.abs(targetID - startID);
            // Проверяем идет ли ход по верткали или горизонтали
            if (rookMove % width  === 0 || rookMove < width) {
                const step = rookMove % width === 0 ? width : 1;
                // Находим в какую сторону по диагонали идет ход
                const rookDirection = targetID > startID ? 1 : -1;
                // Проверяем каждую ячейку по диагонали на наличие фигур
                for (let i = startID + step * rookDirection; i !== targetID; i += step * rookDirection) {
                    const square = document.querySelector(`[square-id="${i}"]`);
                    // Если ячейка содержит фигуру
                    if (square.firstChild) {
                        info();
                        return false;
                    }
                }
                return true;
            } else info();
            break;
        case 'queen':
            const queenMove = Math.abs(targetID - startID);
            // Проверяем идет ли ход по верткали, горизонтали или диагонали
            if (queenMove % width  === 0 || queenMove < width || queenMove % (width + 1) === 0 || queenMove % (width - 1) === 0) {
                let step;
                if(queenMove % width  === 0) step = width;
                if(queenMove < width) step = 1;
                if(queenMove % (width + 1) === 0) step = width + 1;
                if(queenMove % (width - 1) === 0) step = width - 1;
                const queenDirection = targetID > startID ? 1 : -1;
                for (let i = startID + step * queenDirection; i !== targetID; i += step * queenDirection) {
                    const square = document.querySelector(`[square-id="${i}"]`);
                    // Если ячейка содержит фигуру
                    if (square.firstChild) {
                        info();
                        return false;
                    }
                }
                return true;
            } else info();
            break;
        case 'king':
            if (
                startID + 1 === targetID ||
                startID - 1 === targetID ||
                startID + width === targetID ||
                startID + width - 1 === targetID ||
                startID + width + 1 === targetID ||
                startID - width === targetID ||
                startID - width - 1 === targetID ||
                startID - width + 1 === targetID
            ) return true;
            else info();
            break;
    }
}

// Смена игроков и реверс индексов ячеек
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