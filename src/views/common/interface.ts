export interface MapState {
  map: any
  AMap: any
  mapPlugins: MapPluginsParam
  personageResult: PersonageResultParam
}

export interface MapEditState {
  mapId: string
  encryptId: string
  mapBasic: MapBasicParam
  mapCategoryList: MapCategoryListParam[]
  mapElementList: MapElementListParam[]
  elementSum: number
}

export interface MapBasicParam {
  category: number
  coverUri: string
  id: string
  mapName: string
  templateName: string
  templateNo: string
  encryptId: string
  isUpdate: boolean
  publishAt: number
  publishEdition: string
  updateAt: number
}

export interface MapPluginsParam {
  mouseTool: any
}
export interface PersonageResultParam {
  lat: number
  lng: number
}

export interface MapCategoryListParam {
  category: number
  name: string
  coverUri: string
}

export interface MapElementListParam {
  elementList: ElementListParam[]
  layerId: string
  layerName: string
  tagList: TagListParam[] | any[]
  isSelect: boolean
  isShowLayer: boolean
  isEditName: boolean
}

export interface ElementListParam {
  category?: number
  display?: boolean
  drawJson?: any
  elementId: string
  name: string
  elementNo: string
  fillColor?: string | undefined
  lat: number
  lng: number
  lineCategory?: number
  size?: number
  strokeColor?: string
  tagList?: TagListParam[] | any[]
  transparency?: number
  zindex?: number
  zoomMax?: number
  zoomMin?: number
  isSelect: boolean
  isShowElement: boolean
  fillColorDisplay?: boolean
  strokeColorDisplay?: boolean
}

export interface TagListParam {
  tagId: string
  tagName: string
}

export interface ExtendedDocument extends Document {
  fullScreen?: any
  mozFullScreen?: any
  webkitIsFullScreen?: any
  mozCancelFullScreen?: any
  webkitExitFullscreen?: any
}
