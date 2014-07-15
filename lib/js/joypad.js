
function Joypad() {
	this.joypads = navigator.getGamepads;
	this.gamepadsConnected = false;	
};

Joypad.prototype.init = function() {

	var self = this;

	// Listen for connected gamepad
	window.addEventListener('gamepadconnected', function(gamepadEvent) {

		self.gamepadsConnected = true;

		var gamepads = self.joypads();

		for (var i = 0; i < gamepads.length; i++) {

			if(typeof gamepads[i] !== 'object') return;

			self.poll(parseInt(i,10));

		}


	})

	window.addEventListener('gamepaddisconnected', function(gamepadEvent) {

		var gamepads = self.joypads();

		for (var i = 0; i < gamepads.length; i++) {

			if(gamepads[i].connected === false)

		}

	});


	// Polyfill for chrome
	var checkForConnectedGamepads = window.setInterval(function() {

		if(!self.joypads()[0]) {

			var gamepadConnectedEvent = new Event('gamepadconnected');

            if(!self.gamepadsConnected) document.dispatchEvent('gamepadconnected');

            window.clearInterval(checkForConnectedGamepads);

            console.log('found');
        }

	}, 100);

};


Joypad.prototype.poll = function() {

	var self = this;

		var requestAnimationFrame = window.mozRequestAnimationFrame ||
								window.webkitRequestAnimationFrame ||
								window.requestAnimationFrame;


		function checkGamepadEvents (timestamp) {

			var gpad = navigator.getGamepads()[gamepadIndex];
			var gpadButtons = gpad.buttons;
			var gpadAxes = gpad.axes;

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