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
   FIREBASE CONFIGURATION
========================================================== */

const firebaseConfig = {
  apiKey: "AIzaSyAdXM0egInR5bt3bMsR3f6Nl09lGwzQs",

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

const wifiIcon = document.getElementById("wifiIcon");

const espStatus = document.getElementById("espStatus");

const clock = document.getElementById("clock");

const suhu = document.getElementById("suhu");

const kelembapan = document.getElementById("kelembapan");

const moisture = document.getElementById("moisture");

const status = document.getElementById("status");

const gasStatus = document.getElementById("gasStatus");

const valveStatus = document.getElementById("valveStatus");

const duration = document.getElementById("duration");

const dryingButton = document.getElementById("dryingButton");

const dryingControlStatus = document.getElementById("dryingControlStatus");

const notif = document.getElementById("notif");

const ipText = document.getElementById("ip");

const lastUpdateText = document.getElementById("lastUpdate");

const alarmStatus = document.getElementById("alarmStatus");

const firebaseStatus = document.getElementById("firebaseStatus");

/* ==========================================================
   GLOBAL VARIABLE
========================================================== */

let lastFirebaseUpdate = 0;

let sensorChart = null;

let dryingStarted = false;

let dryingFinished = false;

let dryingStartTime = 0;

let dryingStopTime = 0;

let durationTimer = null;

/* ==========================================================
   DIGITAL CLOCK
========================================================== */

function updateClock() {
  if (!clock) {
    return;
  }

  const now = new Date();

  const jam = String(now.getHours()).padStart(2, "0");

  const menit = String(now.getMinutes()).padStart(2, "0");

  const detik = String(now.getSeconds()).padStart(2, "0");

  clock.textContent = `${jam}:${menit}:${detik}`;
}

updateClock();

setInterval(updateClock, 1000);

/* ==========================================================
   HELPER
========================================================== */

function toNumber(value) {
  const number = Number(value);

  return Number.isFinite(number) ? number : null;
}

/* ==========================================================
   FORMAT DURASI
========================================================== */

function formatDuration(value) {
  if (value === null || value === undefined || value === "") {
    return "00:00:00";
  }

  if (typeof value === "string" && value.includes(":")) {
    return value;
  }

  const totalSeconds = Math.max(0, Math.floor(Number(value)));

  if (!Number.isFinite(totalSeconds)) {
    return "00:00:00";
  }

  const hours = Math.floor(totalSeconds / 3600);

  const minutes = Math.floor((totalSeconds % 3600) / 60);

  const seconds = totalSeconds % 60;

  return [
    String(hours).padStart(2, "0"),

    String(minutes).padStart(2, "0"),

    String(seconds).padStart(2, "0"),
  ].join(":");
}

/* ==========================================================
   UPDATE TIMER
========================================================== */

function updateDurationDisplay() {
  if (!duration) {
    return;
  }

  if (dryingStartTime <= 0) {
    duration.textContent = "00:00:00";

    return;
  }

  let endTime = Date.now();

  if (dryingFinished && dryingStopTime > 0) {
    endTime = dryingStopTime;
  }

  const elapsedSeconds = Math.max(
    0,
    Math.floor((endTime - dryingStartTime) / 1000),
  );

  duration.textContent = formatDuration(elapsedSeconds);
}

/* ==========================================================
   TIMER
========================================================== */

function startDurationTimer() {
  if (durationTimer) {
    clearInterval(durationTimer);
  }

  updateDurationDisplay();

  durationTimer = setInterval(() => {
    if (dryingStarted && !dryingFinished) {
      updateDurationDisplay();
    }
  }, 1000);
}

function stopDurationTimer() {
  if (durationTimer) {
    clearInterval(durationTimer);

    durationTimer = null;
  }

  updateDurationDisplay();
}

/* ==========================================================
   FORMAT WAKTU
========================================================== */

function getCurrentTime() {
  return new Date().toLocaleTimeString("id-ID", {
    hour: "2-digit",

    minute: "2-digit",

    second: "2-digit",
  });
}

/* ==========================================================
   ESP32 STATUS
========================================================== */

function setEspStatus(isOnline) {
  if (espStatus) {
    if (isOnline) {
      espStatus.textContent = "ESP32 Online";

      espStatus.className = "esp-status online";
    } else {
      espStatus.textContent = "ESP32 Offline";

      espStatus.className = "esp-status offline";
    }
  }

  if (wifiIcon) {
    if (isOnline) {
      wifiIcon.classList.remove("wifi-offline");

      wifiIcon.classList.add("wifi-online");
    } else {
      wifiIcon.classList.remove("wifi-online");

      wifiIcon.classList.add("wifi-offline");
    }
  }
}

/* ==========================================================
   FIREBASE SENSOR
========================================================== */

onValue(ref(db, "sensor"), (snapshot) => {
  if (!snapshot.exists()) {
    setEspStatus(false);

    if (firebaseStatus) {
      firebaseStatus.textContent = "No Data";
    }

    if (ipText) {
      ipText.textContent = "-";
    }

    return;
  }

  const data = snapshot.val();

  lastFirebaseUpdate = Date.now();

  setEspStatus(true);

  if (ipText) {
    ipText.textContent = data.ip || "-";
  }

  /* SENSOR */

  const temp = toNumber(data.suhu);

  const hum = toNumber(data.kelembapan);

  const moist = toNumber(data.moisture ?? data.soil);

  /* STATUS */

  const gas = String(data.gas || "OFF")
    .trim()
    .toUpperCase();

  const kondisi = String(data.kondisi || "STANDBY")
    .trim()
    .toUpperCase();

  /* SUHU */

  if (suhu && temp !== null) {
    suhu.textContent = `${temp.toFixed(1)} °C`;
  }

  /* KELEMBAPAN */

  if (kelembapan && hum !== null) {
    kelembapan.textContent = `${hum.toFixed(1)} %`;
  }

  /* MOISTURE */

  if (moisture && moist !== null) {
    moisture.textContent = `${moist.toFixed(0)} %`;
  }

  /* DURASI DARI ESP32 */

  if (data.duration !== undefined) {
    /*
         Jika proses selesai,
         gunakan durasi final ESP32.
      */

    if (dryingFinished) {
      duration.textContent = formatDuration(data.duration);
    }
  }

  if (lastUpdateText) {
    lastUpdateText.textContent = getCurrentTime();
  }

  if (firebaseStatus) {
    firebaseStatus.textContent = "Connected";
  }

  updateStatus(kondisi);

  updateGas(gas);

  if (temp !== null && hum !== null && moist !== null) {
    updateChart(temp, hum, moist);
  }
});

/* ==========================================================
   CONTROL START / STOP
========================================================== */

onValue(ref(db, "control/startDrying"), (snapshot) => {
  const value = snapshot.val();

  dryingStarted = value === true || value === "true" || value === 1;

  if (dryingStarted) {
    dryingFinished = false;

    updateDryingButton();

    startDurationTimer();

    if (dryingControlStatus) {
      dryingControlStatus.textContent = "Pengeringan sedang berlangsung";
    }
  } else {
    updateDryingButton();

    if (dryingFinished) {
      stopDurationTimer();

      if (dryingControlStatus) {
        dryingControlStatus.textContent = "Proses pengeringan selesai";
      }
    } else {
      stopDurationTimer();

      if (dryingControlStatus) {
        dryingControlStatus.textContent = "Pengeringan belum dimulai";
      }
    }
  }
});

/* ==========================================================
   START TIME
========================================================== */

onValue(ref(db, "control/startTime"), (snapshot) => {
  const value = toNumber(snapshot.val());

  if (value !== null && value > 0) {
    dryingStartTime = value;

    dryingFinished = false;

    updateDurationDisplay();

    if (dryingStarted) {
      startDurationTimer();
    }
  }
});

/* ==========================================================
   TOMBOL START / STOP
========================================================== */

if (dryingButton) {
  dryingButton.addEventListener("click", async () => {
    try {
      if (!dryingStarted) {
        dryingFinished = false;

        dryingStopTime = 0;

        /*
             ESP32 akan membuat
             startTime resmi.
          */

        await set(ref(db, "control/startDrying"), true);

        console.log("Perintah START dikirim");
      } else {
        /*
             STOP MANUAL
          */

        dryingStopTime = Date.now();

        dryingFinished = true;

        await set(ref(db, "control/startDrying"), false);

        console.log("Perintah STOP dikirim");
      }
    } catch (error) {
      console.error("Gagal mengubah kontrol:", error);

      alert("Gagal mengirim perintah ke ESP32");
    }
  });
}

/* ==========================================================
   UPDATE TOMBOL
========================================================== */

function updateDryingButton() {
  if (!dryingButton) {
    return;
  }

  if (dryingStarted) {
    dryingButton.innerHTML = '<i class="fas fa-stop"></i> Hentikan Pengeringan';

    dryingButton.className = "drying-button stop";
  } else {
    dryingButton.innerHTML = '<i class="fas fa-play"></i> Mulai Pengeringan';

    dryingButton.className = "drying-button start";
  }
}

/* ==========================================================
   UPDATE STATUS
========================================================== */

function updateStatus(kondisi) {
  if (!status) {
    return;
  }

  status.className = "status-text";

  if (alarmStatus) {
    alarmStatus.textContent = "Normal";
  }

  switch (kondisi) {
    case "STANDBY":
      status.textContent = "⏸ STANDBY";

      status.classList.add("status-standby");

      if (notif) {
        notif.textContent = "Menunggu proses pengeringan dimulai";

        notif.className = "notif aman";
      }

      break;

    case "HEATING":
      status.textContent = "🔥 HEATING";

      status.classList.add("status-heating");

      if (notif) {
        notif.textContent = "Oven sedang melakukan pemanasan";

        notif.className = "notif aman";
      }

      break;

    case "OPTIMAL":
      status.textContent = "✅ OPTIMAL";

      status.classList.add("status-optimal");

      if (notif) {
        notif.textContent = "Kondisi pengeringan optimal";

        notif.className = "notif aman";
      }

      break;

    case "READY":
      status.textContent = "✔ READY";

      status.classList.add("status-ready");

      if (notif) {
        notif.textContent = "Bahan siap diperiksa";

        notif.className = "notif aman";
      }

      break;

    case "WARNING":
      status.textContent = "⚠ WARNING";

      status.classList.add("status-warning");

      if (notif) {
        notif.textContent =
          "Suhu atau kelembapan berada pada kondisi peringatan";

        notif.className = "notif warning";
      }

      if (alarmStatus) {
        alarmStatus.textContent = "Warning";
      }

      break;

    case "DANGER":
      status.textContent = "🚨 DANGER";

      status.classList.add("status-danger");

      if (notif) {
        notif.textContent = "Kondisi berbahaya! Gas dimatikan secara otomatis.";

        notif.className = "notif danger";
      }

      if (alarmStatus) {
        alarmStatus.textContent = "Danger";
      }

      break;

    case "DONE":
      status.textContent = "✔ DONE";

      status.classList.add("status-ready");

      dryingFinished = true;

      dryingStarted = false;

      stopDurationTimer();

      if (notif) {
        notif.textContent = "Proses pengeringan selesai";

        notif.className = "notif aman";
      }

      if (dryingControlStatus) {
        dryingControlStatus.textContent = "Proses pengeringan selesai";
      }

      break;

    case "SENSOR ERROR":
      status.textContent = "❌ SENSOR ERROR";

      status.classList.add("status-warning");

      if (notif) {
        notif.textContent = "Sensor mengalami masalah";

        notif.className = "notif warning";
      }

      if (alarmStatus) {
        alarmStatus.textContent = "Sensor Error";
      }

      break;

    default:
      status.textContent = kondisi;

      if (notif) {
        notif.textContent = "Sistem sedang mengirimkan data";

        notif.className = "notif";
      }
  }
}

/* ==========================================================
   GAS AND VALVE
========================================================== */

function updateGas(gas) {
  if (!gasStatus) {
    return;
  }

  if (gas === "ON") {
    gasStatus.textContent = "🟢 GAS ON";

    gasStatus.className = "gas-on";

    if (valveStatus) {
      valveStatus.textContent = "Katup Terbuka";

      valveStatus.className = "valve-status valve-open";
    }

    return;
  }

  gasStatus.textContent = "🔴 GAS OFF";

  gasStatus.className = "gas-off";

  if (valveStatus) {
    valveStatus.textContent = "Katup Tertutup";

    valveStatus.className = "valve-status valve-closed";
  }
}

/* ==========================================================
   CHART
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
          label: "Kadar Air %",

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

          suggestedMax: 100,

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
   UPDATE CHART
========================================================== */

function updateChart(temp, hum, moist) {
  if (!sensorChart) {
    return;
  }

  const now = new Date();

  const label = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",

    minute: "2-digit",

    second: "2-digit",
  });

  sensorChart.data.labels.push(label);

  sensorChart.data.datasets[0].data.push(temp);

  sensorChart.data.datasets[1].data.push(hum);

  sensorChart.data.datasets[2].data.push(moist);

  const maxData = 30;

  if (sensorChart.data.labels.length > maxData) {
    sensorChart.data.labels.shift();

    sensorChart.data.datasets.forEach((dataset) => {
      dataset.data.shift();
    });
  }

  sensorChart.update("none");
}

/* ==========================================================
   INTERNET CHECK
========================================================== */

function checkInternet() {
  if (!wifiIcon) {
    return;
  }

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
  if (lastFirebaseUpdate === 0) {
    return;
  }

  const selisih = Date.now() - lastFirebaseUpdate;

  if (selisih > 30000) {
    setEspStatus(false);

    if (firebaseStatus) {
      firebaseStatus.textContent = "Disconnected";
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

  setTimeout(() => {
    card.style.transition = "0.5s";

    card.style.opacity = "1";

    card.style.transform = "translateY(0)";
  }, index * 150);
});

/* ==========================================================
   DASHBOARD READY
========================================================== */

window.addEventListener("load", () => {
  console.log("=================================");

  console.log(" HerbaDry Monitoring Dashboard ");

  console.log(" Firebase Connected ");

  console.log(" Waiting ESP32 Data... ");

  console.log("=================================");
});
