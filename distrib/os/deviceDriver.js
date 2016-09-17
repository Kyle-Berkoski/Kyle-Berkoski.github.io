/* ------------------------------
     DeviceDriver.ts

     The "base class" for all Device Drivers.
     ------------------------------ */
var SDOS;
(function (SDOS) {
    var DeviceDriver = (function () {
        function DeviceDriver() {
            this.version = '0.07';
            this.status = 'unloaded';
            this.preemptable = false;
            this.driverEntry = null;
            this.isr = null;
        }
        return DeviceDriver;
    }());
    SDOS.DeviceDriver = DeviceDriver;
})(SDOS || (SDOS = {}));
