///<reference path="../globals.ts" />

/* ------------
     Console.ts

     Requires globals.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */

module SDOS {

    export class Console {

        constructor(public currentFont = _DefaultFontFamily,
                    public currentFontSize = _DefaultFontSize,
                    public currentXPosition = 0,
                    public currentYPosition = _DefaultFontSize,
                    public buffer = "") {
        }

        public init(): void {
            this.clearScreen();
            this.resetXY();
        }

        private clearScreen(): void {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        }

        private resetXY(): void {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        }

        public handleInput(): void {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) { //     Enter key
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    _OsShell.handleInput(this.buffer);
                    // Add the command to the command history
					_CommandHistory.push(this.buffer);
					// ... and reset our buffer.
                    this.buffer = "";
                } else if (chr == String.fromCharCode(8)) {
					if (this.buffer.length >= 1){
						var oldXPosition = 0;
						if (_TextHistory.length == 1) {
							//There's only one element in the array so grab that
							var historyLocation = 0;										
						} else if (_TextHistory.length >= 1) {
							// The most recent character is at the end of the array, so grab that
							var historyLocation = _TextHistory.length - 1;
						}
						// This is the width of the previous character
						var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, _TextHistory[historyLocation]);
						// go back the width of the character 
						oldXPosition = this.currentXPosition - offset
						
						/**
						 * oldXPosition: The upper left X value to start the rectangle
						 * currentYPosition: The upper left y value to start the rectangle
						 * offset: The width of the rectangle
						 * 20: Height of the rectangle
						 */
						_DrawingContext.clearRect(oldXPosition, this.currentYPosition-15, offset, 20);
						 
						 // Set the current X position to where we are now
						this.currentXPosition = oldXPosition;
						// Remove the value and the backspace from the _TextHistory array
						_TextHistory.length = _TextHistory.length - 1;
						// We have to remove the character from the buffer as well
						this.buffer = this.buffer.slice(0, -1);
					}
				} else if (chr == String.fromCharCode(38) || chr == String.fromCharCode(40)){
					// Clear out whatever was already typed, and set the x position back to the beginning
					_StdOut.clearLine();
					this.currentXPosition = 11;
					// Store the most recent command in a string
					var currentCommand = _CommandHistory[_CurrentLocation];
					// Loop through the string and put the command back on the canvas
					for (var i = 0; i < currentCommand.length; i++){
						this.putText(currentCommand[i]);
					}
					this.buffer = currentCommand;
				}
				else {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                }
                // TODO: Write a case for Ctrl-C.
            }
        }

        public putText(text): void {
            // My first inclination here was to write two functions: putChar() and putString().
            // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
            // between the two.  So rather than be like PHP and write two (or more) functions that
            // do the same thing, thereby encouraging confusion and decreasing readability, I
            // decided to write one function and use the term "text" to connote string or char.
            //
            // UPDATE: Even though we are now working in TypeScript, char and string remain undistinguished.
            //         Consider fixing that.
			
			
            if (text !== ""){
				// Draw the text at the current X and Y coordinates.
                _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                // Move the current X position.
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                this.currentXPosition = this.currentXPosition + offset;
			}
         }

        public advanceLine(): void {
            this.currentXPosition = 0;
            /*
             * Font size measures from the baseline to the highest point in the font.
             * Font descent measures from the baseline to the lowest point in the font.
             * Font height margin is extra spacing between the lines.
             */
            this.currentYPosition += _DefaultFontSize + 
                                     _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                                     _FontHeightMargin;

            // TODO: Handle scrolling. (iProject 1)
        }
		
		public clearLine(): void {
			_DrawingContext.clearRect(11, this.currentYPosition-15, _Canvas.width-5, 20);
		}
			
    }
 }
