var Word = require("./Word.js");

//Iquirer npm package used to prompt user input.
var inquirer = require("inquirer");

//Cli-color npm package used to give the game some color.
var clc = require('cli-color');

//Figlet npm package used to convert text to drawing.
var figlet = require('figlet');

//Is-letter npm package used for validation.
var isLetter = require('is-letter');

//Creates boxes in the terminal
const boxen = require('boxen');

//Text color for correct guess message.
var correct = clc.green.bold;

//Text color for incorrect guess message.
var incorrect = clc.red.bold;

//Default value for userGuessedCorrectly will be false but will be set to true when users guess is correct.
var userGuessedCorrectly = false;

//Our word bank - predefined list of words to choose from. 
var wordList = ["nikes", "seigfried", "biking", "godspeed", "whiteferrari", "skylineto", "thinkingboutyou", "superrichkids", "strawberryswing", "wealltry", "novacane", "moonriver", "fertilizer", "prettysweet", "nights"];

//Choose random word from wordList.
var randomizer;
var currentWord;

//Counter variables.
var wins = 0;
var losses = 0;
var guessesRemaining = 0;

//Creating a variable to hold the letter that the user enters at the inquirer prompt.
var userGuess = "";

//Creating a variable to hold letters that user already guessed.
var guessedLetterString = "";
var guessedLetterArray = [];

//Holds the number of correct guess. 
//When game starts or is reset, this value should be 0.
var correctGuesses = 0;

//Uses figlet npm to draw the game title.
figlet("Frank Ocean \n Word Guess", function (err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data)
    //Welcome screen text.
    console.log("Welcome to Frank Ocean Word Guess!");
    console.log("Theme is... Frank Ocean... \n");

    //Ask user if they are ready to play.
    confirmStart();
});

//Use Inquirer package to display game confirmation prompt to user.
function confirmStart() {
    var readyStart = [
        {
            type: 'confirm',
            name: 'readyToPlay',
            message: 'Are you ready to play?',
            default: true
        }
    ];

    inquirer.prompt(readyStart).then(answers => {
        //If the user confirms that they want to play, start game.
        if (answers.readyToPlay) {
            console.log("Great! Welcome! Let's begin...");
            console.log("=====================================================================");
            startGame();
        }

        else {
            //If the user does not want to play, exit game.
            console.log("Come back soon!");
            return;
        }
    });
}

//Start game function.
function startGame() {
    //Reset number of guesses remainingm when user starts a new game.
    guessesRemaining = 10;
    //Pick random word from word list.
    chooseWord();
    //When game is reset, empty out list of already guessed letters.
    guessedLetterString = "";
    guessedLetterArray = [];
}

//Function to choose a random word from the list of cities in the word bank array.
function chooseWord() {
    //Randomly generate word from wordList array.
    randomizer = wordList[Math.floor(Math.random() * wordList.length)].toUpperCase();
    //Set the random word chosen from the word list to currentWord.
    currentWord = new Word(randomizer);
    //Tell the user how many letters are in the word.
    console.log("The song title contains " + randomizer.length + " letters.");
    console.log("=====================================================================");
    //Use the Word constructor in Word.js to split the word and generate letters.
    currentWord.splitWord();
    currentWord.generateLetters();
    guessLetter();
}

