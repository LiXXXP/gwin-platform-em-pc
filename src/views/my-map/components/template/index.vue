<template>
  <div class="gwin-platform-map-template flex flex-center flex-only-center">
    <div class="gwin-platform-map-box flex flex-between">
      <div class="gwin-platform-box-left">
        <div class="gwin-platform-box-left__title flex flex-only-center">
          <i @click="onCloseMapTemplate"></i>
          <p>地图模板</p>
        </div>
        <div class="gwin-platform-box-left__list">
          <div
            v-for="(item, index) in state.templateMapList"
            :key="item.id"
            :class="[
              'gwin-platform-map-list',
              { 'gwin-platform-map-list--active': index === templateState.currentIndex }
            ]"
            @click="onSetMapStyle(item, index)"
          >
            <img :src="item.coverUri" />
            <p>{{ item.name }}</p>
          </div>
        </div>
      </div>
      <div class="gwin-platform-box-right">
        <div id="container" class="gwin-platform-box-right__map"></div>
        <el-button type="primary" class="gwin-platform-box-right__use" @click="onUseMapTemplate">
          使用此模板创建
        </el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, reactive } from 'vue'
import { ElNotification } from 'element-plus'
import AMapLoader from '@amap/amap-jsapi-loader'
import { useRouter } from 'vue-router'
import MapApi from '@/api/map' // api
import { state } from '../../map-config'

const router = useRouter()

interface templateMapListParam {
  id: any
  name: string
  coverUri: string
  templateNo: string
}

const emit = defineEmits(['getShowMapTemplate'])

interface TemplateStateOption {
  map: any
  currentIndex: number
}

const templateState: TemplateStateOption = reactive({
  map: null, // 地图实例
  currentIndex: 0 // 当前地图模版index
})

onMounted(() => {
  initMap()
  templateState.currentIndex = state.templateMapList.findIndex((item: any) => item.templateNo === state.templateNo)
})

onUnmounted(() => {
  // 地图销毁
  templateState.map && templateState.map.destroy()
})

/**
 * 地图初始化
 */
const initMap = () => {
  AMapLoader.load({
    key: 'a59a1642e53b3c0af62093f94731d7f3', // 申请好的Web端开发者Key，首次调用 load 时必填
    version: '2.0' // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
  })
    .then((AMap) => {
      templateState.map = new AMap.Map('container', {
        // 设置地图容器id
        zoom: 10,
        viewMode: '2D', // 是否为3D地图模式
        resizeEnable: true, // 是否监控地图容器尺寸变化
        center: [116.397428, 39.90923], // 初始化地图中心点位置
        mapStyle: `amap://styles/${state.templateNo}` // 标准模式
      })
    })
    .catch((e) => {
      console.log(e)
    })
}

/**
 * 设置地图主题样式
 */
const onSetMapStyle = (item: templateMapListParam, index: number) => {
  templateState.currentIndex = index
  const styleName = 'amap://styles/' + item.templateNo
  templateState.map.setMapStyle(styleName)
}

/**
 * 关闭地图模版
 */
const onCloseMapTemplate = () => {
  emit('getShowMapTemplate', false)
}

/**
 * 使用模版
 */
const onUseMapTemplate = async () => {
  if (state.myMapList.length > 4) {
    ElNotification({
      message: '最多创建5个地图',
      type: 'warning',
      offset: 60
    })
    return
  }
  const param = {
    lat: 116.397428,
    lng: 39.90923,
    templateId: state.templateMapList[templateState.currentIndex].id
  }
  const res = await MapApi.MapAddition(param)
  router.push({
    path: '/map/editor',
    query: { id: res.body.id }
  })
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
@include b('map-template') {
  width: 100%;
  height: 100%;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.5);
  box-shadow: 10px 0px 20px 0px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
}
@include b('map-box') {
  width: 70%;
  height: 80%;
  overflow: hidden;
  background-color: #fff;
}
@include b('box-left') {
  width: 200px;
  @include e('title') {
    i {
      width: 40px;
      height: 40px;
      cursor: pointer;
      background: url('@/assets/img/map/icon-map-close.png') no-repeat 0 0;
      background-size: 100%;
    }
    p {
      width: 160px;
      height: 40px;
      color: #fff;
      font-size: 16px;
      font-weight: 400;
      line-height: 40px;
      padding-left: 20px;
      box-sizing: border-box;
      background-color: #2a2f37;
    }
  }
  @include e('list') {
    height: calc(100% - 40px);
    overflow-y: auto;
    overflow-x: hidden;
  }
}
@include b('map-list') {
  width: 200px;
  height: 100px;
  cursor: pointer;
  box-sizing: border-box;
  box-shadow: 10px 0px 20px 0px rgba(0, 0, 0, 0.1);
  position: relative;
  &::before {
    z-index: 99;
    content: '';
    width: 100px;
    height: 100px;
    display: block;
    background: linear-gradient(270deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%);
    position: absolute;
    top: 0;
    left: 0;
  }
  img {
    width: 100%;
    height: 100%;
  }
  p {
    z-index: 999;
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    text-shadow: 10px 0px 20px rgba(0, 0, 0, 0.1), 0px 1px 1px rgba(0, 0, 0, 0.2);
    position: absolute;
    left: 10px;
    bottom: 10px;
  }
  @include m('active') {
    p {
      width: 86px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      padding-right: 12px;
      box-sizing: border-box;
      background-color: var(--gwin-color);
      box-shadow: 10px 0px 20px 0px rgba(0, 0, 0, 0.1);
      border-radius: 100px;
      &::after {
        content: '';
        display: block;
        width: 20px;
        height: 20px;
        background: url('../../../../assets/img/map/icon-map-check.png') no-repeat 0 0;
        background-size: 100%;
        position: absolute;
        right: 10px;
        top: 5px;
      }
    }
  }
}
@include b('box-right') {
  flex: 1;
  position: relative;
  @include e('map') {
    width: 100%;
    height: 100%;
  }
  @include e('use') {
    z-index: 99;
    font-size: 16px;
    font-weight: 600;
    position: absolute;
    left: 50%;
    bottom: 20px;
    -webkit-transform: translate(-50%, 0);
    -moz-transform: translate(-50%, 0);
    transform: translate(-50%, 0);
    &:hover {
      background: #3c7dff !important;
    }
  }
}
</style>
