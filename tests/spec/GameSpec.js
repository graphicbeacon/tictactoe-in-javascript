
describe("Game", function() {

	var game;

	beforeEach(function() {
		
		game = new Game();

	});

    afterEach(function() {
        game = null;
    });
	
	it("Initialises two players", function() {

		expect(game.players.length).toEqual(2);

	});

	
	it("Sets 'X' token", function() {

		var cell1 = game.board.cells[0];
			cell1.paint('X');

		expect(cell1.token).toBe('X');
	});


	it("Confirms win and updates player win!", function() {
		var player1 = game.players[0];
		var player2 = game.players[1];

		game.updateGameState(0, player1.token);
		game.updateGameState(4, player1.token);
		game.updateGameState(8, player1.token);

		expect(game.winner).toBe(true);
		expect(player1.numberOfWins).toBe(1);
	});
});