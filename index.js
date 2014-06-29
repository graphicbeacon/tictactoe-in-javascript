// Global Variables used throughout code
var player = 1; // will be either 1 or 2
var tiles = document.querySelectorAll('input[type="button"]');
var winner = false;

// Loops over all clickable tiles
for (var i = 0; i < tiles.length; i++ ) {

	tiles[i].addEventListener('click', function(clickEvent) { 
		
		var clickedTile = clickEvent.target;

		// Sets clicked state...
		// ...passes turn to next player 
		// ...and checks for winning combination
		activateTile(clickedTile); 
	});
}


// Runs functionality when tile is clicked
function activateTile(tile) {

	if( player == 1) {
		// player is 1, set player1 token
		tile.value = 'X';

		// change to next player
		player += 1;

		// disable tile to prevent changing state
		tile.disabled = 'disabled';
		
		// check for winning combinations
		checkWinner('X');	
	} else {
		// player is 2, set player2 token
		tile.value = 'O';

		// change to previous player
		player -= 1;

		// disable tile to prevent overwriting state
		tile.disabled = 'disabled';

		// check for winning combinations
		checkWinner('O');
	}

	// Check for a draw! In other words no winners.
	checkForDraw();
}


// Check if there are any winning combinations then end game
function checkWinner(playerToken) {

	// Store winning combinations...
	var winningCombinations = [[1,2,3], [4,5,6], [7,8,9], [1,4,7], [2,5,8], [3,6,9], [1,5,9], [3,5,7]];

	// ...and loop over the combination for matches
	for (var i = 0; i < winningCombinations.length; i++) {

		if( tiles[winningCombinations[i][0] - 1].value == playerToken && 
			tiles[winningCombinations[i][1] - 1].value == playerToken &&
			tiles[winningCombinations[i][2] - 1].value == playerToken ) {

			alert('the winner is player --' + playerToken + '--');

			disableAllTiles();

			// Set winner to true
			winner = true;

			console.log('Winning combination', winningCombinations[i][0], winningCombinations[i][1], winningCombinations[i][2]);

		}

	}
}


function checkForDraw() {
	var filledTiles = 0;

	// Loops over tiles and checked if they are all filled
	for (var i = 0; i < tiles.length; i++) {
		// If so and there is no win then it may be a draw
		if(tiles[i].value) filledTiles++;
	}

	if(filledTiles == tiles.length && !winner) {

		alert('Its a draw!');

		console.log('draw');
	};
}

// Disable all tiles after a player wins
// to prevent further interaction with tiles
// until game is reset of course :)
function disableAllTiles() {

	for (var i = 0; i < tiles.length; i++ ) {
		if(tiles[i].value) continue; // Ignore tiles already clicked

		// Disable unclicked tiles
		tiles[i].disabled = 'disabled';
	}

}

// Reset Button Functionality
document.querySelector('.ttt-stage-reset-button').addEventListener('click',reset);

// Reset All tiles
function reset() {

	// Reset state of all tiles
	// // Start a new game
	for (var i = 0; i < tiles.length; i++ ) {
		tiles[i].value = '';
		tiles[i].disabled = '';
	}

	// Reset winner to false
	winner = false;

	// Re-enable to ensure that player 1(X) always goes first
	//player = 1;
}