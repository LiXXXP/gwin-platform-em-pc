<template>
  <div id="myMap" class="gwin-platform-map">
    <!-- 全屏显示 -->
    <div class="gwin-platform-map-full" @click="onFullScreen"></div>
    <!-- 底图 -->
    <div v-if="route.path.includes('editor')" class="gwin-platform-map-base flex flex-only-center">
      <div v-for="item in mapEditState.mapCategoryList" :key="item.category" @click="setMapCategory(item.category)">
        <img :src="item.coverUri" />
        <p>{{ item.name }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useMapInit } from './map-init'
import { mapEditState } from '@/views/common/map-config'
import { useMapBasicInfo } from '@/views/common/map/map-basic'

const route = useRoute()

const { initMap, destroyMap, setMapLayers } = useMapInit() // 地图初始化相关
const { getMapBasicInfoInquiry, mapBasicInfoMaintenance } = useMapBasicInfo() // 基本信息查询

const emit = defineEmits(['emitFullScreen'])

onMounted(async () => {
  if (!route.path.includes('share')) {
    await getMapBasicInfoInquiry() // 地图基本信息查询
  }
  initMap() // 地图初始
})

onUnmounted(() => {
  // 地图销毁
  destroyMap()
})

/**
 * 全屏展示, ref 元素需要在当前页面获取
 */
const onFullScreen = () => {
  emit('emitFullScreen')
}

/**
 * 底图切换
 */
const setMapCategory = async (category: number) => {
  await mapBasicInfoMaintenance(category) // 地图切换底图 信息维护
  await getMapBasicInfoInquiry() // 变更基本信息
  setMapLayers(category) // 设置底图样式
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
@include b('map') {
  width: calc(100vh - 92px);
  height: 100vh;
  flex: 1 1;
  position: relative;
  :deep(.amap-scalecontrol) {
    z-index: 9999;
  }
}
@include b('map-full') {
  width: 32px;
  height: 32px;
  z-index: 99;
  cursor: pointer;
  border-radius: 6px;
  box-sizing: border-box;
  background-color: #fff;
  box-shadow: 0 0 5px silver;
  background-image: url('@/assets/img/editor/icon-full.png');
  background-repeat: no-repeat;
  background-position: 50%;
  background-size: 18px;
  position: absolute;
  right: 60px;
  bottom: 160px;
}
@include b('map-base') {
  height: 80px;
  z-index: 99;
  cursor: pointer;
  position: absolute;
  right: 60px;
  bottom: 60px;
  &:hover {
    div:nth-child(1) {
      left: -380px;
    }
    div:nth-child(2) {
      left: -250px;
    }
    div:nth-child(3) {
      left: -120px;
    }
  }
  div {
    width: 120px;
    height: 80px;
    overflow: hidden;
    margin-left: 8px;
    border-radius: 6px;
    text-align: center;
    box-sizing: border-box;
    border: 3px solid #000;
    transition: all 0.4s;
    -ms-transition: all 0.4s;
    -moz-transition: all 0.4s;
    -webkit-transition: all 0.4s;
    -o-transition: all 0.4s;
    position: absolute;
    &:nth-child(1) {
      left: -140px;
    }
    &:nth-child(2) {
      left: -130px;
    }
    &:nth-child(3) {
      left: -120px;
      z-index: 999;
    }
    &::before {
      z-index: 99;
      content: '';
      width: 120px;
      height: 40px;
      display: block;
      background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%);
      position: absolute;
      bottom: 0;
      left: -3px;
    }
    &:hover {
      box-shadow: 0px 10px 10px 0px rgba(0, 0, 0, 0.5);
    }
    img {
      width: 100%;
      height: 100%;
    }
    p {
      z-index: 99;
      color: #fff;
      font-size: 14px;
      font-weight: 600;
      white-space: nowrap;
      text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.2);
      position: absolute;
      left: 50%;
      bottom: 8px;
      -webkit-transform: translate(-50%, 0);
      -moz-transform: translate(-50%, 0);
      transform: translate(-50%, 0);
    }
  }
}
</style>
