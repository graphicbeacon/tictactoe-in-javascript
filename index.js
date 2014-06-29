window.tictactoe = {

	player: 1,

	tiles: $('.ttt-tiles'),

	currentActiveTileIndex: 0,

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

		// Create game reset event
		this.initResetEvent();

		// Cancel tab key events
		this.cancelTabKeyEvents();

		// Initialise arrow keys for highlighting tiles
		this.initArrowKeyEvents();

		// Initialize mouse events
		this.initMouseEvents();
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

	initResetEvent: function() {

		var self = this;

		// Reset Button Functionality
		self.resetButton.on('click', function() {

			// Reset state of all tiles
			// // Start a new game
			self.tiles.each(function(index, tile) {

				tile.value = '';
				tile.disabled = '';

			});
				
			self.highlightSelectedTile(0);

			// Reset winner to false
			self.isWinner = false;

			// Re-enable to ensure that player 1(X) always goes first
			//self.player = 1;

		});

	},

	cancelTabKeyEvents: function () {

		$(document).on('keydown', function(keydownEvent){

			var characterCode = (typeof keydownEvent.which == 'undefined') ? keydownEvent.keyCode : keydownEvent.which;

			if(characterCode === 9) { // If its tabbing key

				keydownEvent.preventDefault();

			}

		});
	},

	initArrowKeyEvents: function() {

		var self = this;

		// Highlight first tile by default
		this.highlightSelectedTile(this.currentActiveTileIndex);;


		$(document).on('keydown', function(keydownEvent) {

			var characterCode = (typeof keydownEvent.which == 'undefined') ? keydownEvent.keyCode : keydownEvent.which;

			switch(characterCode) {

				case 32:

					self.activateClickedTile(self.tiles.get(self.currentActiveTileIndex));

					break;

				case 37: // Left arrow key
					
					if (self.currentActiveTileIndex === 0) return; // if first element is highlighted dont do anything

					self.highlightSelectedTile(self.currentActiveTileIndex-=1);

					break;

				case 39: // right arrow key

					if (self.currentActiveTileIndex === self.tiles.length - 1) return; // If last element is highlighted don't do anything

					self.highlightSelectedTile(self.currentActiveTileIndex+=1);

					break;

				case 38: // up arrow key

					if (self.currentActiveTileIndex < 3) return; // if on first row then don't do anything

					self.highlightSelectedTile(self.currentActiveTileIndex-=3); // jump backward 3 times

					break;

				case 40: // down arrow key

					if (self.currentActiveTileIndex > 5) return; // if on third row then fon't do anything

					self.highlightSelectedTile(self.currentActiveTileIndex+=3); // jump forward 3 times

			}

		});

	},

	initMouseEvents: function () {

		var self = this;
		var currentActiveTileIndex = this.currentActiveTileIndex;

		this.tiles.each(function(index, tile) {

			var $tile = $(tile);

			$tile.on('mouseover mouseenter', function(hoverEventObject) {

				self.highlightSelectedTile(index);
				
			});

		});
	},


	highlightSelectedTile: function(currentActiveTileIndex) {

		// Set active tile state
		this.currentActiveTileIndex = currentActiveTileIndex;

		// highlights the selected tile
		this.tiles.removeClass('active').eq(currentActiveTileIndex).addClass('active');

	}

};

// Initialize game
tictactoe.init();