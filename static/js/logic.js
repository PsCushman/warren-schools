// Initialize the map
// Initialize the map
var myMap = L.map("map").setView([41.94, -87.687000], 13);

// Create the tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "Map data © <a href='https://openstreetmap.org'>OpenStreetMap</a> contributors",
  maxZoom: 18,
}).addTo(myMap);

// Fetch school data from the Chicago Public Schools API
fetch('https://data.cityofchicago.org/api/views/8i6r-et8s/rows.json')
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    // Define the target school name
    var targetSchools = ["BELL", "AUDUBON", "EDISON", "SKINNER NORTH", "PRITZKER", "MCPHERSON", "PULASKI"];

    // Assuming data is the JSON object you received
    var schoolsData = data.data; // Access the array of school data

    // Loop through each school's data
    schoolsData.forEach(function(school) {
      // Accessing the name of the school (index 11), latitude (index 75), and longitude (index 76)
      var schoolName = school[11];
      var schoolType = school[13];
      var description = school[19];
      var lat = parseFloat(school[75]);
      var lng = parseFloat(school[76]);

      // Check if the schoolName matches the targetSchool
      if (targetSchools.includes(schoolName) && !isNaN(lat) && !isNaN(lng)) {
        // Create a marker using lat and lng
        var marker = L.marker([lat, lng])
          .addTo(myMap)
          .bindPopup(`<strong>${schoolName}</strong><br>${schoolType}<br><small>${description}</small>`)
          .on("mouseover", function(e) {
            this.openPopup();
          })
          .on("mouseout", function(e) {
            this.closePopup();
          });
      }
    });
  });