depths = {
    "<0 km": "#ed7818",
    "0-100 km": "#fcba03",
    ">100 km": "#000000"
}

function init() {
    
    createMap()

}

function createMap() {
    
    let map = L.map("map").setView([0,0], 2)

    // tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map)

    d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(response => {

        // GeoJSON layer
        L.geoJson(response, {
            pointToLayer: (feature, latlong) => {
                return L.circleMarker(latlong, {
                    radius: 2 * feature.properties.mag,
                    fillColor: getBackgroundColor(feature.geometry.coordinates[2]), // depth
                    color: "white",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 1
                })
            },
            onEachFeature: (feature, layer) => {
                layer.bindPopup(`<b>Magnitude: </b>${feature.properties.mag}<br> <b>Place: </b>${feature.properties.place}<br><br> <b>Depth: </b>${feature.geometry.coordinates[2]}`)
            },
        }).addTo(map)

        // legend
        let legend = L.control({position: "topleft"})

        legend.onAdd = (map) => {

            let labelDiv = L.DomUtil.create("div", "legend")
            labelDiv.style.cssText = "background-color:white;padding:20px"

            labelDiv.innerHTML += `<p style="font-weight:bold;margin:0;padding:0">Depths</p>`
            for (depth in depths) {
                labelDiv.innerHTML += `<i style=display:inline-block;width:10px;height:10px;background-color:${depths[depth]};></i> ${depth}<br>`
            }

            return labelDiv

        }

        legend.addTo(map)

    })

}

function getBackgroundColor(depth) {

    if (depth < 0) {
        return depths["<0 km"]
    } else if (depth >= 0 && depth <= 100) {
        return depths["0-100 km"]
    } else if (depth > 100) {
        return depths[">100 km"]
    } else {
        return "red"
    }

}

init()