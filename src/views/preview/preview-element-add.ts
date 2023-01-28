import router from '@/router'
import { mapState, mapEditState } from '@/views/common/map-config'
import { ElementListParam } from '@/views/common/interface'
import { previewState } from './preview-config'
import PreviewApi from '@/api/preview'
import { useElementEvent } from '@/views/editor/map-element-event'
import { usePreviewElementEvent } from './preview-element-event'

const { getElementSum } = useElementEvent()
const { onElementText, previewMapElementInquiry } = usePreviewElementEvent()

export const usePreviewElementAdd = () => {
  /**
   * 地图编辑页-地图图层要素列表查询
   */
  const previewMapInquiry = async () => {
    const param = {
      id: mapEditState.mapId
    }
    const res = await PreviewApi.previewMapInquiry(param)
    if (res.status.replyCode === '102') {
      router.push('/not')
    }

    // 业务图层列表
    mapEditState.mapElementList = res.body.dataList

    // 计算要素数量总和
    getElementSum()

    // 添加所需要的自定义数据
    mapEditState.mapElementList.forEach((item: any) => {
      item.isSelect = false // 是否选中
      item.isShowLayer = true // 显示隐藏
      item.elementList.forEach((ele: ElementListParam) => {
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
      })
    })
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

    if (ele.display) {
      onElementText(ele.name, marker)
    } else {
      // 鼠标经过
      marker.on('mouseover', () => {
        onElementText(ele.name, marker)
      })

      // 鼠标移出
      marker.on('mouseout', () => {
        previewState.text.hide()
      })
    }

    // 点击当前点标记
    marker.on('click', async () => {
      await previewMapElementInquiry(ele.elementId, marker)
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

    if (ele.display) {
      onElementText(ele.name, polyline)
    } else {
      // 鼠标经过
      polyline.on('mouseover', () => {
        onElementText(ele.name, polyline)
      })

      // 鼠标移出
      polyline.on('mouseout', () => {
        previewState.text.hide()
      })
    }

    // 点击当前折线
    polyline.on('click', async () => {
      await previewMapElementInquiry(ele.elementId, polyline)
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

    if (ele.display) {
      onElementText(ele.name, circle)
    } else {
      // 鼠标经过
      circle.on('mouseover', () => {
        onElementText(ele.name, circle)
      })

      // 鼠标移出
      circle.on('mouseout', () => {
        previewState.text.hide()
      })
    }

    // 点击当前圆形
    circle.on('click', async () => {
      await previewMapElementInquiry(ele.elementId, circle)
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

    if (ele.display) {
      onElementText(ele.name, ellipse)
    } else {
      // 鼠标经过
      ellipse.on('mouseover', () => {
        onElementText(ele.name, ellipse)
      })

      // 鼠标移出
      ellipse.on('mouseout', () => {
        previewState.text.hide()
      })
    }

    // 点击当前椭圆形
    ellipse.on('click', async () => {
      await previewMapElementInquiry(ele.elementId, ellipse)
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

    if (ele.display) {
      onElementText(ele.name, rectangle)
    } else {
      // 鼠标经过
      rectangle.on('mouseover', () => {
        onElementText(ele.name, rectangle)
      })

      // 鼠标移出
      rectangle.on('mouseout', () => {
        previewState.text.hide()
      })
    }

    // 点击当前矩形
    rectangle.on('click', async () => {
      await previewMapElementInquiry(ele.elementId, rectangle)
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

    if (ele.display) {
      onElementText(ele.name, polygon)
    } else {
      // 鼠标经过
      polygon.on('mouseover', () => {
        onElementText(ele.name, polygon)
      })

      // 鼠标移出
      polygon.on('mouseout', () => {
        previewState.text.hide()
      })
    }

    // 点击当前多边形
    polygon.on('click', async () => {
      await previewMapElementInquiry(ele.elementId, polygon)
    })
  }
  return {
    previewMapInquiry
  }
}
