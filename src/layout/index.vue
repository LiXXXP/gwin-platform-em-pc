<template>
  <div style="height: 100%">
    <Header />
    <div class="gwin-platform-app-main">
      <Sidebar />
      <Content class="gwin-platform-app-content" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Header from './header.vue'
import Sidebar from './sidebar.vue'
import Content from './content.vue'
import { defineComponent } from 'vue-demi'

defineComponent({
  Header,
  Sidebar,
  Content
})
</script>

<style lang="scss" scoped>
@import '../styles/mixin.scss';

@include b(app-main) {
  width: 100%;
  height: calc(100vh - 50px);
  font-weight: 400;
  background: hsl(0, 0%, 95%);
  display: flex;
  position: relative;
  top: 50px;
  left: 0px;
  right: 0px;
}

@include b(app-content) {
  flex: 1;
  padding: 20px;
  background: #f8fbff;
  overflow-y: auto;
  box-sizing: border-box;
}
</style>
