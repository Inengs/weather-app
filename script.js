const button = document.getElementById("searchplace");
const inputPlace = document.getElementById("placeName");
const currentTemp = document.getElementById("temperature");
const currentWC = document.getElementById("weatherCondition");
const feelsLike = document.getElementById("feelsLike");
const precipitationProbability = document.getElementById("precprob");
const precipitationType = document.getElementById("precType");
const humidity = document.getElementById("Humidity");
const windSpeed = document.getElementById("WindSpeed");
const windDirection = document.getElementById("WindDirection");
const fiveHrButton = document.getElementById("5hrs");
const oneDayButton = document.getElementById("1day");
// Assumed DOM elements for 5hr and 1day forecasts
const temperatureWithTime = document.getElementById("temperatureWithTime"); // Add this to your HTML
const weatherConditionWithTime = document.getElementById("weatherConditionWithTime"); // Add this to your HTML
const yourAPIkey = 'CpFMzGEgqLofdr48yQR0pAkR0P7r2gHE';



// Store lat and long globally
let lat = null;
let long = null;

function changeTime(millisecs) {
    const now = new Date();
    const startTime = now.toISOString();
    const futureTime = new Date(now.getTime() + millisecs).toISOString();
    return { startTime, endTime: futureTime };
}

button.addEventListener("click", fetchCoordinates);

function fetchCoordinates() {
    const searchValue = inputPlace.value;
    if (!searchValue) {
        console.error("Please enter a location");
        return;
    }

    fetch(`https://nominatim.openstreetmap.org/search?q=${searchValue}&format=json&limit=1`)
        .then(response => response.json())
        .then(data => {
            if (!data || data.length === 0) {
                throw new Error("No location found");
            }
            lat = data[0].lat;
            long = data[0].lon;
            return fetchWeather(lat, long);
        })
        .catch(error => {
            console.error("Error fetching location values:", error);
        });
}

// Map weather codes to SVG icons
const weatherIcons = {
    1000: `<svg class="weather-icon sunny" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="5" fill="#ffc107"/><path d="M12 2V4M12 20V22M2 12H4M20 12H22M5.64 5.64L7.05 7.05M16.95 16.95L18.36 18.36M5.64 18.36L7.05 16.95M16.95 7.05L18.36 5.64" stroke="#ffc107" stroke-width="2"/></svg>`, // Clear
    1001: `<svg class="weather-icon cloudy" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 10H16.74A6 6 0 1 0 6 12H8C9.66 12 11 10.66 11 9C11 7.34 9.66 6 8 6C6.34 6 5 7.34 5 9C5 12.31 7.69 15 11 15H18C19.66 15 21 13.66 21 12C21 10.34 19.66 9 18 9Z" fill="#6c757d"/></svg>`, // Cloudy
    4001: `<svg class="weather-icon rainy" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 10H16.74A6 6 0 1 0 6 12H8C9.66 12 11 10.66 11 9C11 7.34 9.66 6 8 6C6.34 6 5 7.34 5 9C5 12.31 7.69 15 11 15H18C19.66 15 21 13.66 21 12C21 10.34 19.66 9 18 9Z" fill="#007bff"/><path d="M7 15L6 18M10 15L9 18M13 15L12 18" stroke="#007bff" stroke-width="2"/></svg>`, // Rain
    6000: `<svg class="weather-icon snowy" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 10H16.74A6 6 0 1 0 6 12H8C9.66 12 11 10.66 11 9C11 7.34 9.66 6 8 6C6.34 6 5 7.34 5 9C5 12.31 7.69 15 11 15H18C19.66 15 21 13.66 21 12C21 10.34 19.66 9 18 9Z" fill="#17a2b8"/><path d="M7 15L7.5 16.5L6 16.5L6.5 15M10 15L10.5 16.5L9 16.5L9.5 15M13 15L13.5 16.5L12 16.5L12.5 15" stroke="#17a2b8" stroke-width="2"/></svg>` // Snow
};

