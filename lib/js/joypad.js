
function Joypad(game) {
	this.joypads = [];
	this.gamepadsConnected = false;	

	this.game = game;
};

Joypad.prototype.init = function() {  

	var self = this;

	// Listen for connected gamepad
	window.addEventListener('gamepadconnected', function(gamepadEvent) {

		self.gamepadsConnected = true;

		var gamepads = navigator.getGamepads();

		for (var i = 0; i < gamepads.length; i++) {
			
			if (typeof gamepads[i] !== "object") break;

			self.joypads.push(new SingleJoypad(gamepads[i].index, self));
		};

		self.gamepadsConnected = true;

	});

	window.addEventListener('gamepaddisconnected', function(gamepadEvent) {

		var gamepads = navigator.getGamepads();

		if (!gamepads[0] && !gamepads[1] && !gamepads[2] && !gamepads[3]) {

			self.gamepadsConnected = false;

		}

	});


	// Polyfill for chrome
	var checkForConnectedGamepads = window.setInterval(function() {

		if(navigator.getGamepads()[0]) {
			console.log('found');
			var gamepadEvent = new Event('gamepadconnected');
            if(!self.gamepadsConnected) window.dispatchEvent(gamepadEvent);

            window.clearInterval(checkForConnectedGamepads);
        }

	}, 500);

};

Joypad.prototype.controllerButtonMap = function(buttonIndex) {

	var buttons = [];

	buttons[0] = 'BUTTON_0';
	buttons[1] = 'BUTTON_1';
	buttons[2] = 'BUTTON_2';
	buttons[3] = 'BUTTON_3';
	buttons[4] = 'BUTTON_4';
	buttons[5] = 'BUTTON_5';
	buttons[6] = 'BUTTON_6';
	buttons[7] = 'BUTTON_7';
	buttons[8] = 'BUTTON_8';
	buttons[9] = 'BUTTON_9';
	buttons[10] = 'BUTTON_10';
	buttons[11] = 'BUTTON_11';
	buttons[12] = 'BUTTON_12';
	buttons[13] = 'BUTTON_13';
	buttons[14] = 'BUTTON_14';
	buttons[15] = 'BUTTON_15';
	buttons[16] = 'BUTTON_16';

	return buttons[buttonIndex];
};

Joypad.prototype.controllerAxisMap = function(axes) {
	// body...
};

Joypad.prototype.buttonPressed = function(joypadIndex, buttonPressed) {

	console.log(joypadIndex, buttonPressed);
	
};


/////////////////////////
// Class Wrapper around each joypad
/////////////////////////
function SingleJoypad(joypadIndex, JoypadParent) {
	this.joypadIndex = joypadIndex;
	this.JoypadParent = JoypadParent;

	this.poll();
};

SingleJoypad.prototype.poll = function() {
	
	var self = this;
	var requestAnimationFrame = window.requestAnimationFrame ||
						window.webkitRequestAnimationFrame ||
						window.mozRequestAnimationFrame;

	function poll() {
		
		setTimeout(function(){ 

			requestAnimationFrame(poll); 

			var gamepad = navigator.getGamepads()[self.joypadIndex + ''];

			for (var i = 0; i < gamepad.buttons.length; i++) {

				if(gamepad.buttons[i].pressed) self.JoypadParent.buttonPressed(self.joypadIndex, i);

			};

		}, 1000 / 7);
	}

	poll();

};