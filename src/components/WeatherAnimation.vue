<template>
  <div class="weather-animation" :class="animationClass">
    <div v-if="weatherType === 'sunny'" class="sunny-animation">
      <div class="sun"></div>
      <div class="clouds">
        <div class="cloud cloud1"></div>
        <div class="cloud cloud2"></div>
        <div class="cloud cloud3"></div>
      </div>
    </div>

    <div v-if="weatherType === 'rainy'" class="rainy-animation">
      <div class="clouds">
        <div class="cloud rain-cloud1"></div>
        <div class="cloud rain-cloud2"></div>
        <div class="cloud rain-cloud3"></div>
      </div>
      <div class="rain">
        <div v-for="i in 50" :key="i" class="raindrop" :style="getRaindropStyle(i)"></div>
      </div>
    </div>

    <div v-if="weatherType === 'snowy'" class="snowy-animation">
      <div class="clouds">
        <div class="cloud snow-cloud1"></div>
        <div class="cloud snow-cloud2"></div>
      </div>
      <div class="snow">
        <div v-for="i in 40" :key="i" class="snowflake" :style="getSnowflakeStyle(i)"></div>
      </div>
    </div>

    <div v-if="weatherType === 'cloudy'" class="cloudy-animation">
      <div class="clouds">
        <div class="cloud cloudy-cloud1"></div>
        <div class="cloud cloudy-cloud2"></div>
        <div class="cloud cloudy-cloud3"></div>
        <div class="cloud cloudy-cloud4"></div>
        <div class="cloud cloudy-cloud5"></div>
      </div>
    </div>

    <div v-if="weatherType === 'storm'" class="storm-animation">
      <div class="clouds">
        <div class="cloud storm-cloud1"></div>
        <div class="cloud storm-cloud2"></div>
        <div class="cloud storm-cloud3"></div>
      </div>
      <div class="lightning">
        <div class="lightning-bolt"></div>
        <div class="lightning-bolt"></div>
      </div>
      <div class="rain">
        <div v-for="i in 60" :key="i" class="raindrop heavy" :style="getRaindropStyle(i)"></div>
      </div>
    </div>

    <div v-if="weatherType === 'foggy'" class="foggy-animation">
      <div class="fog-layer fog1"></div>
      <div class="fog-layer fog2"></div>
      <div class="fog-layer fog3"></div>
    </div>

    <div v-if="weatherType === 'clear-night'" class="clear-night-animation">
      <div class="stars">
        <div v-for="i in 100" :key="i" class="star" :style="getStarStyle(i)"></div>
      </div>
      <div class="moon"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  weatherCode: number
  isNight?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isNight: false
})

const weatherType = computed(() => {
  const code = props.weatherCode
  
  if (code === 0) {
    return props.isNight ? 'clear-night' : 'sunny'
  }
  
  if (code === 1) {
    return props.isNight ? 'clear-night' : 'sunny'
  }
  
  if (code === 2) {
    return 'cloudy'
  }
  
  if (code === 3) {
    return 'cloudy'
  }
  
  if (code === 45 || code === 48) {
    return 'foggy'
  }
  
  if (code >= 51 && code <= 67) {
    return 'rainy'
  }
  
  if (code >= 71 && code <= 86) {
    return 'snowy'
  }
  
  if (code >= 95 && code <= 99) {
    return 'storm'
  }
  
  if (code >= 80 && code <= 82) {
    return 'rainy'
  }
  
  if (code >= 85 && code <= 86) {
    return 'snowy'
  }
  
  return 'sunny'
})

const animationClass = computed(() => `weather-${weatherType.value}`)

const getRaindropStyle = (index: number) => ({
  left: `${Math.random() * 100}%`,
  animationDelay: `${Math.random() * 2}s`,
  animationDuration: `${0.5 + Math.random() * 0.5}s`
})

const getSnowflakeStyle = (index: number) => ({
  left: `${Math.random() * 100}%`,
  animationDelay: `${Math.random() * 3}s`,
  animationDuration: `${3 + Math.random() * 2}s`,
  opacity: 0.7 + Math.random() * 0.3
})

const getStarStyle = (index: number) => ({
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  animationDelay: `${Math.random() * 3}s`,
  animationDuration: `${1 + Math.random() * 2}s`
})
</script>

<style scoped>
.weather-animation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
}

.weather-sunny {
  background: linear-gradient(135deg, rgba(135, 206, 235, 0.3) 0%, rgba(152, 216, 232, 0.3) 50%, rgba(176, 224, 230, 0.3) 100%);
}

