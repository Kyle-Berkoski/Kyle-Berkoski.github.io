///<reference path="../globals.ts" />

/* ------------
     Console.ts

     Requires globals.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */

module TSOS {

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
					debugger;
					if (this.buffer.length >= 1){
						var lineHeight = _DefaultFontSize + _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) + _FontHeightMargin;
						var oldXPosition = 0;
						// Manage where we are in the history array
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
				} else if (chr == "upArrow" || chr == "downArrow"){
					// Clear out whatever was already typed, and set the x position back to the beginning
					_StdOut.clearLine();
					this.currentXPosition = 11;
					// Store the most recent command in a string
					var currentCommand = _CommandHistory[_CurrentLocation];
					// Now move in the array
					if(chr == "upArrow"){
						_CurrentLocation = _CurrentLocation - 1;
					} else if(chr == "downArrow"){
						_CurrentLocation = _CurrentLocation + 1;
					}
					// Put the command back on the canvas
					_StdOut.putText(currentCommand);
					// Add it to the buffer so the user can enter the command again
					this.buffer = currentCommand;
				} else if (chr == String.fromCharCode(9)) {
					/**
					 * Much like myself, it works, but it's ugly.
					 * Maybe come back and fix this.
					 */
					var currentCharsTyped = "";
					// Loop through the text history and add it to the string to be completed
					for (var i = 0; i < _TextHistory.length; i++){
						currentCharsTyped = currentCharsTyped + _TextHistory[i];
					}
					// Now loop through the list of commands and trim the length to what we have
					for (var j = 0; j < _OsShell.commandList.length; j++){
						if (currentCharsTyped == _CommandListSorted[j].slice(0,currentCharsTyped.length)) {
							// Clear the line so we can put the command in
							_StdOut.clearLine();
							_StdOut.putText(_CommandListSorted[j]);
							// Put the command in the buffer so the user can actually input the command
							this.buffer = _CommandListSorted[j];
							// We're done here
							break;
						}						
					}
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
			debugger;
			
            if (text !== ""){
				if (this.currentXPosition >= 490){
					_StdOut.advanceLine(true);
				}
				// Draw the text at the current X and Y coordinates.
                _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
				// Move the current X position.
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                this.currentXPosition = this.currentXPosition + offset;
			}
         }

        public advanceLine(lineIsWrapped): void {
			debugger;
            this.currentXPosition = 0;
            /*
             * Font size measures from the baseline to the highest point in the font.
             * Font descent measures from the baseline to the lowest point in the font.
             * Font height margin is extra spacing between the lines.
             */
            this.currentYPosition += _DefaultFontSize + 
                                     _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                                     _FontHeightMargin;
			var lineHeight = _DefaultFontSize + _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) + _FontHeightMargin;
			// Now that we're on a new line, we can clear the text history
			if (!lineIsWrapped){
				_TextHistory = [];
			}			
            // TODO: Handle scrolling. (iProject 1)
			if(this.currentYPosition > _Canvas.height){
				var canvasContents = _DrawingContext.getImageData(0, 0, _Canvas.width, _Canvas.height);
				_DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
				_DrawingContext.putImageData(canvasContents, 0, -lineHeight);
				this.currentYPosition = this.currentYPosition - lineHeight;
			}
			
        }
		
		public clearLine(): void {
			_DrawingContext.clearRect(11, this.currentYPosition-15, _Canvas.width-5, 20);
			// Just past the prompt string
			this.currentXPosition = 12;
		}
			
    }
 }
