import router from '@/router'
import { mapState, mapEditState } from '@/views/common/map-config'
import { layerState } from '@/views/editor/components/layer/layer.config'
import { ElementListParam } from '@/views/common/interface'
import { initElementActive } from '@/views/editor/components/tools/element-config'
import { useElementEvent } from '@/views/editor/map-element-event'
import EditorApi from '@/api/editor'

const {
  onClickCurrentMarker,
  onClickCurrentPolyline,
  onClickCurrentCircle,
  onClickCurrentEllipse,
  onClickCurrentRectangle,
  onClickCurrentPolygon,
  getElementSum,
  onCloseElementEditor,
  onCloseMouseTool
} = useElementEvent()

export const useElementAdd = () => {
  /**
   * 地图编辑页-地图图层要素列表查询
   */
  const mapElementListInquiry = async () => {
    const param = {
      id: mapEditState.mapId
    }
    const res = await EditorApi.mapElementListInquiry(param)

    if (res.status.replyCode === '102') {
      router.push('/not')
    }

    // 业务图层列表
    mapEditState.mapElementList = res.body.dataList

    // 默认展开第一个业务图层
    layerState.activeLayersId = [res.body.dataList[0].layerId]

    // 计算要素数量总和
    getElementSum()

    // 添加所需要的自定义数据
    for (const item of mapEditState.mapElementList) {
      item.isSelect = false // 是否选中
      item.isShowLayer = true // 显示隐藏
      item.isEditName = false // 修改业务图层名字
      for (const ele of item.elementList) {
        ele.isSelect = false // 是否选中
        ele.isShowElement = true // 显示隐藏
        switch (ele.category) {
          case 1:
            addMarker(ele) // 添加点要素
            break
          case 2:
            addPolyline(ele) // 添加折线
            break
          case 4:
            switch (ele.drawJson.shape) {
              case 1:
                addCircle(ele) // 添加圆
                break
              case 2:
                addEllipse(ele) // 添加椭圆
                break
              case 3:
                addRectangle(ele) // 添加矩形
                break
              case 4:
                addPolygon(ele) // 添加多边形
                break
              default:
                return
            }
            break
          default:
            return
        }
      }
    }
  }

  /**
   * 在地图上标记点
   */
  const addMarker = (ele: ElementListParam) => {
    const marker = new mapState.AMap.Marker({
      content: `<div class="gwin-map-marker" 
      style="background: ${ele.fillColor}; 
      width: ${ele.size === 4 ? '22' : ele.size === 2 ? '24' : '26'}px;
      height: ${ele.size === 4 ? '22' : ele.size === 2 ? '24' : '26'}px;
    "></div>`, // 点标记显示内容
      position: [ele.lng, ele.lat], // 经纬度
      offset: new mapState.AMap.Pixel(-13, -30), // 点标记显示位置偏移量
      topWhenClick: true // 鼠标点击时marker是否置顶
    })

    // 给点要素添加id
    marker?.setExtData({
      size: ele.size,
      fillColor: ele.fillColor,
      elementId: ele.elementId
    })

    marker.setMap(mapState.map)

    // 鼠标按下
    marker.on('mousedown', () => {
      // 先关闭上一次的编辑器
      onCloseElementEditor()

      // 停止鼠标工具
      onCloseMouseTool()
    })

    // 点击当前点标记
    marker.on('click', () => {
      initElementActive()
      onClickCurrentMarker(marker)
    })
  }

  /**
   * 在地图上标记折线
   */
  const addPolyline = (ele: ElementListParam) => {
    const polyline = new mapState.AMap.Polyline({
      path: ele.drawJson.path, // 折线的节点坐标数组
      cursor: 'pointer', // 指定鼠标悬停时的鼠标样式
      strokeColor: ele.fillColorDisplay ? ele.fillColor : '', // 线条颜色
      strokeOpacity: ele.transparency, // 透明度
      strokeWeight: ele.drawJson.strokeWeight, // 线条宽度
      strokeStyle: ele.lineCategory === 1 ? 'solid' : 'dashed', // 线样式，1 实线 2 虚线
      isOutline: ele.strokeColorDisplay, // 线条是否带描边
      outlineColor: ele.strokeColor // 描边颜色
    })

    // 给要素添加id
    polyline?.setExtData({
      strokeWeight: ele.drawJson.strokeWeight,
      elementId: ele.elementId
    })

    polyline.setMap(mapState.map)

    // 鼠标按下
    polyline.on('mousedown', () => {
      // 先关闭上一次的编辑器
      onCloseElementEditor()

      // 停止鼠标工具
      onCloseMouseTool()
    })

    // 点击当前折线
    polyline.on('click', () => {
      initElementActive()
      onClickCurrentPolyline(polyline)
    })
  }

  /**
   * 在地图上标记圆形
   */
  const addCircle = (ele: ElementListParam) => {
    const circle = new mapState.AMap.Circle({
      center: ele.drawJson?.center, // 圆的圆心位置
      radius: ele.drawJson?.radius, // 圆的半径
      cursor: 'pointer', // 指定鼠标悬停时的鼠标样式
      strokeWeight: ele.drawJson.strokeWeight, // 线条宽度
      lineCategory: ele.lineCategory === 1 ? 'solid' : 'dashed', // 线样式，1 实线 2 虚线
      strokeColor: ele.strokeColorDisplay ? ele.strokeColor : '', // 线条颜色
      fillColor: ele.fillColorDisplay ? ele.fillColor : '', // 填充颜色
      fillOpacity: ele.transparency, // 圆形填充透明度
      strokeOpacity: ele.transparency // 轮廓线透明度
    })

    // 给要素添加id
    circle?.setExtData({
      strokeWeight: ele.drawJson.strokeWeight,
      elementId: ele.elementId
    })

    circle.setMap(mapState.map)

    // 鼠标按下
    circle.on('mousedown', () => {
      // 先关闭上一次的编辑器
      onCloseElementEditor()

      // 停止鼠标工具
      onCloseMouseTool()
    })

    // 点击当前圆形
    circle.on('click', () => {
      initElementActive()
      onClickCurrentCircle(circle)
    })
  }

  /**
   * 在地图上标记椭圆
   */
  const addEllipse = (ele: ElementListParam) => {
    const ellipse = new mapState.AMap.Ellipse({
      center: ele.drawJson?.center, // 圆的圆心位置
      radius: ele.drawJson?.radius, // 椭圆的半径
      cursor: 'pointer', // 指定鼠标悬停时的鼠标样式
      strokeWeight: ele.drawJson.strokeWeight, // 线条宽度
      lineCategory: ele.lineCategory === 1 ? 'solid' : 'dashed', // 线样式，1 实线 2 虚线
      strokeColor: ele.strokeColorDisplay ? ele.strokeColor : '', // 线条颜色
      fillColor: ele.fillColorDisplay ? ele.fillColor : '', // 填充颜色
      fillOpacity: ele.transparency, // 填充透明度
      strokeOpacity: ele.transparency // 轮廓线透明度
    })

    // 给要素添加id
    ellipse?.setExtData({
      strokeWeight: ele.drawJson.strokeWeight,
      elementId: ele.elementId
    })

    ellipse.setMap(mapState.map)

    // 鼠标按下
    ellipse.on('mousedown', () => {
      // 先关闭上一次的编辑器
      onCloseElementEditor()

      // 停止鼠标工具
      onCloseMouseTool()
    })

    // 点击当前圆形
    ellipse.on('click', () => {
      initElementActive()
      onClickCurrentEllipse(ellipse)
    })
  }

  /**
   * 在地图上标记矩形
   */
  const addRectangle = (ele: ElementListParam) => {
    const rectangle = new mapState.AMap.Rectangle({
      bounds: ele.drawJson?.bounds, // 矩形的范围
      cursor: 'pointer', // 指定鼠标悬停时的鼠标样式
      strokeWeight: ele.drawJson.strokeWeight, // 线条宽度
      lineCategory: ele.lineCategory === 1 ? 'solid' : 'dashed', // 线样式，1 实线 2 虚线
      strokeColor: ele.strokeColorDisplay ? ele.strokeColor : '', // 线条颜色
      fillColor: ele.fillColorDisplay ? ele.fillColor : '', // 填充颜色
      fillOpacity: ele.transparency, // 填充透明度
      strokeOpacity: ele.transparency // 轮廓线透明度
    })

    // 给要素添加id
    rectangle?.setExtData({
      strokeWeight: ele.drawJson.strokeWeight,
      elementId: ele.elementId
    })

    rectangle.setMap(mapState.map)

    // 鼠标按下
    rectangle.on('mousedown', () => {
      // 先关闭上一次的编辑器
      onCloseElementEditor()

      // 停止鼠标工具
      onCloseMouseTool()
    })

    // 点击当前矩形
    rectangle.on('click', () => {
      initElementActive()
      onClickCurrentRectangle(rectangle)
    })
  }

  /**
   * 在地图上标记多边形
   */
  const addPolygon = (ele: ElementListParam) => {
    const polygon = new mapState.AMap.Polygon({
      path: ele.drawJson?.path, // 多边形轮廓线的节点坐标数组
      cursor: 'pointer', // 指定鼠标悬停时的鼠标样式
      strokeWeight: ele.drawJson.strokeWeight, // 线条宽度
      lineCategory: ele.lineCategory === 1 ? 'solid' : 'dashed', // 线样式，1 实线 2 虚线
      strokeColor: ele.strokeColorDisplay ? ele.strokeColor : '', // 线条颜色
      fillColor: ele.fillColorDisplay ? ele.fillColor : '', // 填充颜色
      fillOpacity: ele.transparency, // 填充透明度
      strokeOpacity: ele.transparency // 轮廓线透明度
    })

    // 给要素添加id
    polygon?.setExtData({
      strokeWeight: ele.drawJson.strokeWeight,
      elementId: ele.elementId
    })

    polygon.setMap(mapState.map)

    // 鼠标按下
    polygon.on('mousedown', () => {
      // 先关闭上一次的编辑器
      onCloseElementEditor()

      // 停止鼠标工具
      onCloseMouseTool()
    })

    // 点击当前多边形
    polygon.on('click', () => {
      initElementActive()
      onClickCurrentPolygon(polygon)
    })
  }
  return {
    mapElementListInquiry
  }
}
