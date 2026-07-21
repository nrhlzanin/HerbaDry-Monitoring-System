/* ==========================================================
   HERBADRY MONITORING SYSTEM
   IoT-Based Herbal Drying Monitoring Dashboard
========================================================== */

/* ==========================================================
   FIREBASE IMPORT
========================================================== */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
  getDatabase,
  ref,
  onValue,
  set,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

/* ==========================================================
   FIREBASE CONFIG
========================================================== */

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

/* ==========================================================
   HTML ELEMENT
========================================================== */

// HEADER

const wifiIcon = document.getElementById("wifiIcon");

const espStatus = document.getElementById("espStatus");

const clock = document.getElementById("clock");

// SENSOR CARD

const suhu = document.getElementById("suhu");

const kelembapan = document.getElementById("kelembapan");

const moisture =
document.getElementById("moisture");

// STATUS

const status = document.getElementById("status");

const gasStatus = document.getElementById("gasStatus");

// NOTIFICATION

const notif = document.getElementById("notif");

// INFORMATION

const ipText = document.getElementById("ip");

const lastUpdateText = document.getElementById("lastUpdate");

const alarmStatus = document.getElementById("alarmStatus");

/* ==========================================================
   GLOBAL VARIABLE
========================================================== */

let lastFirebaseUpdate = Date.now();

let sensorChart = null;

/* ==========================================================
   DIGITAL CLOCK
========================================================== */

function updateClock() {
  if (!clock) return;

  let now = new Date();

  let jam = String(now.getHours()).padStart(2, "0");

  let menit = String(now.getMinutes()).padStart(2, "0");

  let detik = String(now.getSeconds()).padStart(2, "0");

  clock.innerHTML = `${jam}:${menit}:${detik}`;
}

updateClock();

setInterval(updateClock, 1000);

/* ==========================================================
   ESP32 CONNECTION STATUS
========================================================== */

onValue(
  ref(db, "sensor/ip"),

  (snapshot) => {
    if (snapshot.exists() && snapshot.val() !== "") {
      // ONLINE

      if (wifiIcon) {
        wifiIcon.classList.remove("wifi-offline");

        wifiIcon.classList.add("wifi-online");
      }

      if (espStatus) {
        espStatus.innerHTML = "ESP32 Online";

        espStatus.className = "esp-status online";
      }

      if (ipText) {
        ipText.innerHTML = snapshot.val();
      }
    } else {
      // OFFLINE

      if (wifiIcon) {
        wifiIcon.classList.remove("wifi-online");

        wifiIcon.classList.add("wifi-offline");
      }

      if (espStatus) {
        espStatus.innerHTML = "ESP32 Offline";

        espStatus.className = "esp-status offline";
      }

      if (ipText) {
        ipText.innerHTML = "-";
      }
    }
  },
);

/* ==========================================================
   SENSOR DATA FIREBASE
========================================================== */

onValue(
  ref(db, "sensor"),

  (snapshot) => {
    if (!snapshot.exists()) return;

    const data = snapshot.val();

    lastFirebaseUpdate = Date.now();

    /*
      DATA DARI ESP32:

      sensor/
          suhu
          kelembapan
          moisture
          kondisi
          gas
          ip

    */

    let temp = Number(data.suhu || 0);

    let hum = Number(data.kelembapan || 0);

    let moist = Number(data.moisture || 0);

    let gas = data.gas || "OFF";

    let kondisi = data.kondisi || "STARTING";

    // UPDATE SENSOR CARD

    if (suhu) {
      suhu.innerHTML = temp.toFixed(1) + " °C";
    }

    if (kelembapan) {
      kelembapan.innerHTML = hum.toFixed(1) + " %";
    }

    if (moisture) {
      moisture.innerHTML = moist.toFixed(0) + " %";
    }

    // UPDATE WAKTU UPDATE

    if (lastUpdateText) {
      let now = new Date();

      lastUpdateText.innerHTML =
        "Last Update : " + now.toLocaleTimeString("id-ID");
    }

    updateChart(temp, hum, moist);
    updateStatus(kondisi);

    updateGas(gas);
  },
);
/* ==========================================================
   STATUS SYSTEM UPDATE
========================================================== */

function updateStatus(kondisi) {
  if (!status) return;

  // reset class

  status.className = "";

  switch (kondisi) {
    case "STANDBY":

    status.innerHTML = "⏸ STANDBY";

    status.classList.add("status-standby");

    if (notif) {

        notif.innerHTML = "Menunggu suhu oven mencapai 30°C";

        notif.className = "notif aman";

    }
    break;
    case "HEATING":
      status.innerHTML = "🔥 HEATING";

      status.classList.add("status-heating");

      if (notif) {
        notif.innerHTML = "Oven sedang melakukan pemanasan";

        notif.className = "notif aman";
      }

      break;

    case "OPTIMAL":
      status.innerHTML = "✅ OPTIMAL";

      status.classList.add("status-optimal");

      if (notif) {
        notif.innerHTML = "Kondisi pengeringan optimal";

        notif.className = "notif aman";
      }

      break;

    case "READY":
      status.innerHTML = "✔ READY";

      status.classList.add("status-ready");

      if (notif) {
        notif.innerHTML = "Bahan siap diperiksa";

        notif.className = "notif aman";
      }

      break;

    case "WARNING":
      status.innerHTML = "⚠ WARNING";

      status.classList.add("status-warning");

      if (notif) {
        notif.innerHTML = "Suhu atau kelembapan tidak aman";

        notif.className = "notif warning";
      }

      break;

    case "SENSOR ERROR":
      status.innerHTML = "❌ SENSOR ERROR";

      status.classList.add("status-warning");

      if (notif) {
        notif.innerHTML = "Sensor mengalami masalah";

        notif.className = "notif warning";
      }

      break;

    default:
      status.innerHTML = kondisi;
  }
}

