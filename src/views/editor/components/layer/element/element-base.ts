import router from '@/router'
import { ElNotification } from 'element-plus'
import { mapState } from '@/views/common/map-config'
import { layerState } from '../layer.config'
import ElementApi from '@/api/element'

export const useElementBase = () => {
  /**
   * 要素改变大小
   */
  const emitChangeForSize = async (size: number) => {
    layerState.elementbaseParam.size = size
    await setCurrentElement()
  }

  /**
   * 要素线条形状
   */
  const emitChangeForLineCategory = async (category: number) => {
    layerState.elementbaseParam.lineCategory = category
    await setCurrentElement()
  }

  /**
   * 要素线条粗细
   */
  const emitChangeForStrokeWeight = async (weight: number) => {
    layerState.elementbaseParam.drawJson.strokeWeight = weight
    await setCurrentElement()
  }

  /**
   * 要素填充颜色
   */
  const emitChangeForFillColor = async (color: string) => {
    layerState.elementbaseParam.fillColor = color
    await setCurrentElement()
  }

  /**
   * 是否显示填充颜色
   */
  const emitElementSelectFillColor = async (isDisplay: boolean) => {
    layerState.elementbaseParam.fillColorDisplay = isDisplay
    await setCurrentElement()
  }

  /**
   * 是否显示描边颜色
   */
  const emitElementSelectStrokeColor = async (isDisplay: boolean) => {
    layerState.elementbaseParam.strokeColorDisplay = isDisplay
    await setCurrentElement()
  }

  /**
   * 要素描边颜色
   */
  const emitChangeForStrokeColor = async (color: string) => {
    layerState.elementbaseParam.strokeColor = color
    await setCurrentElement()
  }

  /**
   * 要素透明度
   */
  const emitChangeForTransparency = async (transparency: number) => {
    layerState.elementbaseParam.transparency = transparency
    await setCurrentElement()
  }

  /**
   * 设置当前要素
   */
  const setCurrentElement = async () => {
    // 当前点击的要素
    const [current] = mapState.map
      .getAllOverlays()
      ?.filter((item: any) => item.getExtData()?.elementId === layerState.elementInquiry?.id)

    // 为要素设置尺寸
    if (current.type === 'AMap.Marker') {
      // 添加自定义数据， 记录颜色
      current.setExtData({
        size: layerState.elementbaseParam?.size,
        fillColor: layerState.elementbaseParam?.fillColor,
        elementId: layerState.elementInquiry?.id
      })
      current.setContent(
        `<div class="gwin-map-marker" style="background: ${layerState.elementbaseParam?.fillColor}; width: ${
          layerState.elementbaseParam?.size === 4 ? '22' : layerState.elementbaseParam?.size === 2 ? '24' : '26'
        }px;height: ${
          layerState.elementbaseParam?.size === 4 ? '22' : layerState.elementbaseParam?.size === 2 ? '24' : '26'
        }px;"></div>`
      )
    } else {
      current.setExtData({
        strokeWeight: layerState.elementbaseParam.drawJson.strokeWeight,
        elementId: layerState.elementInquiry?.id
      })
      if (current.className === 'Overlay.Polyline') {
        current.setOptions({
          isOutline: layerState.elementbaseParam.strokeColorDisplay, // 线条是否带描边
          outlineColor: layerState.elementbaseParam.strokeColor, // 线条描边颜色
          path: layerState.elementbaseParam.drawJson.path, // 折线的节点坐标数组
          strokeColor: layerState.elementbaseParam.fillColorDisplay ? layerState.elementbaseParam.fillColor : '', // 线条颜色
          strokeOpacity: layerState.elementbaseParam.transparency, // 线条透明度
          strokeWeight: layerState.elementbaseParam.drawJson.strokeWeight, // 线条宽度
          strokeStyle: layerState.elementbaseParam.lineCategory === 1 ? 'solid' : 'dashed' // 线样式，1 实线 2 虚线
        })
      } else {
        current.setOptions({
          path: layerState.elementbaseParam.drawJson.path, // 折线的节点坐标数组
          strokeColor: layerState.elementbaseParam.strokeColorDisplay ? layerState.elementbaseParam.strokeColor : '', // 线条颜色
          strokeOpacity: layerState.elementbaseParam.transparency, // 线条透明度
          strokeWeight: layerState.elementbaseParam.drawJson.strokeWeight, // 线条宽度
          strokeStyle: layerState.elementbaseParam.lineCategory === 1 ? 'solid' : 'dashed', // 线样式，1 实线 2 虚线
          fillOpacity: layerState.elementbaseParam.transparency, // 填充透明度
          fillColor: layerState.elementbaseParam.fillColorDisplay ? layerState.elementbaseParam.fillColor : '' // 填充颜色
        })
      }
    }

    await mapElementBasicInfoMaintenance()
  }

  /**
   * 地图要素基础信息修改
   * @param args 请求参数
   */
  const mapElementBasicInfoMaintenance = async () => {
    const res = await ElementApi.mapElementBasicInfoMaintenance(layerState.elementbaseParam)
    if (res.status.replyCode === '102') {
      router.push('/not')
    }
  }
  return {
    setCurrentElement,
    emitChangeForSize,
    emitChangeForFillColor,
    emitChangeForStrokeColor,
    emitChangeForTransparency,
    emitChangeForLineCategory,
    emitChangeForStrokeWeight,
    emitElementSelectStrokeColor,
    emitElementSelectFillColor
  }
}
