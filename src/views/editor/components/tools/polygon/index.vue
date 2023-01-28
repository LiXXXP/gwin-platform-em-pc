<template>
  <el-tooltip effect="dark" content="矩形" placement="left">
    <div class="gwin-platform-popover">
      <el-popover
        ref="polygonPopover"
        placement="left-start"
        :width="100"
        :trigger="elementState.polygonSelectActive ? 'click' : 'contextmenu'"
        popper-class="gwin-platform-popover--bg gwin-platform-popover--padding"
      >
        <template #reference>
          <i
            :class="[
              'gwin-platform-element__icon-square',
              {
                active: elementState.isActive.square
              }
            ]"
            @click="setPolygonVisible"
          ></i>
        </template>
        <template #default>
          <div
            :class="[
              'gwin-platform-mouse flex flex-only-center',
              { 'rectangle-active': elementState.polygonSelectActive === 1 }
            ]"
            @click="addMapElemenForPolygon('rectangle')"
          >
            <i></i>
            <p>矩形</p>
          </div>
          <div
            :class="[
              'gwin-platform-polygon flex flex-only-center',
              { 'polygon-active': elementState.polygonSelectActive === 2 }
            ]"
            @click="addMapElemenForPolygon('polygon')"
          >
            <i></i>
            <p>多边形</p>
          </div>
        </template>
      </el-popover>
    </div>
  </el-tooltip>
</template>

<script lang="ts" setup>
import { elementState } from '@/views/editor/components/tools/element-config'
import { useElementPolygon } from './polygon'
const { polygonPopover, setPolygonVisible, addMapElemenForPolygon } = useElementPolygon() // 矩形编辑
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
  @include e('icon-square') {
    background-image: url('@/assets/img/toolbar/icon-square.png');
    &.active,
    &:hover {
      background-image: url('@/assets/img/toolbar/icon-square-hover.png');
    }
  }
}
@include b('mouse') {
  padding: 10px;
  font-size: 14px;
  cursor: pointer;
  border-radius: 4px;
  box-sizing: border-box;
  i {
    width: 16px;
    height: 16px;
    margin-right: 10px;
    border: 2px solid rgba(255, 255, 255, 0.7);
  }
  &:hover {
    color: #fff;
    background-color: #2e353f;
    i {
      border-color: #fff;
    }
  }
  &.rectangle-active {
    color: #fff;
    font-weight: 600;
    background-color: #2a2f37;
    i {
      border-color: #fff;
    }
  }
}
@include b('polygon') {
  cursor: pointer;
  padding: 5px 10px;
  box-sizing: border-box;
  i {
    width: 30px;
    height: 30px;
    margin-left: -5px;
    background: url('@/assets/img/toolbar/icon-polygon.png') no-repeat 0 0;
    background-size: 100%;
  }
  &:hover {
    color: #fff;
    background-color: #2e353f;
    i {
      background-image: url('@/assets/img/toolbar/icon-polygon-hover.png');
    }
  }
  &.polygon-active {
    color: #fff;
    font-weight: 600;
    i {
      background-image: url('@/assets/img/toolbar/icon-polygon-hover.png');
    }
  }
}
</style>
