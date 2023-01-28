import { Request, Response } from '@gwin/networking'

interface MapElementAdditionParam {
  basicAttr?: BasicAttr
  category: number
  display?: boolean
  lng: number
  lat: number
  layerId: string
  mapId: string
  name?: string
  zindex?: number
  zoomMax: number
  zoomMin: number
}

interface BasicAttr {
  drawJson?: any
  fillColor?: string
  lineCategory?: number
  size?: number
  strokeColor?: string
  transparency?: number
}

interface MapElementDeletingParam {
  id: string
}

export interface MapElementBizInfoMaintenanceParam {
  display?: boolean
  id?: string
  lat?: number
  lng?: number
  memo?: string
  name?: string
  pictures?: string[]
  zindex?: number
  zoomMax?: number
  zoomMin?: number
}

export interface MapElementBasicInfoMaintenanceParam {
  drawJson?: any
  fillColor?: string
  id?: string
  lineCategory?: number
  size?: number
  strokeColor?: string
  transparency?: number
}

interface MapElementBatchAdditionParam {
  entityId: string | undefined
  file: any
  layerId: string | undefined
  mapId: string | undefined
  userId: string | undefined
}

class ElementApi {
  // 地图要素新增
  async mapElementAddition(params: MapElementAdditionParam): Promise<Response> {
    const request = new Request({
      url: '/yt/v1/MapElementAddition',
      params: params,
      isLoading: false,
      isMessage: true,
      replyCodes: ['102']
    })
    return await request.start()
  }

  // 地图要素删除
  async mapElementDeleting(params: MapElementDeletingParam): Promise<Response> {
    const request = new Request({
      url: '/yt/v1/MapElementDeleting',
      params: params,
      isLoading: false,
      isMessage: true,
      replyCodes: ['102']
    })
    return await request.start()
  }

  // 地图要素信息查询
  async mapElementInquiry(params: MapElementDeletingParam): Promise<Response> {
    const request = new Request({
      url: '/yt/v1/MapElementInquiry',
      params: params,
      isLoading: false,
      isMessage: true,
      replyCodes: ['102']
    })
    return await request.start()
  }

  // 地图要素业务信息修改
  async mapElementBizInfoMaintenance(params: MapElementBizInfoMaintenanceParam): Promise<Response> {
    const request = new Request({
      url: '/yt/v1/MapElementBizInfoMaintenance',
      params: params,
      isLoading: false,
      isMessage: true,
      replyCodes: ['102']
    })
    return await request.start()
  }

  // 地图要素基础信息修改
  async mapElementBasicInfoMaintenance(params: MapElementBasicInfoMaintenanceParam): Promise<Response> {
    const request = new Request({
      url: '/yt/v1/MapElementBasicInfoMaintenance',
      params: params,
      isLoading: false,
      isMessage: true,
      replyCodes: ['102']
    })
    return await request.start()
  }

  // 模版下载
  async mapElementTemplateFileDownload(): Promise<Response> {
    const request = new Request({
      url: '/yt/v1/MapElementTemplateFileDownload',
      isLoading: false,
      isMessage: false,
      replyCodes: ['102'],
      config: { responseType: 'blob' }
    })
    return await request.start()
  }

  // 批量导入
  async mapElementBatchAddition(params: MapElementBatchAdditionParam): Promise<Response> {
    const request = new Request({
      url: '/yt/v1/MapElementBatchAddition',
      method: 'get',
      params: params,
      isLoading: false,
      isMessage: true,
      replyCodes: ['102']
    })
    return await request.start()
  }
}

export default new ElementApi()
