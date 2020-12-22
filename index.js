var snakeGameTable = document.querySelector('.snake-game-table')
var boxes = document.getElementsByClassName('box')
var modal = document.querySelector('.snake-game-modal')
var playAgain = document.querySelector('.play-again')

var table = {
    rowCols: 21,
    boxes: 21 * 21,
}

var snake = {
    direction: 'right',
    position: [[6, 10], [7, 10], [8, 10], [9, 10], [10, 10]],
    speed: 200,
    score: 0,
    final: 0,
    time: 0,
    canTurn: 0,
    init: function() {
        snake.direction = 'right'
        snake.position = [[0, 0]];
        snake.speed = 200
        snake.score = 0
        snake.time = 0
        snake.canTurn = 0
        snakeGameTable.innerHTML = ''
        tableCreation()
    }
}
snake.init()

function tableCreation() {
    if (snakeGameTable.innerHTML === '') {
        for (var i = 0; i < table.boxes; i++) {
            var $box = document.createElement('div')
            $box.classList.add('box')
            snakeGameTable.appendChild($box)
        }
    }

    // status bar
    var $statusBar = document.createElement('div')
    $statusBar.classList.add('status')
    snakeGameTable.appendChild($statusBar)
    $score = document.createElement('span')
    $score.classList.add('score')
    $score.innerHTML = snake.score + 'pts'
    $statusBar.appendChild($score)
}

playAgain.addEventListener('click', startSnake)

document.addEventListener('keydown', function(e) {
    if (e.keyCode === 13 && snake.time === 0) {
        startSnake()
    }
})

function startSnake() {
    modal.classList.add('hidden');
    snake.time = 1;
    renderSnake();
    randomFood();
    // interval heart of the game()
    setInt = setInterval(function() {
        move()
    }, snake.speed)
}

function renderSnake() {
    for (var i = 0; i < snake.position.length; i++) {
        boxes[snake.position[i][0] + snake.position[i][1] * table.rowCols].classList.add('snake')
    }
}

function randomFood() {
    var randomX = Math.floor(Math.random() * table.rowCols)
    var randomY = Math.floor(Math.random() * table.rowCols)
    random = randomX + randomY * table.rowCols;
    while (boxes[random].classList.contains('snake')) {
        randomX = Math.floor(Math.random() * table.rowCols)
        randomY = Math.floor(Math.random() * table.rowCols)
        random = randomX + randomY * table.rowCols; 
    }
    boxes[random].classList.add('food')
    foodPos = [randomX, randomY]
}
function move() {
    // check if move allowed & then eat Food
    hitFood()
    hitBorder()
    hitSnake()

    // actually move the snake
    updatePositions()
    renderSnake()
    document.addEventListener('keydown', turn)
    snake.canTurn = 1;
}

function hitFood() {
    var head = snake.position[snake.position.length - 1];
    // var tail = snake.position[0];
    if (head[0]=== foodPos[0] && head[1] === foodPos[1]) {
        boxes[random].classList.remove('food')
        snake.position.unshift([]);
        randomFood()
        snake.score += 10;
        $score.innerHTML = snake.score + 'pts'
    }
}
function hitBorder() {
    var headPos = snake.position.length - 1;
    if (
        (snake.position[headPos][0] === table.rowCols - 1 && snake.direction === 'right')||
        (snake.position[headPos][0] === 0 && snake.direction === 'left') ||
        (snake.position[headPos][1] === table.rowCols - 1 && snake.direction === 'down')||
        (snake.position[headPos][1] === 0 && snake.direction === 'up') 
    ) {
        stop()
    }
}
function hitSnake() {
    var headPos = snake.position.length - 1;
    console.log(headPos, snake.position)
    for (var i = 0;  i < headPos -1 ; i++) {
        if (snake.position[headPos].toString() === snake.position[i].toString()) {
            stop()
        }
    }
}


function updatePositions() {
    if (boxes[snake.position[0][0] + snake.position[0][1] * table.rowCols]) {
        boxes[snake.position[0][0] + snake.position[0][1] * table.rowCols].classList.remove('snake')
    }
    
    var head = snake.position[snake.position.length -1];
    snake.position.shift()
    switch(snake.direction) {
        case 'left':
            snake.position.push([head[0] - 1, head[1]]);
            break;
        case 'up':
            snake.position.push([head[0], head[1] - 1]);
            break;   
        case 'right':
            snake.position.push([head[0] + 1, head[1]]);
            break;   
        case 'down':
            snake.position.push([head[0], head[1] + 1]);
            break;
        default:
            console.log('no direction!')       
    }
}

function turn(e) {
    if (snake.canTurn) {
        switch (e.keyCode) {
            case 13:
                // document.removeEventListener()
                break;
            case 37: // left
                if (snake.direction === 'right') return;
                    snake.direction = 'left'
                break;   
            case 38: // up
                if (snake.direction === 'down') return;
                    snake.direction = 'up'
                break;  
            case 39: // right
                if (snake.direction === 'left') return;
                    snake.direction = 'right'
                    break;  
            case 40: // down
                if (snake.direction === 'up') return;
                    snake.direction = 'down'
                    break;
            default: 
                console.log('wrong key')
                
        }
        snake.canTurn = 0;
    }
}

function stop() {
    clearInterval(setInt)
    snake.final = snake.score;
    playAgain.querySelector('span').innerHTML = snake.final + 'Points'

    setTimeout(() => {
        playAgain.querySelector('span').innerHTML = 'Play Again'
    }, 800);
    snake.init()
    modal.classList.remove('hidden')
}
