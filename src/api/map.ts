import { Request, Response } from '@gwin/networking'

interface MapListInquiryParams {
  page?: {
    pageNum: number
    pageSize: number
    returnCount: boolean
  }
  subjectId: string | undefined
}

interface MapTemplateListInquiryParams {
  page: {
    pageNum: number
    pageSize: number
    returnCount: boolean
  }
}

interface MapBasicInfoMaintenanceParams {
  id: string
  mapCategory?: number
  mapName?: string
}

interface MapDeletingParams {
  id: string
}

interface TagLinkMaintenanceParams {
  bizId: string
  tagCategory: number
  userId: string | undefined
  tagList?: any[]
}

interface MapAdditionParams {
  lat: number
  lng: number
  templateId: string
}

class MapApi {
  // 我的地图列表查询
  async mapListInquiry(params: MapListInquiryParams): Promise<Response> {
    const request = new Request({
      url: '/yt/v1/MapListInquiry',
      params: params,
      isLoading: true,
      isMessage: true
    })
    return await request.start()
  }

  // 底图模版列表查询
  async mapTemplateListInquiry(params: MapTemplateListInquiryParams): Promise<Response> {
    const request = new Request({
      url: '/yt/v1/MapTemplateListInquiry',
      params: params,
      isLoading: false,
      isMessage: true
    })
    return await request.start()
  }

  // 我的地图信息修改
  async mapBasicInfoMaintenance(params: MapBasicInfoMaintenanceParams): Promise<Response> {
    const request = new Request({
      url: '/yt/v1/MapBasicInfoMaintenance',
      params: params,
      isLoading: false,
      isMessage: true
    })
    return await request.start()
  }

  // 我的地图删除
  async mapDeleting(params: MapDeletingParams): Promise<Response> {
    const request = new Request({
      url: '/yt/v1/MapDeleting',
      params: params,
      isLoading: false,
      isMessage: true
    })
    return await request.start()
  }

  // 我的地图发布
  async mapPublish(params: MapDeletingParams): Promise<Response> {
    const request = new Request({
      url: '/yt/v1/MapPublish',
      params: params,
      isLoading: false,
      isMessage: true
    })
    return await request.start()
  }

  // 我的地图分享
  async mapShare(params: MapDeletingParams): Promise<Response> {
    const request = new Request({
      url: '/yt/v1/MapShare',
      params: params,
      isLoading: false,
      isMessage: false
    })
    return await request.start()
  }

  // 我的地图标签维护
  async tagLinkMaintenance(params: TagLinkMaintenanceParams): Promise<Response> {
    const request = new Request({
      url: '/yt/v1/TagLinkMaintenance',
      params: params,
      isLoading: false,
      isMessage: true
    })
    return await request.start()
  }

  // 地图新增
  async MapAddition(params: MapAdditionParams): Promise<Response> {
    const request = new Request({
      url: '/yt/v1/MapAddition',
      params: params,
      isLoading: false,
      isMessage: true
    })
    return await request.start()
  }
}

export default new MapApi()
