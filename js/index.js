"use strict"
const apiKey = "0da0df80f80146f79a8173731240412";
const searchBtn = document.querySelector("#searchBtn");
const searchInput = document.querySelector("#searchInput");
const loadingSpinner = document.querySelector("#loadingSpinner");
const currentDaydiv = document.querySelector("#currentDay");
const currentDateP = document.querySelector("#currentDay p");
const countryName = document.querySelector("#currentDay h2");
const tempC = document.querySelector("#currentDay h3");
const condition = document.querySelector("#currentDay h5");
const conditionIcon = document.querySelector("#currentDay img");
const rainPossibility = document.querySelector("#currentDay #rainP");
const windSpeed = document.querySelector("#currentDay #wSpeed");
const windDirection = document.querySelector("#currentDay #wDir");
const rowData = document.querySelector("#rowData");
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June','July', 'August', 'September', 'October', 'November', 'December'];

function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  } 
function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    getCity(latitude,longitude);   
  }  
async function getCity(lat, lon){
    const token = `pk.e8db43aa123b2e037b073a0cdadae3d0`
    const finderUrl = `https://us1.locationiq.com/v1/reverse?key=${token}&lat=${lat}&lon=${lon}&format=json`
    const city = await fetch(finderUrl);
    const cityName = await city.json();
    console.log(cityName.address.city);
    getData(cityName.address.city)   
}

if(searchInput.value == ""){
    getLocation();  
}
searchBtn.addEventListener('click' , function(){
    getData(`${searchInput.value}`)
} )

async function getData(cityName) {
    const weather = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${cityName}&days=3`);
    const response = await weather.json();
    loadingSpinner.classList.add("d-none")
    displayData(response);
    console.log(response);
}
   
function displayData(res){
    const currentDate = new Date(res.forecast.forecastday[0].date);
    const currentDay = days[currentDate.getDay()];
    const currentMonth = months[currentDate.getMonth()];
    currentDateP.innerHTML = currentDay + ' - ' + currentDate.getDate() + ' - ' +currentMonth;
    countryName.innerHTML = res.location.name;
    tempC.innerHTML =  res.current.temp_c + "°C";
    condition.innerHTML = res.current.condition.text; 
    conditionIcon.src = res.current.condition.icon;
    rainPossibility.innerHTML = res.forecast.forecastday[0].day.daily_chance_of_rain;
    windSpeed.innerHTML = res.current.wind_kph;
    windDirection.innerHTML = res.current.wind_dir;
    let container = '';
    for (let i = 1; i < res.forecast.forecastday.length; i++) {
        const x = new Date(res.forecast.forecastday[i].date);
        container+=`
        <div class="weather-info col-9 col-lg-3 text-center rounded-5 pt-5 my-5 h-25">
            <h4 class="bg-black bg-opacity-50 rounded-5 py-2">${days[x.getDay(x)]}</h4>
            <img src="${res.forecast.forecastday[i].day.condition.icon}" alt="condition icon">
            <h2>${res.forecast.forecastday[i].day.maxtemp_c}°C</h2>
            <h3>${res.forecast.forecastday[i].day.mintemp_c}° </h3>
            <p class="fs-4 text-primary">${res.forecast.forecastday[i].day.condition.text}</p>    
        </div> `    
    }
    rowData.innerHTML = currentDaydiv.outerHTML + container;
}

