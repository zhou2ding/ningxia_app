<template>
  <div>
    <AppHeader></AppHeader>
    <div class="main">
      <div class="row1">
        <!-- 文件处理区域 -->
        <div class="file-process">
          <FileProcess/>
        </div>
        <!-- 排名区域 -->
        <div class="rank-container">
          <div class="coming-soon-overlay">敬请期待</div>
          <RoadRank class="inline"/>
        </div>
        <!-- 地图区域 -->
        <div class="map-container">
          <div class="coming-soon-overlay">敬请期待</div>
          <RoadMap class="inline"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppHeader from '../components/AppHeader/AppHeader.vue'
import FileProcess from '../components/FileProcess/FileProcess.vue'
import RoadMap from '../components/RoadMap/RoadMap.vue'
import RoadRank from '../components/RoadRank/RoadRank.vue'


export default {
  components: {
    AppHeader,
    FileProcess,
    RoadMap,
    RoadRank
  }
}

</script>

<style scoped>
.main {
  width: 100%;
  margin-top: 100px;
}

.row1 {
  width: 100%;
  height: 500px;
  margin-bottom: 20px;
  padding: 0 20px;
  display: flex;
  justify-content: space-evenly;
  gap: 20px;
  align-items: flex-start;
  box-sizing: border-box;
  flex-wrap: wrap;
}

.map-container {
  position: relative;
  height: 400px;
  width: 400px;
}

.rank-container {
  position: relative;
  width: 400px;
  height: 400px;
}

.coming-soon-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
  z-index: 9999;
}

.map-container:hover .coming-soon-overlay,
.rank-container:hover .coming-soon-overlay {
  opacity: 1;
}

.file-process {
  width: 350px;
  height: 440px;
  margin-right: 50px;
  margin-bottom: 50px;
}
</style>
