mapboxgl.accessToken = 'pk.eyJ1IjoibmF0aGFuaWVsMTciLCJhIjoiY2x1aWhkOWN2MDNwczJxbnl0dXE3dmI3MiJ9._2Rt6wiscjpX_n0e2EXb8w';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [107.6175, -6.9039], // initial map center
    zoom: 12 // initial map zoom
});

map.on('load', function () {
    map.addSource('traffic', {
        type: 'vector',
        url: 'mapbox://mapbox.mapbox-traffic-v1'
    });

    map.addLayer({
        'id': 'traffic-layer',
        'type': 'line',
        'source': 'traffic',
        'source-layer': 'traffic',
        'layout': {
            'line-join': 'round',
            'line-cap': 'round'
        },
        'paint': {
            'line-color': [
                'match',
                ['get', 'congestion'],
                'low', '#00FF00', // hijau untuk lalu lintas ringan
                'moderate', '#FFFF00', // kuning untuk lalu lintas sedang
                'heavy', '#FFA500', // oranye untuk lalu lintas padat
                '#FF0000' // merah untuk lalu lintas macet
            ],
            'line-opacity': 0.75,
            'line-width': {
                'base': 1.5,
                'stops': [[4, 2], [18, 20]]
            }
        }
    });
});

function searchLocation(searchTerm) {
  // Lakukan pencarian menggunakan Mapbox Search
  // Lakukan pencarian berdasarkan nama tempat
  fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchTerm)}.json?access_token=${mapboxgl.accessToken}`)
      .then(response => response.json())
      .then(data => {
          if (data.features && data.features.length > 0) {
              const coordinates = data.features[0].center;
              map.flyTo({ center: coordinates, zoom: 18 });
          } else {
              alert('Location not found!');
          }
      })
      .catch(error => {
          console.error('Error searching location:', error);
          alert('An error occurred while searching for the location.');
      });
}

// Menambahkan event listener untuk form pencarian
const searchForm = document.getElementById('search-form');
searchForm.addEventListener('submit', function(event) {
  event.preventDefault(); // Mencegah perilaku default pengiriman formulir
  const searchTerm = document.getElementById('search-input').value;
  searchLocation(searchTerm);
});
