import { reactive } from 'vue'
import { mapState } from '@/views/common/map-config'

export const elementState: ElementStateParam = reactive({
  isActive: {
    // 选中每一项的状态 active
    move: false,
    marker: false,
    line: false,
    round: false,
    square: false,
    import: false,
    ranging: false,
    area: false
  },
  circleSelectActive: 0, // 圆编辑选择类型 1为圆 2为椭圆
  polygonSelectActive: 0, // 矩形编辑选择类型 1为矩形 2为多边形
  layerId: '', // 所选图层id
  layerName: '' // 所选图层名字
})

/**
 * 对象第一层深拷贝，右侧按钮选中的状态一开始都为false
 * 点击其中一个时，先给每个状态赋值为初始值，再给自身赋为 true ，不改变深拷贝的初始对象
 */
export const initActive: IsActiveListParam = Object.assign({}, elementState.isActive)

/**
 * init 选中交互状态置为初始
 */
export const initElementActive = () => {
  elementState.isActive = Object.assign({}, initActive)
  elementState.circleSelectActive = 0
  elementState.polygonSelectActive = 0
  if (!elementState.isActive.move) {
    mapState.map.getAllOverlays()?.forEach((item: any) => {
      // 给元素移除可移动属性
      !item.type.includes('AMap.InfoWindow') && item.setDraggable(false)
    })
  }
}

interface ElementStateParam {
  isActive: IsActiveListParam
  circleSelectActive: number
  polygonSelectActive: number
  layerId: string | undefined
  layerName: string | undefined
}

interface IsActiveListParam {
  move: boolean
  marker: boolean
  line: boolean
  round: boolean
  square: boolean
  import: boolean
  ranging: boolean
  area: boolean
}
