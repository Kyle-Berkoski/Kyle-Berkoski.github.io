///<reference path="../globals.ts" />
///<reference path="deviceDriver.ts" />

/* ----------------------------------
   DeviceDriverKeyboard.ts

   Requires deviceDriver.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */

module SDOS {

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
				chr = String.fromCharCode(keyCode);
				// Only store the value if it's a digit
				if ((keyCode >= 48) && (keyCode <= 57)){
					_TextHistory.push(chr);
				}
                _KernelInputQueue.enqueue(chr);
            } else if (keyCode == 8) { // Backspace
				chr = String.fromCharCode(8);
				_KernelInputQueue.enqueue(chr);
			} else if (keyCode == 9) { //Tab
				chr = String.fromCharCode(9);
				_KernelInputQueue.enqueue(chr);
				
			} else if (keyCode == 38) { // Up arrow
				// Only go up if we can
				if (_CurrentLocation > 0){
					_CurrentLocation = _CurrentLocation - 1;
					chr = String.fromCharCode(38);
					_KernelInputQueue.enqueue(chr);
				}
				
			} else if (keyCode == 40) { // Down Arrow
				// Only go down if we can
				if (_CurrentLocation <= _CommandHistory.length) {
					_CurrentLocation = _CurrentLocation + 1;
					chr = String.fromCharCode(38);
					_KernelInputQueue.enqueue(chr);
				}
				
				
			}
        }
    }
}
