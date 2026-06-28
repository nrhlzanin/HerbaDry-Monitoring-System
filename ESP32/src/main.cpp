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
#define DHTPIN 26
#define DHTTYPE DHT22
#define SOIL_PIN 34
#define BUZZER 19

// ================= OBJECT =================
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

DHT dht(DHTPIN, DHTTYPE);

// LCD 20x4
LiquidCrystal_I2C lcd(0x27, 20, 4);

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

bool dryingStarted = false;
unsigned long dryingStartTime = 0;
unsigned long dryingMinutes = 0;

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
  lcd.print("Connect to WiFi");

  lcd.setCursor(0, 1);
  lcd.print("SSID:HerbaDry_Setup");

  lcd.setCursor(0, 2);
  lcd.print("PASS:12345678");

  lcd.setCursor(0, 3);
  lcd.print("Open 192.168.4.1");

  bool ok = wm.autoConnect(
      "HerbaDry_Setup",
      "12345678");

  if (!ok)
  {
    lcd.clear();
    lcd.setCursor(0, 1);
    lcd.print("WiFi Failed");

    lcd.setCursor(0, 2);
    lcd.print("Restarting...");

    delay(2000);
    ESP.restart();
  }

  lcd.clear();

  lcd.setCursor(0, 0);
  lcd.print("WiFi Connected");

  lcd.setCursor(0, 1);
  lcd.print("IP Address:");

  lcd.setCursor(0, 2);
  lcd.print(WiFi.localIP());

  delay(3000);
}

// =========================================
// FIREBASE
// =========================================
void initFirebase()
{
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;

  config.signer.test_mode = true;

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

  Serial.println("===== DHT READ =====");

  Serial.print("Temp RAW = ");
  Serial.println(temp);

  Serial.print("Hum RAW = ");
  Serial.println(hum);

  if (!isnan(temp))
    t = temp;

  if (!isnan(hum))
    h = hum;

  int raw = analogRead(SOIL_PIN);

  soil = map(raw, soilDry, soilWet, 0, 100);
  soil = constrain(soil, 0, 100);

  Serial.print("T = ");
  Serial.println(t);

  Serial.print("H = ");
  Serial.println(h);

  Serial.print("Soil = ");
  Serial.println(soil);
}

// =========================================
// STATUS
// =========================================
void checkCondition()
{
  // Validasi akhir kadar air
  if (soil <= 10)
  {
    kondisi = "Done";
    return;
  }

  // Danger
  if (
      t >= 70 ||
      h >= 80 ||
      dryingMinutes > 45)
  {
    kondisi = "Danger";
  }

  // Warning
  else if (
      (t >= 65 && t < 70) ||
      h > 55 ||
      dryingMinutes > 30)
  {
    kondisi = "Warning";
  }

  // Ready Check
  else if (
      dryingMinutes >= 20 &&
      t >= 55 &&
      t <= 65 &&
      h <= 40)
  {
    kondisi = "Ready Check";
  }

  // Optimal
  else if (
      t >= 55 &&
      t <= 65 &&
      h >= 30 &&
      h <= 55)
  {
    kondisi = "Optimal";
  }

  // Heating
  else if (
      t < 50 ||
      dryingMinutes < 5)
  {
    kondisi = "Heating";
  }

  else
  {
    kondisi = "Heating";
  }
}
// =========================================
// LCD 20x4
// =========================================
void updateLCD()
{
  lcd.clear();

  int hours = dryingMinutes / 60;
  int minutes = dryingMinutes % 60;

  lcd.setCursor(0, 0);
  lcd.print("T:");
  lcd.print(t, 1);
  lcd.print((char)223);
  lcd.print("C");

  lcd.setCursor(11, 0);
  lcd.print("RH:");
  lcd.print(h, 0);
  lcd.print("%");

  lcd.setCursor(0, 1);
  lcd.print("Moist:");
  lcd.print(soil);
  lcd.print("%");

  lcd.setCursor(0, 2);
  lcd.print("Time:");

  if (hours < 10)
    lcd.print("0");
  lcd.print(hours);

  lcd.print("h ");

  if (minutes < 10)
    lcd.print("0");
  lcd.print(minutes);

  lcd.print("m");

  lcd.setCursor(0, 3);
  lcd.print("Status:");

  if (kondisi == "Done")
    lcd.print("DONE");
  else if (kondisi == "Ready Check")
    lcd.print("READY");
  else if (kondisi == "Optimal")
    lcd.print("OPTIMAL");
  else if (kondisi == "Warning")
    lcd.print("WARNING");
  else if (kondisi == "Danger")
    lcd.print("DANGER");
  else
    lcd.print("HEATING");
}
// =========================================
// FIREBASE SEND
// =========================================
void sendFirebase()
{
  Serial.println("=== FIREBASE SEND ===");

  if (Firebase.RTDB.setFloat(&fbdo, "/sensor/suhu", t))
    Serial.println("Suhu OK");
  else
    Serial.println(fbdo.errorReason());

  if (Firebase.RTDB.setFloat(&fbdo, "/sensor/kelembapan", h))
    Serial.println("RH OK");
  else
    Serial.println(fbdo.errorReason());

  if (Firebase.RTDB.setInt(&fbdo, "/sensor/soil", soil))
    Serial.println("Soil OK");
  else
    Serial.println(fbdo.errorReason());
  if (Firebase.RTDB.setInt(&fbdo, "/sensor/duration", dryingMinutes))
    Serial.println("Duration OK");
  else
    Serial.println(fbdo.errorReason());
  if (Firebase.RTDB.setString(&fbdo, "/sensor/kondisi", kondisi))
    Serial.println("Status OK");
  else
    Serial.println(fbdo.errorReason());

  if (Firebase.RTDB.setString(
          &fbdo,
          "/sensor/ip",
          WiFi.localIP().toString()))
  {
    Serial.println("IP OK");
  }
  else
  {
    Serial.println(fbdo.errorReason());
  }
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

    // mulai timer ketika suhu mulai naik
    if (!dryingStarted && t >= 50 && h <= 55)
    {
      dryingStarted = true;
      dryingStartTime = millis();

      Serial.println("Drying process started");
    }

    if (dryingStarted)
    {
      dryingMinutes =
          (millis() - dryingStartTime) / 60000;
    }

    checkCondition();
    updateLCD();

    Serial.print("T=");
    Serial.print(t);

    Serial.print(" H=");
    Serial.print(h);

    Serial.print(" Soil=");
    Serial.print(soil);

    Serial.print("% Time=");
    Serial.print(dryingMinutes);
    Serial.print("min");

    Serial.print(" Status=");
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