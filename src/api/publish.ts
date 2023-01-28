import { Request, Response } from '@gwin/networking'

interface PublishedMapInquiryParam {
  encryptId: string | undefined
  id?: string | undefined
}

class PublishedApi {
  // 已发布地图全量信息查询
  async publishedMapInquiry(params: PublishedMapInquiryParam): Promise<Response> {
    const request = new Request({
      url: '/yt/v1/PublishedMapInquiry',
      params: params,
      isLoading: false,
      isMessage: true,
      replyCodes: ['102']
    })
    return await request.start()
  }

  // 已发布地图要素信息查询
  async publishedMapElementInquiry(params: PublishedMapInquiryParam): Promise<Response> {
    const request = new Request({
      url: '/yt/v1/PublishedMapElementInquiry',
      params: params,
      isLoading: false,
      isMessage: true,
      replyCodes: ['102']
    })
    return await request.start()
  }
}

export default new PublishedApi()
