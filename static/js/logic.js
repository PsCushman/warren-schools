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
    // Define the dictionary to map school names to their types
    var schoolTypes = {
      "BELL": "Selective Enrollment",
      "AUDUBON": "Choice",
      "EDISON": "Selective Enrollment",
      "SKINNER NORTH": "Selective Enrollment",
      "PRITZKER": "Selective Enrollment",
      "MCPHERSON": "Selective Enrollment",
      "PULASKI": "Neighborhood",
      "BURNLEY": "Choice"
    };

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

      // Check if the schoolName exists in the dictionary and has valid lat and lng
      if (schoolTypes.hasOwnProperty(schoolName) && !isNaN(lat) && !isNaN(lng)) {
        // Create a marker using lat and lng
        var marker = L.marker([lat, lng])
        .addTo(myMap)
        .bindPopup(function () {
          var enrollmentType = schoolTypes[schoolName];
          var popupColor = "";

          // Determine the background color based on enrollment type
          if (enrollmentType === "Choice") {
            popupColor = "red";
          } else if (enrollmentType === "Selective Enrollment") {
            popupColor = "blue";
          } else {
            popupColor = "green";
          }

          // Build the popup content with the selected color
          return `<div class="custom-popup" style="background-color: ${popupColor};"><strong>${schoolName}</strong><br>${enrollmentType}<br><small>${description}</small></div>`;
        })
        .on("mouseover", function (e) {
          this.openPopup();
        })
        .on("mouseout", function (e) {
          this.closePopup();
        });
      }
    });
  });