/*
* Set starting variables
* - isPopup: if window when the game is over is open or not
* - openCards: cards that have been flipped
* - matches: the amount of pairs matched
* - moves: total flips (meaning total times two cards have been flipped)
* - dontClick: when animation happens for mismatch, cannot click other cards
*/

let isPopup = false;
let openCards = [];
let matches = 0;
let moves = 0;
let dontClick = false;

// Variables for the times
let minutes = 0;
let seconds = 0;
let miliseconds = 0;
let t;
const time = document.querySelector(".clock");

// Timer function
function startTimer() {
    t = setInterval(function() {
        miliseconds++;
        if (miliseconds >=100) {
            miliseconds = 0;
            seconds++;
            if (seconds >= 60) {
                seconds = 0;
                minutes++;
                if (minutes >= 60) {
                    gameOver();
                }
            }
        }
        time.textContent = (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds ? (seconds > 9 ? seconds : "0" + seconds) : "00") + ":" + (miliseconds > 9 ? miliseconds : "0" + miliseconds);
    }, 10);
}

// Grab all the cards and add an event listener
const cards = document.querySelectorAll('.card');
for (const card of cards) {
    card.addEventListener('click', flipCard);
}

// Shuffle board before 1st game
shuffleCards();

// Grab the repeat button and add event handler to it
const repeat = document.querySelector(".restart");
repeat.addEventListener('click', function restartGame() {
    if (isPopup)
        return;
    clearInterval(t);
    restart();
    for (const card of cards)
        card.className = 'card'
});

// Grab the stars and make the rating the amount of stars
const stars = document.querySelectorAll('.fa-star');
let rating = stars.length - 1;

// Display for the amount of moves
const movesElement = document.querySelector('.moves');

// Grab pop up window class
const popup = document.querySelector('.popuptext');

// Grab the span elements in the pop up for editing when game is over
const finalMoves = document.querySelector('.totalMoves');
const finalRating = document.querySelector('.rating');
const finalTime = document.querySelector('.time');

// Grab the play again and shuffle buttons on the 
// pop up window and add event handlers
const playAgainButton = document.querySelector('.playAgain');
playAgainButton.addEventListener('click', function popUpRestart() {
    finishPopup();
    for (const card of cards)
        card.className = 'card';
});

const shuffleButton = document.querySelector('.shuffle');
shuffleButton.addEventListener('click', function popUpShuffle() {
    finishPopup();
    shuffleCards();
});

function finishPopup() {
    isPopup = false;
    popup.classList.toggle('show');
    restart();
}

//Reset variables for restart
function restart() {
    minutes = 0;
    seconds = 0;
    miliseconds = 0;
    time.textContent = "00:00:00"
    openCards = [];
    moves = 0;
    matches = 0;
    rating = stars.length - 1;
    movesElement.textContent = moves;
    
    for (const star of stars) {
        star.style.visibility = null;
    }
}

// Shuffles cards
function shuffleCards() {
    let classes = [];
    for (const card of cards)
        classes.push(card.firstElementChild.className);
    
    classes = shuffle(classes);
    for (const card of cards) {
        card.className = 'card';
        card.firstElementChild.className = classes.pop();
        console.log(card.firstElementChild.className);
    }
}

// Helper shuffle function
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Flip card when clicked - check if two have been clicked
function flipCard() {
    if (moves == 0 && openCards.length == 0)
        startTimer();
    if (openCards.length < 2 && !isPopup && !dontClick) {
        if ((openCards.length == 0 || this !== openCards[0]) && !this.className.includes('match')) {
            this.className = 'card open show';
            openCards.push(this);
            if (openCards.length == 2)
                checkMatch();
        }
    }
}

// Check if the two cards flipped have matched and act on it
function checkMatch() {
    moves++;
    movesElement.textContent = moves;
    const card1 = openCards.pop();
    const card2 = openCards.pop();
    if (card1.firstElementChild.className == card2.firstElementChild.className) {
        card1.className = card2.className = 'card match pop';
        matches++;
        if (matches == 8) { 
            gameOver();
        }
    } else {
        card1.style.background = card2.style.background = '#CC0000';
        dontClick = true;
        card1.classList.add("wiggle");
        card2.classList.add("wiggle"); 
        setTimeout(function () {
            card1.className = card2.className = 'card'; 
            card1.removeAttribute('style');
            card2.removeAttribute('style'); 
            dontClick = false;
        }, 1000);
    }
    
    if (moves == 16 || moves == 25 || moves == 30) {
        stars[rating--].style.visibility = 'hidden';   
    }
}

// When all matches are made, show pop up with stats.
function gameOver() {
    clearInterval(t);
    finalMoves.textContent = moves;
    finalRating.textContent = rating+1;
    finalTime.textContent = (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds ? (seconds > 9 ? seconds : "0" + seconds) : "00") + ":" + (miliseconds > 9 ? miliseconds : "0" + miliseconds);
    isPopup = true;
    popup.classList.toggle('show');
}