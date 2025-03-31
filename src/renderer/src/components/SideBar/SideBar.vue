<template>
  <div class="sidebar">
    <div class="menu-item">
      <div class="menu-header" @click="toggleMenu">
        <span>路况数据</span>
        <span class="arrow" :class="{ 'arrow-down': isExpanded }"></span>
      </div>
      <div v-if="isExpanded" class="submenu">
        <router-link to="/roadDetect" class="sidebar-link" active-class="active-link">
          计算数据
        </router-link>
        <router-link to="/setting" class="sidebar-link" active-class="active-link">
          指标配置
        </router-link>
        <router-link to="/statistics" class="sidebar-link" active-class="active-link">
          统计功能
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isExpanded = ref(true)

const toggleMenu = () => {
  isExpanded.value = !isExpanded.value
}
</script>

<style lang="scss" scoped>
@import '../../styles/variables/variables.module';

.sidebar {
  z-index: calc($base-z-index + 1);
  overflow: hidden;
  width: $base-left-menu-width;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  background-color: $base-menu-background;
  padding-top: 50px;
  box-shadow: 0 2px 6px rgba(0, 21, 41, 0.4);
  transition: $base-transition;
  border-right: 1px solid rgba(0, 0, 0, 0.1); /* 添加右边的分界线 */
}

.sidebar-link {
  display: block;
  padding: 15px;
  color: $base-menu-color;
  text-decoration: none;

  &:hover,
  &.active-link {
    color: #fff;
    background-color: #546d8d;
  }
}

.menu-item {
  .menu-header {
    padding: 15px;
    color: $base-menu-color;
    font-weight: bold;
    font-size: $base-font-size-big;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .arrow {
      display: inline-block;
      width: 10px;
      height: 10px;
      border: solid $base-menu-color;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
      transition: transform 0.3s;
    }

    .arrow-down {
      transform: rotate(225deg);
    }
  }

  .submenu {
    background-color: $base-menu-background;

    .sidebar-link {
      padding: 10px 35px;
    }
  }
}
</style>
