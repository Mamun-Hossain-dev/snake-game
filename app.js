const snakeBoard = document.getElementById("snake-board");
let scoreBox = document.querySelector("#scores");
let pointsBox = document.querySelector("#points");
let highScoreBox = document.getElementById("high-score");
const foodSound = new Audio("./assets/food.mp3");
const moveSound = new Audio("./assets/move.mp3");
const gameOverSound = new Audio("./assets/over.wav");

//level buttons variables
const btnsContainer = document.querySelectorAll(".level-btns button");
const buttons = Array.from(btnsContainer);

// //initially active the easy level 
buttons[0].classList.add("selected");

// snake variables
let inputDir = {x: 0, y: 0};
let snakeArr = [
    {x: 5, y: 9}
];
let food = {x: 12, y: 15};
let speed = 4;
let lastPaintTime = 0;
let score = 0;
let point = 0;
let highScoreVal = 0;


// main function or gaming loop function
function main(ctime) {
   window.requestAnimationFrame(main);

   if ((ctime - lastPaintTime) / 1000 < (1 / speed)) {
    return;
   }
   lastPaintTime = ctime;

  //call the gameEngine() function
  gameEngine();
}

//reset the active class
function resetActiveClass() {
    buttons.forEach((btn)=> btn.classList.remove('selected'));
}

// if you level up the game then increase the speed 
buttons[0].onclick = function() {
    speed = 4;
    resetActiveClass();
    this. classList.add("selected");
}
buttons[1].onclick = function() {
    speed = 8;
    resetActiveClass();
    this. classList.add("selected");
}
buttons[2].onclick = function() {
    speed = 12;
    resetActiveClass();
    this. classList.add("selected");
}

// function collide () 
function isCollide(arr) {
    //if head of the snake collide with the body then game over
    for (let i = 1; i < arr.length; i++) {
        if ((arr[i].x === arr[0].x) && (arr[i].y === arr[0].y)) {
            return true;
        }
    }

    //checking collision with walls and edges
    if (arr[0].x >= 20 || arr[0].y >= 20 || arr[0].x <= 0 || arr[0].y <= 0) {
        return true;
    }
}

//generate random foods after eating 
function generateFood() {
    let min = 2;
    let max = 18;
    food.x = Math.floor(Math.random() * (max - min + 1)) + min;
    food.y = Math.floor(Math.random() * (max - min + 1)) + min;
}


//  Game Engine Function
function gameEngine() {
    snakeBoard.innerHTML = "";

    // update the snake and the food
    if(isCollide(snakeArr)) {
        gameOverSound.play();
        inputDir = {x: 0, y: 0};
        snakeArr = [{x: 5, y: 9}];
        score = 0;
        point = 0;  
        alert("Game Over! Press Any key to Restart!!!");
        location.reload();
    }

    //if you have eaten the food, increase the score and regenerate the food again
    if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
        foodSound.play();
        score++;
        if (score > highScoreVal) {
            highScoreVal = score;
            highScoreBox.innerHTML = highScoreVal;
            localStorage.setItem("highScore", JSON.stringify(highScoreVal));
        }
        point += 10;
        scoreBox.innerHTML = (score < 10) ? `0${score}`: score; 
        pointsBox.innerHTML = (point < 100) ? `000${point}`: point; 
        snakeArr.unshift({x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y});
        generateFood();
    }

    //move the snake continuesLy according to the direction's movement
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = {...snakeArr[i]};
    }
    snakeArr[0].x = snakeArr[0].x + inputDir.x;
    snakeArr[0].y  = snakeArr[0].y + inputDir.y;

    //display the snake
    snakeArr.forEach((elem, idx) => {
        const snakeDiv = document.createElement("div");
        if (idx === 0) {
            snakeDiv.classList.add("snake-head");
        } else {
            snakeDiv.classList.add("snake-body");
        }
        snakeDiv.style.gridRowStart = elem.y;
        snakeDiv.style.gridColumnStart = elem.x;
        snakeBoard.appendChild(snakeDiv);
    });

    // display the food
    let foodDiv = document.createElement("div");
    foodDiv.style.gridRowStart = food.y;
    foodDiv.style.gridColumnStart = food.x;
    foodDiv.classList.add("food");
    snakeBoard.appendChild(foodDiv);
}

// getting highScore value from the LS:
let highScore = localStorage.getItem("highScore");
if (highScore === null) {
    highScoreVal = 0
    localStorage.setItem("highScore", JSON.stringify(highScoreVal));
} else {
    highScoreVal = JSON.parse(highScore);
    highScoreBox.innerHTML = highScoreVal;
}

// initialize the game  
window.requestAnimationFrame(main);

//main logic starts here
window.addEventListener("keydown", (e) => {
    inputDir = {x: 0, y: 1}; 
    moveSound.play();

    switch (e.key) {
        case "ArrowUp":
            inputDir.x = 0;
            inputDir.y = -1;
            break;
        case "ArrowDown":
            inputDir.x = 0;
            inputDir.y = 1;
            break;
        case "ArrowLeft":
            inputDir.x = -1;
            inputDir.y = 0;
            break;
        case "ArrowRight":
            inputDir.x = 1;
            inputDir.y = 0;
            break;
        default:
            break;
    }
})