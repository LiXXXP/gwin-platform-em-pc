<template>
  <el-tooltip effect="dark" content="移动" placement="left">
    <i
      :class="[
        'gwin-platform-element__icon-move',
        {
          active: elementState.isActive.move
        }
      ]"
      @click="setElementDraggable"
    ></i>
  </el-tooltip>
  <el-tooltip effect="dark" content="左键单击点选，按住Ctrl/command点选多个" placement="left">
    <i class="gwin-platform-element__icon-choose"></i>
  </el-tooltip>
</template>

<script lang="ts" setup>
import { elementState } from '@/views/editor/components/tools/element-config'
import { useElementMove } from './move'

const { setElementDraggable } = useElementMove()
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
  @include e('icon-move') {
    background-image: url('@/assets/img/toolbar/icon-move.png');
    &.active,
    &:hover {
      background-image: url('@/assets/img/toolbar/icon-move-hover.png');
    }
  }
  @include e('icon-choose') {
    background-color: #1c2028 !important;
    border: 1px solid rgba(255, 255, 255, 0.5);
    background-image: url('@/assets/img/toolbar/icon-choose-hover.png');
  }
}
</style>
