var Letter = require("./Letter");

var Word = function (myWord) {
    //Take chosen word from word list.
    this.myWord = myWord;
    //This is an array of letters representing the letters of the random chosen word.
    this.letters = [];
    //This is an array of spaces representing the number of spaces needed for the random chosen word 
    //This is based on the number of letters in the word.
    this.spaces = [];
    //After we get a random word from the word list, I think I need to use the split method to add the letters to the this.letters array.
    this.splitWord = function () {
        this.letters = this.myWord.split("");

        //Determine number of spaces needed based on length of this.letters array in the Word constructor.
        numberSpacesNeeded = this.letters.length;

        //Use the .join method to join each space that we pushed to the this.spaces array by a space.
        console.log(this.spaces.join(" "));
    }
    this.generateLetters = function () {
        for (i = 0; i < this.letters.length; i++) {
            this.letters[i] = new Letter(this.letters[i]);
            //this.letters[i].letterGuessedCorrectly = true;
            //This line of code shows the super array of letter objects for debugging purposes.
            //console.log(this.letters[i]);
            this.letters[i].showCharacter();
        }
    }
}

//Export the Word constructor so that we can use/reference it in index.js.
module.exports = Word;