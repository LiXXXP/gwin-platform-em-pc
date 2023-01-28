<template>
  <el-tooltip effect="dark" content="暂不支持" placement="bottom">
    <div class="gwin-platform-popover">
      <el-popover
        v-model:visible="state.popoverVisible"
        placement="bottom-start"
        :width="484"
        trigger="click"
        popper-class="gwin-platform-popover--bg"
      >
        <template #reference>
          <i class="gwin-platform-icons-keyboard" @click="state.popoverVisible = true"></i>
        </template>
        <template #default>
          <div class="gwin-platform-popover__title">
            <p>快捷键</p>
            <i @click="state.popoverVisible = false"></i>
          </div>
          <div class="gwin-platform-popover__content flex flex-center flex-only-center">
            <i></i>
          </div>
        </template>
      </el-popover>
    </div>
  </el-tooltip>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
const state = reactive({
  popoverVisible: false
})
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
@include b('icons-keyboard') {
  width: 20px;
  height: 20px;
  display: block;
  cursor: pointer;
  margin-left: 20px;
  background: url('@/assets/img/editor/icon-keyboard.png') no-repeat 0 0;
  background-size: 100%;
}
@include b('popover') {
  @include e('title') {
    color: #fff;
    font-size: 16px;
    padding: 0 20px;
    font-weight: 600;
    text-align: left;
    padding-bottom: 10px;
    background-color: #39404c;
    border-bottom: 1px solid rgba(225, 229, 245, 0.1);
    position: relative;
    i {
      width: 20px;
      height: 20px;
      display: block;
      cursor: pointer;
      background: url('@/assets/img/map/icon-close.png') no-repeat 0 0;
      background-size: 100%;
      position: absolute;
      right: 10px;
      top: 0;
    }
  }
  @include e('content') {
    padding: 20px 0;
    i {
      width: 456px;
      height: 231px;
      background: url('@/assets/img/editor/keyboard.png') no-repeat center 50%;
      background-size: 100%;
    }
  }
}
</style>
