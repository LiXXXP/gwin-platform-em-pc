<template>
  <div class="gwin-platform-element flex flex-column flex-only-center">
    <el-tooltip effect="dark" content="测距" placement="left">
      <i
        :class="[
          'gwin-platform-element__icon-ranging',
          {
            active: elementState.isActive.ranging
          }
        ]"
        @click="setMouseToolForRule"
      ></i>
    </el-tooltip>
    <el-tooltip effect="dark" content="测面" placement="left">
      <i
        :class="[
          'gwin-platform-element__icon-surface',
          {
            active: elementState.isActive.area
          }
        ]"
        @click="setMouseToolForArea"
      ></i>
    </el-tooltip>
  </div>
</template>

<script lang="ts" setup>
import { elementState } from '@/views/editor/components/tools/element-config'
import { useMouseTool } from './tool-config'
const { setMouseToolForRule, setMouseToolForArea } = useMouseTool()
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
@include b('element') {
  i {
    width: 32px;
    height: 32px;
    display: block;
    cursor: pointer;
    border-radius: 4px;
    margin-bottom: 8px;
    box-sizing: border-box;
    background-color: transparent;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background-size: 70%;
    &.active {
      background-color: #1c2028;
      border: 1px solid rgba(255, 255, 255, 0.5);
    }
  }

  @include e('icon-ranging') {
    background-image: url('@/assets/img/toolbar/icon-ranging.png');
    &.active,
    &:hover {
      background-image: url('@/assets/img/toolbar/icon-ranging-hover.png');
    }
  }
  @include e('icon-surface') {
    background-image: url('@/assets/img/toolbar/icon-surface.png');
    &.active,
    &:hover {
      background-image: url('@/assets/img/toolbar/icon-surface-hover.png');
    }
  }
}
</style>