//Function that will prompt the user to enter a letter. This letter is the user's guess.
function guessLetter() {
    //Keep prompting user to enter a letter if there are slots/underscores that still need to be filled in
    //OR if there are still guesses remaining.
    if (correctGuesses < currentWord.letters.length || guessesRemaining > 0) {
        inquirer.prompt([
            {
                name: "letter",
                message: "Guess a letter:",
                validate: function (value) {
                    if (isLetter(value)) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            }
        ]).then(function (guess) {
            //Convert all letters guessed by the user to upper case.
            guess.letter.toUpperCase();
            console.log("You guessed: " + guess.letter.toUpperCase());
            //Assume correct guess to be false at this point.
            userGuessedCorrectly = false;
            //Need to find out if letter was already guessed by the user. If already guessed by the user, notify the user to enter another letter.
            //User shouldn't be able to continue with game if they guess the same letter more than once.
            if (guessedLetterArray.indexOf(guess.letter.toUpperCase()) > -1) {
                //If user already guessed a letter, run inquirer again to prompt them to enter a different letter.
                console.log("You already guessed that letter. Enter another one.");
                console.log("=====================================================================");
                guessLetter();
            }

            //If user entered a letter that was not already guessed...
            else if (guessedLetterArray.indexOf(guess.letter.toUpperCase()) === -1) {
                //Add letter to list of already guessed letters.
                guessedLetterString = guessedLetterString.concat(" " + guess.letter.toUpperCase());
                guessedLetterArray.push(guess.letter.toUpperCase());
                //Show letters already guessed to user.
                console.log(boxen('Letters already guessed: ' + guessedLetterString, { padding: 1 }));

                //We need to loop through all of the letters in the word, 
                //and determine if the letter that the user guessed matches one of the letters in the word.
                for (i = 0; i < currentWord.letters.length; i++) {
                    //If the user guess equals one of the letters/characters in the word and letterGuessedCorrectly is equal to false for that letter...
                    if (guess.letter.toUpperCase() === currentWord.letters[i].character && currentWord.letters[i].letterGuessedCorrectly === false) {
                        //Set letterGuessedCorrectly property for that letter equal to true.
                        currentWord.letters[i].letterGuessedCorrectly === true;
                        //Set userGuessedCorrectly to true.
                        userGuessedCorrectly = true;
                        currentWord.spaces[i] = guess.letter.toUpperCase();
                      
                        //Increment the number of slots/underscores filled in with letters by 1.
                        correctGuesses++
                    }
                }

                console.log("You've guessed " + correctGuesses + '/' + randomizer.length + " letters. \n");

                currentWord.splitWord();
                currentWord.generateLetters();

                //If user guessed correctly...
                if (userGuessedCorrectly) {
                    //Tell user they are CORRECT (letter is in the word they are trying to guess.)
                    console.log(correct('\n CORRECT!'));
                    console.log("=====================================================================");
                    //After each letter guess, check if the user won or lost.
                    checkIfUserWon();
                }

                //Else if user guessed incorrectly...
                else {
                    //Tell user they are INCORRECT (letter is not in the word).
                    console.log(incorrect('\n INCORRECT!'));
                    //Decrease number of guesses remaining by 1 and display number of guesses remaining.
                    guessesRemaining--;
                    console.log("You have " + guessesRemaining + " guesses left.");
                    console.log("=====================================================================");
                    //After each letter guess, check if the user won or lost.
                    checkIfUserWon();
                }
            }
        });
    }
}

//This function will check if the user won or lost after user guesses a letter.
function checkIfUserWon() {
    //If number of guesses remaining is 0, end game.
    if (guessesRemaining === 0) {
        console.log(incorrect('YOU LOST. BETTER LUCK NEXT TIME.'));
        console.log("The song was: " + randomizer);
        //Increment loss counter by 1.
        losses++;
        //Display wins and losses totals.
        console.log("Wins: " + wins + " Losses: " + losses);
        console.log("=====================================================================");
        //Ask user if they want to play again. Call playAgain function.
        playAgain();
    }

    //else if the number of spaces that are filled in with a letter equals the number of letters in the word, the user won.
    else if (correctGuesses === currentWord.letters.length) {
        console.log(correct("YOU WON! YOU'RE A TRUE FAN!"));
        //Increment win counter by 1.
        wins++;
        //Show total wins and losses.
        console.log("Wins: " + wins + " Losses: " + losses);
        console.log("=====================================================================");
        //Ask user if they want to play again. Call playAgain function.
        playAgain();
    }

    else {
        //If user did not win or lose after a guess, keep running inquirer.
        guessLetter("");
    }
}

//Create a function that will ask user if they want to play again at the end of the game.
function playAgain() {
    var playGameAgain = [
        {
            type: 'confirm',
            name: 'playAgain',
            message: 'Play again?',
            default: true
        }
    ];

    inquirer.prompt(playGameAgain).then(userWantsTo => {
        if (userWantsTo.playAgain) {
            //Empty out the array that contains the letters already guessed.
            guessedLetterString = "";
            guessedLetterArray = [];
            //Set number of slots filled in with letters back to zero.
            correctGuesses = 0;
            console.log("Great! Let's begin... \n");
            //start a new game.
            startGame();
        }

        else {
            //If user doesn't want to play again, exit game.
            console.log("Come back soon!");
            return;
        }
    });
}
