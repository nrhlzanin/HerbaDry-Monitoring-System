/* ==========================================================
   HERBADRY MONITORING SYSTEM
   LOG DATA JAVASCRIPT
========================================================== */

/* ==========================================================
   FIREBASE IMPORT
========================================================== */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
  getDatabase,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

/* ==========================================================
   FIREBASE CONFIG
========================================================== */

const firebaseConfig = {
  apiKey: "AIzaSyAdXM0egIpInR5bt3bMsR3f6Nl09lGwzQs",

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

const clock = document.getElementById("clock");

const firebaseStatus = document.getElementById("firebaseStatus");

const limitData = document.getElementById("limitData");

const filterStatus = document.getElementById("filterStatus");

const refreshButton = document.getElementById("refreshButton");

const logTableBody = document.getElementById("logTableBody");

const dataInfo = document.getElementById("dataInfo");

const totalData = document.getElementById("totalData");

const lastTemperature = document.getElementById("lastTemperature");

const lastHumidity = document.getElementById("lastHumidity");

const lastMoisture = document.getElementById("lastMoisture");

/* ==========================================================
   GLOBAL
========================================================== */

let allLogs = [];

let logChart = null;

/* ==========================================================
   CLOCK
========================================================== */

function updateClock() {
  if (!clock) {
    return;
  }

  const now = new Date();

  clock.textContent = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",

    minute: "2-digit",

    second: "2-digit",
  });
}

updateClock();

setInterval(updateClock, 1000);

/* ==========================================================
   NUMBER
========================================================== */

function toNumber(value) {
  const number = Number(value);

  return Number.isFinite(number) ? number : null;
}

/* ==========================================================
   DURATION
========================================================== */

function formatDuration(value) {
  const seconds = toNumber(value);

  if (seconds === null) {
    return "00:00:00";
  }

  const hours = Math.floor(seconds / 3600);

  const minutes = Math.floor((seconds % 3600) / 60);

  const remainingSeconds = Math.floor(seconds % 60);

  return [
    String(hours).padStart(2, "0"),

    String(minutes).padStart(2, "0"),

    String(remainingSeconds).padStart(2, "0"),
  ].join(":");
}

/* ==========================================================
   TIMESTAMP
========================================================== */

function getTimestampDate(timestamp) {
  const value = toNumber(timestamp);

  if (value !== null && value > 100000000000) {
    return new Date(value);
  }

  if (typeof timestamp === "string") {
    const parsed = Date.parse(timestamp);

    if (!Number.isNaN(parsed)) {
      return new Date(parsed);
    }
  }

  return null;
}

function formatTimestamp(timestamp) {
  const date = getTimestampDate(timestamp);

  if (!date) {
    return "-";
  }

  return date.toLocaleString("id-ID", {
    day: "2-digit",

    month: "2-digit",

    year: "numeric",

    hour: "2-digit",

    minute: "2-digit",

    second: "2-digit",
  });
}

function formatChartTimestamp(timestamp) {
  const date = getTimestampDate(timestamp);

  if (!date) {
    return "--";
  }

  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",

    minute: "2-digit",

    second: "2-digit",
  });
}

/* ==========================================================
   SORT TIME
========================================================== */

function getSortTime(item) {
  const date = getTimestampDate(item.timestamp);

  if (date) {
    return date.getTime();
  }

  return 0;
}

/* ==========================================================
   FIREBASE LOG
========================================================== */

onValue(
  ref(db, "logs"),

  (snapshot) => {
    if (!snapshot.exists()) {
      allLogs = [];

      setFirebaseStatus(false);

      applyFilters();

      return;
    }

    const data = snapshot.val();

    allLogs = Object.entries(data).map(([key, value]) => ({
      id: key,

      ...value,
    }));

    allLogs.sort((a, b) => getSortTime(b) - getSortTime(a));

    setFirebaseStatus(true);

    applyFilters();
  },
);

/* ==========================================================
   FILTER
========================================================== */

function applyFilters() {
  const limit = Number(limitData?.value || 50);

  const selectedStatus = filterStatus?.value || "ALL";

  let filteredLogs = [...allLogs];

  if (selectedStatus !== "ALL") {
    filteredLogs = filteredLogs.filter(
      (item) =>
        String(item.kondisi || "")
          .trim()
          .toUpperCase() === selectedStatus,
    );
  }

  const limitedLogs = filteredLogs.slice(0, limit);

  renderTable(limitedLogs);

  updateSummary(limitedLogs);

  updateChart(limitedLogs);
}

/* ==========================================================
   TABLE
========================================================== */

