
function Cell (row, column) {

	this._ROW = row;
	this._COLUMN = column;
	this._CELL_CLASS = 'board__cell';
	this._CELL_HIGHLIGHTED_CLASS = 'board__cell--highlighted';

	this.cell = null;

	this.create();
};


Cell.prototype.create = function() {

	var cell = document.createElement('input');
		cell.type = 'button';
		cell.id = this._ROW + '_' + this._COLUMN;
		cell.className = this._CELL_CLASS;

	this.cell = cell;
}


Cell.prototype.reset = function() {
	
	this.cell.disabled = '';
	this.cell.value = '';
};


Cell.prototype.disable = function() {
	
	this.cell.disabled = 'disabled';
};


Cell.prototype.removeHighlight = function() {
	
	this.cell.classList.remove(this._CELL_HIGHLIGHTED_CLASS);
};


Cell.prototype.setHighlight = function() {
	
	this.cell.classList.add(this._CELL_HIGHLIGHTED_CLASS);
};


Cell.prototype.paint = function(token) {

	this.cell.value = token;
	this.cell.disabled = 'disabled';
};