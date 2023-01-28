import AMapLoader from '@amap/amap-jsapi-loader'
import { useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
import { mapState, mapEditState } from '@/views/common/map-config'
import { layerState, ElementInquiryParam } from '@/views/editor/components/layer/layer.config'
import { elementState } from '@/views/editor/components/tools/element-config'
import { useElementAdd } from '@/views/editor/map-element-add'
import { useElementEvent } from '@/views/editor/map-element-event'
import { usePreviewElementAdd } from '@/views/preview/preview-element-add'
import { useShareElementAdd } from '@/views/share/share-element-add'

const { mapElementListInquiry } = useElementAdd()
const { onCloseElementEditor } = useElementEvent()
const { previewMapInquiry } = usePreviewElementAdd()
const { publishedMapInquiry } = useShareElementAdd()

export const useMapInit = () => {
  const route = useRoute()
  /**
   * 地图初始化
   */
  const initMap = () => {
    ;(window as any)._AMapSecurityConfig = {
      securityJsCode: '8c198fa8ff5eb01baec5230f6f0336b2' // jscode 要与 key 一起使用
    }
    AMapLoader.load({
      key: 'a59a1642e53b3c0af62093f94731d7f3', // 申请好的Web端开发者Key，首次调用 load 时必填
      version: '2.0' // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    })
      .then(async (AMap) => {
        mapState.AMap = AMap // 地图内置实例
        mapState.map = new AMap.Map('myMap', {
          zoom: 12,
          viewMode: '3D', // 是否为3D地图模式
          isHotspot: false, // 是否开启地图热点和标注的hover效果
          animateEnable: false, // 地图平移过程中是否使用动画
          resizeEnable: false, // 是否监控地图容器尺寸变化
          doubleClickZoom: false, // 地图是否可通过双击鼠标放大地图，默认为true
          jogEnable: false, // 地图是否使用缓动效果
          center: [116.397428, 39.90923] // 初始化地图中心点位置
        })

        // 设置地图底图样式
        setMapLayers(mapEditState.mapBasic.category)

        // 地图编辑页-图层要素列表查询
        if (route.path.includes('editor')) {
          // 地图样式
          mapState.map.setMapStyle('amap://styles/' + mapEditState.mapBasic?.templateNo)
          await mapElementListInquiry()
        }

        // 地图预览页-图层要素列表查询
        if (route.path.includes('preview')) {
          // 地图样式
          mapState.map.setMapStyle('amap://styles/' + mapEditState.mapBasic?.templateNo)
          await previewMapInquiry()
        }

        // 地图分享页-图层要素列表查询
        if (route.path.includes('share')) {
          await publishedMapInquiry()
        }

        // 地图添加插件
        AMap.plugin(['AMap.ControlBar', 'AMap.Geolocation', 'AMap.ToolBar', 'AMap.Scale', 'AMap.MouseTool'], () => {
          // 添加 3D 罗盘控制
          mapState.map.addControl(
            new AMap.ControlBar({
              position: { right: '30px', bottom: '330px' },
              showControlButton: true // 是否显示倾斜、旋转按钮。默认为 true
            })
          )

          // 添加 浏览器个人定位
          const geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, // 是否使用高精度定位，默认:true
            timeout: 10000, // 超过10秒后停止定位，默认：5s
            position: { right: '60px', bottom: '280px' }, // 定位按钮的停靠位置
            borderRadius: '6px', // 圆角
            offset: [0, 0], // 定位按钮与设置的停靠位置的偏移量，默认：[10, 20]
            zoomToAccuracy: false // 定位成功后是否自动调整地图视野到定位点
          })
          mapState.map.addControl(geolocation)

          // 获取个人定位坐标
          geolocation.getCurrentPosition(function (status: string, result: any) {
            if (status === 'complete') {
              ;({ ...mapState.personageResult } = { lng: result?.position.lng, lat: result?.position.lat })
            } else {
              ;({ ...mapState.personageResult } = { lng: 116.397428, lat: 39.90923 })
              ElNotification({
                message: `个人定位获取失败，请重试`,
                type: 'error',
                offset: 60
              })
            }
          })

          // 添加 工具条
          mapState.map.addControl(
            new AMap.ToolBar({
              position: { right: '60px', bottom: '205px' }
            })
          )

          // 添加 比例尺
          mapState.map.addControl(
            new AMap.Scale({
              position: { right: '40px', bottom: '7px' }
            })
          )

          // 添加鼠标工具
          mapState.mapPlugins.mouseTool = new AMap.MouseTool(mapState.map)

          // 鼠标左键双击地图
          mapState.map.on('click', async () => {
            // 关闭当前编辑
            onCloseElementEditor()
            // 关闭导入弹窗与高亮
            elementState.isActive.import = false

            // 关闭要素编辑栏
            layerState.elementInquiry = <ElementInquiryParam>{}

            // 设置鼠标状态
            mapState.map.setDefaultCursor('default')

            // marker 先置为初始样式
            mapState.map.getAllOverlays('marker').forEach((item: any) => {
              item.setContent(
                `<div class="gwin-map-marker" style="background: ${item.getExtData().fillColor}; width: ${
                  item.getExtData().size === 4 ? '22' : item.getExtData().size === 2 ? '24' : '26'
                }px;height: ${
                  item.getExtData().size === 4 ? '22' : item.getExtData().size === 2 ? '24' : '26'
                }px;"></div>`
              )
            })
          })
        })
      })
      .catch((e) => {
        console.log(e)
      })
  }

  /**
   * 地图销毁
   */
  const destroyMap = () => {
    mapState.map && mapState.map.destroy()
  }

  /**
   * 设置底图样式
   * @param category 类型 1 标准 2 卫星 4 卫星路网
   */
  const setMapLayers = (category: number) => {
    mapState.map.remove([new mapState.AMap.TileLayer.Satellite(), new mapState.AMap.TileLayer.RoadNet()])
    switch (category) {
      case 4:
        mapState.map.add([
          // 卫星
          new mapState.AMap.TileLayer.Satellite({
            zIndex: 1
          }),
          // 路网
          new mapState.AMap.TileLayer.RoadNet({
            zIndex: 1
          })
        ])
        break
      case 2:
        mapState.map.add([
          // 卫星
          new mapState.AMap.TileLayer.Satellite({
            zIndex: 1
          })
        ])
        break
      case 1:
        mapState.map.add([
          // 标准
          mapState.AMap.createDefaultLayer({
            zIndex: 1
          })
        ])
        break
      default:
        return
    }
  }

  return {
    initMap,
    destroyMap,
    setMapLayers
  }
}
