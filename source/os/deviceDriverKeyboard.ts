///<reference path="../globals.ts" />
///<reference path="deviceDriver.ts" />

/* ----------------------------------
   DeviceDriverKeyboard.ts

   Requires deviceDriver.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */

module TSOS {

    // Extends DeviceDriver
    export class DeviceDriverKeyboard extends DeviceDriver {

        constructor() {
            // Override the base method pointers.

            // The code below cannot run because "this" can only be
            // accessed after calling super.
            //super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            super();
            this.driverEntry = this.krnKbdDriverEntry;
            this.isr = this.krnKbdDispatchKeyPress;
        }

        public krnKbdDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }

        public krnKbdDispatchKeyPress(params) {
            // Parse the params.    TODO: Check that the params are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";
            // Check to see if we even want to deal with the key that was pressed.
            if (((keyCode >= 65) && (keyCode <= 90)) ||   // A..Z
                ((keyCode >= 97) && (keyCode <= 123))) {  // a..z {
                // Determine the character we want to display.
                // Assume it's lowercase...
                chr = String.fromCharCode(keyCode + 32);
                // ... then check the shift key and re-adjust if necessary.
                if (isShifted) {
                    chr = String.fromCharCode(keyCode);
                }
				_TextHistory.push(chr);
                // TODO: Check for caps-lock and handle as shifted if so.
                _KernelInputQueue.enqueue(chr);
            } else if (((keyCode >= 48) && (keyCode <= 57)) ||   // digits
                        (keyCode == 32)                     ||   // space
                        (keyCode == 13)) {                       // enter
				// Shift doesn't give new keyCodes so we need to check for shifts
				switch(keyCode){
					case(48):
					// 0 or )
						if(isShifted){
							chr = ")";
							_TextHistory.push(chr)
						} else {
							chr = String.fromCharCode(48);
							_TextHistory.push(chr)
						}
						break;
					case(49):
					// 1 or !
						if(isShifted){
							chr = "!";
							_TextHistory.push(chr)
						} else {
							chr = String.fromCharCode(49);
							_TextHistory.push(chr)
						}
						break;
					case(50):
					// 2 or @
						if(isShifted){
							chr = "@";
							_TextHistory.push(chr)
						} else {
							chr = String.fromCharCode(50);
							_TextHistory.push(chr)
						}
						break;
					case(51):
					// 3 or #
						if(isShifted){
							chr = "#";
							_TextHistory.push(chr)
						} else {
							chr = String.fromCharCode(51);
							_TextHistory.push(chr)
						}
						break;
					case(52):
					// 4 or $
						if(isShifted){
							chr = "$";
							_TextHistory.push(chr)
						} else {
							chr = String.fromCharCode(52);
							_TextHistory.push(chr)
						}
						break;
					case(53):
					// 5 or %
						if(isShifted){
							chr = "%";
							_TextHistory.push(chr)
						} else {
							chr = String.fromCharCode(53);
							_TextHistory.push(chr)
						}
						break;
					case(54):
					// 6 or ^
						if(isShifted){
							chr = "^";
							_TextHistory.push(chr)
						} else {
							chr = String.fromCharCode(54);
							_TextHistory.push(chr)
						}
						break;
					case(55):
					// 7 or &
						if(isShifted){
							chr = "&";
							_TextHistory.push(chr)
						} else {
							chr = String.fromCharCode(55);
							_TextHistory.push(chr)
						}
						break;
					case(56):
					// 8 or *
						if(isShifted){
							chr = "*";
							_TextHistory.push(chr)
						} else {
							chr = String.fromCharCode(56);
							_TextHistory.push(chr)
						}
						break;
					case(57):
					// 9 or (
						if(isShifted){
							chr = "(";
							_TextHistory.push(chr)
						} else {
							chr = String.fromCharCode(57);
							_TextHistory.push(chr)
						}
						break;
					case(32):
					// Space
						chr = String.fromCharCode(32);
						break;
					case(13):
					// Enter
						chr = String.fromCharCode(13);
						break;
					default:
						console.log("Fuck you shouldn't be here");
				}
				
                _KernelInputQueue.enqueue(chr);			
            } else if (keyCode == 8) { // Backspace
				chr = String.fromCharCode(8);
				_KernelInputQueue.enqueue(chr);
				
			} else if (keyCode == 9) { //Tab
				chr = String.fromCharCode(9);
				_KernelInputQueue.enqueue(chr);
				
			} else if (keyCode == 38) { // Up arrow
				// Only go back if we can
				if (_CurrentLocation > 0 && _CommandHistory.length != 0){
					chr = "upArrow";
					_KernelInputQueue.enqueue(chr);
				}
				
			} else if (keyCode == 40) { // Down Arrow
				// Only go forward if we can
				if (_CurrentLocation <= _CommandHistory.length && _CommandHistory.length != 0) {					
					chr = "downArrow";
					_KernelInputQueue.enqueue(chr);
				}
				
			// These unshifted key codes are giving weird results. 
			// TODO: Go back and decipher what to do with these weird character returns
			} else if (keyCode == 192) {
				debugger;
				if(isShifted){
					chr = "~";
					_TextHistory.push(chr)
				} /*else {
					chr = String.fromCharCode(192);
					_TextHistory.push(chr)
				}*/
				_KernelInputQueue.enqueue(chr);
				
			} else if (keyCode == 189) {
				debugger;
				if(isShifted){
					chr = "_";
					_TextHistory.push(chr)
				} /*else {
					chr = String.fromCharCode(189);
					_TextHistory.push(chr)
				}*/
				_KernelInputQueue.enqueue(chr);
				
			} else if (keyCode == 187) {
				debugger;
				if(isShifted){
					chr = "+";
					_TextHistory.push(chr)
				} /*else {
					chr = String.fromCharCode(187);
					_TextHistory.push(chr)
				}*/
				_KernelInputQueue.enqueue(chr);
			}
        }
    }
}
