# frontend/script.js
document.getElementById("getLocationBtn").onclick = function () {
    const status = document.getElementById("status");
    status.innerText = "...جاري تحديد الموقع";

    if (!navigator.geolocation) {
        status.innerText = "المتصفح لا يدعم تحديد الموقع";
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const accuracy = position.coords.accuracy;
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            if (accuracy <= 5) {
                status.style.color = 'green';
            } else {
                status.style.color = 'red';
            }

            const response = await fetch("https://plus.khaburah.online/api/pluscode", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ latitude: lat, longitude: lng })
            });

            const data = await response.json();
            status.innerText = `Plus Code: ${data.plus_code}`;
        },
        () => {
            status.innerText = "فشل في الحصول على الموقع";
        },
        { enableHighAccuracy: true }
    );
};
