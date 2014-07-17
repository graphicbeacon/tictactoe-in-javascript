
function Board() {

	this._ROWS = 3;
	this._COLUMNS = 3;
	this._BOARD_CLASS = 'board';

	this.cells = [];
	this.currentHighlightedCellIndex = 0;

	this.initCells();
}


Board.prototype.initCells = function() {

	for(row = 0; row < this._ROWS; row++) {
      for(column = 0; column < this._COLUMNS; column++) {
        this.cells.push(new Cell(row, column));
      }
    }

	//this.initKeyboardEvents();

};


Board.prototype.initKeyboardEvents = function(first_argument) {
	
	var self = this;

	window.addEventListener('keydown', function(keydownEvent) {

		var characterCode = (typeof keydownEvent.which == 'undefined') ? keydownEvent.keyCode : keydownEvent.which;

		switch(characterCode) {

			case 37: // Left arrow key
				
				if (self.currentHighlightedCellIndex === 0) return; // if first element is highlighted dont do anything

				self.highlightSelectedCell(self.currentHighlightedCellIndex - 1);

				break;

			case 39: // right arrow key

				if (self.currentHighlightedCellIndex === self.cells.length - 1) return; // If last element is highlighted don't do anything

				self.highlightSelectedCell(self.currentHighlightedCellIndex + 1);

				break;

			case 38: // up arrow key

				if (self.currentHighlightedCellIndex < 3) return; // if on first row then don't do anything

				self.highlightSelectedCell(self.currentHighlightedCellIndex - 3); // jump backward 3 times

				break;

			case 40: // down arrow key

				if (self.currentHighlightedCellIndex > 5) return; // if on third row then fon't do anything

				self.highlightSelectedCell(self.currentHighlightedCellIndex + 3); // jump forward 3 times

				break;

			case 9: // tab key

				keydownEvent.preventDefault();

				break;

		}

	});
};


Board.prototype.generate = function() {
	
	var self = this,
		board = document.createElement('div');
		board.className = this._BOARD_CLASS;

		// Highlight First cell
		this.cells[0].setHighlight();

		for (var i = 0; i < this.cells.length; i++) {

			var Cell = this.cells[i];

			Cell.cell.setAttribute('data-cell-index', i);

			Cell.cell.addEventListener('mouseover', function(mouseoverEvent) {

				// Highlight element sending its ID
				self.highlightSelectedCell(this.dataset.cellIndex);

			});

			board.appendChild(Cell.cell);
		};

		return board;
};


Board.prototype.disable = function() {

	this.cells.forEach(function(Cell) {
		Cell.disable();
	});
};


Board.prototype.reset = function() {

	this.cells.forEach(function(Cell) {
		Cell.reset();
	});

	this.highlightSelectedCell(0);
};


Board.prototype.highlightSelectedCell = function(cellIndex) {
	
	var cellIndex = typeof cellIndex === 'number' ? cellIndex : parseInt(cellIndex, 10);
	
	this.cells.forEach(function(Cell) {
		Cell.removeHighlight();
	});

	this.cells[cellIndex].setHighlight();

	this.currentHighlightedCellIndex = cellIndex;
};


Board.prototype.paintSelectedCell = function(cellIndex, playerToken) {

	var cellIndex = typeof cellIndex === 'number' ? cellIndex : parseInt(cellIndex, 10);

	this.cells[cellIndex].paint(playerToken);

};