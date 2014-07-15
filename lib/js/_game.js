(function() {

	function Game (config) {
		this.player = 1,
		this.tiles = config.tiles,
		this.currentActiveTileIndex = 0,
		this.isWinner = false;

		this.gamepadsConnected = false;

		this.init();
	};

	
	Game.prototype.init = function() {

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

		// Initialise arrow keys for highlighting tiles
		this.initKeyboardInputEvents();

		// Initialize mouse events
		this.initMouseEvents();

		// Listen for connected gamepads and set controller support
		this.initGamepadEvents();
	};


	Game.prototype.activateClickedTile = function (clickedTile) {

		if ($(clickedTile).is(':disabled')) return;

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

	};


	Game.prototype.checkWinner = function (playerToken) {

		var self = this;

		// Store winning combinations...
		var winningCombinations = [[1,2,3], [4,5,6], [7,8,9], [1,4,7], [2,5,8], [3,6,9], [1,5,9], [3,5,7]];

		$.each(winningCombinations, function (index, winningCombination) {

			if( self.tiles.get(winningCombination[0] - 1).value == playerToken && 
				self.tiles.get(winningCombination[1] - 1).value == playerToken &&
				self.tiles.get(winningCombination[2] - 1).value == playerToken ) {

				alert('the winner is player ' + self.player);

				console.log('the winner is player ' + self.player);

				// Set winner to true
				self.isWinner = true;

				self.disableAllTiles();


				//console.log('Winning combination', winningCombination[0], winningCombination[1], winningCombination[2]);

			}


		});

	};


	Game.prototype.checkForDraw = function (first_argument) {
		
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

	};


	Game.prototype.disableAllTiles = function () {

		// Disable all tiles after a player wins
		// to prevent further interaction with tiles
		// until game is reset of course :)
		this.tiles.each(function (index, tile) {

			if(tile.value) return; // Ignore tiles already clicked
			
			// Disable unclicked tiles
			tile.disabled = 'disabled';

		});

	};


	Game.prototype.resetGame = function () {

		// Reset state of all tiles
		// Start a new game
		this.tiles.each(function(index, tile) {

			tile.value = '';
			tile.disabled = '';

		});
			
		this.highlightSelectedTile(0);

		// Reset winner to false
		this.isWinner = false;

		// Re-enable to ensure that player 1(X) always goes first
		// this.player = 1;
		// 
	};


	Game.prototype.initKeyboardInputEvents = function () {

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

					break;

				case 82: // R key

					self.resetGame();

					break;

				case 9: // tab key

					keydownEvent.preventDefault();

					break;

			}

		});

	};


	Game.prototype.initMouseEvents = function () {

		var self = this;
		var currentActiveTileIndex = this.currentActiveTileIndex;

		this.tiles.each(function(index, tile) {

			var $tile = $(tile);

			$tile.on('mouseover mouseenter', function(hoverEventObject) {

				self.highlightSelectedTile(index);
				
			});

		});
	};


	Game.prototype.highlightSelectedTile = function (currentActiveTileIndex) {

		// Set active tile state
		this.currentActiveTileIndex = currentActiveTileIndex;

		// highlights the selected tile
		this.tiles.removeClass('active').eq(currentActiveTileIndex).addClass('active');

	};


	Game.prototype.initGamepadEvents = function () {

		var self = this;

		// Listen for connected gamepad
		$(window).on('gamepadconnected', function(gamepadEvent) {

			self.gamepadsConnected = true;

			$.each(navigator.getGamepads(), function(index, gamepad) {
				
				if(typeof gamepad !== 'object') return;

				self.mapGamepadControls(parseInt(index,10));

			});


		}).on('gamepaddisconnected', function() {


			if (!navigator.getGamepads()[0]) {

				self.gamepadsConnected = false;

			}

		});


		// Polyfill for chrome
		var checkForConnectedGamepads = window.setInterval(function() {

			if(navigator.getGamepads()[0]) {

                if(!self.gamepadsConnected) $(window).trigger("gamepadconnected");

                window.clearInterval(checkForConnectedGamepads);
            }

		}, 500);
	};


	Game.prototype.mapGamepadControls = function(gamepadIndex) {
		
		var self = this;

		var requestAnimationFrame = window.mozRequestAnimationFrame ||
								window.webkitRequestAnimationFrame ||
								window.requestAnimationFrame;


		function checkGamepadEvents (timestamp) {

			var gpad = navigator.getGamepads()[gamepadIndex];
			var gpadButtons = gpad.buttons;
			var gpadAxes = gpad.axes;
			
			//console.log(navigator.getGamepads()[0].axes[1]);

		    // for(var i=0;i<gpadButtons.length;i++) {
	     // 	    var html = "Button "+(i+1)+": ";
	     // 	    if(gpadButtons[i].pressed) console.log(html, ' pressed');
      // 		}
    		
		    // for(var i=0;i<gpadAxes.length;i++) {
	     // 	    if(gpadAxes[i] === 1 || gpadAxes[i] === -1) 
	     // 	    	console.log(gpadAxes[i]);
      // 		}

      		if (self.player === gamepadIndex+1) {

	    		// Listening for directional pad presses
	   			if ((gpadAxes[1] === -1 && gpadAxes[0] < 1) && self.currentActiveTileIndex >= 3) { // up button

					self.highlightSelectedTile(self.currentActiveTileIndex-=3); // jump backward 3 times

	   			} else if ((gpadAxes[1] === 1 && gpadAxes[0] < 1) && self.currentActiveTileIndex <= 5) {// down button and if not on third row

					self.highlightSelectedTile(self.currentActiveTileIndex+=3); // jump forward 3 times

	   			} else if ((gpadAxes[0] === -1 && gpadAxes[1] < 1) && self.currentActiveTileIndex !== 0) { // left button

	   				self.highlightSelectedTile(self.currentActiveTileIndex-=1);

	   			} else if ((gpadAxes[0] === 1 && gpadAxes[1] < 1) && self.currentActiveTileIndex !== self.tiles.length - 1) { // right button

					self.highlightSelectedTile(self.currentActiveTileIndex+=1);

	   			}

	   			// Listening for X , O, [], /\ button presses
	   			if (gpadButtons[0].pressed || gpadButtons[1].pressed || 
	   				gpadButtons[2].pressed || gpadButtons[3].pressed || gpadButtons[7].pressed) { 

	   				self.activateClickedTile(self.tiles.get(self.currentActiveTileIndex));

	   			}
   			}

            setTimeout(function() {
	            requestAnimationFrame(checkGamepadEvents);
			}, 100);
		};


		requestAnimationFrame(checkGamepadEvents);

	};

	// Initialize app
	new Game({
		tiles: $('.ttt-tiles')
	});
}());