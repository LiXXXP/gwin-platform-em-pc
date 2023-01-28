<template>
  <div ref="editorPageRef" class="gwin-platform-editor flex flex-column flex-center">
    <!-- 头部 名称 搜索 快捷键 -->
    <div class="gwin-platform-editor__header">
      <HeadView></HeadView>
    </div>
    <div class="flex flex-only-center">
      <!-- 左侧 业务图层 要素编辑 -->
      <div class="gwin-platform-editor__left">
        <!-- 业务图层 -->
        <BusinessView></BusinessView>
        <!-- 要素编辑 -->
        <ElementView></ElementView>
      </div>
      <!-- 地图 -->
      <MapView @emit-full-screen="onFullScreen"></MapView>
      <!-- 右侧 要素创建 工具栏 -->
      <div class="gwin-platform-editor__right">
        <ElementToolBar></ElementToolBar>
      </div>
    </div>
    <!-- 底部 经纬度 比例尺 -->
    <div class="gwin-platform-editor__footer flex flex-end">
      <LocationView></LocationView>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { mapEditState } from '@/views/common/map-config'

// 子组件
import HeadView from '@/views/common/header/index.vue' // 头部 名称 搜索 快捷键
import BusinessView from './components/layer/business/index.vue' // 左侧业务图层
import ElementView from './components/layer/element/index.vue' // 左侧要素编辑
import MapView from '@/views/common/map/index.vue' // 地图
import ElementToolBar from '@/views/editor/components/tools/index.vue' // 右侧要素创建工具栏
import LocationView from '@/views/common/footer/index.vue' // 地图底部 鼠标移动显示经纬度

import { useMapGround } from '@/views/common/map/map-ground'
const { editorPageRef, onFullScreen } = useMapGround() // 全屏显示

const route = useRoute()
mapEditState.mapId = <string>route.query?.id
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
@include b('editor') {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  @include e('header') {
    width: 100%;
    height: 50px;
    z-index: 3333;
    padding: 0 20px;
    box-sizing: border-box;
    background-color: #2a2f37;
    position: fixed;
    top: 0;
    left: 0;
  }
  @include e('left') {
    width: 50px;
    height: 100%;
    padding: 50px 0;
    box-sizing: border-box;
    background-color: #2a2f37;
    border-bottom: 1px solid #5a5f68;
    border-right: 1px solid #5a5f68;
  }
  @include e('right') {
    width: 42px;
    height: 100%;
    padding: 70px 0;
    box-sizing: border-box;
    background-color: #2a2f37;
    border-left: 1px solid #5a5f68;
  }
  @include e('footer') {
    width: 100%;
    height: 42px;
    z-index: 999;
    box-sizing: border-box;
    background-color: #2a2f37;
    border-top: 1px solid #5a5f68;
    position: fixed;
    left: 0;
    bottom: 0;
    &::after {
      content: '';
      width: 42px;
      height: 1px;
      background-color: #2a2f37;
      position: absolute;
      top: -1px;
      right: -1px;
    }
  }
}
</style>
