/* ==========================================================
   HERBADRY MONITORING SYSTEM
   IoT-Based Herbal Drying Monitoring
========================================================== */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
    getDatabase,
    ref,
    onValue,
    set
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

    measurementId: "G-BX2N20LC0W"

};

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);

/* ==========================================================
   HTML ELEMENT
========================================================== */

// Header

const wifiIcon = document.getElementById("wifiIcon");
const espStatus = document.getElementById("espStatus");
const clock = document.getElementById("clock");

// Sensor Card

const suhu = document.getElementById("suhu");
const kelembapan = document.getElementById("kelembapan");
const soil = document.getElementById("soil");
const duration = document.getElementById("duration");

// Status

const status = document.getElementById("status");
const gasStatus = document.getElementById("gasStatus");

// Notification

const notif = document.getElementById("notif");

// Information

const lastUpdateText = document.getElementById("lastUpdate");
const ipText = document.getElementById("ip");
const alarmStatus = document.getElementById("alarmStatus");

// Popup

const popup = document.getElementById("popup");
const popupText = document.getElementById("popupText");

/* ==========================================================
   GLOBAL VARIABLE
========================================================== */

let alarmOff = false;

let popupShown = false;

let lastUpdate = Date.now();

// Chart Variable

let sensorChart = null;

/* ==========================================================
   DIGITAL CLOCK
========================================================== */

function updateClock() {

    const now = new Date();

    const h = String(now.getHours()).padStart(2, "0");

    const m = String(now.getMinutes()).padStart(2, "0");

    const s = String(now.getSeconds()).padStart(2, "0");

    clock.innerHTML = `${h}:${m}:${s}`;

}

updateClock();

setInterval(updateClock, 1000);

/* ==========================================================
   ESP32 STATUS
========================================================== */

onValue(ref(db, "sensor/ip"), (snapshot) => {

    if (snapshot.exists() && snapshot.val() !== "") {

        wifiIcon.classList.remove("offline");
        wifiIcon.classList.add("online");

        espStatus.classList.remove("offline");
        espStatus.classList.add("online");

        espStatus.innerHTML = "ESP32 Online";

        ipText.innerHTML = snapshot.val();

    } else {

        wifiIcon.classList.remove("online");
        wifiIcon.classList.add("offline");

        espStatus.classList.remove("online");
        espStatus.classList.add("offline");

        espStatus.innerHTML = "ESP32 Offline";

        ipText.innerHTML = "-";

    }

});

/* ==========================================================
   SENSOR DATA
========================================================== */

