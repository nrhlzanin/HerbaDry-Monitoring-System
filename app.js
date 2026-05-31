import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  set
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// ================= FIREBASE =================
const firebaseConfig = {
  apiKey: "AIzaSyAdXM0egIpInr5bt3bMsR3f6Nl09lGwzQs",
  authDomain: "herbadry-monitoring.firebaseapp.com",
  databaseURL: "https://herbadry-monitoring-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "herbadry-monitoring",
  storageBucket: "herbadry-monitoring.firebasestorage.app",
  messagingSenderId: "714369778562",
  appId: "1:714369778562:web:3ea942ef318bd5f7d4c59b",
  measurementId: "G-BX2N20LC0W"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ================= HEADER =================
const wifiIcon = document.getElementById("wifiIcon");
const espStatus = document.getElementById("espStatus");
const clock = document.getElementById("clock");

// ================= ELEMENT =================
const suhu = document.getElementById("suhu");
const kelembapan = document.getElementById("kelembapan");
const soil = document.getElementById("soil");
const status = document.getElementById("status");

const notif = document.getElementById("notif");
const buzzerStatus = document.getElementById("buzzerStatus");

const popup = document.getElementById("popup");
const popupText = document.getElementById("popupText");

// ================= JAM =================
setInterval(() => {
  const now = new Date();

  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");

  clock.innerText = `${h}:${m}:${s}`;
}, 1000);

// ================= STATUS ESP =================
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

// ================= SENSOR =================
onValue(ref(db, "sensor"), (snap) => {

  const data = snap.val();
  if (!data) return;

  suhu.innerText = Number(data.suhu).toFixed(1) + " °C";
  kelembapan.innerText = Number(data.kelembapan).toFixed(1) + " %";
  soil.innerText = data.soil + " %";
  status.innerText = data.kondisi;

  // default popup hide
  popup.classList.add("hidden");

  // ================= STATUS BAR =================

  if (data.kondisi === "Heating") {

    notif.innerHTML =
      '<i class="bi bi-fire"></i> Pemanasan Oven...';

    notif.className = "notif aman";
  }

  else if (data.kondisi === "Optimal") {

    notif.innerHTML =
      '<i class="bi bi-check-circle-fill"></i> Suhu Optimal Tercapai';

    notif.className = "notif aman";
  }

  else if (data.kondisi === "Warning") {

    notif.innerHTML =
      '<i class="bi bi-exclamation-triangle-fill"></i> Suhu Mulai Tinggi';

    notif.className = "notif warning";

    popup.classList.remove("hidden");
    popupText.innerHTML = "WARNING!";
  }

  else {

    notif.innerHTML =
      '<i class="bi bi-exclamation-octagon-fill"></i> Suhu Sangat Tinggi!';

    notif.className = "notif bahaya";

    popup.classList.remove("hidden");
    popupText.innerHTML = "DANGER!";
  }

  // jika moisture selesai
  if (data.soil < 10) {
    notif.innerHTML =
      '<i class="bi bi-check2-square"></i> Pengeringan Selesai';
    notif.className = "notif aman";
  }

});

// ================= STATUS ALARM =================
onValue(ref(db, "control/buzzerOff"), (snap) => {

  if (snap.val() === true) {
    buzzerStatus.innerText = "Alarm: OFF";
  } else {
    buzzerStatus.innerText = "Alarm: ON";
  }

});

// ================= BUTTON =================
window.matikanBuzzer = function () {
  set(ref(db, "control/buzzerOff"), true);
  popup.classList.add("hidden");
};

// ================= INTERNET USER =================
setInterval(() => {
  if (!navigator.onLine) {
    wifiIcon.className = "wifi-icon wifi-offline";
  }
}, 3000);