.sun {
  position: absolute;
  top: 10%;
  right: 10%;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, #FFD700 0%, #FFA500 100%);
  border-radius: 50%;
  box-shadow: 0 0 50px #FFD700;
  animation: sunPulse 3s ease-in-out infinite;
}

@keyframes sunPulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 50px #FFD700; }
  50% { transform: scale(1.1); box-shadow: 0 0 80px #FFD700; }
}

.cloud {
  position: absolute;
  background: white;
  opacity: 0.9;
  animation: float 6s ease-in-out infinite;
  filter: blur(0.5px);
}

.cloud::before,
.cloud::after {
  content: '';
  position: absolute;
  background: white;
  border-radius: 50%;
}

.cloud1 {
  width: 120px;
  height: 60px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
  border-radius: 60px;
}

.cloud1::before {
  width: 50px;
  height: 50px;
  top: -25px;
  left: 15px;
}

.cloud1::after {
  width: 40px;
  height: 40px;
  top: -20px;
  right: 20px;
}

.cloud2 {
  width: 90px;
  height: 45px;
  top: 30%;
  right: 20%;
  animation-delay: 2s;
  border-radius: 45px;
}

.cloud2::before {
  width: 35px;
  height: 35px;
  top: -17px;
  left: 10px;
}

.cloud2::after {
  width: 30px;
  height: 30px;
  top: -15px;
  right: 15px;
}

.cloud3 {
  width: 140px;
  height: 70px;
  top: 15%;
  left: 50%;
  animation-delay: 4s;
  border-radius: 70px;
}

.cloud3::before {
  width: 60px;
  height: 60px;
  top: -30px;
  left: 20px;
}

