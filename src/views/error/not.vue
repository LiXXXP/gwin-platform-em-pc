<template>
  <div class="gwin-platform-not">
    <i></i>
    <p>当前地图已被删除，如有需要请联系管理员</p>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
@include b('not') {
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: #6e6e6e;
  font-size: 16px;
  i {
    width: 300px;
    height: 300px;
    background: url('@/assets/img/map/icon-not.png') no-repeat 0 0;
    background-size: 100%;
  }
}
</style>
