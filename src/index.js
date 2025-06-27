function updateDateTime(description, humidity, wind) {
  let now = new Date();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[now.getDay()];
  let hours = now.getHours();
  let minutes = now.getMinutes();
  if (minutes < 10) minutes = `0${minutes}`;
  let formattedDate = `${day} ${hours}:${minutes}`;
  document.querySelector(
    "#date-time"
  ).innerHTML = `${formattedDate}, ${description} <br /> Humidity: <strong>${humidity}%</strong>, Wind: <strong>${wind}km/h</strong>`;
}

function displayForecast(data) {
  const forecastEl = document.querySelector("#forecast");
  let html = "";

  data.daily.slice(1, 6).forEach((day) => {
    const date = new Date(day.time * 1000);
    const dayName = date.toLocaleDateString("en-GB", { weekday: "short" });
    const iconCode = day.condition.icon;
    const iconUrl = `https://shecodes-assets.s3.amazonaws.com/api/weather/icons/${iconCode}.png`;

    html += `
      <div class="weather-forecast-day">
        <div class="weather-forecast-date">${dayName}</div>
        <div class="weather-forecast-icon">
          <img src="${iconUrl}" alt="${day.condition.description}" />
        </div>
        <div class="weather-forecast-temperatures">
          <div class="weather-forecast-temperature"><strong>${Math.round(
            day.temperature.maximum
          )}°C</strong></div>
          <div class="weather-forecast-temperature">${Math.round(
            day.temperature.minimum
          )}°C</div>
        </div>
      </div>`;
  });

  forecastEl.innerHTML = html;
}

function getForecast(city) {
  const apiKey = "ctec04f17ee45ebe9b5ffoa34af106fa";
  const url = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;

  axios
    .get(url)
    .then((res) => {
      displayForecast(res.data);
    })
    .catch((err) => console.error("Forecast error:", err));
}

function searchCity(city) {
  const apiKey = "ctec04f17ee45ebe9b5ffoa34af106fa";
  const apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;

  axios
    .get(apiUrl)
    .then((response) => {
      const temperature = Math.round(response.data.temperature.current);
      const cityName = response.data.city;
      const humidity = response.data.temperature.humidity;
      const wind = Math.round(response.data.wind.speed);
      const description = response.data.condition.description;

      document.querySelector("#city-name").textContent = cityName;
      document.querySelector(
        ".current-weather span"
      ).textContent = `🌤️${temperature}°C`;
      updateDateTime(description, humidity, wind);
      getForecast(city);
    })
    .catch((error) => {
      alert("Sorry, city not found.");
      console.error("API error:", error);
    });
}

function handleSearch(event) {
  event.preventDefault();
  const inputElement = document.querySelector('input[type="search"]');
  const city = inputElement.value.trim();
  if (city) {
    searchCity(city);
  }
}

document.querySelector("form").addEventListener("submit", handleSearch);

document.querySelector('input[type="search"]').value = "Paris";
searchCity("Paris");