function fetchWeather(lat, long) {
    fetch(`https://api.tomorrow.io/v4/weather/forecast?location=${lat},${long}&fields=temperature,temperatureApparent,weatherCode,precipitationProbability,precipitationType,humidity,windSpeed,windDirection&timesteps=1h&apikey=${yourAPIkey}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("API Response:", JSON.stringify(data, null, 2)); // Log the full response
            if (!data.timelines || !data.timelines.hourly || !data.timelines.hourly[0]) {
                throw new Error(`Invalid API response structure: ${JSON.stringify(data)}`);
            }
            const firstInterval = data.timelines.hourly[0].values;
            currentTemp.innerHTML = `Temperature: ${firstInterval.temperature} °C`;
            currentWC.innerHTML = `Weather Condition: ${firstInterval.weatherCode}`;
            weatherIcon.innerHTML = weatherIcons[firstInterval.weatherCode] || '';
            feelsLike.innerHTML = `Feels Like: ${firstInterval.temperatureApparent} °C`;
            precipitationProbability.innerHTML = `Precipitation Probability: ${firstInterval.precipitationProbability}%`;
            precipitationType.innerHTML = `Precipitation Type: ${firstInterval.precipitationType || 'None'}`;
            humidity.innerHTML = `Humidity: ${firstInterval.humidity}%`;
            windSpeed.innerHTML = `Wind Speed: ${firstInterval.windSpeed} m/s`;
            windDirection.innerHTML = `Wind Direction: ${firstInterval.windDirection}°`;
        })
        .catch(error => {
            console.error("Couldn’t fetch weather:", error);
        });
}

fiveHrButton.addEventListener("click", fetchWeather5hr);

function fetchWeather5hr() {
    if (!lat || !long) {
        console.error("Location not set. Please search for a place first.");
        return;
    }
    const { startTime, endTime } = changeTime(18000000); // 5 hours in milliseconds
    fetch(`https://api.tomorrow.io/v4/weather/forecast?location=${lat},${long}&fields=temperature,weatherCode&timesteps=1h&startTime=${startTime}&endTime=${endTime}&apikey=${yourAPIkey}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (!data.timelines || !data.timelines.hourly || !data.timelines.hourly[0]) {
                throw new Error("Invalid API response structure");
            }
            const intervals = data.timelines.hourly;
            let temps = "";
            let weatherCodes = "";
            for (let i = 0; i < Math.min(5, intervals.length); i++) {
                temps += `${intervals[i].values.temperature} °C `;
                weatherCodes += `${intervals[i].values.weatherCode} `;
            }
            temperatureWithTime.innerHTML = `5-Hour Temperatures: ${temps}`;
            weatherConditionWithTime.innerHTML = `5-Hour Weather Codes: ${weatherCodes}`;
        })
        .catch(error => {
            console.error("Couldn’t fetch 5-hour weather:", error);
        });
}

oneDayButton.addEventListener("click", fetchWeather1dy);

function fetchWeather1dy() {
    if (!lat || !long) {
        console.error("Location not set. Please search for a place first.");
        return;
    }
    const { startTime, endTime } = changeTime(86400000); // 24 hours in milliseconds
    fetch(`https://api.tomorrow.io/v4/weather/forecast?location=${lat},${long}&fields=temperature,weatherCode&timesteps=1h&startTime=${startTime}&endTime=${endTime}&apikey=${yourAPIkey}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("1dy Weather Response:", JSON.stringify(data, null, 2));
            if (!data.timelines || !data.timelines.hourly || !data.timelines.hourly[0]) {
                throw new Error("Invalid API response structure");
            }
            const intervals = data.timelines.hourly;
            let temps = "";
            let weatherCodes = "";
            for (let i = 0; i < Math.min(24, intervals.length); i++) {
                temps += `${intervals[i].values.temperature} °C `;
                weatherCodes += `${intervals[i].values.weatherCode} `;
            }
            temperatureWithTime.innerHTML = `1-Day Temperatures: ${temps}`;
            weatherConditionWithTime.innerHTML = `1-Day Weather Codes: ${weatherCodes}`;
        })
        .catch(error => {
            console.error("Couldn’t fetch 1-day weather:", error);
        });
}