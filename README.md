# HerbaDry Monitoring System

## IoT-Based Herbal Drying Monitoring and Control System

HerbaDry Monitoring System is an Internet of Things (IoT)-based monitoring and control system developed to monitor and control the drying process of herbal materials, particularly elephant ginger (*Zingiber officinale*).

The system monitors temperature, relative humidity, and moisture condition during the drying process. Measurement data are processed by an ESP32 DevKit V1 and transmitted through a Wi-Fi connection to Firebase Realtime Database. The data can then be accessed through a web-based monitoring dashboard.

In addition to monitoring, the system implements Mamdani Fuzzy Logic to determine the gas valve condition based on temperature and relative humidity. A Smart Valve Controller is used to automatically regulate the gas supply to the drying oven.

The system is designed as a low-cost and modular platform that can be reproduced, modified, and further developed for herbal, agricultural, and food drying applications.

---

## Features

The main features of the HerbaDry Monitoring System include:

- Real-time temperature monitoring using DHT22.
- Real-time relative humidity monitoring using DHT22.
- Moisture condition monitoring using a Capacitive Soil Moisture Sensor V1.2.
- ESP32-based data processing.
- Wi-Fi connectivity.
- Firebase Realtime Database integration.
- Web-based monitoring dashboard.
- Real-time visualization of sensor measurements.
- Drying duration monitoring.
- Local monitoring using a 20 × 4 I2C LCD.
- Local data logging using a MicroSD Card.
- Audible notification using a buzzer.
- Seven drying status conditions:
  - Standby
  - Heating
  - Ready Check
  - Optimal
  - Warning
  - Danger
  - Done
- Automatic gas control using a Smart Valve Controller.
- Mamdani Fuzzy Logic-based heating control.
- Remote monitoring through a web browser.

---

# System Architecture

The overall architecture of the HerbaDry Monitoring System is shown below.