onValue(ref(db, "sensor"), (snapshot) => {

    lastUpdate = Date.now();

    if (!snapshot.exists()) return;

    const data = snapshot.val();

    // ==========================
    // Sensor Value
    // ==========================

    const temp = Number(data.suhu || 0);
    const hum = Number(data.kelembapan || 0);
    const moisture = Number(data.soil || 0);
    const dryingTime = Number(data.duration || 0);

    updateChart(temp, hum, moisture);

    suhu.innerHTML = temp.toFixed(1) + " °C";
    kelembapan.innerHTML = hum.toFixed(1) + " %";
    soil.innerHTML = moisture + " %";

    const jam = Math.floor(dryingTime / 60);
    const menit = dryingTime % 60;

    duration.innerHTML =
        String(jam).padStart(2, "0") +
        "h " +
        String(menit).padStart(2, "0") +
        "m";

    // ==========================
    // Status Sistem
    // ==========================

    const kondisi = data.kondisi || "Heating";

    status.innerHTML = kondisi;

    status.className = "";

    switch (kondisi) {

        case "Heating":

            status.classList.add("status-heating");

            notif.innerHTML =
                "🔥 Oven sedang melakukan pemanasan.";

            notif.className = "notif aman";

            popup.classList.add("hidden");
            popupShown = false;

            break;

        case "Ready Check":

            status.classList.add("status-ready");

            notif.innerHTML =
                "🔍 Produk siap dilakukan pemeriksaan.";

            notif.className = "notif aman";

            popup.classList.add("hidden");
            popupShown = false;

            break;

        case "Optimal":

            status.classList.add("status-optimal");

            notif.innerHTML =
                "✅ Kondisi pengeringan optimal.";

            notif.className = "notif aman";

            popup.classList.add("hidden");
            popupShown = false;

            break;

        case "Done":

            status.classList.add("status-done");

            notif.innerHTML =
                "🎉 Proses pengeringan selesai.";

            notif.className = "notif aman";

            popup.classList.add("hidden");
            popupShown = false;

            break;

        case "Warning":

            status.classList.add("status-warning");

            notif.innerHTML =
                "⚠ Warning! Suhu atau kelembapan mulai keluar dari batas.";

            notif.className = "notif warning";

            if (!alarmOff && !popupShown) {

                popup.classList.remove("hidden");

                popupText.innerHTML = "WARNING";

                popupShown = true;

            }

            break;

        case "Danger":

            status.classList.add("status-danger");

            notif.innerHTML =
                "🚨 Danger! Sistem mendeteksi kondisi berbahaya.";

            notif.className = "notif bahaya";

            if (!alarmOff && !popupShown) {

                popup.classList.remove("hidden");

                popupText.innerHTML = "DANGER";

                popupShown = true;

            }

            break;

        default:

            status.classList.add("status-heating");

            notif.innerHTML = "Menunggu data sensor...";

            notif.className = "notif aman";

    }

    // ==========================
    // Gas Valve Status
    // ==========================

    if (gasStatus) {

        if (data.gas === true || data.gas === "ON") {

            gasStatus.innerHTML = "🟢 Gas ON";

            gasStatus.className = "gas-on";

        } else {

            gasStatus.innerHTML = "🔴 Gas OFF";

            gasStatus.className = "gas-off";

        }

    }

    // ==========================
    // Last Update
    // ==========================

    if (lastUpdateText) {

        const now = new Date();

        lastUpdateText.innerHTML =
            now.toLocaleDateString("id-ID") +
            " " +
            now.toLocaleTimeString("id-ID");

    }

});

/* ==========================================================
   BUZZER STATUS
========================================================== */

onValue(ref(db, "control/buzzerOff"), (snapshot) => {

    alarmOff = snapshot.val() === true;

    if (alarmStatus) {

        if (alarmOff) {

            alarmStatus.innerHTML = "🔕 Alarm OFF";

        } else {

            alarmStatus.innerHTML = "🔔 Alarm ON";

        }

    }

});

/* ==========================================================
   CHART.JS
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
                    label: "Suhu (°C)",
                    data: [],
                    borderWidth: 2,
                    tension: 0.35,
                    fill: false
                },

                {
                    label: "Kelembapan (%)",
                    data: [],
                    borderWidth: 2,
                    tension: 0.35,
                    fill: false
                },

                {
                    label: "Moisture (%)",
                    data: [],
                    borderWidth: 2,
                    tension: 0.35,
                    fill: false
                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            interaction: {
                mode: "index",
                intersect: false
            },

            plugins: {

                legend: {
                    display: true
                }

            },

            scales: {

                x: {

                    title: {

                        display: true,

                        text: "Waktu"

                    }

                },

                y: {

                    beginAtZero: true,

                    title: {

                        display: true,

                        text: "Nilai Sensor"

                    }

                }

            }

        }

    });

}

/* ==========================================================
   UPDATE CHART
========================================================== */

function updateChart(temp, hum, moisture) {

    if (!sensorChart) return;

    const now = new Date();

    const label =
        now.getHours().toString().padStart(2, "0") +
        ":" +
        now.getMinutes().toString().padStart(2, "0") +
        ":" +
        now.getSeconds().toString().padStart(2, "0");

    sensorChart.data.labels.push(label);

    sensorChart.data.datasets[0].data.push(temp);
    sensorChart.data.datasets[1].data.push(hum);
    sensorChart.data.datasets[2].data.push(moisture);

    const maxPoint = 20;

    if (sensorChart.data.labels.length > maxPoint) {

        sensorChart.data.labels.shift();

        sensorChart.data.datasets.forEach(dataset => {
            dataset.data.shift();
        });

    }

    sensorChart.update();

}

