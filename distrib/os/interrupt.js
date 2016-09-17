/* ------------
   Interrupt.ts
   ------------ */
var SDOS;
(function (SDOS) {
    var Interrupt = (function () {
        function Interrupt(irq, params) {
            this.irq = irq;
            this.params = params;
        }
        return Interrupt;
    }());
    SDOS.Interrupt = Interrupt;
})(SDOS || (SDOS = {}));
