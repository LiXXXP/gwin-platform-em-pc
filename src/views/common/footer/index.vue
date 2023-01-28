<template>
  <div class="gwin-platform-location flex flex-only-center">
    <div class="flex flex-only-center">
      <p>经度</p>
      <el-input
        v-model="footerState.lngInput"
        type="number"
        :input-style="{ color: '#fff', width: '110px', height: '26px', background: '#39404C', border: 0 }"
        @keyup.enter="onSetMapCenter"
      />
    </div>
    <div class="flex flex-only-center">
      <p>纬度</p>
      <el-input
        v-model="footerState.latInput"
        type="number"
        :input-style="{ color: '#fff', width: '110px', height: '26px', background: '#39404C', border: 0 }"
        @keyup.enter="onSetMapCenter"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, watchEffect } from 'vue'
import { mapState } from '@/views/common/map-config'

interface stateOptions {
  lngInput: number
  latInput: number
}

const footerState: stateOptions = reactive({
  lngInput: 0, // 经度
  latInput: 0 // 纬度
})

watchEffect(() => {
  footerState.lngInput = mapState.personageResult.lng
  footerState.latInput = mapState.personageResult.lat
  mapState.map?.on('mousemove', showInfoMove)
})

/**
 * 根据鼠标指针位置移动显示对应的经纬度坐标值
 * @param e 当前移动对象
 */
function showInfoMove(e: any): void {
  footerState.lngInput = e.lnglat.getLng()
  footerState.latInput = e.lnglat.getLat()
}

/**
 * 根据当前经纬度，设置地图中心点
 */
const onSetMapCenter = () => {
  mapState.map?.setCenter([footerState.lngInput, footerState.latInput])
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
@include b('location') {
  color: #fff;
  font-size: 12px;
  margin-right: 220px;
  p {
    width: 50px;
    text-align: center;
  }
}
</style>
