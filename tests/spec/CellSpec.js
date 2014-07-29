
describe("Cell", function() {

	var cell;

	beforeEach(function(){
		cell = new Cell(0,0);
	});


	it("Returns the correct row and column", function(){
		expect(cell._ROW).toEqual(0);
		expect(cell._COLUMN).toEqual(0);
	});


	it("Sets the appropriate id", function(){
		cell.init();

		expect(cell.cell.id).toEqual("0_0");
	});


	it("Paints the cell and keeps it final", function(){
		cell.paint('X');
		cell.paint('O');
		expect(cell.token).toEqual('X');
	});


});