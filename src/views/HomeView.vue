<template>
  <div class="home">
            <WeatherAnimation 
          v-if="currentWeather" 
          :weather-code="currentWeather.weatherCode"
          :is-night="isNightTime"
        />
    
    <div class="container">
              <div class="search-section card">
          <h2>Search for a Location</h2>
          <div class="search-form">
            <input
              v-model="searchQuery"
              @input="handleSearch"
              @keyup.enter="searchLocations"
              type="text"
              placeholder="Enter city name (e.g., Berlin, London, Tokyo)"
              class="input"
            />
            <button @click="searchLocations" :disabled="!searchQuery.trim()" class="btn">
              Search
            </button>
          </div>
        
        <div v-if="searchResults.length > 0" class="search-results">
          <h3>Search Results:</h3>
          <div class="location-list">
            <div
              v-for="location in searchResults"
              :key="`${location.latitude}-${location.longitude}`"
              @click="selectLocation(location)"
              class="location-item"
            >
              <div class="location-name">{{ location.name }}</div>
              <div class="location-details">
                {{ location.country }}{{ location.admin1 ? `, ${location.admin1}` : '' }}
              </div>
            </div>
          </div>
        </div>

        <div v-if="!selectedLocation && searchResults.length === 0" class="fun-info">
          <div class="fun-card">
            <h3>🌍 Explore the World's Weather</h3>
            <p>Search for any city to discover its current weather and 7-day forecast!</p>
            
            <div class="fun-facts">
              <div class="fact-item">
                <span class="fact-icon">🌡️</span>
                <span class="fact-text">Get real-time temperature data</span>
              </div>
              <div class="fact-item">
                <span class="fact-icon">🌤️</span>
                <span class="fact-text">Beautiful weather animations</span>
              </div>
              <div class="fact-item">
                <span class="fact-icon">📱</span>
                <span class="fact-text">Works on all devices</span>
              </div>
              <div class="fact-item">
                <span class="fact-icon">⚡</span>
                <span class="fact-text">Powered by Open-Meteo API</span>
              </div>
            </div>

            <div class="popular-cities">
              <h4>Popular Cities to Try:</h4>
              <div class="city-tags">
                <span class="city-tag" @click="searchQuery = 'Tokyo'; searchLocations()">Tokyo</span>
                <span class="city-tag" @click="searchQuery = 'New York'; searchLocations()">New York</span>
                <span class="city-tag" @click="searchQuery = 'London'; searchLocations()">London</span>
                <span class="city-tag" @click="searchQuery = 'Paris'; searchLocations()">Paris</span>
                <span class="city-tag" @click="searchQuery = 'Sydney'; searchLocations()">Sydney</span>
                <span class="city-tag" @click="searchQuery = 'Dubai'; searchLocations()">Dubai</span>
              </div>
            </div>
          </div>
        </div>
      </div>

              <div v-if="selectedLocation" class="weather-section">
          <div class="back-section">
            <button @click="goBackToSearch" class="back-btn">
              ← Back to Home
            </button>
          </div>
          
          <div class="current-weather card">
            <h2>Current Weather in {{ selectedLocation.name }}</h2>
            <div v-if="currentWeather" class="current-weather-content">
              <div class="weather-main">
                <div class="temperature">{{ Math.round(currentWeather.temperature) }}°C</div>
                <div class="weather-description">{{ currentWeather.description }}</div>
              </div>
              <div class="weather-details">
                <div class="detail-item">
                  <span class="label">Feels like:</span>
                  <span class="value">{{ Math.round(currentWeather.feelsLike) }}°C</span>
                </div>
                <div class="detail-item">
                  <span class="label">Humidity:</span>
                  <span class="value">{{ currentWeather.humidity }}%</span>
                </div>
                <div class="detail-item">
                  <span class="label">Wind:</span>
                  <span class="value">{{ Math.round(currentWeather.windSpeed) }} km/h</span>
                </div>
              </div>
            </div>
            <div v-else-if="loading" class="loading">Loading current weather...</div>
          </div>

          <div class="daily-forecast card">
            <h2>7-Day Forecast</h2>
            <div v-if="dailyForecast.length > 0" class="forecast-grid">
              <div
                v-for="day in dailyForecast"
                :key="day.date"
                class="forecast-day"
              >
                <div class="day-name">{{ formatDay(day.date) }}</div>
                <div class="day-date">{{ formatDate(day.date) }}</div>
                <div class="day-temp">
                  <span class="max-temp">{{ Math.round(day.maxTemp) }}°</span>
                  <span class="min-temp">{{ Math.round(day.minTemp) }}°</span>
                </div>
                <div class="day-description">{{ day.description }}</div>
              </div>
            </div>
            <div v-else-if="loading" class="loading">Loading forecast...</div>
          </div>
        </div>

        <div v-if="error" class="error">
          {{ error }}
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useWeatherStore } from '@/stores/weather'
import WeatherAnimation from '@/components/WeatherAnimation.vue'

