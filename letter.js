var Letter = function(character) {
	// A string value to store the underlying character for the letter
	this.character = character.toUpperCase();
	// A boolean value that stores whether that letter has been guessed yet
	this.letterGuessedCorrectly = false;
	// A function that returns the underlying character if the letter has been guessed, 
	//or a placeholder (like an underscore) if the letter has not been guessed
	this.showCharacter = function() {
		if (this.letterGuessedCorrectly) {
			console.log(this.character);
		}
		else {
			//console.log ("-");
		}

	}
}

//export Letter constructor so that Word.js can use it.
module.exports = Letter