/* ==========================================================
   GAS STATUS
========================================================== */

function updateGas(gas) {
  if (!gasStatus) return;

  if (gas === "ON") {
    gasStatus.innerHTML = "🟢 GAS ON";

    gasStatus.className = "gas-on";
  } else {
    gasStatus.innerHTML = "🔴 GAS OFF";

    gasStatus.className = "gas-off";
  }
}

/* ==========================================================
   CHART.JS REALTIME SENSOR
========================================================== */

const chartCanvas = document.getElementById("sensorChart");

if (chartCanvas) {
  const ctx = chartCanvas.getContext("2d");

  sensorChart = new Chart(ctx, {
    type: "line",

    data: {
      labels: [],

      datasets: [
        {
          label: "Suhu °C",

          data: [],

          borderWidth: 2,

          tension: 0.3,
        },

        {
          label: "Kelembapan %",

          data: [],

          borderWidth: 2,

          tension: 0.3,
        },

        {
          label: "Moisture %",

          data: [],

          borderWidth: 2,

          tension: 0.3,
        },
      ],
    },

    options: {
      responsive: true,

      maintainAspectRatio: false,

      interaction: {
        mode: "index",

        intersect: false,
      },

      plugins: {
        legend: {
          display: true,
        },
      },

      scales: {
        x: {
          title: {
            display: true,

            text: "Waktu",
          },
        },

        y: {
          beginAtZero: true,

          title: {
            display: true,

            text: "Nilai Sensor",
          },
        },
      },
    },
  });
}

/* ==========================================================
   UPDATE CHART FUNCTION
========================================================== */

function updateChart(temp, hum, moist) {
  if (!sensorChart) return;

  let now = new Date();

  let label =
    now.getHours().toString().padStart(2, "0") +
    ":" +
    now.getMinutes().toString().padStart(2, "0") +
    ":" +
    now.getSeconds().toString().padStart(2, "0");

  sensorChart.data.labels.push(label);

  sensorChart.data.datasets[0].data.push(temp);

  sensorChart.data.datasets[1].data.push(hum);

  sensorChart.data.datasets[2].data.push(moist);

  // simpan maksimal 30 data

  const maxData = 30;

  if (sensorChart.data.labels.length > maxData) {
    sensorChart.data.labels.shift();

    sensorChart.data.datasets.forEach((dataset) => {
      dataset.data.shift();
    });
  }

  sensorChart.update();
}

/* ==========================================================
   INTERNET CONNECTION CHECK
========================================================== */

function checkInternet() {
  if (!wifiIcon) return;

  if (navigator.onLine) {
    wifiIcon.classList.remove("wifi-offline");

    wifiIcon.classList.add("wifi-online");
  } else {
    wifiIcon.classList.remove("wifi-online");

    wifiIcon.classList.add("wifi-offline");
  }
}

checkInternet();

setInterval(checkInternet, 5000);

/* ==========================================================
   ESP32 OFFLINE DETECTOR
========================================================== */

setInterval(() => {
  let selisih = Date.now() - lastFirebaseUpdate;

  // jika tidak menerima data
  // lebih dari 15 detik

  if (selisih > 30000) {
    if (espStatus) {
      espStatus.innerHTML = "ESP32 Offline";

      espStatus.className = "esp-status offline";
    }
  }
}, 5000);

/* ==========================================================
   CARD ANIMATION
========================================================== */

const cards = document.querySelectorAll(".card");

cards.forEach((card, index) => {
  card.style.opacity = "0";

  card.style.transform = "translateY(20px)";

  setTimeout(
    () => {
      card.style.transition = "0.5s";

      card.style.opacity = "1";

      card.style.transform = "translateY(0)";
    },

    index * 150,
  );
});

/* ==========================================================
   DASHBOARD READY
========================================================== */

window.addEventListener(
  "load",

  () => {
    console.log("=================================");

    console.log(" HerbaDry Monitoring Dashboard ");

    console.log(" Firebase Connected ");

    console.log(" Waiting ESP32 Data...");

    console.log("=================================");
  },
);

/* ==========================================================
   KEEP ALIVE
========================================================== */

setInterval(() => {
  console.log("Dashboard Active");
}, 60000);
