///<reference path="../globals.ts" />
///<reference path="deviceDriver.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* ----------------------------------
   DeviceDriverKeyboard.ts

   Requires deviceDriver.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    var DeviceDriverKeyboard = (function (_super) {
        __extends(DeviceDriverKeyboard, _super);
        function DeviceDriverKeyboard() {
            // Override the base method pointers.
            // The code below cannot run because "this" can only be
            // accessed after calling super.
            //super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            _super.call(this);
            this.driverEntry = this.krnKbdDriverEntry;
            this.isr = this.krnKbdDispatchKeyPress;
        }
        DeviceDriverKeyboard.prototype.krnKbdDriverEntry = function () {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        };
        DeviceDriverKeyboard.prototype.krnKbdDispatchKeyPress = function (params) {
            // Parse the params.    TODO: Check that the params are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";
            // Check to see if we even want to deal with the key that was pressed.
            if (((keyCode >= 65) && (keyCode <= 90)) ||
                ((keyCode >= 97) && (keyCode <= 123))) {
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
            }
            else if (((keyCode >= 48) && (keyCode <= 57)) ||
                (keyCode == 32) ||
                (keyCode == 13)) {
                // Shift doesn't give new keyCodes so we need to check for shifts
                switch (keyCode) {
                    case (48):
                        // 0 or )
                        if (isShifted) {
                            chr = ")";
                            _TextHistory.push(chr);
                        }
                        else {
                            chr = String.fromCharCode(48);
                            _TextHistory.push(chr);
                        }
                        break;
                    case (49):
                        // 1 or !
                        if (isShifted) {
                            chr = "!";
                            _TextHistory.push(chr);
                        }
                        else {
                            chr = String.fromCharCode(49);
                            _TextHistory.push(chr);
                        }
                        break;
                    case (50):
                        // 2 or @
                        if (isShifted) {
                            chr = "@";
                            _TextHistory.push(chr);
                        }
                        else {
                            chr = String.fromCharCode(50);
                            _TextHistory.push(chr);
                        }
                        break;
                    case (51):
                        // 3 or #
                        if (isShifted) {
                            chr = "#";
                            _TextHistory.push(chr);
                        }
                        else {
                            chr = String.fromCharCode(51);
                            _TextHistory.push(chr);
                        }
                        break;
                    case (52):
                        // 4 or $
                        if (isShifted) {
                            chr = "$";
                            _TextHistory.push(chr);
                        }
                        else {
                            chr = String.fromCharCode(52);
                            _TextHistory.push(chr);
                        }
                        break;
                    case (53):
                        // 5 or %
                        if (isShifted) {
                            chr = "%";
                            _TextHistory.push(chr);
                        }
                        else {
                            chr = String.fromCharCode(53);
                            _TextHistory.push(chr);
                        }
                        break;
                    case (54):
                        // 6 or ^
                        if (isShifted) {
                            chr = "^";
                            _TextHistory.push(chr);
                        }
                        else {
                            chr = String.fromCharCode(54);
                            _TextHistory.push(chr);
                        }
                        break;
                    case (55):
                        // 7 or &
                        if (isShifted) {
                            chr = "&";
                            _TextHistory.push(chr);
                        }
                        else {
                            chr = String.fromCharCode(55);
                            _TextHistory.push(chr);
                        }
                        break;
                    case (56):
                        // 8 or *
                        if (isShifted) {
                            chr = "*";
                            _TextHistory.push(chr);
                        }
                        else {
                            chr = String.fromCharCode(56);
                            _TextHistory.push(chr);
                        }
                        break;
                    case (57):
                        // 9 or (
                        if (isShifted) {
                            chr = "(";
                            _TextHistory.push(chr);
                        }
                        else {
                            chr = String.fromCharCode(57);
                            _TextHistory.push(chr);
                        }
                        break;
                    case (32):
                        // Space
                        chr = String.fromCharCode(32);
                        break;
                    case (13):
                        // Enter
                        chr = String.fromCharCode(13);
                        break;
                    default:
                        console.log("Fuck you shouldn't be here");
                }
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 8) {
                chr = String.fromCharCode(8);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 9) {
                chr = String.fromCharCode(9);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 38) {
                // Only go back if we can
                if (_CurrentLocation > 0 && _CommandHistory.length != 0) {
                    chr = "upArrow";
                    _KernelInputQueue.enqueue(chr);
                }
            }
            else if (keyCode == 40) {
                // Only go forward if we can
                if (_CurrentLocation <= _CommandHistory.length && _CommandHistory.length != 0) {
                    chr = "downArrow";
                    _KernelInputQueue.enqueue(chr);
                }
            }
            else if (keyCode == 192) {
                debugger;
                if (isShifted) {
                    chr = "~";
                    _TextHistory.push(chr);
                } /*else {
                    chr = String.fromCharCode(192);
                    _TextHistory.push(chr)
                }*/
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 189) {
                debugger;
                if (isShifted) {
                    chr = "_";
                    _TextHistory.push(chr);
                } /*else {
                    chr = String.fromCharCode(189);
                    _TextHistory.push(chr)
                }*/
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 187) {
                debugger;
                if (isShifted) {
                    chr = "+";
                    _TextHistory.push(chr);
                } /*else {
                    chr = String.fromCharCode(187);
                    _TextHistory.push(chr)
                }*/
                _KernelInputQueue.enqueue(chr);
            }
        };
        return DeviceDriverKeyboard;
    }(TSOS.DeviceDriver));
    TSOS.DeviceDriverKeyboard = DeviceDriverKeyboard;
})(TSOS || (TSOS = {}));
