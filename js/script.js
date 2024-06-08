const API_KEY = "10cc793abbbc495b94502329240506";

const getWeather = function (url) {
  const weather = new XMLHttpRequest();
  weather.open("GET", url);
  weather.send();
  weather.addEventListener("load", function () {
    const {
      current,
      location,
      forecast: {forecastday},
    } = JSON.parse(this.responseText);
    current.condition.icon = current.condition.icon.replace("64x64", "128x128");
    current.condition.icon = current.condition.icon.replace("//", "https://");
    let weeks = "";
    forecastday.map((day, i) => {
    day.day.condition.icon = day.day.condition.icon.replace("//", "https://");
      let date = new Date(day.date);
      let weekday =
        i === 0
          ? "Aujourd'hui"
          : new Intl.DateTimeFormat("fr-FR", {
              weekday: "long",
            }).format(date);
      weeks += `
            <div>
                <p>${weekday}</p>
                <img src="${day.day.condition.icon}" alt="">
                <p>${Math.round(day.day.mintemp_c)}°/${Math.round(day.day.maxtemp_c)}°</p>
                
            </div>
            `;
    });

    document.title = `${Math.round(current.temp_c)}°c in ${location.name}, ${location.country}`;
    const html = `
             <div class="current">

            <div class="info">
                <div>
                    <h1>${location.name}, ${location.country}</h1>
                    <p>${current.condition.text}</p>
                </div>
                <p class="deg">${Math.round(current.temp_c)}°c</p>
            </div>
            <div class="img-box">
                <img alt="" src="${current.condition.icon}">
            </div>

        </div>
            <div class="week">
               ${weeks}
            </div>
            `;
    document.querySelector(".container").innerHTML = html;
  });
};

const toggleSearchSection = function () {
  document.querySelector("#search-section").classList.toggle("hidden");
};

document.querySelector("#search-form").addEventListener("submit", function (e) {
  e.preventDefault();
  let city = document.querySelector("#search-input").value;
  if (!city) return;
  getWeather(
    `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=3&lang=fr`
  );
  toggleSearchSection();
});


navigator.geolocation.getCurrentPosition(
  function (position) {
    if (navigator.geolocation) {
      const {latitude,longitude} = position.coords;
      getWeather(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${latitude},${longitude}&days=3&lang=fr&lang=fr`
      );
    }
  },
  function () {
    alert("La localisation n'est pas autorisée.");
    toggleSearchSection(); 
  }
);

