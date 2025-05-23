/* frontend/js/main.js
 * ----------------------------------------------------------
 * PlusCode-Reporter: mobile client logic (vanilla JS)
 * ---------------------------------------------------------- */

const api = "/api";

/* ----------------------------------------------------------
   Global state
---------------------------------------------------------- */
let coord    = null;   // latest GeolocationCoordinates
let plusCode = null;   // string recorded from the API
let items    = [];     // [{ item_id, description_ar, quantity }]
let watchId  = null;   // geolocation.watchPosition() handle

/* ----------------------------------------------------------
   DOM elements
---------------------------------------------------------- */
const gpsBtn   = document.getElementById("getLoc");
const recBtn   = document.getElementById("recordPlus");
const statusEl = document.getElementById("gpsStatus");

const catSel   = document.getElementById("categorySel");
const itemSel  = document.getElementById("itemSel");
const qtyInput = document.getElementById("qty");
const addBtn   = document.getElementById("addItem");
const itemList = document.getElementById("itemList");
const saveBtn  = document.getElementById("saveReport");

/* ----------------------------------------------------------
   1. Load categories/items on page load
---------------------------------------------------------- */
async function loadCategories() {
  const cats = await fetch(`${api}/admin/categories`).then(r => r.json());

  catSel.innerHTML = "";
  cats.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = c.name_ar;
    opt.dataset.items = JSON.stringify(c.items);
    catSel.appendChild(opt);
  });

  populateItems(); // fill first item list
}

function populateItems() {
  const selected = catSel.selectedOptions[0];
  const itemsArr = JSON.parse(selected.dataset.items);
  itemSel.innerHTML = "";
  itemsArr.forEach(i => {
    const opt = document.createElement("option");
    opt.value = i.id;
    opt.textContent = i.description_ar;
    itemSel.appendChild(opt);
  });
}

/* ----------------------------------------------------------
   2. Continuous GPS watcher (≤5 m accuracy gate)
---------------------------------------------------------- */
gpsBtn.onclick = () => {
  statusEl.textContent = "⏳";
  recBtn.disabled = true;

  // reset any previous watch
  if (watchId) navigator.geolocation.clearWatch(watchId);

  watchId = navigator.geolocation.watchPosition(
    pos => {
      coord = pos.coords;
      statusEl.textContent =
        `m ${coord.accuracy.toFixed(1)} ` + (coord.accuracy <= 5 ? "✅" : "❌");

      if (coord.accuracy <= 5) {
        recBtn.disabled = false;               // enable Plus-Code button
        navigator.geolocation.clearWatch(watchId); // stop watching, save battery
      }
    },
    err => alert(err.message),
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 30000      // 30 s max wait for acceptable fix
    }
  );
};

/* ----------------------------------------------------------
   3. Record Plus Code (POST /admin/pluscode)
---------------------------------------------------------- */
recBtn.onclick = async () => {
  try {
    const res = await fetch(`${api}/admin/pluscode`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lat: coord.latitude, lng: coord.longitude })
    });
    if (!res.ok) throw new Error("API error");
    plusCode = await res.text();
    document.getElementById("plusCodeOut").textContent = plusCode;
  } catch (e) {
    alert("تعذّر توليد Plus Code");
  }
};

/* ----------------------------------------------------------
   4. Item list handling
---------------------------------------------------------- */
addBtn.onclick = () => {
  const qty = parseInt(qtyInput.value, 10);
  if (!qty || qty < 1) return;

  const itemId   = parseInt(itemSel.value, 10);
  const itemDesc = itemSel.selectedOptions[0].textContent;

  items.push({ item_id: itemId, description_ar: itemDesc, quantity: qty });

  const li = document.createElement("li");
  li.textContent = `${itemDesc} (عدد ${qty})`;
  itemList.appendChild(li);
};

/* ----------------------------------------------------------
   5. Save report (POST /reports)
---------------------------------------------------------- */
saveBtn.onclick = async () => {
  if (!plusCode) return alert("يرجى تسجيل Plus Code أولاً");
  if (!items.length) return alert("أضف عنصرًا واحدًا على الأقل");

  const payload = {
    plus_code:  plusCode,
    lat:        coord.latitude,
    lng:        coord.longitude,
    engineer_id: 1,  // TODO: hook up real dropdown when UI ready
    wilaya_id:   1,
    items: items.map(i => ({ item_id: i.item_id, quantity: i.quantity }))
  };

  try {
    const res = await fetch(`${api}/reports`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      alert("تم حفظ التقرير ✅");
      window.location.reload();
    } else {
      alert("خطأ أثناء الحفظ");
    }
  } catch {
    alert("انقطع الاتصال بالخادم");
  }
};

/* ----------------------------------------------------------
   6. Initialise on page load
---------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  loadCategories();
  catSel.onchange = populateItems;
});
