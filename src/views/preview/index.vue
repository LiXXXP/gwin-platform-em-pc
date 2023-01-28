<template>
  <div ref="editorPageRef" class="gwin-platform-preview flex flex-column flex-center">
    <!-- 头部 名称 搜索 快捷键 -->
    <div class="gwin-platform-preview__header">
      <HeadView></HeadView>
    </div>
    <div class="flex flex-only-center">
      <!-- 左侧 业务图层 要素编辑 -->
      <div class="gwin-platform-preview__left">
        <!-- 业务图层 -->
        <BusinessView></BusinessView>
      </div>
      <!-- 地图 -->
      <MapView @emit-full-screen="onFullScreen"></MapView>
      <!-- 右侧 要素创建 工具栏 -->
      <div class="gwin-platform-preview__right">
        <MouseTool></MouseTool>
      </div>
    </div>
    <!-- 底部 经纬度 比例尺 -->
    <div class="gwin-platform-preview__footer flex flex-end">
      <LocationView></LocationView>
    </div>
  </div>
  <el-image-viewer
    v-if="previewState.isPreview"
    :url-list="layerState.elementInquiry?.pictures"
    :initial-index="previewState.index"
    @close="onCloseViewer"
  ></el-image-viewer>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { mapEditState } from '@/views/common/map-config'
import { layerState } from '@/views/editor/components/layer/layer.config'
import { previewState } from './preview-config'

// 子组件
import HeadView from '@/views/common/header/index.vue' // 头部 名称 搜索 快捷键
import BusinessView from '@/views/editor/components/layer/business/index.vue' // 左侧业务图层
import MapView from '@/views/common/map/index.vue' // 地图
import MouseTool from '@/views/common/tools/index.vue' // 测距测面
import LocationView from '@/views/common/footer/index.vue' // 地图底部 鼠标移动显示经纬度

import { useMapGround } from '@/views/common/map/map-ground'
import { usePreviewElementEvent } from './preview-element-event'
const { editorPageRef, onFullScreen } = useMapGround() // 全屏显示
const { onCloseViewer } = usePreviewElementEvent()

const route = useRoute()
mapEditState.mapId = <string>route.query?.id
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
@include b('preview') {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  @include e('header') {
    width: 100%;
    height: 50px;
    z-index: 999;
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
