import { mapEditState } from '@/views/common/map-config'
import EditorApi from '@/api/editor'

export const useMapBasicInfo = () => {
  /**
   * 地图基本信息查询
   */
  const getMapBasicInfoInquiry = async () => {
    const param = {
      id: mapEditState.mapId
    }
    const res = await EditorApi.mapBasicInfoInquiry(param)
    // 地图基本信息
    mapEditState.mapBasic = res.body

    // 地图底图切换列表
    const mapCategoryIndex = mapEditState.mapCategoryList?.length - 1
    mapEditState.mapCategoryList[mapCategoryIndex].name = res.body.templateName
    mapEditState.mapCategoryList[mapCategoryIndex].coverUri = res.body.coverUri
  }

  /**
   * 底图切换, 地图基本信息维护
   */
  const mapBasicInfoMaintenance = async (category: number) => {
    const param = {
      id: mapEditState.mapId,
      mapCategory: category,
      mapName: mapEditState.mapBasic.mapName
    }
    await EditorApi.mapBasicInfoMaintenance(param)
  }

  return {
    getMapBasicInfoInquiry,
    mapBasicInfoMaintenance
  }
}
