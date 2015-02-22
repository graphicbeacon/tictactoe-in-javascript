
function Game(gameContainer) {

	this.board = new Board();
    this.gameContainer = gameContainer;
	this.players = [];
	this.currentPlayer = 0;

	this.winner = false;
	this.draw = false;

	//TODO: Implement Joypad functionality

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

	// Don't update if cell is already set with a token, game ended due to win or draw
	if(this.board.cells[cellIndex].cell.disabled || this.winner || this.draw) return;

	// else paint cell with player token
	this.board.paintSelectedCell(cellIndex, playerToken);

	// Check if anyone won
	this.checkWinner();

	// Set turns for each player
	(this.currentPlayer === 0) ? ++this.currentPlayer : --this.currentPlayer;

	// Check if anyone drew
	this.checkDraw();
};


Game.prototype.start = function() {

	var stage = document.querySelector(this.gameContainer);
	stage.appendChild(this.board.generate());

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

			alert('the winner is player ' + playerNumber);

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