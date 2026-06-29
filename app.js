import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
  getDatabase,
  ref,
  onValue,
  set,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// ================= FIREBASE =================

const firebaseConfig = {
  apiKey: "AIzaSyAdXM0egIpInr5bt3bMsR3f6Nl09lGwzQs",
  authDomain: "herbadry-monitoring.firebaseapp.com",
  databaseURL:
    "https://herbadry-monitoring-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "herbadry-monitoring",
  storageBucket: "herbadry-monitoring.firebasestorage.app",
  messagingSenderId: "714369778562",
  appId: "1:714369778562:web:3ea942ef318bd5f7d4c59b",
  measurementId: "G-BX2N20LC0W",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ================= ELEMENT =================

const wifiIcon = document.getElementById("wifiIcon");
const espStatus = document.getElementById("espStatus");
const clock = document.getElementById("clock");

const suhu = document.getElementById("suhu");
const kelembapan = document.getElementById("kelembapan");
const soil = document.getElementById("soil");
const duration = document.getElementById("duration");
const status = document.getElementById("status");

const notif = document.getElementById("notif");
const buzzerStatus = document.getElementById("buzzerStatus");

const popup = document.getElementById("popup");
const popupText = document.getElementById("popupText");

let alarmOff = false;
let lastUpdate = Date.now();
let popupShown = false;

// ================= JAM =================

setInterval(() => {
  const now = new Date();

  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");

  clock.innerText = `${h}:${m}:${s}`;
}, 1000);

// ================= STATUS ESP32 =================

onValue(ref(db, "sensor/ip"), (snap) => {
  if (snap.exists() && snap.val() !== "") {
    wifiIcon.className = "wifi-icon wifi-online";
    espStatus.innerText = "ESP32 Online";
    espStatus.className = "esp-status esp-online";
  } else {
    wifiIcon.className = "wifi-icon wifi-offline";
    espStatus.innerText = "ESP32 Offline";
    espStatus.className = "esp-status esp-offline";
  }
});

// ================= DATA SENSOR =================

onValue(ref(db, "sensor"), (snap) => {
  lastUpdate = Date.now();

  const data = snap.val();

  if (!data) return;

  const suhuValue = Number(data.suhu || 0);
  const rhValue = Number(data.kelembapan || 0);
  const soilValue = Number(data.soil || 0);

  suhu.innerText = suhuValue.toFixed(1) + " °C";
  kelembapan.innerText = rhValue.toFixed(1) + " %";
  soil.innerText = soilValue + " %";

  const durationValue = Number(data.duration || 0);

  const jam = Math.floor(durationValue / 60);
  const menit = durationValue % 60;

  duration.innerText = `${String(jam).padStart(2, "0")}h ${String(menit).padStart(2, "0")}m`;

  // ================= STATUS DARI ESP32 =================

  const kondisi = data.kondisi || "Heating";

  status.innerText = kondisi;

  // ================= NOTIFIKASI =================

  if (kondisi === "Heating") {
    popupShown = false;

    notif.innerHTML = '<i class="bi bi-fire"></i> Pemanasan Oven';

    notif.className = "notif aman";
  } else if (kondisi === "Optimal") {
    popupShown = false;

    notif.innerHTML = '<i class="bi bi-check-circle-fill"></i> Kondisi Optimal';

    notif.className = "notif aman";
  } else if (kondisi === "Ready Check") {
    popupShown = false;

    notif.innerHTML = '<i class="bi bi-search"></i> Produk siap diperiksa';

    notif.className = "notif aman";
  } else if (kondisi === "Done") {
    popupShown = false;

    notif.innerHTML = '<i class="bi bi-check2-all"></i> Pengeringan Selesai';

    notif.className = "notif aman";
  } else if (kondisi === "Warning") {
    notif.innerHTML =
      '<i class="bi bi-exclamation-triangle-fill"></i> Kondisi Warning Terdeteksi';

    notif.className = "notif warning";

    if (!alarmOff && !popupShown) {
      popup.classList.remove("hidden");
      popupText.innerHTML = "WARNING!";
      popupShown = true;
    }
  } else if (kondisi === "Danger") {
    notif.innerHTML =
      '<i class="bi bi-exclamation-octagon-fill"></i> Kondisi Bahaya Terdeteksi';

    notif.className = "notif bahaya";

    if (!alarmOff && !popupShown) {
      popup.classList.remove("hidden");
      popupText.innerHTML = "DANGER!";
      popupShown = true;
    }
  }
});

// ================= STATUS BUZZER =================

onValue(ref(db, "control/buzzerOff"), (snap) => {
  alarmOff = snap.val() === true;

  if (alarmOff) {
    buzzerStatus.innerText = "Alarm: OFF";
  } else {
    buzzerStatus.innerText = "Alarm: ON";
  }
});

// ================= TOMBOL MULAI =================

window.mulaiPengeringan = function () {
  set(ref(db, "control/startDrying"), true);

  alert("Timer pengeringan dimulai.");
};

window.stopPengeringan = function () {
  set(ref(db, "control/startDrying"), false);
};

// ================= MATIKAN ALARM =================

window.matikanBuzzer = function () {
  set(ref(db, "control/buzzerOff"), true);

  popup.classList.add("hidden");

  popupShown = true;
};

// ================= INTERNET USER =================

setInterval(() => {
  if (!navigator.onLine) {
    wifiIcon.className = "wifi-icon wifi-offline";
  }
}, 3000);

// ================= AUTO OFFLINE =================

setInterval(() => {
  const diff = Date.now() - lastUpdate;

  if (diff > 10000) {
    espStatus.innerText = "ESP32 Offline";
    espStatus.className = "esp-status esp-offline";
    wifiIcon.className = "wifi-icon wifi-offline";
  }
}, 2000);
