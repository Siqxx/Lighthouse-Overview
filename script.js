let map;
let markers = {};
let infoWindows = {};
let tiltEnabled = false;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 7,
    center: { lat: 13.5, lng: 121.0 },
    mapTypeId: google.maps.MapTypeId.SATELLITE
  });

  fetch("lighthouses.json")
    .then(response => response.json())
    .then(data => {
      data.forEach(lh => {
        const marker = new google.maps.Marker({
          position: { lat: lh.lat, lng: lh.lng },
          map: map,
          title: lh.name,
          icon: lh.status === "Operating" ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png" : "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
        });

        const info = new google.maps.InfoWindow({
          content: `<strong>${lh.name}</strong><br>Status: ${lh.status}`
        });

        marker.addListener("click", () => info.open(map, marker));

        markers[lh.name] = marker;
        infoWindows[lh.name] = info;
      });
    });
}

function showTable(status) {
  fetch("lighthouses.json")
    .then(response => response.json())
    .then(data => {
      const filtered = data.filter(lh => lh.status === status);
      let html = "<table><tr><th>Name</th><th>Status</th></tr>";
      filtered.forEach(lh => {
        html += `<tr onclick="focusLighthouse('${lh.name}')">
                   <td>${lh.name}</td><td>${lh.status}</td>
                 </tr>`;
      });
      html += "</table>";
      document.getElementById("table").innerHTML = html;
    });
}

function focusLighthouse(name) {
  const marker = markers[name];
  const info = infoWindows[name];
  if (marker) {
    map.setZoom(15);
    map.setCenter(marker.getPosition());
    map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
    info.open(map, marker);
  }
}

function toggleTilt() {
  if (!map) return;
  if (tiltEnabled) {
    map.setTilt(0);
    tiltEnabled = false;
  } else {
    map.setTilt(45);
    tiltEnabled = true;
  }
}

function changeMapType(type) {
  map.setMapTypeId(type);
}
function updateTimestamp() {
  const now = new Date();
  document.getElementById("lastUpdated").textContent = now.toLocaleString();
}

// Call this whenever data is fetched
function showTable(status) {
  fetch("lighthouses.json")
    .then(response => response.json())
    .then(data => {
      const filtered = data.filter(lh => lh.status === status);
      let html = "<table><tr><th>Name</th><th>Status</th></tr>";
      filtered.forEach(lh => {
        html += `<tr onclick="focusLighthouse('${lh.name}')">
                   <td>${lh.name}</td><td>${lh.status}</td>
                 </tr>`;
      });
      html += "</table>";
      document.getElementById("table").innerHTML = html;

      updateTimestamp(); // refresh timestamp
    });
}