```text
                ┌──────────────────────┐
                │       DHT22          │
                │ Temperature & RH     │
                └──────────┬───────────┘
                           │
                           │
                ┌──────────▼───────────┐
                │ Capacitive Soil      │
                │ Moisture Sensor V1.2 │
                └──────────┬───────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │    ESP32     │
                    │   DevKit V1  │
                    └──────┬──────┘
                           │
              ┌────────────┼─────────────┐
              │            │             │
              ▼            ▼             ▼
       ┌───────────┐ ┌───────────┐ ┌──────────────┐
       │   LCD     │ │  MicroSD  │ │    Buzzer    │
       │   20×4    │ │  Module   │ │ Notification │
       └───────────┘ └───────────┘ └──────────────┘
                           │
                 ┌─────────┴─────────┐
                 │                   │
                 ▼                   ▼
          ┌─────────────┐     ┌──────────────┐
          │   Wi-Fi /   │     │   Mamdani    │
          │   Firebase  │     │ Fuzzy Logic  │
          └──────┬──────┘     └──────┬───────┘
                 │                   │
                 ▼                   ▼
        ┌────────────────┐    ┌──────────────┐
        │ Web Monitoring │    │ Smart Valve  │
        │   Dashboard    │    │  Controller  │
        └───────┬────────┘    └──────┬───────┘
                │                    │
                ▼                    ▼
             ┌───────┐         ┌─────────────┐
             │ User  │         │ Gas Supply  │
             └───────┘         │  / Heating  │
                               └─────────────┘
````

---

# Hardware Components

The main hardware components used in the HerbaDry Monitoring System are listed below.

| No. | Component                            | Function                                                               |
| --: | ------------------------------------ | ---------------------------------------------------------------------- |
|   1 | ESP32 DevKit V1                      | Main microcontroller and data processor                                |
|   2 | DHT22                                | Measures temperature and relative humidity                             |
|   3 | Capacitive Soil Moisture Sensor V1.2 | Monitors moisture condition of the herbal material                     |
|   4 | ESP32 Expansion Board                | Provides convenient connection for the ESP32 and peripheral components |
|   5 | LCD 20 × 4 + I2C Module              | Displays local measurement and system information                      |
|   6 | MicroSD Card Module                  | Provides local data storage                                            |
|   7 | Buzzer                               | Provides audible system notification                                   |
|   8 | 12 V 1 A Adapter                     | Main power supply                                                      |
|   9 | LM2596 Step-Down Converter           | Reduces the input voltage for low-voltage electronic components        |
|  10 | Smart Valve Controller               | Controls the gas supply automatically                                  |
|  11 | Gas Regulator                        | Regulates gas pressure from the gas cylinder                           |
|  12 | Stainless Steel Flexible Hose        | Connects the gas supply system                                         |
|  13 | DC Female Power Connector            | Power connection                                                       |
|  14 | Jumper Cables                        | Electrical connections                                                 |
|  15 | PVC Project Box                      | Protects the electronic components                                     |
|  16 | Supporting mechanical components     | Supports the gas installation and hardware assembly                    |

---

# Hardware Specifications

### ESP32 DevKit V1

The ESP32 DevKit V1 is used as the main controller of the system. It handles sensor acquisition, data processing, Wi-Fi communication, LCD control, data logging, fuzzy logic processing, and gas valve control.

### DHT22

The DHT22 sensor is used to measure:

* Temperature (°C)
* Relative humidity (%RH)

The sensor is installed inside the drying chamber while being positioned away from direct flame or excessive heat.

### Capacitive Soil Moisture Sensor V1.2

The capacitive soil moisture sensor is used as an indicator of the moisture condition of the herbal material.

The sensor output is connected to an analog input of the ESP32 and converted into a percentage-based moisture indicator through calibration.

### LCD 20 × 4 I2C

The LCD provides local information including:

* Temperature
* Relative humidity
* Moisture condition
* System status
* Connection information

### MicroSD Card

The MicroSD Card module provides local storage for monitoring data and can be used as a backup when Internet connectivity is temporarily unavailable.

### Smart Valve Controller

The Smart Valve Controller regulates the gas supply to the drying oven.

The operating states are:

* **Gas ON:** Valve open and gas supply enabled.
* **Gas OFF:** Valve closed and gas supply stopped.

---

# Sensor Pin Configuration

The main ESP32 pin configuration used in the prototype is shown below.

| Component                       | ESP32 Pin     |
| ------------------------------- | ------------- |
| DHT22 Data                      | GPIO 26       |
| Capacitive Soil Moisture Sensor | GPIO 34       |
| Buzzer                          | GPIO 4        |
| MicroSD CS                      | GPIO 5        |
| LCD I2C SDA                     | ESP32 I2C SDA |
| LCD I2C SCL                     | ESP32 I2C SCL |

The pin configuration may be modified according to the hardware implementation and firmware configuration.

---

# Software Architecture

The system consists of three main software components:

```text
ESP32 Firmware
      │
      ├── Sensor Reading
      ├── Data Processing
      ├── Moisture Monitoring
      ├── Mamdani Fuzzy Logic
      ├── Gas Valve Control
      ├── LCD Display
      ├── Buzzer
      ├── MicroSD Logging
      └── Wi-Fi Communication
                │
                ▼
      Firebase Realtime Database
                │
                ▼
       Web Monitoring Dashboard
