import { Request, Response } from '@gwin/networking'

interface TagListInquiryParams {
  // 标签列表查询参数类型
  userId: string | undefined
  createName?: string
  tagCategory?: number | string
  tagName?: string
  notIncloudedTag?: string[]
  page?: {
    returnCount?: boolean
    pageNum?: number
    pageSize?: number
  }
}

interface TagAdditionParams {
  // 标签新增参数类型
  userId: string | undefined
  memo: string
  tagCategory: number | string
  tagName: string
}

interface TagDeletingParams {
  // 标签删除参数类型
  id: string
}

interface TagMaintenanceParams {
  // 标签编辑参数类型
  id: string | undefined
  memo: string
  tagCategory: number | string
  tagName: string
}

class TagsApi {
  // 标签列表查询
  async tagListInquiry(params: TagListInquiryParams): Promise<Response> {
    const request = new Request({
      url: '/yt/v1/TagListInquiry',
      params: params,
      isLoading: false,
      isMessage: true
    })
    return await request.start()
  }

  // 标签新增
  async tagAddition(params: TagAdditionParams): Promise<Response> {
    const request = new Request({
      url: '/yt/v1/TagAddition',
      params: params,
      isLoading: true,
      isMessage: true
    })
    return await request.start()
  }

  // 标签删除
  async tagDeleting(params: TagDeletingParams): Promise<Response> {
    const request = new Request({
      url: '/yt/v1/TagDeleting',
      params: params,
      isLoading: false,
      isMessage: true
    })
    return await request.start()
  }

  // 标签编辑
  async tagMaintenance(params: TagMaintenanceParams): Promise<Response> {
    const request = new Request({
      url: '/yt/v1/TagMaintenance',
      params: params,
      isLoading: true,
      isMessage: true
    })
    return await request.start()
  }
}

export default new TagsApi()
