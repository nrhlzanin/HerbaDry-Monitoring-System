# ESP32 Firmware

This directory contains the firmware for the HerbaDry Monitoring System.

## Main Functions

The firmware is responsible for:

- Reading temperature and relative humidity from the DHT22 sensor.
- Reading moisture data from the Capacitive Soil Moisture Sensor V1.2.
- Processing sensor measurements using the ESP32.
- Displaying system information on the 20x4 I2C LCD.
- Controlling the buzzer.
- Recording monitoring data using the MicroSD Card module.
- Connecting the ESP32 to a Wi-Fi network.
- Transmitting monitoring data to Firebase Realtime Database.
- Determining the drying condition.
- Applying Mamdani fuzzy logic for heating control.
- Controlling the Smart Valve.

## Hardware Configuration

The main sensor connections include:

| Component | ESP32 Pin |
|---|---|
| DHT22 | GPIO 26 |
| Capacitive Soil Moisture Sensor | GPIO 34 |
| Buzzer | GPIO 4 |
| MicroSD CS | GPIO 5 |

The LCD uses an I2C interface.

## Development Environment

The firmware was developed using:

- ESP32 DevKit V1
- PlatformIO
- Visual Studio Code
- Arduino framework

## Installation

1. Install Visual Studio Code.
2. Install the PlatformIO extension.
3. Open the `ESP32` directory as a PlatformIO project.
4. Connect the ESP32 to the computer using a USB cable.
5. Select the appropriate serial port.
6. Compile the firmware.
7. Upload the firmware to the ESP32.

## Configuration

Before uploading the firmware, configure the required Wi-Fi and cloud service parameters according to the implementation.

Do not upload private credentials, API keys, access tokens, or passwords to the public repository.

## License

The firmware is released under the MIT License.
