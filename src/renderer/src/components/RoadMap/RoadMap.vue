<template>
  <div class="animate-border">
    <div class="content-wrapper">
      <h2 class="map-form-title">地图搜索</h2>
      <!-- 百度地图 -->
      <div id="map1" style="width: 100%; height: 280px; margin-top: 20px;"></div>
    </div>
    <i></i>
    <i></i>
  </div>
</template>

<script>
/* global BMapGL */
export default {
  name: "RoadMap",
  mounted() {
    this.checkBaiduMapReady();
  },
  methods: {
    checkBaiduMapReady() {
      if (window.BMapGL) {
        this.initMap();
      } else {
        setTimeout(() => {
          this.checkBaiduMapReady();
        }, 200);
      }
    },
    initMap() {
      // 初始化百度地图
      this.map = new BMapGL.Map("map1");
      const centerPoint = new BMapGL.Point(106.2046, 37.9937);
      this.map.centerAndZoom(centerPoint, 8);
      this.map.enableScrollWheelZoom(true);
      // 添加比例尺控件
      const scaleControl = new BMapGL.ScaleControl();
      this.map.addControl(scaleControl);
      // 添加导航控件
      const navControl = new BMapGL.NavigationControl();
      this.map.addControl(navControl);
    }
  }
};
</script>

<style lang="scss" scoped>
@use '../../styles/variables/variables.module' as *;

.animate-border {
  padding-bottom: 20px;
  overflow: hidden;
  border: 2px solid rgba(91, 166, 255, 0.4);
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: center;

  &::before,
  &::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 2px;
  }

  i {
    position: absolute;
    display: inline-block;
    height: 100%;
    width: 2px;
  }

  &::before {
    top: 0;
    left: -100%;
    background-image: linear-gradient(90deg, transparent, #6ec8ff, transparent);
    animation: one 4s linear infinite;
  }

  i:nth-of-type(1) {
    top: -100%;
    right: 0;
    background-image: linear-gradient(180deg, transparent, #6ec8ff, transparent);
    animation: two 4s linear 1s infinite;
  }

  &::after {
    bottom: 0;
    right: -100%;
    background-image: linear-gradient(-90deg, transparent, #6ec8ff, transparent);
    animation: three 4s linear 2s infinite;
  }

  i:nth-of-type(2) {
    bottom: -100%;
    left: 0;
    background-image: linear-gradient(360deg, transparent, #6ec8ff, transparent);
    animation: four 4s linear 3s infinite;
  }

  .content-wrapper {
    width: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .map-form-title {
      color: #3ad9ff;
      font-size: 24px;
      text-align: center;
    }
  }
}

@keyframes one {
  0% {
    left: -100%;
  }
  50%,
  100% {
    left: 100%;
  }
}

@keyframes two {
  0% {
    top: -100%;
  }
  50%,
  100% {
    top: 100%;
  }
}

@keyframes three {
  0% {
    right: -100%;
  }
  50%,
  100% {
    right: 100%;
  }
}

@keyframes four {
  0% {
    bottom: -100%;
  }
  50%,
  100% {
    bottom: 100%;
  }
}
</style>
