mapboxgl.accessToken =
  "pk.eyJ1IjoiYXphemVsLW9zcyIsImEiOiJja3llMXFxMjQwN3NnMnBwaDZocWhkanY5In0.JZ8_N1g-cBkGD1bXwAVlCA";

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/light-v10",
  center: post.coordinates,
  zoom: 7,
});

// add markers to map
// create a HTML element for each feature
const el = document.createElement("div");
el.className = "marker";

// make a marker for each feature and add to the map
new mapboxgl.Marker(el)
  .setLngLat(post.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }) // add popups
      .setHTML(`<h3>${post.title}</h3><p>${post.location}</p>`)
  )
  .addTo(map);

// toggle the edit form
$(".toggle-edit-form").on("click", function () {
  $(this).text() === "Edit" ? $(this).text("Cancel") : $(this).text("Edit");

  $(this).siblings(".edit-review-form").toggle();
});

$(".clear-rating").on("click", function () {
  $(this).siblings(".input-no-rate").click();
});