```

---

# Repository Structure

The repository is organized as follows:

```text
HerbaDry-Monitoring-System/
│
├── ESP32/
│   ├── include/
│   ├── lib/
│   ├── src/
│   ├── test/
│   └── platformio.ini
│
├── logData/
│
├── .github/
│   └── workflows/
│
├── app.js
├── index.html
├── style.css
├── firebase.json
├── .firebaserc
├── README.md
└── HerbaDry-Monitoring-System.code-workspace
```

### ESP32

Contains the firmware and PlatformIO configuration for the ESP32 DevKit V1.

The firmware includes:

* Sensor acquisition
* Temperature and humidity processing
* Moisture monitoring
* Wi-Fi configuration
* Firebase communication
* Mamdani Fuzzy Logic
* Smart Valve control
* LCD control
* Buzzer control
* MicroSD data logging
* Drying status determination

### logData

Contains files related to monitoring data logging and data visualization.

### app.js

Contains JavaScript functions used by the web monitoring dashboard.

### index.html

The main web dashboard page.

### style.css

Contains the dashboard interface styling.

### firebase.json

Contains Firebase Hosting configuration.

### .firebaserc

Contains Firebase project configuration.

---

# Firmware Requirements

The ESP32 firmware is developed using PlatformIO.

Required software:

* Visual Studio Code
* PlatformIO
* ESP32 development board support
* USB driver for the ESP32 board
* USB data cable

The firmware uses libraries required for:

* DHT22 sensor
* LCD I2C
* Wi-Fi
* WiFiManager
* Firebase
* ArduinoJson
* MicroSD
* Fuzzy logic
* Other supporting functions

---

# Installation

## 1. Clone the Repository

Clone the repository using:

```bash
git clone https://github.com/nrhlzanin/HerbaDry-Monitoring-System.git
```

Enter the repository directory:

```bash
cd HerbaDry-Monitoring-System
```

---

## 2. Open the ESP32 Project

Open the following folder using Visual Studio Code:

```text
ESP32/
```

Make sure that PlatformIO is installed.

---

## 3. Connect the ESP32

Connect the ESP32 DevKit V1 to the computer using a USB data cable.

Make sure that the ESP32 is detected correctly by the operating system.

---

## 4. Configure the Firmware

Before uploading the firmware, configure the required parameters, including:

* Wi-Fi configuration
* Firebase configuration
* Sensor configuration
* GPIO configuration
* Smart Valve configuration
* Other system parameters

Do not publish private credentials, API keys, tokens, or passwords in the public repository.

---

## 5. Compile the Firmware

In PlatformIO:

1. Open the ESP32 project.
2. Check the selected ESP32 board.
3. Click **Build**.
4. Wait until the compilation process is completed.
5. Make sure there are no compilation errors.

---

## 6. Upload the Firmware

1. Connect the ESP32 to the computer.
2. Select the correct serial port.
3. Click **Upload**.
4. Wait until the upload process is completed.
5. Restart the ESP32 if necessary.

---

# Wi-Fi Configuration

The system uses a Wi-Fi configuration process to connect the ESP32 to the Internet.

When the ESP32 cannot connect to a previously configured network, it starts the configuration access point.

The default setup network is:

```text
SSID     : HerbaDry_Setup
Password : 12345678
```

After connecting to the setup network, open:

```text
http://192.168.4.1
```

Select the Wi-Fi network that will be used by the system and enter its password.

After successful configuration, the ESP32 connects to the selected Wi-Fi network and starts communication with Firebase Realtime Database.

---

# Firebase Realtime Database

Firebase Realtime Database is used as the communication and storage layer between the ESP32 and the web dashboard.

The system transmits monitoring information including:

* Temperature
* Relative humidity
* Moisture condition
* System status
* Drying duration
* Gas valve status
* Network information

The web dashboard retrieves the data from Firebase and displays the latest measurements in real time.

---

# Web Monitoring Dashboard

The HerbaDry Monitoring dashboard provides real-time information about the drying process.

The dashboard displays:

* Temperature (°C)
* Relative humidity (%RH)
* Moisture level (%)
* Drying duration
* System status
* Gas ON / Gas OFF status
* Monitoring graphs
* Network status
* System notifications
* Latest sensor update

The dashboard can be accessed through a web browser using a computer or mobile device connected to the Internet.

---

# System Status

The system uses seven predefined operating conditions.

### Standby

The system is active but the drying process has not been started.

### Heating

The drying chamber is in the initial heating stage.

### Ready Check

The drying environment is approaching the required operating conditions.

### Optimal

The drying parameters have reached the predefined target condition.

### Warning

One or more parameters have exceeded the recommended operating range and require user attention.

### Danger

The drying environment has reached a critical condition.

### Done

The herbal material has reached the predefined moisture condition for completion of the drying process.

---

# Mamdani Fuzzy Logic

The heating control system uses Mamdani Fuzzy Logic.

The fuzzy controller uses:

### Input Variables

* Temperature
* Relative humidity

### Output Variable

* Gas control

The gas control has two main states:

```text
Gas ON
Gas OFF
```

The fuzzy inference process consists of:

```text
Sensor Measurement
        │
        ▼
Fuzzification
        │
        ▼
Fuzzy Rule Evaluation
        │
        ▼
Inference
        │
        ▼
Centroid Defuzzification
        │
        ▼
Gas ON / Gas OFF
```

The fuzzy controller considers temperature and humidity simultaneously to determine the appropriate heating condition.

---

# Gas Valve Control

The Smart Valve Controller is used to regulate the gas supply to the drying oven.

The control states are:

```text
Gas ON  → Valve Open  → Gas Supply Active
Gas OFF → Valve Closed → Gas Supply Stopped
```

The ESP32 determines the gas state using the Mamdani Fuzzy Logic controller and sends the corresponding command to the Smart Valve Controller through the configured communication system.

The Smart Valve Controller uses the Tuya Cloud platform for remote control communication.

---

# Hardware Assembly

## 1. Prepare the Components

Prepare all components listed in the Bill of Materials.

Check each component for physical damage before assembly.

---

## 2. Install the Sensors

Install the DHT22 inside the drying chamber.

The DHT22 should:

* Be exposed to the drying environment.
* Be positioned away from direct flame.
* Not be in direct contact with the heating element.
* Be installed in a consistent position during testing.

Install the Capacitive Soil Moisture Sensor V1.2 so that it can monitor the moisture condition of the herbal material.

---

## 3. Assemble the Electronic System

Install the ESP32 DevKit V1 on the expansion board.

Connect:

```text
DHT22
  │
  └── Data → GPIO 26

