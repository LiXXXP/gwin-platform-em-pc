import router from '@/router'
import { mapState, mapEditState } from '@/views/common/map-config'
import { layerState } from '@/views/editor/components/layer/layer.config'
import { previewState } from './preview-config'
import PreviewApi from '@/api/preview'

export const usePreviewElementEvent = () => {
  /**
   * 鼠标滑过显示要素名称
   */
  const onElementText = (name: string, ele: any) => {
    previewState.text = new mapState.AMap.Text({
      text: name,
      anchor: 'center', // 设置文本标记锚点
      cursor: 'pointer',
      style: {
        'border-radius': '2px',
        'background-color': '#2A2F37',
        'text-align': 'center',
        'font-size': '12px',
        border: '0',
        color: '#fff',
        padding: '2px 6px'
      }
    })
    previewState.text.setExtData({
      elementId: ele.getExtData().elementId
    })
    switch (ele.className) {
      case 'AMap.Marker':
        previewState.text.setPosition(ele.getPosition())
        previewState.text.setOffset(new mapState.AMap.Pixel(40, -15))
        previewState.text.setMap(mapState.map)
        break
      case 'Overlay.Polyline':
        const polylineIndex = Math.floor(ele.getPath().length / 2)
        previewState.text.setPosition(ele.getPath()[polylineIndex])
        previewState.text.setMap(mapState.map)
        break
      case 'Overlay.Circle':
        previewState.text.setPosition(ele.getCenter())
        previewState.text.setMap(mapState.map)
        break
      case 'Overlay.Ellipse':
        previewState.text.setPosition(ele.getCenter())
        previewState.text.setMap(mapState.map, ele.getCenter())
        break
      case 'Overlay.Rectangle':
        const bounds = [
          ele.getBounds().northEast.lng,
          ele.getBounds().northEast.lat,
          ele.getBounds().southWest.lng,
          ele.getBounds().southWest.lat
        ]
        previewState.text.setPosition(bounds)
        previewState.text.setMap(mapState.map)
        break
      case 'Overlay.Polygon':
        const PolygonIndex = Math.floor(ele.getPath().length / 2)
        previewState.text.setPosition(ele.getPath()[PolygonIndex])
        previewState.text.setMap(mapState.map)
        break
      default:
        return
    }
  }

  /**
   * 请求要素信息
   */
  const previewMapElementInquiry = async (id: string, ele: any) => {
    // 请求接口
    const param = {
      id: id
    }
    const res = await PreviewApi.previewMapElementInquiry(param)
    if (res.status.replyCode === '102') {
      router.push('/not')
    }
    layerState.elementInquiry = res.body

    // 选中元素的所在图层id
    layerState.activeLayersId = res.body?.layerId

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

    // 要素在地图上的视图自适应
    mapState.map.setFitView(ele, true, [0, 0, 0, 0], 12)

    // 设置要素样式
    setElementStyle(ele)

    // 添加要素信息窗体
    elementInfoWindow(ele)
  }

  /**
   * 要素样式初始
   */
  const initElement = () => {
    // marker 先置为初始样式
    mapState.map.getAllOverlays('marker').forEach((item: any) => {
      item.setContent(
        `<div class="gwin-map-marker" style="background: ${item.getExtData().fillColor}; width: ${
          item.getExtData().size === 4 ? '22' : item.getExtData().size === 2 ? '24' : '26'
        }px;height: ${item.getExtData().size === 4 ? '22' : item.getExtData().size === 2 ? '24' : '26'}px;"></div>`
      )
    })

    // 先将要素样式置为初始
    mapState.map.getAllOverlays().forEach((item: any) => {
      item.setOptions({
        strokeWeight: item.getExtData()?.strokeWeight // 线条宽度
      })
    })
  }

  /**
   * 设置要素点击后的样式
   */
  const setElementStyle = (ele: any) => {
    initElement()
    // 点击当前要素的样式高亮
    if (ele.type === 'AMap.Marker') {
      // 地图上有多个marker时，当isTop为true时，marker将显示在最前面
      ele.setTop(true)

      // 改变当前点击的marker样式
      ele.setContent(
        `<div class="gwin-map-marker" style="background: ${
          ele.getExtData().fillColor
        }; width: 30px;height: 30px;border-color:rgba(0,0,0, 0.3)"></div>`
      )
    } else {
      // 设置点击的当前要素样式
      ele.setOptions({
        strokeWeight: ele.getExtData().strokeWeight + 3 // 线条宽度
      })
    }
  }

  /**
   * 要素添加信息窗体
   */
  const elementInfoWindow = (ele: any) => {
    previewState.infoWindow = new mapState.AMap.InfoWindow({
      isCustom: true, // 使用自定义窗体
      content: createInfoWindow(0),
      closeWhenClickMap: true, // 是否在鼠标点击地图后关闭信息窗体
      offset: new mapState.AMap.Pixel(16, -45)
    })

    switch (ele.className) {
      case 'AMap.Marker':
        previewState.infoWindow.open(mapState.map, ele.getPosition())
        break
      case 'Overlay.Polyline':
        const polylineIndex = Math.floor(ele.getPath().length / 2)
        previewState.infoWindow.open(mapState.map, ele.getPath()[polylineIndex])
        break
      case 'Overlay.Circle':
        previewState.infoWindow.open(mapState.map, ele.getCenter())
        break
      case 'Overlay.Ellipse':
        previewState.infoWindow.open(mapState.map, ele.getCenter())
        break
      case 'Overlay.Rectangle':
        const bounds = [
          ele.getBounds().northEast.lng,
          ele.getBounds().northEast.lat,
          ele.getBounds().southWest.lng,
          ele.getBounds().southWest.lat
        ]
        previewState.infoWindow.open(mapState.map, bounds)
        break
      case 'Overlay.Polygon':
        const PolygonIndex = Math.floor(ele.getPath().length / 2)
        previewState.infoWindow.open(mapState.map, ele.getPath()[PolygonIndex])
        break
      default:
        return
    }
  }

  /**
   * 信息窗体内容
   * @returns
   */
  const createInfoWindow = (index: number) => {
    let picture = ''
    let tag = ''
    let memo = ''
    const title = `
      <div class="gwin-platform-info__title flex flex-between flex-only-center">
        <p>${layerState.elementInquiry.name}</p>
        <i onclick="closeInfoWindow()"></i>
      </div>`
    if (layerState.elementInquiry.memo) {
      memo = `<div class="gwin-platform-info__memo">${layerState.elementInquiry.memo}</div>`
    }
    if (layerState.elementInquiry.tagList) {
      for (const t of layerState.elementInquiry.tagList) {
        tag += `<p>${t}</p>`
      }
    }
    if (layerState.elementInquiry.pictures.length) {
      picture = `
        <div class="gwin-platform-info__picture">
          <img src="${layerState.elementInquiry.pictures[index]}" />
          <p class="length">${index + 1}/${layerState.elementInquiry.pictures.length}</p>
          <div class="gwin-platform-info__picture--hover">
            <div class="flex flex-between flex-only-center">
              <i class="left" onclick="onPrevPage(${index})"></i>
              <i class="look" onclick="onPreview(${index})"></i>
              <i class="right" onclick="onNextPage(${index})"></i>
            </div>
          </div>
        </div>`
    }

    const content = `<div class="gwin-platform-info-window">${title}${picture}<div class="gwin-platform-info__tag flex flex-only-center">${tag}</div>${memo}</div> `
    return content
  }

  // 上一张图片
  ;(window as any).onPrevPage = (index: number) => {
    if (index < 1) {
      return
    }
    index--
    previewState.infoWindow.setContent(createInfoWindow(index))
  }

  // 下一张图片
  ;(window as any).onNextPage = (index: number) => {
    if (index === layerState.elementInquiry.pictures.length - 1) {
      return
    }
    index++
    previewState.infoWindow.setContent(createInfoWindow(index))
  }

  /**
   * 图片预览
   */
  ;(window as any).onPreview = (index: number) => {
    previewState.isPreview = true
    previewState.index = index
  }

  /**
   * 关闭图片预览
   */
  const onCloseViewer = () => {
    previewState.isPreview = false
  }

  /**
   * 关闭信息窗体
   */
  ;(window as any).closeInfoWindow = () => {
    previewState.infoWindow.close()
  }

  return {
    onElementText,
    initElement,
    setElementStyle,
    previewMapElementInquiry,
    onCloseViewer
  }
}
