var Service, Characteristic, limiter, cmdBase;
var exec = require("child_process").exec,
    RateLimiter = require('limiter').RateLimiter;

module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    limiter = new RateLimiter(1, 700); //limit requests to one per 200ms
    homebridge.registerAccessory("homebridge-rfoutlets",
        "RFOutlet",
        RFOutletAccessory);
}

function RFOutletAccessory(log, config) {
    this.log = log;

    //Accessory information
    this.name = config["name"];
    this.type = config["type"];
    this.manufacturer = config["manufacturer"];
    this.model = config["model"];
    this.serial = config["serial"];

    //RF transmit inforamtion
    this.rf_on = config["rf_on"];
    this.rf_off = config["rf_off"];

    if (config["pulselength"]) {
        this.pulselength = config["pulselength"];
    } else {
        this.pulselength = -1; //Default to a pulse length of 189
    }

    // if (config["pin"]) {
    //     this.pin = config["pin"];
    // } else {
    //     this.pin = 0; //Default to GPIO pin 0
    // }

	if (config["protocol"]) {
        this.protocol = config["protocol"];
    } else {
        this.protocol = 1; //Default to protocol 1
    }

    //cmdBase = "sudo " + //the codesend executable requires root
        //__dirname + //module directory
        //"/codesend -p " + this.pin + " -l " + this.pulselength + " ";
}

function buildCodesendString(code, protocol, pulselength) {
	var ret = __dirname + "/codesend " + code + " " + protocol;
	if (pulselength != -1) {
		ret = ret + " " + pulselength;
	}
	return ret;
}

RFOutletAccessory.prototype = {
    setPowerState: function(powerOn, callback) {
        var state;
        var cmd;

        if (powerOn) {
            //cmd = cmdBase + this.rf_on;
			cmd = buildCodesendString(this.rf_on, this.protocol, this.pulselength);
            state = "on";
        } else {
            //cmd = cmdBase + this.rf_off;
			cmd = buildCodesendString(this.rf_off, this.protocol, this.pulselength);
            state = "off";
        }

        this.log("Turning " + this.name + " " + state);
		this.log("Command: " + cmd);

        limiter.removeTokens(1, function() {
            exec(cmd, function(error, stdout, stderr) {
                if (error) {
                    console.log(error);
                }
                callback();
            })
        });
    },

    identify: function(callback) {
        this.log("HomeKit identify requested");
        callback();
    },

    getServices: function() {
        var informationService = new Service.AccessoryInformation();

        informationService
            .setCharacteristic(Characteristic.Manufacturer, this.manufacturer)
            .setCharacteristic(Characteristic.Model, this.model)
            .setCharacteristic(Characteristic.SerialNumber, this.serial);

        var outletService;

        switch (this.type) {
            case "Switch":
                this.outletService = new Service.Switch(this.name);
                break;
            case "Light":
                this.outletService = new Service.Lightbulb(this.name);
                break;
            case "Fan":
                this.outletService = new Service.Fan(this.name);
                break;
            default:
                this.outletService = new Service.Switch(this.name);
        }

        this.outletService
            .getCharacteristic(Characteristic.On)
            .on('set', this.setPowerState.bind(this));

        return [informationService, this.outletService];
    }
};