Moisture Sensor
  │
  └── Analog Output → GPIO 34

Buzzer
  │
  └── Signal → GPIO 4

MicroSD
  │
  └── CS → GPIO 5

LCD 20×4
  │
  └── I2C → ESP32 I2C interface
```

Check all connections before powering the system.

---

## 4. Install the Power Supply

The prototype uses:

```text
12 V 1 A Adapter
        │
        ▼
LM2596 Step-Down Converter
        │
        ▼
Low-Voltage Electronics
```

Before connecting the output of the LM2596 to the electronic components, verify the output voltage using a multimeter.

Check:

* Voltage
* Polarity
* Ground connection
* Cable condition

---

## 5. Install the Smart Valve

The Smart Valve Controller is installed in the gas supply line between the gas regulator and the drying oven.

The general configuration is:

```text
Gas Cylinder
     │
     ▼
Gas Regulator
     │
     ▼
Smart Valve
     │
     ▼
Gas Hose
     │
     ▼
Drying Oven
```

All gas connections must be checked for leakage before operation.

---

# System Operation

## 1. Start the System

Connect the 12 V adapter and turn on the system.

Wait for the ESP32 to complete its initialization.

---

## 2. Configure Wi-Fi

If required, connect to:

```text
HerbaDry_Setup
```

and access:

```text
192.168.4.1
```

Configure the Wi-Fi network that will be used by the system.

---

## 3. Check the Sensors

Verify that the LCD displays:

* Temperature
* Relative humidity
* Moisture condition
* System status

---

## 4. Open the Dashboard

Open the HerbaDry Monitoring dashboard using a web browser.

Verify that the latest sensor data are displayed.

---

## 5. Place the Herbal Material

Place the herbal material inside the drying chamber.

For the prototype validation, elephant ginger (*Zingiber officinale*) was used as the test material.

Position the moisture sensor consistently with the calibration and testing procedure.

---

## 6. Start Drying

Press the **Start Drying** button on the monitoring dashboard.

The system starts recording the drying duration and monitoring the sensor measurements.

---

## 7. Monitor the Drying Process

During operation, the system continuously monitors:

* Temperature
* Relative humidity
* Moisture condition
* Drying duration
* System status
* Gas valve condition

The ESP32 processes the sensor measurements and applies the fuzzy control algorithm to determine the gas valve state.

---

## 8. Stop Drying

When the drying process is completed:

1. Open the dashboard.
2. Press **Stop Drying**.
3. Turn off the drying oven.
4. Verify that the gas supply has stopped.
5. Allow the equipment to cool.
6. Turn off the electrical supply if the system will no longer be used.

---

# Moisture Sensor Calibration

The Capacitive Soil Moisture Sensor V1.2 is used as an indicator of the moisture condition of the herbal material.

Calibration is required before using the sensor for experimental monitoring.

The general calibration procedure is:

1. Prepare the herbal material sample.
2. Measure the initial sample condition.
3. Record the sensor reading.
4. Determine the reference moisture value using a gravimetric or other reference method.
5. Compare the sensor reading with the reference value.
6. Determine the calibration relationship.
7. Implement the calibration parameters in the firmware.
8. Perform a validation test.

The calibration result is dependent on the material characteristics, sample thickness, sensor position, and contact condition.

---

# Validation

The prototype was tested using elephant ginger (*Zingiber officinale*).

During the drying characterization test, the recorded temperature increased from approximately:

```text
37 °C → 49 °C
```

during a 30-minute observation period.

The average temperature was approximately:

```text
44.8 °C
```

Relative humidity decreased from approximately:

```text
100 %RH → 70 %RH
```

during the same observation period.

Moisture sensor testing was also performed using different ginger thicknesses:

* 1 cm
* 5 mm
* 3 mm

The results showed that thinner ginger samples experienced a faster reduction in the moisture sensor reading.

---

# Safety

Because the system combines electronic equipment with an LPG-powered heating system, safety precautions must be followed.

* Verify the power supply voltage before connecting the electronics.
* Check polarity before applying power.
* Disconnect electrical power before modifying the circuit.
* Keep electronic components away from direct flame and high-temperature areas.
* Do not place the DHT22 directly above the heating source.
* Check all gas connections for leakage before operation.
* Ensure that the gas hose is properly installed.
* Do not operate the system if gas leakage is detected.
* Keep combustible materials away from the drying oven.
* Ensure that a manual gas shut-off mechanism remains accessible.
* Do not leave the gas-powered drying system unattended.
* Install and operate the Smart Valve according to the manufacturer's instructions.

---

# Reproducibility

The repository provides the resources required to reproduce and further develop the HerbaDry Monitoring System.

The supporting files include:

* ESP32 firmware
* Web dashboard source code
* Hardware wiring diagram
* Bill of Materials
* Hardware documentation
* System architecture
* Installation instructions
* Operation instructions
* Sensor calibration procedure
* Testing and validation information

The complete design files will also be deposited in an open-access repository.

Repository DOI:

```text
[DOI ZENODO]
```

---

# Design Files

The design files are organized into the following categories:

| File / Directory | Description                           |
| ---------------- | ------------------------------------- |
| `/ESP32`         | ESP32 firmware and PlatformIO project |
| `/Dashboard`     | Web monitoring dashboard source files |
| `/logData`       | Monitoring data and logging files     |
| `/Hardware`      | Hardware diagrams and documentation   |
| `/BOM`           | Bill of Materials                     |
| `/Documentation` | Supporting technical documentation    |

The final repository structure may be updated to match the released design files.

---

# Bill of Materials

The complete Bill of Materials is provided in the repository and contains the components required to reproduce the prototype.

The documented prototype cost is approximately:

```text
Rp940,682
```

Equivalent to approximately:

```text
USD 57.01
```

based on an exchange rate of approximately Rp16,500 per USD.

The BOM includes electronic, electrical, mechanical, gas-system, and supporting components.

---

# Open Source License

The hardware design files of the HerbaDry Monitoring System are released under:

**CERN Open Hardware Licence Version 2 – Strongly Reciprocal (CERN-OHL-S v2)**

The firmware and web dashboard source code are released under:

**MIT License**

The applicable license files are provided in the repository.

---

# Citation

If you use the HerbaDry Monitoring System, its hardware design, firmware, or documentation in your research or development work, please cite the associated publication.

The publication DOI will be added after publication.

```text
Nurhaliza Anindya Putri, Meyti Eka Apriyani, and Erfan Rohadi.
Herbal Ingredient Monitoring System Based on the Internet of Things (IoT)
with Temperature, Humidity, and Moisture Level Analysis.
HardwareX.
DOI: [TO BE ADDED]
```

Repository:

```text
https://github.com/nrhlzanin/HerbaDry-Monitoring-System
```

Zenodo:

```text
[ZENODO DOI TO BE ADDED]
```

---

# Related Publication

The HerbaDry Monitoring System is described in the following publication:

**Herbal Ingredient Monitoring System Based on the Internet of Things (IoT) with Temperature, Humidity, and Moisture Level Analysis**

Authors:

* Nurhaliza Anindya Putri
* Meyti Eka Apriyani
* Erfan Rohadi

Department of Information Technology
Politeknik Negeri Malang
Malang, Indonesia

---

# Authors

### Nurhaliza Anindya Putri

Department of Information Technology
Politeknik Negeri Malang
Malang, Indonesia

Email:
[nurhaliza.anindya996@gmail.com](mailto:nurhaliza.anindya996@gmail.com)

### Meyti Eka Apriyani

Department of Information Technology
Politeknik Negeri Malang
Malang, Indonesia

Email:
[meytieka@polinema.ac.id](mailto:meytieka@polinema.ac.id)

### Erfan Rohadi

Department of Information Technology
Politeknik Negeri Malang
Malang, Indonesia

Email:
[erfan@polinema.ac.id](mailto:erfan@polinema.ac.id)

---

# Acknowledgement

This project was developed as part of research and development activities in the Department of Information Technology, Politeknik Negeri Malang.

---

# Project Status

The HerbaDry Monitoring System is a research prototype.

The system can be further developed through:

* Additional environmental sensors.
* Improved moisture measurement methods.
* Improved calibration techniques.
* More advanced automatic drying control.
* Additional data analysis.
* Mobile application development.
* Notification system integration.
* Machine-learning-based drying analysis.
* Improved gas control and safety mechanisms.
