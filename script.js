// OpenWeatherMap API key
const API_KEY = "YOUR_API_KEY_HERE" // Replace with your actual API key
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather"

// DOM elements
const searchForm = document.getElementById("search-form")
const cityInput = document.getElementById("city-input")
const weatherCard = document.getElementById("weather-card")
const addFavoriteBtn = document.getElementById("add-favorite")
const favoritesList = document.getElementById("favorites").querySelector("ul")

// Favorites array
const favorites = JSON.parse(localStorage.getItem("favorites")) || []

// Event listeners
searchForm.addEventListener("submit", handleSearch)
addFavoriteBtn.addEventListener("click", addToFavorites)

// Initialize favorites
updateFavoritesList()

async function handleSearch(e) {
  e.preventDefault()
  const city = cityInput.value.trim()
  if (!city) return

  try {
    const weatherData = await fetchWeatherData(city)
    updateWeatherCard(weatherData)
    addFavoriteBtn.style.display = "block"
  } catch (error) {
    console.error("Error:", error)
    weatherCard.innerHTML = `<p class="error">${error.message}</p>`
    addFavoriteBtn.style.display = "none"
  }
}

async function fetchWeatherData(city) {
  const response = await fetch(`${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`)
  if (!response.ok) {
    throw new Error("City not found or API error")
  }
  return response.json()
}

function updateWeatherCard(data) {
  const { name, main, weather } = data
  weatherCard.innerHTML = `
        <h2>${name}</h2>
        <img src="http://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="${weather[0].description}" class="weather-icon">
        <div class="temperature">${Math.round(main.temp)}°C</div>
        <div class="conditions">${weather[0].description}</div>
        <div class="humidity">Humidity: ${main.humidity}%</div>
    `
}

function addToFavorites() {
  const cityName = weatherCard.querySelector("h2").textContent
  if (!favorites.includes(cityName)) {
    favorites.push(cityName)
    localStorage.setItem("favorites", JSON.stringify(favorites))
    updateFavoritesList()
  }
}

function updateFavoritesList() {
  favoritesList.innerHTML = ""
  favorites.forEach((city) => {
    const li = document.createElement("li")
    const button = document.createElement("button")
    button.textContent = city
    button.addEventListener("click", () => {
      cityInput.value = city
      handleSearch(new Event("submit"))
    })
    li.appendChild(button)
    favoritesList.appendChild(li)
  })
}

