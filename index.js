window.tictactoe = {

	player: 1,

	tiles: $('.ttt-tiles'),

	resetButton: $('.ttt-stage-reset-button'),

	isWinner: false,

	init: function () {
			
		var self = this;

		// Loops over all clickable tiles
		this.tiles.each(function(index, tile) {

			var $tile = $(tile);

			$tile.on('click', function(clickEvent) {
				
				// Sets clicked state...
				// ...passes turn to next player 
				// ...and checks for winning combination
				self.activateClickedTile(clickEvent.target);

			});
		});

		// Set game reset event
		this.createGameResetEvent();

		// Capture tab events
		this.captureTabEvents();
	},

	activateClickedTile: function (clickedTile) {

		if (this.player === 1) {

			// player is 1, set player1 token
			clickedTile.value = 'X';

			// disable clickedTile to prevent changing state
			clickedTile.disabled = 'disabled';
			
			// check for winning combinations
			this.checkWinner('X');	

			// change to next player
			this.player += 1;

		} else if (this.player === 2) {

			// player is 2, set player2 token
			clickedTile.value = 'O';

			// disable clickedTile to prevent overwriting state
			clickedTile.disabled = 'disabled';

			// check for winning combinations
			this.checkWinner('O');

			// change to previous player
			this.player -= 1;
		}


		this.checkForDraw();

	},

	checkWinner: function (playerToken) {

		var self = this;

		// Store winning combinations...
		var winningCombinations = [[1,2,3], [4,5,6], [7,8,9], [1,4,7], [2,5,8], [3,6,9], [1,5,9], [3,5,7]];

		$.each(winningCombinations, function (index, winningCombination) {

			if( self.tiles.get(winningCombination[0] - 1).value == playerToken && 
				self.tiles.get(winningCombination[1] - 1).value == playerToken &&
				self.tiles.get(winningCombination[2] - 1).value == playerToken ) {

				alert('the winner is player ' + self.player);

				self.disableAllTiles();

				// Set winner to true
				self.isWinner = true;

				console.log('Winning combination', winningCombination[0], winningCombination[1], winningCombination[2]);

			}


		});

	},

	checkForDraw: function() {

		var filledTiles = 0;

		// Loops over tiles and checked if they are all filled
		this.tiles.each(function(index, tile) {
			// If so and there is no win then it may be a draw
			if(tile.value) filledTiles++;
		});

		if(filledTiles === this.tiles.length && !this.isWinner) {

			alert('Its a draw!');

			console.log('draw');
		};
	},

	disableAllTiles: function () {

		// Disable all tiles after a player wins
		// to prevent further interaction with tiles
		// until game is reset of course :)
		this.tiles.each(function(index, tile) {

			if(tile.value) return; // Ignore tiles already clicked
			
			// Disable unclicked tiles
			tile.disabled = 'disabled';

		});

	},

	createGameResetEvent: function() {

		var self = this;

		// Reset Button Functionality
		self.resetButton.on('click', function() {

			// Reset state of all tiles
			// // Start a new game
			self.tiles.each(function(index, tile) {

				tile.value = '';
				tile.disabled = '';

			});

			// Reset winner to false
			self.isWinner = false;

			// Re-enable to ensure that player 1(X) always goes first
			//self.player = 1;

		});

	},

	captureTabEvents: function () {

		this.tiles.get(0).focus();

		$(document).on('keydown', function(keydownEvent){

			var characterCode = (typeof keydownEvent.which == 'undefined') ? keydownEvent.keyCode : keydownEvent.which;

			if(characterCode === 9) { // If its tabbing key
				keydownEvent.preventDefault();
			}

		});
	}

};

// Initialize game
tictactoe.init();