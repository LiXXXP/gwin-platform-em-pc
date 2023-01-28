import { reactive } from 'vue'
import { useRoute } from 'vue-router'
import { SearchStateOption, LocationParam } from './interface'
import { mapState } from '@/views/common/map-config'
import EditorApi from '@/api/editor'

export const searchState: SearchStateOption = reactive({
  searchType: 1, // 搜索类型
  searchValue: '', // 搜索框内容
  isResultShow: false,
  locationResultList: [], // 地址结果列表
  elementResultList: [] // 要素结果列表
})

export const useSearch = () => {
  const route = useRoute()
  /**
   * 搜索
   * searchType 1 位置搜索，调取 js api
   * searchType 2 经纬度 调接口
   */
  const onSearch = () => {
    // 位置搜索
    if (searchState.searchType === 1) {
      onMapLocationSearch()
    } else {
      // 要素搜索
      onMapElementSearch()
    }
  }

  /**
   * 地图位置搜索
   */
  const onMapLocationSearch = () => {
    const keywords = searchState.searchValue
    if (!keywords) {
      searchState.isResultShow = false
      return
    }
    mapState.AMap.plugin('AMap.PlaceSearch', function () {
      const placeSearch = new mapState.AMap.PlaceSearch({
        city: '全国',
        pageSize: 10, // 单页显示结果条数
        pageIndex: 1, // 页码
        autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口
      })
      placeSearch.search(keywords, function (status: any, result: any) {
        searchState.locationResultList = result.poiList?.pois
        searchState.isResultShow = true
      })
    })
  }

  /**
   * 地图要素搜索
   */
  const onMapElementSearch = async () => {
    const keywords = searchState.searchValue
    if (!keywords) {
      searchState.isResultShow = false
      return
    }
    const param = {
      elementName: keywords,
      mapId: <string>route.query.id,
      page: {
        pageNum: 1,
        pageSize: 10,
        returnCount: false
      }
    }
    const res = await EditorApi.MapElementNameListInquiry(param)
    searchState.elementResultList = res.body.dataList
    searchState.isResultShow = true
  }

  /**
   * 点击搜索结果的每一条，定位到地图相关位置，设置地图中心点
   */
  const onSetMapCenter = (location: LocationParam, name: string) => {
    searchState.searchValue = name
    mapState.map.setCenter([location.lng, location.lat])
    searchState.isResultShow = false
  }
  return {
    onSearch,
    onSetMapCenter
  }
}
