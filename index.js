let apiKey = "3146t1140fd0d5bb8o78d46fad42f7bd"; // My API key
let apiUrl = "https://api.shecodes.io/weather/v1/current";

// Get DOM elements
let searchBox = document.querySelector("#search-input");
let searchForm = document.querySelector("#search-form");
let cityElement = document.querySelector("#current-city");
let dateElement = document.querySelector("#current-date");
let temperatureValueElement = document.querySelector(
  ".current-temperature-value"
);
let humidityElement = document.querySelector("#humidity");
let windElement = document.querySelector("#wind");
let temperatureIconElement = document.querySelector(
  ".current-temperature-icon"
);

// Function to format date and time using an approximate timezone offset (based on longitude)
function formatDateAndTimeWithLongitude(timestamp, longitude) {
  if (longitude === undefined) {
    return "Invalid Timezone"; // If longitude is missing, return an error string
  }

  let date = new Date(timestamp * 1000); // Convert timestamp to milliseconds
  let timezoneOffsetInHours = Math.round(longitude / 15); // Approximate timezone offset from longitude
  let localTime = new Date(
    date.setHours(date.getUTCHours() + timezoneOffsetInHours)
  ); // Adjust for timezone offset

  let day = String(localTime.getDate()).padStart(2, "0");
  let month = String(localTime.getMonth() + 1).padStart(2, "0");
  let year = localTime.getFullYear();

  let hours = localTime.getHours();
  let minutes = String(localTime.getMinutes()).padStart(2, "0");
  let ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? String(hours).padStart(2, "0") : "12"; // Ensure at least 2 digits

  return `${day}/${month}/${year}, ${hours}:${minutes} ${ampm}`; // Format as DD/MM/YYYY, HH:MM AM/PM
}

// Function to display weather details
async function displayWeather(city) {
  try {
    let apiRequestUrl = `${apiUrl}?query=${city}&key=${apiKey}`;
    console.log("API Request URL:", apiRequestUrl); // Log the URL being called

    let response = await fetch(apiRequestUrl);
    let data = await response.json(); // Parse the response

    console.log("API Response:", data); // Log the entire response to see structure

    if (!response.ok || data.status === "not_found") {
      console.error(`Error: ${data.message}`); // Log the error message from API
      cityElement.innerHTML = "City not found";
      temperatureValueElement.innerHTML = "--"; // Reset temperature
      dateElement.innerHTML = "--"; // Reset date
      humidityElement.innerHTML = "--"; // Reset humidity
      windElement.innerHTML = "--"; // Reset wind
      return; // Exit function if there's an error
    }

    // Update the DOM elements with the fetched data
    if (data.temperature) {
      cityElement.innerHTML = data.city;
      temperatureValueElement.innerHTML = Math.round(data.temperature.current); // Set current temperature

      // Check if coordinates are available for timezone approximation
      if (data.coordinates && data.time) {
        let longitude = data.coordinates.longitude;
        dateElement.innerHTML = formatDateAndTimeWithLongitude(
          data.time,
          longitude
        );
      } else {
        console.error("Coordinates or time data is missing.");
        dateElement.innerHTML = "Invalid Date";
      }

      // Update humidity
      humidityElement.innerHTML = `${data.temperature.humidity}%`; // Update humidity

      // Update wind speed
      windElement.innerHTML = `${Math.round(data.wind.speed)} km/h`; // Update wind speed

      // Display the weather icon
      temperatureIconElement.innerHTML = `<img src="${data.condition.icon_url}" alt="Weather Icon">`;
    } else {
      console.error("Temperature data is missing.");
    }
  } catch (error) {
    console.error("There was an error fetching the weather data:", error);
  }
}

// Event listener for form submission
searchForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent form from submitting normally
  let city = searchBox.value.trim();
  if (city) {
    displayWeather(city); // Call function to display weather
  } else {
    console.error("Please enter a city");
  }
});
