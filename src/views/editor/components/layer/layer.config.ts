import { reactive } from 'vue'

export const layerState: LayerStateOption = reactive({
  businessActive: true, // 左侧菜单 业务图层 选中状态
  elementActive: true, // 左侧菜单 要素编辑 选中状态
  activeLayersId: [], // 选中的业务图层 图层id
  isShowBusinessLayer: true, // 显示隐藏全部业务图层
  elementInquiry: <ElementInquiryParam>{}, // 要素信息
  elementbaseParam: <ElementbaseParam>{}, // 要素基本信息参数
  currentElementType: '', // 当前点击的要素类型
  currentElementEditor: null // 当前打开的要素编辑器
})

interface LayerStateOption {
  businessActive: boolean
  elementActive: boolean
  activeLayersId: string[]
  isShowBusinessLayer: boolean
  elementInquiry: ElementInquiryParam
  elementbaseParam: ElementbaseParam
  currentElementType: string
  currentElementEditor: any
}

export interface ElementInquiryParam {
  category: number // 要素类别 1 地图 2 图层 3 要素
  drawJson: any
  elementNo: string
  fillColor: string
  id: string
  lat: number
  lng: number
  lineCategory: number
  memo: string
  name: string
  pictures: string[]
  size: number
  strokeColor: string
  tagList: TagListParam[]
  transparency: number
  zindex: number
  zoomMax: number
  zoomMin: number
  layerId: string
  layerName: string
  isEditName: boolean
  VModelName: string
  display: boolean
  strokeColorDisplay: boolean
  fillColorDisplay: boolean
}

interface TagListParam {
  tagId: string
  tagName: string
  length: number
}

interface ElementbaseParam {
  drawJson?: any
  fillColor?: string
  id?: string
  lineCategory?: number
  size?: number
  strokeColor?: string
  transparency?: number
  fillColorDisplay?: boolean
  strokeColorDisplay?: boolean
}
