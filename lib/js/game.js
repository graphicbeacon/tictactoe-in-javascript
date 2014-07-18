
function Game() {
	this.board = new Board();
	this.players = [];
	this.currentPlayer = 0;

	this.winner = false;
	this.draw = false;

	this.init();
}


Game.prototype.init = function() {

	var self = this;

	// Set players
	this.players[0] = new Player('X');
	this.players[1] = new Player('O');

	//
	this.board.cells.forEach(function(Cell) {

		Cell.cell.addEventListener('click', function(clickEvent) {

			var cellIndex = clickEvent.target.dataset.cellIndex;
			var playerToken = self.players[self.currentPlayer].token;

			self.updateGameState(cellIndex, playerToken);
		});

	});

	//
	this.setKeydownListeners();

};


Game.prototype.setKeydownListeners = function() {
	
	var self = this;
	// 
	document.addEventListener('keydown', function(keydownEvent) {

		var characterCode = (typeof keydownEvent.which == 'undefined') ? keydownEvent.keyCode : keydownEvent.which;

		var cellIndex = self.board.currentHighlightedCellIndex;
		var playerToken = self.players[self.currentPlayer].token;

		switch (characterCode) {

			case 32: // Space bar

				self.updateGameState(cellIndex, playerToken);

				break;

			case 82: // 'R' key

				self.reset(); // Reset game

				break;
		}
	});
};


Game.prototype.updateGameState = function(cellIndex, playerToken) {

	if(this.winner || this.draw) return;

	this.board.paintSelectedCell(cellIndex, playerToken);

	// Check if anyone won
	this.checkWinner();

	// Set turns for each player
	(this.currentPlayer === 0) ? ++this.currentPlayer : --this.currentPlayer;

	// Check if anyone drew
	this.checkDraw();
};


Game.prototype.start = function() {

	var stage = document.body;
	stage.insertBefore(this.board.generate(), stage.childNodes[0]);

	/////// MUST REWRITE
	this.initGamepadEvents();
};


Game.prototype.checkWinner = function(first_argument) {
	
	var self = this;

	// Store winning combinations...
	var winningCombinations = [[1,2,3], [4,5,6], [7,8,9], [1,4,7], [2,5,8], [3,6,9], [1,5,9], [3,5,7]];
	var playerToken = self.players[self.currentPlayer].token;

	winningCombinations.forEach(function (winningCombination) {

		if( self.board.cells[winningCombination[0] - 1].cell.value == playerToken && 
			self.board.cells[winningCombination[1] - 1].cell.value == playerToken &&
			self.board.cells[winningCombination[2] - 1].cell.value == playerToken ) {

			var playerNumber = self.currentPlayer + 1;

			//alert('the winner is player ' + playerNumber);

			console.log('the winner is player ' + playerNumber);

			// Set winner to true
			self.winner = true;

			// Increment player's number of wins
			++self.players[self.currentPlayer].numberOfWins; 
			
			self.board.disable();

			console.log('Winning combination', winningCombination[0], winningCombination[1], winningCombination[2]);
			console.log('Player ' + playerNumber + ' has won ' + self.players[self.currentPlayer].numberOfWins + ' times');

		}

	});
};


Game.prototype.checkDraw = function() {

	var filledCells = 0;

	this.board.cells.forEach(function(Cell) {

		if(Cell.cell.value) filledCells++;
	});

	if(filledCells === this.board.cells.length) {

		alert('Its a draw!');

		this.draw = true;

		console.log('draw');
	};
};


Game.prototype.reset = function() {

	this.board.reset();
	
	this.winner = false;

	this.draw = false;

	// Reset this.currentPlayer to be always player 1
	// this.currentPlayer = 0;
};




//////////////////////////////////////////////////
// Temporary Fix - MUST REFACTOR!!!
//////////////////////////////////////////////////
Game.prototype.initGamepadEvents = function() {
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
	
	// 
	    var self = this;

		var requestAnimationFrame = window.mozRequestAnimationFrame ||
								window.webkitRequestAnimationFrame ||
								window.requestAnimationFrame;


		function checkGamepadEvents (timestamp) {

			var gpad = navigator.getGamepads()[gamepadIndex];
			var gpadButtons = gpad.buttons;
			var gpadAxes = gpad.axes;
			var cellIndex = self.board.currentHighlightedCellIndex;
			
			//console.log(navigator.getGamepads()[0].axes[1]);

		    // for(var i=0;i<gpadButtons.length;i++) {
	     // 	    var html = "Button "+(i+1)+": ";
	     // 	    if(gpadButtons[i].pressed) console.log(html, ' pressed');
      // 		}
    		
		    // for(var i=0;i<gpadAxes.length;i++) {
	     // 	    if(gpadAxes[i] === 1 || gpadAxes[i] === -1) 
	     // 	    	console.log(gpadAxes[i]);
      // 		}

	   		var playerToken = self.players[self.currentPlayer].token;

      		if (self.currentPlayer === gamepadIndex) {

	    		// Listening for directional pad presses
	   			if ((gpadAxes[1] === -1 && gpadAxes[0] < 1) && cellIndex >= 3) { // up button

					self.board.highlightSelectedCell(self.board.currentHighlightedCellIndex-=3); // jump backward 3 times

	   			} else if ((gpadAxes[1] === 1) && cellIndex <= 5) {// down button and if not on third row

					self.board.highlightSelectedCell(self.board.currentHighlightedCellIndex+=3); // jump forward 3 times

	   			} else if ((gpadAxes[0] === -1 ) && cellIndex !== 0) { // left button

	   				self.board.highlightSelectedCell(self.board.currentHighlightedCellIndex-=1);

	   			} else if ((gpadAxes[0] === 1) && cellIndex !== self.board.cells.length - 1) { // right button

					self.board.highlightSelectedCell(self.board.currentHighlightedCellIndex+=1);

	   			}

	   			// Listening for X , O, [], /\ button presses
	   			if (gpadButtons[0].pressed || gpadButtons[1].pressed || 
	   				gpadButtons[2].pressed || gpadButtons[3].pressed || gpadButtons[7].pressed) { 


	   				self.updateGameState(self.board.currentHighlightedCellIndex, playerToken);

	   			}
   			}

            setTimeout(function() {
	            requestAnimationFrame(checkGamepadEvents);
			}, 100);
		};


		requestAnimationFrame(checkGamepadEvents);

};