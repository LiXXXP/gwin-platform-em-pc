import { reactive } from 'vue'

export interface MyMapListParam {
  id: string
  coverUri: string
  isUpdate: boolean
  publishAt: number
  updateAt: number
  isEditName: boolean
  mapName: string
  VModelName: string
  tagList: TagListParam[]
  publishEdition: string
  isShowHandle: boolean
}

export interface TagListParam {
  tagId: string
  tagName: string
}

export interface TemplateMapListParam {
  id: string
  coverUri: string
  name: string
  templateNo: string
}

export interface StateOptions {
  myMapList: MyMapListParam[] // 我的地图列表
  templateMapList: TemplateMapListParam[] // 底图模版列表
  templateMapListPage: {
    count: number
    pageNum: number
    pageSize: number
    returnCount: boolean
  }
  encryptUrl: string
  isShowMapTemplate: boolean
  templateNo: string
}

export const state: StateOptions = reactive({
  myMapList: [], // 我的地图列表
  templateMapList: [], // 底图模版列表
  templateMapListPage: {
    // 底图模版列表分页
    count: 0,
    pageNum: 1,
    pageSize: 10,
    returnCount: true
  },
  encryptUrl: '', // 分享idT
  isShowMapTemplate: false, // 是否显示地图模版 弹窗
  templateNo: '' // 地图模版类型
})
