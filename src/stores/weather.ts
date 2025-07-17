import { defineStore } from 'pinia'
import axios from 'axios'

export interface Location {
  name: string
  latitude: number
  longitude: number
  country: string
  admin1?: string
}

export interface CurrentWeather {
  temperature: number
  feelsLike: number
  humidity: number
  windSpeed: number
  description: string
  weatherCode: number
  time: string
}

export interface DailyForecast {
  date: string
  maxTemp: number
  minTemp: number
  description: string
}

export const useWeatherStore = defineStore('weather', {
  state: () => ({
    loading: false,
    error: null as string | null
  }),

  actions: {
    async searchLocations(query: string): Promise<Location[]> {
      try {
        this.loading = true
        this.error = null
        
        const response = await axios.get(
          `https://geocoding-api.open-meteo.com/v1/search`,
          {
            params: {
              name: query,
              count: 10,
              language: 'en',
              format: 'json'
            }
          }
        )

        if (response.data.results) {
          return response.data.results.map((result: any) => ({
            name: result.name,
            latitude: result.latitude,
            longitude: result.longitude,
            country: result.country,
            admin1: result.admin1
          }))
        }
        
        return []
      } catch (error) {
        this.error = 'Failed to search locations'
        console.error('Location search error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async getCurrentWeather(latitude: number, longitude: number): Promise<CurrentWeather> {
      try {
        this.loading = true
        this.error = null
        
        const response = await axios.get(
          `https://api.open-meteo.com/v1/forecast`,
          {
            params: {
              latitude,
              longitude,
              current: 'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code',
              timezone: 'auto'
            }
          }
        )

        const current = response.data.current
        
        return {
          temperature: current.temperature_2m,
          feelsLike: current.apparent_temperature,
          humidity: current.relative_humidity_2m,
          windSpeed: current.wind_speed_10m,
          description: this.getWeatherDescription(current.weather_code),
          weatherCode: current.weather_code,
          time: current.time
        }
      } catch (error) {
        this.error = 'Failed to fetch current weather'
        console.error('Current weather error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async getDailyForecast(latitude: number, longitude: number): Promise<DailyForecast[]> {
      try {
        this.loading = true
        this.error = null
        
        const today = new Date()
        const endDate = new Date()
        endDate.setDate(today.getDate() + 7)
        
        const response = await axios.get(
          `https://api.open-meteo.com/v1/forecast`,
          {
            params: {
              latitude,
              longitude,
              daily: 'temperature_2m_max,temperature_2m_min,weather_code',
              start_date: today.toISOString().split('T')[0],
              end_date: endDate.toISOString().split('T')[0],
              timezone: 'auto'
            }
          }
        )

        const daily = response.data.daily
        const forecast: DailyForecast[] = []

        for (let i = 0; i < daily.time.length; i++) {
          forecast.push({
            date: daily.time[i],
            maxTemp: daily.temperature_2m_max[i],
            minTemp: daily.temperature_2m_min[i],
            description: this.getWeatherDescription(daily.weather_code[i])
          })
        }

        return forecast
      } catch (error) {
        this.error = 'Failed to fetch daily forecast'
        console.error('Daily forecast error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    getWeatherDescription(code: number): string {
      const weatherCodes: { [key: number]: string } = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Foggy',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        56: 'Light freezing drizzle',
        57: 'Dense freezing drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        66: 'Light freezing rain',
        67: 'Heavy freezing rain',
        71: 'Slight snow fall',
        73: 'Moderate snow fall',
        75: 'Heavy snow fall',
        77: 'Snow grains',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        85: 'Slight snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with slight hail',
        99: 'Thunderstorm with heavy hail'
      }
      
      return weatherCodes[code] || 'Unknown'
    }
  }
}) 