function renderTable(logs) {
  if (!logTableBody) {
    return;
  }

  if (logs.length === 0) {
    showEmptyData("Tidak ada data yang sesuai dengan filter.");

    if (dataInfo) {
      dataInfo.textContent = "0 data";
    }

    return;
  }

  logTableBody.innerHTML = "";

  logs.forEach((item, index) => {
    const suhu = toNumber(item.suhu);

    const kelembapan = toNumber(item.kelembapan);

    const moisture = toNumber(item.moisture ?? item.soil);

    const kondisi = String(item.kondisi || "-")
      .trim()
      .toUpperCase();

    const gas = String(item.gas || "OFF")
      .trim()
      .toUpperCase();

    const duration = formatDuration(item.duration);

    const row = document.createElement("tr");

    row.innerHTML = `
          <td>${index + 1}</td>

          <td>
            ${formatTimestamp(item.timestamp)}
          </td>

          <td>
            ${suhu === null ? "--" : `${suhu.toFixed(1)} °C`}
          </td>

          <td>
            ${kelembapan === null ? "--" : `${kelembapan.toFixed(1)} %`}
          </td>

          <td>
            ${moisture === null ? "--" : `${moisture.toFixed(0)} %`}
          </td>

          <td>
            <span
              class="log-status ${getStatusClass(kondisi)}"
            >
              ${kondisi}
            </span>
          </td>

          <td>
            <span
              class="${gas === "ON" ? "log-gas-on" : "log-gas-off"}"
            >
              ${gas === "ON" ? "🟢 ON / Terbuka" : "🔴 OFF / Tertutup"}
            </span>
          </td>

          <td>
            ${duration}
          </td>
        `;

    logTableBody.appendChild(row);
  });

  if (dataInfo) {
    dataInfo.textContent = `${logs.length} data ditampilkan`;
  }
}

/* ==========================================================
   EMPTY DATA
========================================================== */

function showEmptyData(message) {
  if (!logTableBody) {
    return;
  }

  logTableBody.innerHTML = `
      <tr>
        <td
          colspan="8"
          class="empty-data"
        >
          ${message}
        </td>
      </tr>
    `;
}

/* ==========================================================
   STATUS CLASS
========================================================== */

function getStatusClass(status) {
  switch (status) {
    case "STANDBY":
      return "log-status-standby";

    case "HEATING":
      return "log-status-heating";

    case "READY":
      return "log-status-ready";

    case "OPTIMAL":
      return "log-status-optimal";

    case "WARNING":
      return "log-status-warning";

    case "DANGER":
      return "log-status-danger";

    case "DONE":
      return "log-status-done";

    case "SENSOR ERROR":
      return "log-status-error";

    default:
      return "";
  }
}

/* ==========================================================
   SUMMARY
========================================================== */

function updateSummary(logs) {
  if (totalData) {
    totalData.textContent = logs.length;
  }

  if (logs.length === 0) {
    lastTemperature.textContent = "-- °C";

    lastHumidity.textContent = "-- %";

    lastMoisture.textContent = "-- %";

    return;
  }

  const latest = logs[0];

  const temp = toNumber(latest.suhu);

  const hum = toNumber(latest.kelembapan);

  const moist = toNumber(latest.moisture ?? latest.soil);

  lastTemperature.textContent =
    temp === null ? "-- °C" : `${temp.toFixed(1)} °C`;

  lastHumidity.textContent = hum === null ? "-- %" : `${hum.toFixed(1)} %`;

  lastMoisture.textContent = moist === null ? "-- %" : `${moist.toFixed(0)} %`;
}

/* ==========================================================
   CHART INITIALIZATION
========================================================== */

const chartCanvas = document.getElementById("logChart");

if (chartCanvas) {
  const ctx = chartCanvas.getContext("2d");

  logChart = new Chart(ctx, {
    type: "line",

    data: {
      labels: [],

      datasets: [
        {
          label: "Suhu (°C)",

          data: [],

          borderWidth: 2,

          tension: 0.3,

          fill: false,
        },

        {
          label: "Kelembapan (%)",

          data: [],

          borderWidth: 2,

          tension: 0.3,

          fill: false,
        },

        {
          label: "Kadar Air (%)",

          data: [],

          borderWidth: 2,

          tension: 0.3,

          fill: false,
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
          ticks: {
            maxTicksLimit: 10,
          },
        },

        y: {
          beginAtZero: true,

          suggestedMax: 100,
        },
      },
    },
  });
}

/* ==========================================================
   UPDATE CHART
========================================================== */

function updateChart(logs) {
  if (!logChart) {
    return;
  }

  const chartLogs = [...logs].reverse();

  logChart.data.labels = chartLogs.map((item) =>
    formatChartTimestamp(item.timestamp),
  );

  logChart.data.datasets[0].data = chartLogs.map((item) => toNumber(item.suhu));

  logChart.data.datasets[1].data = chartLogs.map((item) =>
    toNumber(item.kelembapan),
  );

  logChart.data.datasets[2].data = chartLogs.map((item) =>
    toNumber(item.moisture ?? item.soil),
  );

  logChart.update();
}

/* ==========================================================
   FILTER EVENTS
========================================================== */

limitData?.addEventListener("change", applyFilters);

filterStatus?.addEventListener("change", applyFilters);

refreshButton?.addEventListener("click", applyFilters);

/* ==========================================================
   FIREBASE STATUS
========================================================== */

function setFirebaseStatus(connected) {
  if (!firebaseStatus) {
    return;
  }

  if (connected) {
    firebaseStatus.textContent = "Firebase Connected";

    firebaseStatus.className = "esp-status online";
  } else {
    firebaseStatus.textContent = "No Data";

    firebaseStatus.className = "esp-status offline";
  }
}

/* ==========================================================
   INITIAL LOG
========================================================== */

console.log("HerbaDry Log Data Loaded");
