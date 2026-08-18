# Hardware Design

This directory contains the hardware design documentation of the HerbaDry Monitoring System.

## Hardware Components

The system consists of the following main hardware components:

- ESP32 DevKit V1
- DHT22 temperature and relative humidity sensor
- Capacitive Soil Moisture Sensor V1.2
- ESP32 Expansion Board
- LCD 20x4 with I2C module
- MicroSD Card module
- 12 V 1 A power adapter
- LM2596 step-down converter
- Smart Valve
- Gas regulator
- Buzzer
- Supporting electrical and mechanical components

## Hardware Functions

The ESP32 DevKit V1 functions as the main controller of the system. The DHT22 measures temperature and relative humidity inside the drying chamber, while the Capacitive Soil Moisture Sensor V1.2 is used to monitor the moisture condition of the herbal material.

The LCD 20x4 provides local information about the system condition and sensor measurements. The MicroSD Card module provides local data storage, while the Smart Valve is used to control the gas supply for the drying process.

## Wiring Diagram

The complete wiring diagram will be provided in the `wiring_diagram` directory.

## Power Supply

The system uses a 12 V 1 A adapter as the main power source. An LM2596 step-down converter is used to reduce the voltage for the low-voltage electronic components.

## Safety

The electronic control system must be installed away from direct heat and flame. Gas connections must be checked for leakage before operating the drying system.
