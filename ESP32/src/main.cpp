#include <Arduino.h>
#include <WiFi.h>
#include <WiFiManager.h>
#include <Firebase_ESP_Client.h>
#include <DHT.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

// ================= FIREBASE =================
#define API_KEY "AIzaSyAdXM0egIpInr5bt3bMsR3f6Nl09lGwzQs"
#define DATABASE_URL "https://herbadry-monitoring-default-rtdb.asia-southeast1.firebasedatabase.app/"

// ================= PIN =================
#define DHTPIN    26
#define DHTTYPE   DHT22
#define SOIL_PIN  34
#define BUZZER    19

// ================= OBJECT =================
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

DHT dht(DHTPIN, DHTTYPE);
LiquidCrystal_I2C lcd(0x27, 16, 2);

// ================= SOIL =================
const int soilDry = 3200;
const int soilWet = 1200;

// ================= LIMIT =================
const float suhuOptimalMin = 60.0;
const float suhuOptimalMax = 65.0;

const float suhuWarningMin = 65.0;
const float suhuDanger = 70.0;

const float rhMin = 30.0;
const float rhMax = 55.0;

// ================= TIMER =================
unsigned long lastRead = 0;
unsigned long lastSend = 0;
unsigned long lastBuzz = 0;

const unsigned long sensorInterval = 2000;
const unsigned long firebaseInterval = 2500;

// ================= DATA =================
float t = 0;
float h = 0;
int soil = 0;
String kondisi = "Heating";

// ================= BUZZER =================
bool buzzerOff = false;
unsigned long snoozeStart = 0;
const unsigned long snoozeDuration = 120000;

// =========================================
// WIFI
// =========================================
void connectWiFi()
{
    WiFiManager wm;

    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Setup WiFi");
    lcd.setCursor(0, 1);
    lcd.print("192.168.4.1");

    bool ok = wm.autoConnect("HerbaDry_Setup", "12345678");

    if (!ok)
    {
        ESP.restart();
    }

    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("WiFi Connected");
    lcd.setCursor(0, 1);
    lcd.print(WiFi.localIP());

    delay(2000);
}

// =========================================
// FIREBASE
// =========================================
void initFirebase()
{
    config.api_key = API_KEY;
    config.database_url = DATABASE_URL;

    Firebase.begin(&config, &auth);
    Firebase.reconnectWiFi(true);

    Serial.println("Firebase Connected");
}

// =========================================
// SENSOR
// =========================================
void readSensor()
{
    float temp = dht.readTemperature();
    float hum = dht.readHumidity();

    if (!isnan(temp))
        t = temp;

    if (!isnan(hum))
        h = hum;

    int raw = analogRead(SOIL_PIN);

    soil = map(raw, soilDry, soilWet, 0, 100);
    soil = constrain(soil, 0, 100);
}

// =========================================
// STATUS
// =========================================
void checkCondition()
{
    // selesai pengeringan
    if (soil <= 10)
    {
        kondisi = "Done";
        return;
    }

    // bahaya
    if (t >= suhuDanger)
    {
        kondisi = "Danger";
    }

    // warning
    else if (t >= suhuWarningMin)
    {
        kondisi = "Warning";
    }

    // optimal
    else if (
        t >= suhuOptimalMin &&
        t < suhuOptimalMax &&
        h >= rhMin &&
        h <= rhMax)
    {
        kondisi = "Optimal";
    }

    // pemanasan
    else
    {
        kondisi = "Heating";
    }
}

// =========================================
// LCD
// =========================================
void updateLCD()
{
    lcd.clear();

    lcd.setCursor(0, 0);
    lcd.print("T:");
    lcd.print(t, 0);
    lcd.print("C");

    lcd.setCursor(8, 0);
    lcd.print("H:");
    lcd.print(h, 0);
    lcd.print("%");

    lcd.setCursor(0, 1);
    lcd.print("M:");
    lcd.print(soil);
    lcd.print("%");

    if (kondisi == "Done")
        lcd.print(" DONE");
    else if (kondisi == "Optimal")
        lcd.print(" OPT");
    else if (kondisi == "Warning")
        lcd.print(" WARN");
    else if (kondisi == "Danger")
        lcd.print(" DANG");
    else
        lcd.print(" HEAT");
}

// =========================================
// FIREBASE SEND
// =========================================
void sendFirebase()
{
    Firebase.RTDB.setFloat(&fbdo, "/sensor/suhu", t);
    Firebase.RTDB.setFloat(&fbdo, "/sensor/kelembapan", h);
    Firebase.RTDB.setInt(&fbdo, "/sensor/soil", soil);
    Firebase.RTDB.setString(&fbdo, "/sensor/kondisi", kondisi);
    Firebase.RTDB.setString(&fbdo, "/sensor/ip", WiFi.localIP().toString());
}

// =========================================
// CONTROL
// =========================================
void readControl()
{
    if (Firebase.RTDB.getBool(&fbdo, "/control/buzzerOff"))
    {
        bool val = fbdo.boolData();

        if (val)
        {
            buzzerOff = true;
            snoozeStart = millis();
        }
    }
}

// =========================================
// SNOOZE
// =========================================
void checkSnooze()
{
    if (
        buzzerOff &&
        millis() - snoozeStart >= snoozeDuration)
    {
        buzzerOff = false;

        Firebase.RTDB.setBool(
            &fbdo,
            "/control/buzzerOff",
            false);
    }
}

// =========================================
// BUZZER
// =========================================
void updateBuzzer()
{
    if (buzzerOff)
    {
        digitalWrite(BUZZER, LOW);
        return;
    }

    if (kondisi == "Heating")
        return;

    int interval = 5000;

    if (kondisi == "Optimal")
        interval = 5000;

    if (kondisi == "Warning")
        interval = 2000;

    if (kondisi == "Danger")
        interval = 500;

    if (millis() - lastBuzz >= interval)
    {
        lastBuzz = millis();

        digitalWrite(BUZZER, HIGH);
        delay(150);
        digitalWrite(BUZZER, LOW);
    }
}

// =========================================
// SETUP
// =========================================
void setup()
{
    Serial.begin(115200);

    pinMode(BUZZER, OUTPUT);
    digitalWrite(BUZZER, LOW);

    dht.begin();

    lcd.init();
    lcd.backlight();

    connectWiFi();
    initFirebase();
}

// =========================================
// LOOP
// =========================================
void loop()
{
    unsigned long now = millis();

    if (now - lastRead >= sensorInterval)
    {
        lastRead = now;

        readSensor();
        checkCondition();
        updateLCD();

        Serial.print("T=");
        Serial.print(t);

        Serial.print(" H=");
        Serial.print(h);

        Serial.print(" Soil=");
        Serial.print(soil);

        Serial.print("% Status=");
        Serial.println(kondisi);
    }

    if (now - lastSend >= firebaseInterval)
    {
        lastSend = now;

        sendFirebase();
        readControl();
    }

    checkSnooze();
    updateBuzzer();
}