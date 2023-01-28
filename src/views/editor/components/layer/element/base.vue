<template>
  <div class="gwin-platform-attribute__base">
    <div class="gwin-platform-base__design">外观</div>
    <!-- 尺寸 -->
    <SizeRadio
      v-if="layerState.currentElementType?.includes('AMap.Marker')"
      :size="layerState.elementInquiry.size"
      @emit-change-for-size="emitChangeForSize"
    ></SizeRadio>
    <!-- 线形 -->
    <LineSelect
      v-if="!layerState.currentElementType?.includes('AMap.Marker')"
      :line-category="layerState.elementInquiry.lineCategory"
      :stroke-weight="layerState.elementInquiry.drawJson?.strokeWeight"
      @emit-change-for-line-category="emitChangeForLineCategory"
      @emit-change-for-stroke-weight="emitChangeForStrokeWeight"
    ></LineSelect>
    <!-- 填充 -->
    <ColorPicker
      :title="'填充'"
      :color="layerState.elementInquiry?.fillColor || ''"
      :category="layerState.elementInquiry.category"
      :display="layerState.elementInquiry.fillColorDisplay"
      @emit-change-for-color="emitChangeForFillColor"
      @emit-change-element-select-color="emitElementSelectFillColor"
    ></ColorPicker>
    <!-- 描边 -->
    <ColorPicker
      v-if="!layerState.currentElementType?.includes('AMap.Marker')"
      :title="'描边'"
      :color="layerState.elementInquiry?.strokeColor || ''"
      :category="layerState.elementInquiry.category"
      :display="layerState.elementInquiry.strokeColorDisplay"
      @emit-change-for-color="emitChangeForStrokeColor"
      @emit-change-element-select-color="emitElementSelectStrokeColor"
    ></ColorPicker>
    <!-- 透明度 -->
    <TransparencySlider
      v-if="!layerState.currentElementType?.includes('AMap.Marker')"
      :transparency="layerState.elementInquiry?.transparency"
      @emit-change-for-transparency="emitChangeForTransparency"
    ></TransparencySlider>
  </div>
</template>

<script lang="ts" setup>
import { layerState } from '../layer.config'
// 公共组件
import SizeRadio from '@/components/SizeRadio/index.vue' // 尺寸大小
import LineSelect from '@/components/LineSelect/index.vue' // 线形
import ColorPicker from '@/components/ColorPicker/index.vue' // 颜色填充
import TransparencySlider from '@/components/TransparencySlider/index.vue' // 透明度

import { useElementBase } from './element-base'

const {
  emitChangeForSize,
  emitChangeForFillColor,
  emitChangeForStrokeColor,
  emitChangeForTransparency,
  emitChangeForLineCategory,
  emitChangeForStrokeWeight,
  emitElementSelectFillColor,
  emitElementSelectStrokeColor
} = useElementBase()
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
@include b('attribute') {
  @include e('base') {
    color: #fff;
    font-size: 12px;
    box-sizing: border-box;
    background-color: #2a2f37;
  }
}
@include b('base') {
  @include e('design') {
    padding: 8px 0;
    font-weight: 600;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }
}
</style>
