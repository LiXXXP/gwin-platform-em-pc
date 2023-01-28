import router from '@/router'
import ElementApi from '@/api/element'
import { mapState, mapEditState } from '@/views/common/map-config'
import { layerState } from '@/views/editor/components/layer/layer.config'
import { initElementActive } from '@/views/editor/components/tools/element-config'
import { useElementEvent } from '@/views/editor/map-element-event'

const {
  onClickCurrentMarker,
  onClickCurrentPolyline,
  onClickCurrentCircle,
  onClickCurrentRectangle,
  onClickCurrentPolygon,
  getElementSum,
  onCloseMouseTool,
  onCloseElementEditor
} = useElementEvent()

export const useMouseToolDraw = () => {
  /**
   * 标工具绘制覆盖物结束时触发此事件，obj对象为绘制出来的覆盖物对象
   */
  const onMouseToolDraw = () => {
    // 添加完成
    mapState.mapPlugins.mouseTool?.on('draw', async (type: any) => {
      let params = {}
      switch (type.obj.className) {
        case 'AMap.Marker':
          // 点定义数据
          params = {
            category: 1, // 要素类型 1 点 2 线 4 面
            lng: type.obj?.getPosition().lng, // 经度
            lat: type.obj?.getPosition().lat, // 纬度
            basicAttr: {
              size: 2, // 尺寸 1 大 2 中 4 小
              fillColor: '#3C7DFF' // 填充颜色
            }
          }
          break
        case 'Overlay.Polyline':
          if (type.obj?.getPath().length <= 1) {
            return
          }
          // 折线定义数据
          params = {
            category: 2, // 要素类型 1 点 2 线 4 面
            lng: type.obj?.getPath()[0].lng, // 经度
            lat: type.obj?.getPath()[0].lat, // 纬度
            basicAttr: {
              drawJson: {
                path: type.obj?.getPath(), // 折线坐标点 array
                strokeWeight: 3 // 线条宽度
              },
              lineCategory: 1, // 线形状 1 实线 2 虚线
              fillColor: '#3C7DFF', // 线条填充颜色
              transparency: 1 // 透明度,取值范围[0,1]
            }
          }
          break
        case 'Overlay.Circle':
          if (type.obj?.getRadius() <= 0) {
            return
          }
          // 圆形定义数据
          params = {
            category: 4, // 要素类型 1 点 2 线 4 面
            lng: type.obj?.getCenter().lng, // 经度
            lat: type.obj?.getCenter().lat, // 纬度
            basicAttr: {
              drawJson: {
                shape: 1, // 面的形状，1: 圆形 2: 椭圆 3: 矩形 4: 多边形
                center: type.obj?.getCenter(), // 圆心位置
                radius: type.obj?.getRadius(), // 圆半径，单位:米
                strokeWeight: 1 // 轮廓线宽度
              },
              lineCategory: 1, // 线形状 1 实线 2 虚线
              strokeColor: '#3C7DFF', // 线条颜色
              fillColor: '#3C7DFF', // 填充颜色
              transparency: 0.3 // 填充透明度
            }
          }
          break
        case 'Overlay.Rectangle':
          if (
            type.obj?.getBounds().northEast.lng === type.obj?.getBounds().southWest.lng &&
            type.obj?.getBounds().northEast.lat === type.obj?.getBounds().southWest.lat
          ) {
            return
          }
          // 矩形定义数据
          params = {
            category: 4, // 要素类型 1 点 2 线 4 面
            lng: type.obj?.getBounds().northEast.lng, // 经度
            lat: type.obj?.getBounds().northEast.lat, // 纬度
            basicAttr: {
              drawJson: {
                shape: 3, // 面的形状，1: 圆形 2: 椭圆 3: 矩形 4: 多边形
                bounds: type.obj?.getBounds(), // 矩形的范围
                strokeWeight: 1 // 轮廓线宽度
              },
              lineCategory: 1, // 线形状 1 实线 2 虚线
              strokeColor: '#3C7DFF', // 线条颜色
              fillColor: '#3C7DFF', // 填充颜色
              transparency: 0.3 // 填充透明度
            }
          }

          break
        case 'Overlay.Polygon':
          if (type.obj?.getPath().length <= 2) {
            mapState.map.remove(type.obj)
            return
          }
          // 多边形定义数据
          params = {
            category: 4, // 要素类型 1 点 2 线 4 面
            lng: type.obj?.getPath()[0].lng, // 经度
            lat: type.obj?.getPath()[0].lat, // 纬度
            basicAttr: {
              drawJson: {
                shape: 4, // 面的形状，1: 圆形 2: 椭圆 3: 矩形 4: 多边形
                path: type.obj?.getPath(), // 多边形轮廓线的节点坐标数组
                strokeWeight: 1 // 轮廓线宽度
              },
              lineCategory: 1, // 线形状 1 实线 2 虚线
              strokeColor: '#3C7DFF', // 线条颜色
              fillColor: '#3C7DFF', // 填充颜色
              transparency: 0.3 // 填充透明度
            }
          }
          break
        default:
          return
      }

      await mapElementAddition(params, type.obj)

      // 鼠标按下
      type.obj.on('mousedown', () => {
        // 先关闭上一次的编辑器
        onCloseElementEditor()

        // 停止鼠标工具
        onCloseMouseTool()
      })

      // 鼠标点击
      type.obj.on('click', () => {
        initElementActive()
        onClickElement(type.obj)
      })
    })
  }

  /**
   * 点击要素
   * @param ele
   */
  const onClickElement = (ele: any) => {
    // 点击当前要素
    switch (ele.className) {
      case 'AMap.Marker':
        onClickCurrentMarker(ele)
        break
      case 'Overlay.Polyline':
        onClickCurrentPolyline(ele)
        break
      case 'Overlay.Circle':
        onClickCurrentCircle(ele)
        break
      case 'Overlay.Rectangle':
        onClickCurrentRectangle(ele)
        break
      case 'Overlay.Polygon':
        onClickCurrentPolygon(ele)
        break
      default:
        return
    }
  }

  /**
   * 添加要素，请求方法
   */
  const mapElementAddition = async (params: any, ele: any) => {
    // 添加的业务图层id
    const BusinessIndex = layerState.activeLayersId?.length - 1
    const layerId: string = layerState.activeLayersId[BusinessIndex]
    // 请求参数
    const param = {
      layerId: layerId, // 图层id
      mapId: mapEditState.mapId, // 地图id
      zoomMax: 18, // 要素展示最大层级
      zoomMin: 13, // 要素展示最小层级
      ...params
    }
    const res = await ElementApi.mapElementAddition(param)
    if (res.status.replyCode === '102') {
      router.push('/not')
    }

    // 给点要素添加id
    if (ele.type === 'AMap.Marker') {
      ele?.setExtData({
        size: 2,
        fillColor: '#3C7DFF',
        elementId: res.body.id
      })
    } else {
      ele?.setExtData({
        strokeWeight: 1,
        elementId: res.body.id
      })
    }

    // 给相应业务图层添加要素
    const index = mapEditState.mapElementList?.findIndex((item) => {
      return item.layerId === layerId
    })
    mapEditState.mapElementList[index]?.elementList.push({
      elementId: res.body.id,
      elementNo: res.body.elementNo,
      name: res.body.name,
      lat: res.body.lat,
      lng: res.body.lng,
      isSelect: false, // 是否选中
      isShowElement: true // 显示隐藏
    })

    // 计算元素总数量
    getElementSum()
  }
  return {
    onMouseToolDraw,
    mapElementAddition
  }
}
