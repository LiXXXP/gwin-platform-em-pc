<template>
  <el-tooltip effect="dark" content="折线" placement="left">
    <i
      :class="[
        'gwin-platform-element__icon-line',
        {
          active: elementState.isActive.line
        }
      ]"
      @click="addMapElemenForPolyline"
    ></i>
  </el-tooltip>
</template>

<script lang="ts" setup>
import { elementState } from '@/views/editor/components/tools/element-config'
import { useElementPolyline } from './polyline'
const { addMapElemenForPolyline } = useElementPolyline() // 点编辑
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
  @include e('icon-line') {
    background-image: url('@/assets/img/toolbar/icon-line.png');
    &.active,
    &:hover {
      background-image: url('@/assets/img/toolbar/icon-line-hover.png');
    }
  }
}
</style>