.cloud3::after {
  width: 50px;
  height: 50px;
  top: -25px;
  right: 25px;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.weather-rainy {
  background: linear-gradient(135deg, rgba(44, 62, 80, 0.4) 0%, rgba(52, 73, 94, 0.4) 50%, rgba(93, 109, 126, 0.4) 100%);
}

.rain-cloud1, .rain-cloud2, .rain-cloud3 {
  background: #34495E;
  box-shadow: 0 0 20px rgba(52, 73, 94, 0.5);
  filter: blur(0.5px);
}

.rain-cloud1 {
  width: 160px;
  height: 80px;
  top: 10%;
  left: 5%;
  border-radius: 80px;
}

.rain-cloud1::before {
  width: 70px;
  height: 70px;
  top: -35px;
  left: 20px;
  background: #34495E;
}

.rain-cloud1::after {
  width: 60px;
  height: 60px;
  top: -30px;
  right: 25px;
  background: #34495E;
}

.rain-cloud2 {
  width: 140px;
  height: 70px;
  top: 15%;
  right: 10%;
  border-radius: 70px;
}

.rain-cloud2::before {
  width: 60px;
  height: 60px;
  top: -30px;
  left: 15px;
  background: #34495E;
}

.rain-cloud2::after {
  width: 50px;
  height: 50px;
  top: -25px;
  right: 20px;
  background: #34495E;
}

.rain-cloud3 {
  width: 120px;
  height: 60px;
  top: 8%;
  left: 60%;
  border-radius: 60px;
}

.rain-cloud3::before {
  width: 50px;
  height: 50px;
  top: -25px;
  left: 10px;
  background: #34495E;
}

.rain-cloud3::after {
  width: 40px;
  height: 40px;
  top: -20px;
  right: 15px;
  background: #34495E;
}

.raindrop {
  position: absolute;
  width: 2px;
  height: 20px;
  background: linear-gradient(to bottom, transparent, #87CEEB);
  border-radius: 0 0 2px 2px;
  animation: rain linear infinite;
}

@keyframes rain {
  0% { transform: translateY(-100vh); }
  100% { transform: translateY(100vh); }
}

.weather-snowy {
  background: linear-gradient(135deg, rgba(232, 244, 253, 0.2) 0%, rgba(240, 248, 255, 0.2) 50%, rgba(248, 251, 255, 0.2) 100%);
}

.snow-cloud1, .snow-cloud2 {
  background: #B8C6DB;
  box-shadow: 0 0 20px rgba(184, 198, 219, 0.5);
  filter: blur(0.5px);
}

.snow-cloud1 {
  width: 140px;
  height: 70px;
  top: 10%;
  left: 15%;
  border-radius: 70px;
}

.snow-cloud1::before {
  width: 60px;
  height: 60px;
  top: -30px;
  left: 15px;
  background: #B8C6DB;
}

.snow-cloud1::after {
  width: 50px;
  height: 50px;
  top: -25px;
  right: 20px;
  background: #B8C6DB;
}

.snow-cloud2 {
  width: 120px;
  height: 60px;
  top: 15%;
  right: 20%;
  border-radius: 60px;
}

.snow-cloud2::before {
  width: 50px;
  height: 50px;
  top: -25px;
  left: 10px;
  background: #B8C6DB;
}

.snow-cloud2::after {
  width: 40px;
  height: 40px;
  top: -20px;
  right: 15px;
  background: #B8C6DB;
}

.snowflake {
  position: absolute;
  width: 6px;
  height: 6px;
  background: white;
  border-radius: 50%;
  animation: snow linear infinite;
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
}

@keyframes snow {
  0% { transform: translateY(-100vh) rotate(0deg); }
  100% { transform: translateY(100vh) rotate(360deg); }
}

.weather-cloudy {
  background: linear-gradient(135deg, rgba(189, 195, 199, 0.3) 0%, rgba(149, 165, 166, 0.3) 50%, rgba(127, 140, 141, 0.3) 100%);
}

.cloudy-cloud1, .cloudy-cloud2, .cloudy-cloud3, .cloudy-cloud4, .cloudy-cloud5 {
  background: #95A5A6;
  box-shadow: 0 0 15px rgba(149, 165, 166, 0.5);
  filter: blur(0.5px);
}

.cloudy-cloud1 {
  width: 160px;
  height: 80px;
  top: 10%;
  left: 5%;
  animation-delay: 0s;
  border-radius: 80px;
}

.cloudy-cloud1::before {
  width: 70px;
  height: 70px;
  top: -35px;
  left: 20px;
  background: #95A5A6;
}

.cloudy-cloud1::after {
  width: 60px;
  height: 60px;
  top: -30px;
  right: 25px;
  background: #95A5A6;
}

.cloudy-cloud2 {
  width: 140px;
  height: 70px;
  top: 20%;
  right: 15%;
  animation-delay: 1s;
  border-radius: 70px;
}

.cloudy-cloud2::before {
  width: 60px;
  height: 60px;
  top: -30px;
  left: 15px;
  background: #95A5A6;
}

.cloudy-cloud2::after {
  width: 50px;
  height: 50px;
  top: -25px;
  right: 20px;
  background: #95A5A6;
}

.cloudy-cloud3 {
  width: 120px;
  height: 60px;
  top: 15%;
  left: 50%;
  animation-delay: 2s;
  border-radius: 60px;
}

.cloudy-cloud3::before {
  width: 50px;
  height: 50px;
  top: -25px;
  left: 10px;
  background: #95A5A6;
}

.cloudy-cloud3::after {
  width: 40px;
  height: 40px;
  top: -20px;
  right: 15px;
  background: #95A5A6;
}

.cloudy-cloud4 {
  width: 130px;
  height: 65px;
  top: 25%;
  left: 30%;
  animation-delay: 3s;
  border-radius: 65px;
}

.cloudy-cloud4::before {
  width: 55px;
  height: 55px;
  top: -27px;
  left: 12px;
  background: #95A5A6;
}

.cloudy-cloud4::after {
  width: 45px;
  height: 45px;
  top: -22px;
  right: 18px;
  background: #95A5A6;
}

.cloudy-cloud5 {
  width: 100px;
  height: 50px;
  top: 12%;
  right: 5%;
  animation-delay: 4s;
  border-radius: 50px;
}

.cloudy-cloud5::before {
  width: 40px;
  height: 40px;
  top: -20px;
  left: 8px;
  background: #95A5A6;
}

.cloudy-cloud5::after {
  width: 35px;
  height: 35px;
  top: -17px;
  right: 12px;
  background: #95A5A6;
}

.weather-storm {
  background: linear-gradient(135deg, rgba(44, 62, 80, 0.5) 0%, rgba(52, 73, 94, 0.5) 50%, rgba(27, 38, 49, 0.5) 100%);
}

.storm-cloud1, .storm-cloud2, .storm-cloud3 {
  background: #1B2631;
  box-shadow: 0 0 30px rgba(27, 38, 49, 0.8);
  filter: blur(0.5px);
}

.storm-cloud1 {
  width: 200px;
  height: 100px;
  top: 5%;
  left: 10%;
  border-radius: 100px;
}

.storm-cloud1::before {
  width: 80px;
  height: 80px;
  top: -40px;
  left: 25px;
  background: #1B2631;
}

.storm-cloud1::after {
  width: 70px;
  height: 70px;
  top: -35px;
  right: 30px;
  background: #1B2631;
}

.storm-cloud2 {
  width: 180px;
  height: 90px;
  top: 12%;
  right: 15%;
  border-radius: 90px;
}

.storm-cloud2::before {
  width: 75px;
  height: 75px;
  top: -37px;
  left: 20px;
  background: #1B2631;
}

.storm-cloud2::after {
  width: 65px;
  height: 65px;
  top: -32px;
  right: 25px;
  background: #1B2631;
}

.storm-cloud3 {
  width: 160px;
  height: 80px;
  top: 8%;
  left: 60%;
  border-radius: 80px;
}

.storm-cloud3::before {
  width: 70px;
  height: 70px;
  top: -35px;
  left: 15px;
  background: #1B2631;
}

.storm-cloud3::after {
  width: 60px;
  height: 60px;
  top: -30px;
  right: 20px;
  background: #1B2631;
}

.lightning {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.lightning-bolt {
  position: absolute;
  top: 5%;
  left: 25%;
  width: 6px;
  height: 120px;
  background: linear-gradient(to bottom, #FFFFFF, #FFD700, #FFA500, #FF4500);
  clip-path: polygon(50% 0%, 20% 30%, 50% 40%, 30% 60%, 50% 70%, 40% 90%, 50% 100%);
  animation: lightning 3s ease-in-out infinite;
  opacity: 0;
  filter: blur(0.5px);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
}

.lightning-bolt:nth-child(2) {
  left: 75%;
  animation-delay: 1.5s;
  height: 100px;
  clip-path: polygon(50% 0%, 30% 25%, 50% 35%, 20% 55%, 50% 65%, 35% 85%, 50% 100%);
}

@keyframes lightning {
  0%, 85%, 100% { opacity: 0; transform: scale(1); }
  5%, 10% { opacity: 1; transform: scale(1.2); }
  15%, 20% { opacity: 0.8; transform: scale(1); }
  25%, 30% { opacity: 1; transform: scale(1.1); }
}

.raindrop.heavy {
  width: 3px;
  height: 25px;
  background: linear-gradient(to bottom, transparent, #5D6D7E);
}

.weather-foggy {
  background: linear-gradient(135deg, rgba(213, 219, 219, 0.3) 0%, rgba(189, 195, 199, 0.3) 50%, rgba(174, 182, 191, 0.3) 100%);
}

.fog-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.3);
  animation: fogMove 20s linear infinite;
}

.fog1 {
  animation-delay: 0s;
  background: rgba(255, 255, 255, 0.2);
}

.fog2 {
  animation-delay: 7s;
  background: rgba(255, 255, 255, 0.15);
}

.fog3 {
  animation-delay: 14s;
  background: rgba(255, 255, 255, 0.25);
}

@keyframes fogMove {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.weather-clear-night {
  background: linear-gradient(135deg, rgba(11, 20, 38, 0.6) 0%, rgba(27, 38, 49, 0.6) 50%, rgba(44, 62, 80, 0.6) 100%);
}

.stars {
  position: absolute;
  width: 100%;
  height: 100%;
}

.star {
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  animation: twinkle ease-in-out infinite;
  box-shadow: 0 0 3px rgba(255, 255, 255, 0.8);
}

@keyframes twinkle {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

.moon {
  position: absolute;
  top: 10%;
  right: 15%;
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, #F4F6F7 0%, #D5DBDB 100%);
  border-radius: 50%;
  box-shadow: 0 0 30px rgba(244, 246, 247, 0.5);
  animation: moonGlow 4s ease-in-out infinite;
}

@keyframes moonGlow {
  0%, 100% { box-shadow: 0 0 30px rgba(244, 246, 247, 0.5); }
  50% { box-shadow: 0 0 50px rgba(244, 246, 247, 0.8); }
}

@media (max-width: 768px) {
  .sun {
    width: 60px;
    height: 60px;
    top: 5%;
    right: 5%;
  }
  
  .cloud {
    transform: scale(0.8);
  }
  
  .moon {
    width: 50px;
    height: 50px;
    top: 5%;
    right: 10%;
  }
}
</style> 