interface Location {
  name: string
  latitude: number
  longitude: number
  country: string
  admin1?: string
}

interface CurrentWeather {
  temperature: number
  feelsLike: number
  humidity: number
  windSpeed: number
  description: string
  weatherCode: number
  time: string
}

interface DailyForecast {
  date: string
  maxTemp: number
  minTemp: number
  description: string
}

const searchQuery = ref('')
const searchResults = ref<Location[]>([])
const selectedLocation = ref<Location | null>(null)
const currentWeather = ref<CurrentWeather | null>(null)
const dailyForecast = ref<DailyForecast[]>([])
const loading = ref(false)
const error = ref('')

const weatherStore = useWeatherStore()

const handleSearch = () => {
  if (searchQuery.value.trim().length >= 2) {
    searchLocations()
  } else {
    searchResults.value = []
  }
}

const searchLocations = async () => {
  if (!searchQuery.value.trim()) return
  
  try {
    loading.value = true
    error.value = ''
    const results = await weatherStore.searchLocations(searchQuery.value)
    searchResults.value = results
  } catch (err) {
    error.value = 'Failed to search locations. Please try again.'
    console.error('Search error:', err)
  } finally {
    loading.value = false
  }
}

const selectLocation = async (location: Location) => {
  selectedLocation.value = location
  searchResults.value = []
  searchQuery.value = location.name
  
  try {
    loading.value = true
    error.value = ''
    
    // Fetch current weather and forecast
    const [weather, forecast] = await Promise.all([
      weatherStore.getCurrentWeather(location.latitude, location.longitude),
      weatherStore.getDailyForecast(location.latitude, location.longitude)
    ])
    
    currentWeather.value = weather
    dailyForecast.value = forecast
  } catch (err) {
    error.value = 'Failed to load weather data. Please try again.'
    console.error('Weather fetch error:', err)
  } finally {
    loading.value = false
  }
}

const formatDay = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { weekday: 'short' })
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const isNightTime = computed(() => {
  if (!currentWeather.value?.time) return false
  const hour = new Date(currentWeather.value.time).getHours()
  return hour < 6 || hour > 18
})

const goBackToSearch = () => {
  selectedLocation.value = null
  currentWeather.value = null
  dailyForecast.value = []
  searchQuery.value = ''
  searchResults.value = []
  error.value = ''
}

onMounted(() => {
})
</script>

<style scoped>
.home {
  min-height: 100vh;
  position: relative;
  z-index: 1;
}

.search-section {
  margin-bottom: 2rem;
}

.search-form {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.search-form .input {
  flex: 1;
}

.search-results {
  margin-top: 1rem;
}

.location-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.location-item {
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
}

.location-item:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: #667eea;
}

.location-name {
  font-weight: 600;
  font-size: 1.1rem;
}

.location-details {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  margin-top: 0.25rem;
}

.weather-section {
  display: grid;
  gap: 2rem;
}

.back-section {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 1rem;
}

.back-btn {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.current-weather-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: center;
}

.weather-main {
  text-align: center;
}

.temperature {
  font-size: 3rem;
  font-weight: 300;
  color: #667eea;
}

.weather-description {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 0.5rem;
}

.weather-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.detail-item:last-child {
  border-bottom: none;
}

.label {
  color: rgba(255, 255, 255, 0.7);
}

.value {
  font-weight: 600;
  color: #ffffff;
}

.forecast-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.forecast-day {
  text-align: center;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  color: #ffffff;
}

.day-name {
  font-weight: 600;
  color: #667eea;
}

.day-date {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0.25rem 0;
}

.day-temp {
  margin: 0.5rem 0;
}

.max-temp {
  font-size: 1.2rem;
  font-weight: 600;
  color: #dc3545;
}

.min-temp {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  margin-left: 0.5rem;
}

.day-description {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 0.5rem;
}

/* Fun Information Section */
.fun-info {
  margin-top: 2rem;
}

.fun-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  color: #ffffff;
}

.fun-card h3 {
  color: #ffffff;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.fun-card p {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.fun-facts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.fact-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(102, 126, 234, 0.2);
  border-radius: 8px;
  border: 1px solid rgba(102, 126, 234, 0.3);
}

.fact-icon {
  font-size: 1.5rem;
}

.fact-text {
  color: #ffffff;
  font-weight: 500;
}

.popular-cities h4 {
  color: #ffffff;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.city-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.city-tag {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  border: none;
}

.city-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

@media (max-width: 768px) {
  .search-form {
    flex-direction: column;
  }
  
  .current-weather-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .forecast-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }
}
</style> 