<template>
  <el-tooltip effect="dark" content="编辑点" placement="left">
    <i
      :class="[
        'gwin-platform-element__icon-mark',
        {
          active: elementState.isActive.marker
        }
      ]"
      @click="addMapElemenForMarker"
    ></i>
  </el-tooltip>
</template>

<script lang="ts" setup>
import { elementState } from '@/views/editor/components/tools/element-config'
import { useElementMarker } from './marker'
const { addMapElemenForMarker } = useElementMarker() // 点编辑
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
  @include e('icon-mark') {
    background-image: url('@/assets/img/toolbar/icon-mark.png');
    &.active,
    &:hover {
      background-image: url('@/assets/img/toolbar/icon-mark-hover.png');
    }
  }
}
</style>