/* ==========================================================
   CONTROL BUTTON
========================================================== */

// ===========================
// START DRYING
// ===========================

window.mulaiPengeringan = function () {

    set(ref(db, "control/startDrying"), true);

    alert("Proses pengeringan dimulai.");

};


// ===========================
// STOP DRYING
// ===========================

window.stopPengeringan = function () {

    set(ref(db, "control/startDrying"), false);

    alert("Proses pengeringan dihentikan.");

};


// ===========================
// MATIKAN BUZZER
// ===========================

window.matikanBuzzer = function () {

    set(ref(db, "control/buzzerOff"), true);

    popup.classList.add("hidden");

    popupShown = true;

};


// ===========================
// GAS ON
// ===========================

window.gasOn = function () {

    set(ref(db, "control/gas"), true);

};


// ===========================
// GAS OFF
// ===========================

window.gasOff = function () {

    set(ref(db, "control/gas"), false);

};

/* ==========================================================
   GAS STATUS
========================================================== */

onValue(ref(db, "control/gas"), (snapshot) => {

    if (!gasStatus) return;

    const gas = snapshot.val();

    if (gas === true) {

        gasStatus.innerHTML = "🟢 Gas ON";

        gasStatus.className = "gas-on";

    } else {

        gasStatus.innerHTML = "🔴 Gas OFF";

        gasStatus.className = "gas-off";

    }

});

/* ==========================================================
   INTERNET CONNECTION
========================================================== */

function checkInternet() {

    if (navigator.onLine) {

        wifiIcon.className = "wifi-icon wifi-online";

    } else {

        wifiIcon.className = "wifi-icon wifi-offline";

    }

}

checkInternet();

setInterval(checkInternet, 5000);

/* ==========================================================
   ESP32 OFFLINE CHECK
========================================================== */

setInterval(() => {

    const diff = Date.now() - lastUpdate;

    if (diff > 10000) {

        espStatus.innerHTML = "ESP32 Offline";

        espStatus.className = "esp-status esp-offline";

    }

}, 3000);

/* ==========================================================
   ESP32 IP ADDRESS
========================================================== */

onValue(ref(db, "sensor/ip"), (snapshot) => {

    if (!ipAddress) return;

    if (snapshot.exists()) {

        ipAddress.innerHTML = snapshot.val();

    } else {

        ipAddress.innerHTML = "-";

    }

});

/* ==========================================================
   LAST UPDATE
========================================================== */

const lastUpdateText = document.getElementById("lastUpdate");

function updateLastUpdate() {

    if (!lastUpdateText) return;

    const now = new Date();

    lastUpdateText.innerHTML =
        "Last Update : " +
        now.toLocaleTimeString("id-ID");

}

/* ==========================================================
   RESET POPUP SAAT STATUS NORMAL
========================================================== */

function resetPopup(statusSistem){

    if(
        statusSistem === "Heating" ||
        statusSistem === "Optimal" ||
        statusSistem === "Ready Check" ||
        statusSistem === "Done"
    ){

        popupShown = false;

        popup.classList.add("hidden");

    }

}

/* ==========================================================
   AUTO AKTIFKAN ALARM LAGI
========================================================== */

function resetAlarm(){

    alarmOff = false;

    set(ref(db,"control/buzzerOff"),false);

}

/* ==========================================================
   ANIMASI CARD
========================================================== */

const cards = document.querySelectorAll(".card");

cards.forEach((card,index)=>{

    card.style.opacity="0";

    card.style.transform="translateY(20px)";

    setTimeout(()=>{

        card.style.transition=".5s";

        card.style.opacity="1";

        card.style.transform="translateY(0px)";

    },150*index);

});


/* ==========================================================
   DASHBOARD READY
========================================================== */

window.addEventListener("load",()=>{

    console.log("=====================================");
    console.log(" HerbaDry Monitoring Dashboard Ready ");
    console.log(" Firebase Connected ");
    console.log(" ESP32 Waiting...");
    console.log("=====================================");

});


/* ==========================================================
   PING DASHBOARD
========================================================== */

setInterval(()=>{

    console.log("Dashboard Active");

},60000);