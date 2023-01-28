import router from '@/router'
import ElementApi from '@/api/element'
import { mapState, mapEditState } from '@/views/common/map-config'
import { layerState } from '@/views/editor/components/layer/layer.config'
import { initElementActive } from '@/views/editor/components/tools/element-config'

export const useElementEvent = () => {
  /**
   * 初始点标记样式
   */
  const initMarker = () => {
    mapState.map.getAllOverlays('marker').forEach((item: any) => {
      item.setContent(
        `<div class="gwin-map-marker" style="background: ${item.getExtData().fillColor}; width: ${
          item.getExtData().size === 4 ? '22' : item.getExtData().size === 2 ? '24' : '26'
        }px;height: ${item.getExtData().size === 4 ? '22' : item.getExtData().size === 2 ? '24' : '26'}px;"></div>`
      )
    })
  }

  /**
   * 点击当前点标记 进行编辑 公共方法
   * @param marker 当前marker对象
   * @param fillColor 颜色
   */
  const onClickCurrentMarker = async (marker: any) => {
    // 点击当前的要素获取类型 进行赋值
    layerState.currentElementType = marker.type

    // 自动缩放地图到合适的视野级别
    mapState.map.setFitView(marker, true, [0, 0, 0, 0], 12)
    await mapElementInquiry(marker.getExtData().elementId)

    // 地图上有多个marker时，当isTop为true时，marker将显示在最前面
    marker.setTop(true)
    // 改变当前点击的marker样式
    marker.setContent(
      `<div class="gwin-map-marker" style="background: ${
        marker.getExtData().fillColor
      }; width: 30px;height: 30px;border-color:rgba(0,0,0, 0.3)"></div>`
    )
  }

  /**
   * 点击当前折线 进行编辑 公共方法
   */
  const onClickCurrentPolyline = async (polyline: any) => {
    // 点击当前的要素获取类型 进行赋值
    layerState.currentElementType = polyline.type

    // 自动缩放地图到合适的视野级别
    mapState.map.setFitView(polyline, true, [0, 0, 0, 0], 12)
    await mapElementInquiry(polyline.getExtData().elementId)

    // // 打开折线编辑
    mapState.map.plugin(['AMap.PolyEditor'], function () {
      layerState.currentElementEditor = new mapState.AMap.PolyEditor(mapState.map, polyline)
      layerState.currentElementEditor.open()

      // 通过鼠标在折线上增加一个节点或在多边形上增加一个顶点时触发此事件
      layerState.currentElementEditor.on('addnode', async (ele: any) => {
        layerState.elementbaseParam.drawJson.path = ele.target.getPath()
        await ElementApi.mapElementBasicInfoMaintenance(layerState.elementbaseParam)
      })

      // 鼠标调整折线上某个节点或多边形上某个顶点的位置时触发此事件
      layerState.currentElementEditor.on('adjust', async (ele: any) => {
        layerState.elementbaseParam.drawJson.path = ele.target.getPath()
        await ElementApi.mapElementBasicInfoMaintenance(layerState.elementbaseParam)
      })

      // 通过鼠标在折线上删除一个节点或在多边形上删除一个顶点时触发此事件
      layerState.currentElementEditor.on('removenode', async (ele: any) => {
        layerState.elementbaseParam.drawJson.path = ele.target.getPath()
        await ElementApi.mapElementBasicInfoMaintenance(layerState.elementbaseParam)
      })

      // 当双击鼠标左键，结束编辑时设置样式
      layerState.currentElementEditor.on('end', () => {
        setOptions(polyline)
      })
    })
  }

  /**
   * 点击当前圆形 进行编辑 公共方法
   */
  const onClickCurrentCircle = async (circle: any) => {
    // 点击当前的要素获取类型 进行赋值
    layerState.currentElementType = circle.type

    // 自动缩放地图到合适的视野级别
    mapState.map.setFitView(circle, true, [0, 0, 0, 0], 12)
    await mapElementInquiry(circle.getExtData().elementId)

    // 打开圆形编辑
    mapState.map.plugin(['AMap.CircleEditor'], function () {
      layerState.currentElementEditor = new mapState.AMap.CircleEditor(mapState.map, circle)
      layerState.currentElementEditor.open()

      // 拖拽圆心调整圆形位置时触发此事件
      layerState.currentElementEditor.on('move', async (ele: any) => {
        layerState.elementbaseParam.drawJson.center = [ele.lnglat.lng, ele.lnglat.lat]
        await ElementApi.mapElementBasicInfoMaintenance(layerState.elementbaseParam)
        const param = {
          id: circle.getExtData().elementId,
          lng: ele.lnglat.lng,
          lat: ele.lnglat.lat
        }
        await ElementApi.mapElementBizInfoMaintenance(param)
      })

      // 鼠标调整圆形半径时，触发此事件
      layerState.currentElementEditor.on('adjust', async (ele: any) => {
        layerState.elementbaseParam.drawJson.radius = ele.radius
        await ElementApi.mapElementBasicInfoMaintenance(layerState.elementbaseParam)
      })

      // 当双击鼠标左键，结束编辑时设置样式
      layerState.currentElementEditor.on('end', () => {
        setOptions(circle)
      })
    })
  }

  /**
   * 点击当前椭圆形 进行编辑 公共方法
   */
  const onClickCurrentEllipse = async (ellipse: any) => {
    // 点击当前的要素获取类型 进行赋值
    layerState.currentElementType = ellipse.type

    // 先关闭上一次的编辑器
    onCloseElementEditor()

    // 停止鼠标工具
    onCloseMouseTool()

    // 右边编辑栏样式初始
    initElementActive()

    // 自动缩放地图到合适的视野级别
    mapState.map.setFitView(ellipse, true, [0, 0, 0, 0], 12)
    await mapElementInquiry(ellipse.getExtData().elementId)

    // 打开椭圆编辑
    mapState.map.plugin(['AMap.EllipseEditor'], function () {
      layerState.currentElementEditor = new mapState.AMap.EllipseEditor(mapState.map, ellipse)
      layerState.currentElementEditor.open()

      // 拖拽圆心调整圆形位置时触发此事件
      layerState.currentElementEditor.on('move', async (ele: any) => {
        layerState.elementbaseParam.drawJson.center = [ele.lnglat.lng, ele.lnglat.lat]
        await ElementApi.mapElementBasicInfoMaintenance(layerState.elementbaseParam)
        const param = {
          id: ellipse.getExtData().elementId,
          lng: ele.lnglat.lng,
          lat: ele.lnglat.lat
        }
        await ElementApi.mapElementBizInfoMaintenance(param)
      })

      // 鼠标调整圆形半径时，触发此事件
      layerState.currentElementEditor.on('adjust', async (ele: any) => {
        layerState.elementbaseParam.drawJson.radius = ele.radius
        await ElementApi.mapElementBasicInfoMaintenance(layerState.elementbaseParam)
      })

      // 当双击鼠标左键，结束编辑时设置样式
      layerState.currentElementEditor.on('end', () => {
        setOptions(ellipse)
      })
    })
  }

  /**
   * 点击当前矩形 进行编辑 公共方法
   */
  const onClickCurrentRectangle = async (rectangle: any) => {
    // 点击当前的要素获取类型 进行赋值
    layerState.currentElementType = rectangle.type

    // 自动缩放地图到合适的视野级别
    mapState.map.setFitView(rectangle, true, [0, 0, 0, 0], 12)
    await mapElementInquiry(rectangle.getExtData().elementId)

    mapState.map.plugin(['AMap.RectangleEditor'], function () {
      layerState.currentElementEditor = new mapState.AMap.RectangleEditor(mapState.map, rectangle)
      layerState.currentElementEditor.open()

      // 鼠标调整横向和纵向半径时触发该事件
      layerState.currentElementEditor.on('adjust', async (ele: any) => {
        layerState.elementbaseParam.drawJson.bounds = ele.bounds
        await ElementApi.mapElementBasicInfoMaintenance(layerState.elementbaseParam)
      })

      // 当双击鼠标左键，结束编辑时设置样式
      layerState.currentElementEditor.on('end', () => {
        setOptions(rectangle)
      })
    })
  }

  /**
   * 点击当前多边形形 进行编辑 公共方法
   */
  const onClickCurrentPolygon = async (polygon: any) => {
    // 点击当前的要素获取类型 进行赋值
    layerState.currentElementType = polygon.type

    // 自动缩放地图到合适的视野级别
    mapState.map.setFitView(polygon, true, [0, 0, 0, 0], 12)
    await mapElementInquiry(polygon.getExtData().elementId)

    mapState.map.plugin(['AMap.PolyEditor'], function () {
      layerState.currentElementEditor = new mapState.AMap.PolyEditor(mapState.map, polygon)
      layerState.currentElementEditor.open()

      // 通过鼠标在折线上增加一个节点或在多边形上增加一个顶点时触发此事件
      layerState.currentElementEditor.on('addnode', async (ele: any) => {
        layerState.elementbaseParam.drawJson.path = ele.target.getPath()
        await ElementApi.mapElementBasicInfoMaintenance(layerState.elementbaseParam)
      })

      // 鼠标调整折线上某个节点或多边形上某个顶点的位置时触发此事件
      layerState.currentElementEditor.on('adjust', async (ele: any) => {
        layerState.elementbaseParam.drawJson.path = ele.target.getPath()
        await ElementApi.mapElementBasicInfoMaintenance(layerState.elementbaseParam)
      })

      // 通过鼠标在折线上删除一个节点或在多边形上删除一个顶点时触发此事件
      layerState.currentElementEditor.on('removenode', async (ele: any) => {
        layerState.elementbaseParam.drawJson.path = ele.target.getPath()
        await ElementApi.mapElementBasicInfoMaintenance(layerState.elementbaseParam)
      })

      // 当双击鼠标左键，结束编辑时设置样式
      layerState.currentElementEditor.on('end', () => {
        setOptions(polygon)
      })
    })
  }

  /**
   * 请求要素信息
   */
  const mapElementInquiry = async (id: string) => {
    // marker 先置为初始样式
    initMarker()

    // 设置鼠标状态
    mapState.map.setDefaultCursor('default')

    // 打开要素编辑
    layerState.elementActive = true

    // 请求接口
    const param = {
      id: id
    }
    const res = await ElementApi.mapElementInquiry(param)
    if (res.status.replyCode === '102') {
      router.push('/not')
    }
    layerState.elementInquiry = res.body

    if (!res.body.tagList) {
      layerState.elementInquiry.tagList = []
    }

    // 自定义数据
    layerState.elementInquiry.isEditName = false
    layerState.elementInquiry.VModelName = ''

    // 要素基本信息修改参数赋值
    ;({ ...layerState.elementbaseParam } = {
      drawJson: layerState.elementInquiry?.drawJson,
      fillColor: layerState.elementInquiry?.fillColor,
      id: layerState.elementInquiry?.id,
      lineCategory: layerState.elementInquiry?.lineCategory,
      size: layerState.elementInquiry?.size,
      strokeColor: layerState.elementInquiry?.strokeColor,
      transparency: layerState.elementInquiry?.transparency,
      fillColorDisplay: layerState.elementInquiry?.fillColorDisplay,
      strokeColorDisplay: layerState.elementInquiry?.strokeColorDisplay
    })

    // 选中元素的所在图层id
    layerState.activeLayersId = [...new Set(layerState.activeLayersId.concat(res.body?.layerId))]

    // 点击元素或图层 相应的所在图层或元素高亮
    mapEditState.mapElementList.forEach((item) => {
      item.isSelect = false
      item.elementList.forEach((ele) => {
        ele.isSelect = false
        if (ele.elementId === id) {
          ele.isSelect = true
        }
      })
    })
  }

  /**
   * 计算要素数量总和
   */
  const getElementSum = () => {
    const elementLength = mapEditState.mapElementList.map((item) => {
      return item.elementList?.length
    })
    mapEditState.elementSum = elementLength.reduce((n, m) => n + m)
  }

  /**
   * 编辑完成设置样式
   */
  const setOptions = (ele: any) => {
    if (ele.className === 'Overlay.Polyline') {
      ele.setOptions({
        isOutline: layerState.elementbaseParam?.strokeColorDisplay, // 线条是否带描边
        outlineColor: layerState.elementbaseParam.strokeColor, // 线条描边颜色
        path: layerState.elementbaseParam.drawJson?.path, // 折线的节点坐标数组
        strokeColor: layerState.elementbaseParam.fillColorDisplay ? layerState.elementbaseParam.fillColor : '', // 线条颜色
        strokeOpacity: layerState.elementbaseParam.transparency, // 透明度
        strokeWeight: layerState.elementbaseParam.drawJson.strokeWeight, // 线条宽度
        strokeStyle: layerState.elementbaseParam.lineCategory === 1 ? 'solid' : 'dashed' // 线样式，1 实线 2 虚线
      })
    } else {
      ele.setOptions({
        strokeColor: layerState.elementbaseParam?.strokeColorDisplay ? layerState.elementbaseParam.strokeColor : '', // 线条颜色
        strokeOpacity: layerState.elementbaseParam.transparency, // 线条透明度
        strokeWeight: layerState.elementbaseParam.drawJson?.strokeWeight, // 线条宽度
        strokeStyle: layerState.elementbaseParam.lineCategory === 1 ? 'solid' : 'dashed', // 线样式，1 实线 2 虚线
        fillOpacity: layerState.elementbaseParam.transparency, // 填充透明度
        fillColor: layerState.elementbaseParam.fillColorDisplay ? layerState.elementbaseParam.fillColor : '' // 填充颜色
      })
    }
  }

  /**
   * 关闭要素编辑器
   */
  const onCloseElementEditor = () => {
    layerState.currentElementEditor?.close()
    layerState.currentElementEditor = null
  }

  /**
   * 关闭鼠标工具
   */
  const onCloseMouseTool = () => {
    mapState.mapPlugins?.mouseTool?.close()
    mapState.mapPlugins.mouseTool = null
  }

  return {
    onClickCurrentMarker,
    onClickCurrentPolyline,
    onClickCurrentCircle,
    onClickCurrentEllipse,
    onClickCurrentRectangle,
    onClickCurrentPolygon,
    getElementSum,
    onCloseElementEditor,
    onCloseMouseTool
  }
}
