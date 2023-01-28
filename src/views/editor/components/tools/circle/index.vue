<template>
  <el-tooltip effect="dark" content="圆形" placement="left">
    <div class="gwin-platform-popover">
      <el-popover
        ref="circlePopover"
        placement="left-start"
        :width="90"
        :trigger="elementState.circleSelectActive ? 'click' : 'contextmenu'"
        popper-class="gwin-platform-popover--bg gwin-platform-popover--padding"
      >
        <template #reference>
          <i
            :class="[
              'gwin-platform-element__icon-round',
              {
                active: elementState.isActive.round
              }
            ]"
            @click="setCircleVisible"
          ></i>
        </template>
        <template #default>
          <div
            :class="[
              'gwin-platform-mouse flex flex-only-center',
              { 'circle-active': elementState.circleSelectActive === 1 }
            ]"
            @click="addMapElemenForCircle('circle')"
          >
            <i class="gwin-platform-mouse__circle"></i>
            <p>圆</p>
          </div>
          <div
            :class="[
              'gwin-platform-mouse flex flex-only-center',
              { 'ellipse-active': elementState.circleSelectActive === 2 }
            ]"
            @click="addMapElemenForCircle('ellipse')"
          >
            <i class="gwin-platform-mouse__ellipse"></i>
            <p>椭圆</p>
          </div>
        </template>
      </el-popover>
    </div>
  </el-tooltip>
</template>

<script lang="ts" setup>
import { elementState } from '@/views/editor/components/tools/element-config'
import { useElementCircle } from './circle'
const { circlePopover, setCircleVisible, addMapElemenForCircle } = useElementCircle() // 点编辑
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

  @include e('icon-round') {
    background-image: url('@/assets/img/toolbar/icon-round.png');
    &.active,
    &:hover {
      background-image: url('@/assets/img/toolbar/icon-round-hover.png');
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
  @include e('circle') {
    border-radius: 100%;
  }
  @include e('ellipse') {
    border-radius: 100% 50% !important;
    transform: rotate(-45deg);
  }
  &:hover {
    color: #fff;
    background-color: #2e353f;
    i {
      border-color: #fff;
    }
  }
  &.circle-active,
  &.ellipse-active {
    color: #fff;
    font-weight: 600;
    background-color: #2a2f37;
    i {
      border-color: #fff;
    }
  }
}
</style>
