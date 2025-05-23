const api = "/api";
let coord = null;
let plusCode = null;
let items = [];

const gpsBtn = document.getElementById("getLoc");
const recBtn = document.getElementById("recordPlus");
const statusEl = document.getElementById("gpsStatus");

gpsBtn.onclick = () => {
  statusEl.textContent = "⏳";
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      coord = pos.coords;
      statusEl.textContent = `✅ ${coord.accuracy.toFixed(1)} m`;
      recBtn.disabled = coord.accuracy > 5;
    },
    (err) => alert(err.message),
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
};

recBtn.onclick = async () => {
  const res = await fetch(`${api}/admin/pluscode`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lat: coord.latitude, lng: coord.longitude })
  });
  plusCode = await res.text();
  document.getElementById("plusCodeOut").textContent = plusCode;
};
