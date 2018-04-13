# homebridge-rfoutlets

Homebridge plugin purpose-built for controlling 433MHz radio frequency outlets which can be purchased inexpensively. (i.e. [these](https://www.amazon.com/Etekcity-Wireless-Electrical-Household-Appliances/dp/B00DQELHBS "Etekcity Wireless Outlets")). Homebridge maintains state information, so you can always know if you left that lamp on.

Tested on a Raspberry Pi 2 - Model B running Raspbian (Debian) and Node.js v6.9.0. This should work on most Raspberry Pi models, however YMMV

Supports *lights*, *switches*, and *fans*

## Installation

- Install homebridge  
`sudo npm install -g homebridge`

- Install homebridge-rfoutlets  
`git clone https://github.com/chucktator/homebridge-rfoutlets.git`  
`npm install -g ./homebridge-rfoutlets`

- In order for the plugin to have access to the Pi's GPIOs, you must add your homebridge user to the appropriate group. This way no sudo access is necessary.
`sudo usermod -G gpio homebridge`

- Update your homebridge configuration

## Notes

- The user which homebridge is run from must be on the list of *sudoers* as the `codesend` executable requires root privileges
- A great guide on how to record RF signals and set up your Pi to transmit can be found [here](https://www.samkear.com/hardware/control-power-outlets-wirelessly-raspberry-pi "Pi 433Mhz Transmitter Guide"). Note: the web portion of the guide is not required

## Configuration

- `name`: Name of your device
- `type`: `Light`, `Switch`, or `Fan` (**required**)
- `manufacturer`: manufacturer of the device plugged into the outlet (*optional*, defaults to *blank*)
- `model`: model of the device plugged into the outlet (*optional*, defaults to *blank*)
- `serial`: serial number of the device plugged into the outlet (*optional*, defaults to *blank*)
- `rf_on`: RF signal to turn the outlet on (**required**)
- `rf_off`: RF signal to turn the outlet off (**required**)
- `pulselength`: RF transmission pulse length (*optional*, defaults to 189)
- `protocol`: The protocol of the controlled device (*optional*, defaults to 1)

See `sample-config.json`
