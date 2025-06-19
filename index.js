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
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let formattedDate = `${day} ${hours}:${minutes}`;
  let dateTimeElement = document.querySelector("#date-time");
  dateTimeElement.innerHTML = `${formattedDate}, ${description} <br /> Humidity: <strong>${humidity}%</strong>, Wind: <strong>${wind}km/h</strong>`;
}

function handleSearch(event) {
  event.preventDefault();

  let inputElement = document.querySelector('input[type="search"]');
  let city = inputElement.value.trim();

  let apiKey = "ctec04f17ee45ebe9b5ffoa34af106fa";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;

  axios
    .get(apiUrl)
    .then(function (response) {
      console.log(response.data); // ✅ Helps debuggin
      let temperature = Math.round(response.data.temperature.current);
      let cityName = response.data.city;
      let humidity = response.data.temperature.humidity;
      let wind = Math.round(response.data.wind.speed);
      let description = response.data.condition.description;
      let iconUrl = response.data.condition.icon_url;

      // ✅ Update city
      document.querySelector("#city-name").textContent = cityName;

      // ✅ Update weather icon
      let iconElement = document.querySelector("#weather-icon");

      iconElement.setAttribute("src", iconUrl);
      iconElement.setAttribute("alt", description);
      iconElement.classList.add("visible");
      // ✅ Update temperature
      document.querySelector("#temperature").textContent = `${temperature}°C`;

      // ✅ Update date, humidity, wind
      updateDateTime(description, humidity, wind);
    })
    .catch(function (error) {
      alert("Sorry, city not found.");
      console.error("API error:", error);
    });
}

let form = document.querySelector("form");
form.addEventListener("submit", handleSearch);
