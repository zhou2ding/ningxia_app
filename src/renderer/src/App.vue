<template>
  <div id="app">
    <TopBar />
    <SideBar />
    <div class="main-content">
      <router-view :key="Math.random()" />
    </div>
  </div>
</template>

<script>
import TopBar from './components/TopBar/TopBar.vue'
import SideBar from './components/SideBar/SideBar.vue'

export default {
  components: {
    TopBar,
    SideBar
  }
}
</script>

<style scoped>
#app {
  display: flex;
}

.main-content {
  position: fixed;
  top: 50px;
  left: 200px;
  height: 100vh;
  min-height: calc(100% - 50px);
  width: calc(100% - 200px);
  background: url('./assets/images/bg.png') no-repeat center center;
  background-size: 100% 100%;
}
</style>
