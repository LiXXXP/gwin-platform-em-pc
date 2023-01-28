<template>
  <div class="gwin-platform-element flex flex-column flex-only-center">
    <MoveTool></MoveTool>
    <MarkerTool></MarkerTool>
    <PolylineTool></PolylineTool>
    <hr />
    <CircleTool></CircleTool>
    <PolygonTool></PolygonTool>
    <hr />
    <ImportTool></ImportTool>
    <hr />
    <MouseTool></MouseTool>
  </div>
</template>

<script lang="ts" setup>
// 子组件
import MoveTool from '@/views/editor/components/tools/move/index.vue' // 移动工具
import MarkerTool from '@/views/editor/components/tools/marker/index.vue' // 点标记
import PolylineTool from '@/views/editor/components/tools/polyline/index.vue' // 折线
import CircleTool from '@/views/editor/components/tools/circle/index.vue' // 圆与椭圆
import PolygonTool from '@/views/editor/components/tools/polygon/index.vue' // 矩形与多边形
import ImportTool from '@/views/editor/components/tools/import/index.vue' // 批量导入
import MouseTool from '@/views/common/tools/index.vue' // 测距测面工具
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
@include b('element') {
  width: 100%;
  hr {
    border: 0;
    width: 48px;
    height: 1px;
    margin-bottom: 8px;
    transform: scale(0.5);
    background-color: #5a5f68;
  }
}
</style>
