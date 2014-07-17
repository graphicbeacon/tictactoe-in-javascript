
describe("Board", function() {

	var board;

	beforeEach(function() {

		board = new Board();
		generatedBoard = board.generate();

	});

	afterEach(function(){

		board = null;
		generatedBoard = null;

	});

	
	it("Confirms the board class to be an object", function() {

		expect(typeof board).toBe("object");

	});


	it("Generates 9 cells", function() {

		expect(generatedBoard.childNodes.length).toEqual(9);

	});

	
	it("Has already highlighted first cell", function() {

		expect(generatedBoard.childNodes[0].className).toContain('board__cell--highlighted');

	});
	

	it("Highlights second cell when mouseovered and ensures first one is not", function() {

		var secondCell = generatedBoard.childNodes[1];
		var mouseoverEvent = new Event("mouseover");

		secondCell.dispatchEvent(mouseoverEvent);

		expect(secondCell.className).toContain('board__cell--highlighted');
		expect(generatedBoard.childNodes[0].className).not.toContain('board__cell--highlighted');
	});

});