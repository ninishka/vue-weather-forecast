<template>
  <div id="app">
    <header class="app-header">
      <h1>🌤️ Weather Forecast</h1>
    </header>
    
    <main class="app-main">
      <router-view />
    </main>
    
    <footer class="app-footer">
      <p>Powered by Open-Meteo API</p>
    </footer>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.app-header h1 {
  margin: 0;
  font-size: 2rem;
  font-weight: 300;
}

.app-main {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.app-footer {
  background: #f8f9fa;
  color: #6c757d;
  text-align: center;
  padding: 1rem;
  border-top: 1px solid #e9ecef;
}
</style> 