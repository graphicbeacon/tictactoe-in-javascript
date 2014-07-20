
function Player(playerToken) {
	this.token = playerToken;
	this.numberOfWins = 0;
	this.joypad = null;
};

Player.prototype.assignJoypad = function(joypad) {
	
	if(typeof joypad === "object") {
		this.joypad = joypad;
	}

};

Player.prototype.removeJoypad = function() {
	delete this.joypad;
};