import { reactive } from 'vue'
import mapRoad from '../../assets/img/editor/map-road.png'
import mapSatellite from '../../assets/img/editor/map-satellite.png'
import { MapState, MapEditState, MapBasicParam, PersonageResultParam, MapElementListParam } from './interface'

/**
 * 地图公共数据 state
 */
export const mapState: MapState = reactive({
  map: null, // 地图实例
  AMap: null, // 地图内部实例
  mapPlugins: {
    // 地图插件
    mouseTool: null // 地图鼠标工具
  },
  personageResult: <PersonageResultParam>{} // 个人定位经纬度
})

/**
 * 编辑地图页面 state
 */
export const mapEditState: MapEditState = reactive({
  mapId: '', // 地图id
  encryptId: '', // 地图分享id
  mapCategoryList: [
    // 底图列表
    {
      category: 4,
      name: '卫星和路网',
      coverUri: mapRoad
    },
    {
      category: 2,
      name: '卫星',
      coverUri: mapSatellite
    },
    {
      category: 1,
      name: '',
      coverUri: ''
    }
  ],
  mapBasic: <MapBasicParam>{}, // 地图基本信息
  mapElementList: [] as Array<MapElementListParam>, // 地图 业务图层要素 列表
  elementSum: 0 // 元素数量总和
})
