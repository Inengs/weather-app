const button = document.getElementById("searchplace")
// const inputPlace = document.getElementById("placeName")
let long;
let lat;
let searchValue;


inputPlace.addEventListener("click")
button.addEventListener("click", fetchplace)

function fetchplace() {
    searchValue = getElementById("placeName").value
}
function fetchlocation() {
    fetch("https://nominatim.openstreetmap.org/search?q=searchValue&format=json&limit=1")
        .then(response => response.json)
        .then(function (data) {
            long = data[0].lon
            lat = data[0].lat
        })
        .catch(function (error) {
            console.error("Error fetching location values:", error)
        })

}