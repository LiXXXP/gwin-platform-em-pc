import { Request, Response } from '@gwin/networking'

interface MapBasicInfoInquiryParams {
  id: string
}

interface MapBasicInfoMaintenanceParams {
  id: string
  mapCategory?: number
  mapName?: string
}

interface MapElementNameListInquiryParams {
  elementName: string
  mapId: string
  page: {
    pageNum: number
    pageSize: number
    returnCount: boolean
  }
}

interface MapLayerCategoryAdditionParams {
  mapId: string
}

interface MapLayerCategoryMaintenanceParams {
  id: string
  name: string
}

class EditorApi {
  // 地图基本信息查询
  async mapBasicInfoInquiry(params: MapBasicInfoInquiryParams): Promise<Response> {
    const request = new Request({
      url: '/yt/v1/MapBasicInfoInquiry',
      params: params,
      isLoading: true,
      isMessage: true,
      replyCodes: ['102']
    })
    return await request.start()
  }

  // 我的地图信息修改
  async mapBasicInfoMaintenance(params: MapBasicInfoMaintenanceParams): Promise<Response> {
    const request = new Request({
      url: '/yt/v1/MapBasicInfoMaintenance',
      params: params,
      isLoading: false,
      isMessage: true,
      replyCodes: ['102']
    })
    return await request.start()
  }

  // 搜索框 要素搜索
  async MapElementNameListInquiry(params: MapElementNameListInquiryParams): Promise<Response> {
    const request = new Request({
      url: '/yt/v1/MapElementNameListInquiry',
      params: params,
      isLoading: false,
      isMessage: true,
      replyCodes: ['102']
    })
    return await request.start()
  }

  // 地图图层要素列表查询
  async mapElementListInquiry(params: MapBasicInfoInquiryParams): Promise<Response> {
    const request = new Request({
      url: '/yt/v1/MapElementListInquiry',
      params: params,
      isLoading: false,
      isMessage: true,
      replyCodes: ['102']
    })
    return await request.start()
  }

  // 地图图层分类新增
  async mapLayerCategoryAddition(params: MapLayerCategoryAdditionParams): Promise<Response> {
    const request = new Request({
      url: '/yt/v1/MapLayerCategoryAddition',
      params: params,
      isLoading: false,
      isMessage: true,
      replyCodes: ['102']
    })
    return await request.start()
  }

  // 地图图层分类修改
  async mapLayerCategoryMaintenance(params: MapLayerCategoryMaintenanceParams): Promise<Response> {
    const request = new Request({
      url: '/yt/v1/MapLayerCategoryMaintenance',
      params: params,
      isLoading: false,
      isMessage: true,
      replyCodes: ['102']
    })
    return await request.start()
  }

  // 地图图层分类删除
  async mapLayerCategoryDeleting(params: MapBasicInfoInquiryParams): Promise<Response> {
    const request = new Request({
      url: '/yt/v1/MapLayerCategoryDeleting',
      params: params,
      isLoading: false,
      isMessage: true,
      replyCodes: ['102']
    })
    return await request.start()
  }
}

export default new EditorApi()
