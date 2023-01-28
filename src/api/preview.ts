import { Request, Response } from '@gwin/networking'

interface PreviewMapInquiryParam {
  id: string | undefined
}

class PreviewApi {
  // 预览地图全量信息查询
  async previewMapInquiry(params: PreviewMapInquiryParam): Promise<Response> {
    const request = new Request({
      url: '/yt/v1/PreviewMapInquiry',
      params: params,
      isLoading: true,
      isMessage: true,
      replyCodes: ['102']
    })
    return await request.start()
  }

  // 预览地图要素信息查询
  async previewMapElementInquiry(params: PreviewMapInquiryParam): Promise<Response> {
    const request = new Request({
      url: '/yt/v1/PreviewMapElementInquiry',
      params: params,
      isLoading: false,
      isMessage: true,
      replyCodes: ['102']
    })
    return await request.start()
  }
}

export default new PreviewApi()
