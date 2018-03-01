/*
 * Create a list that holds all of your cards
 */
const classListCards = document.querySelectorAll(".card > i");
const listOfCards = [];
for (let i = 0; i < classListCards.length; i++) {
    listOfCards.push(classListCards[i].classList[1]);
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

const shuffledListOfCards = shuffle(listOfCards);

const cardElements = document.querySelectorAll(".card > i");
for (let i = 0; i < cardElements.length; i++) {
    let secondClassName = cardElements[i].classList[1];
    cardElements[i].classList.remove(secondClassName);
    cardElements[i].classList.add(shuffledListOfCards[i]);

}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

const TWO_STARS_DIFF = 10;
const ONE_STARS_DIFF = 18;
const DIFFERENT_IMAGES = 8;
const STARS_NUMBER = 3;
var openedCards = [];
var totalMoves = 0;
var matches = 0;
var clock;

// Click listener
const deckClassElement = document.querySelector(".deck");
deckClassElement.addEventListener("click", function(event) {
    if (totalMoves === 0) {
        startTimer();
    }
    revealCard(event);
    addCard(event);
    if (totalMoves - matches === TWO_STARS_DIFF) {
        removeStar(2);
    } else if (totalMoves - matches === ONE_STARS_DIFF) {
        removeStar(1);
    }
});

function revealCard(event) {
    event.target.classList.add("show");
    event.target.classList.add("open");
}

var pre;
function addCard(event) {
    if (openedCards.length === 1) {
        if (pre.target.isSameNode(event.target)) {
            return;
        }
        displayCounter(++totalMoves);
        if (isSameCard(event)) {
            removeShowOpenClasses(event);
            addMatchClass(event);
        } else {
            setTimeout(removeShowOpenClasses, 500, openedCards[0]);
            setTimeout(removeShowOpenClasses, 500, event);
            setTimeout(emptyCardList, 500);
        }
    } else {
        if (pre != null) {
            if (pre.target.isSameNode(event.target)) {
                return;
            }
        }
        displayCounter(++totalMoves);
        openedCards.push(event);
    }
    pre = event;
}

function isSameCard(event) {
    let cardOne = openedCards[0].target.querySelector("i").classList[1];
    let cardTwo = event.target.querySelector("i").classList[1];

    if (cardOne === cardTwo) {
        return true;
    }
    return false;
}

function removeShowOpenClasses(event) {
    event.target.classList.remove("show");
    event.target.classList.remove("open");
}

function addMatchClass(event) {
    event.target.classList.add("match");
    openedCards.pop().target.classList.add("match");
    ++matches;
    isFinished();
}

function emptyCardList() {
    openedCards.pop();
}


// Displat total moves to the screen
function displayCounter(totalMoves) {
    document.querySelector(".moves").innerHTML = totalMoves;
}

// Check if all cards match
function isFinished() {
    if (DIFFERENT_IMAGES === matches) {
        winMessage();
    }
}

// Get current stars
function getStarsParent() {
    return document.querySelector(".stars");
}

// Remove solid star and add no-solid star
function removeStar(child) {
    let starParent = getStarsParent();
    starParent.getElementsByTagName("li")[child].firstElementChild.classList.remove("fa-star");
    starParent.getElementsByTagName("li")[child].firstElementChild.classList.add("fa-star-o");
}

// Modal for win message
function winMessage() {
    var modal = document.getElementById("myModal");
    var span = document.getElementsByClassName("close")[0];

    let timeHeader = document.getElementById("time-header");
    let starsHeader = document.getElementById("stars-header");
    const playAgainButton = document.getElementById("play-again-button");
    timeHeader.innerHTML += getTime();
    starsHeader.innerHTML += document.getElementsByClassName("fa-star").length;

    playAgainButton.addEventListener("click", function() {
        modal.style.display = "none";
        resetAll();
    })

    // Open the modal 
    modal.style.display = "block";

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        stopTime();
        clearTime();
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            stopTime();
            clearTime();
            modal.style.display = "none";
        }
    }
}

// Reset button
const reset = document.querySelector(".restart");
reset.addEventListener("click", function() {
    resetAll();
});

// Mother function for reset functions
function resetAll() {
    emptyCardList();
    resetAllCards();
    resetMovesDisplayCounter();
    resetStarsDisplay();
    stopTime();
    clearTime();
}
// All Reset functions
function resetAllCards() {
    const listCards = document.querySelectorAll(".card");
    let classes = ["match", "show", "open"];
    for (let i = 0; i < DIFFERENT_IMAGES * 2; i++) {
        listCards[i].classList.remove(...classes);
    }
}

function resetMovesDisplayCounter() {
    totalMoves = 0;
    displayCounter(totalMoves);
}

function resetStarsDisplay() {
    let starParent = document.querySelector(".stars");
    for (let i = 0; i < STARS_NUMBER; i++) {
        starParent.getElementsByTagName("li")[i].firstElementChild.classList.remove("fa-star-o");
        starParent.getElementsByTagName("li")[i].firstElementChild.classList.add("fa-star");
    }
}

// Timer and functions
var minutesLabel = document.getElementById("minutes");
var secondsLabel = document.getElementById("seconds");
var totalSeconds = 0;

function startTimer() {
    clock = setInterval(setTime, 1000);
}

function setTime() {
    ++totalSeconds;
    secondsLabel.innerHTML = pad(totalSeconds % 60);
    minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
}

function pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
    } else {
        return valString;
    }
}

function stopTime() {
    clearInterval(clock);
}

function clearTime() {
    totalSeconds = 0;
    document.getElementById("minutes").innerHTML = "00";
    document.getElementById("seconds").innerHTML = "00";
}

function getTime() {
    let minutes = document.getElementById("minutes").innerHTML;
    let seconds = document.getElementById("seconds").innerHTML;

    return minutes + " : " + seconds;
}