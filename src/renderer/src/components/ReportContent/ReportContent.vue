<template>
  <div class="report-content">
    <div class="title">{{ title }}</div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  }
})
</script>

<style lang="less" scoped>
.report-content {
  width: 100%;
  height: 100%;
  position: relative;
  background: url('../../assets/images/kuang.png') no-repeat;
  background-size: 100% 100%;

  .title {
    position: absolute;
    top: 0;
    left: 12px;
    text-align: left;
    color: #2b8fff;
    font-size: 18px;
    z-index: 1;
  }
}
</style>
