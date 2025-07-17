# Vue Weather Forecast

A simple weather app built with Vue 3 that shows current weather and 7-day forecasts. Search for any city and get real-time weather data.

## What it does

- Search for cities and get weather info
- See current temperature, humidity, wind speed
- View 7-day forecast with daily highs/lows
- Works on mobile and desktop
- Dark theme with weather animations

## Tech stack

- Vue 3 + TypeScript
- Pinia for state management
- Vite for building
- Open-Meteo API (free, no API key needed)

## Getting started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## How to use

1. Type a city name in the search box
2. Click on a location from the results
3. View current weather and forecast
4. Use the "Back to Search" button to search again

## Deployment

The app is set up for GitHub Pages deployment. Just push to main branch and it'll auto-deploy.

## Local development

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

That's it! The app uses the free Open-Meteo API so no API keys or setup required. 