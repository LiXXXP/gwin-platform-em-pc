import { useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
import ElementApi from '@/api/element'
import { mapState, mapEditState } from '@/views/common/map-config'
import { initElementActive } from '@/views/editor/components/tools/element-config'
import { layerState, ElementInquiryParam } from '../layer.config'
import { useElementEvent } from '@/views/editor/map-element-event'
import { usePreviewElementEvent } from '@/views/preview/preview-element-event'
import { useShareElementEvent } from '@/views/share/share-element-event'

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
const { previewMapElementInquiry } = usePreviewElementEvent()
const { shareMapElementInquiry } = useShareElementEvent()

export const useElementAdd = () => {
  const route = useRoute()
  /**
   * 显示隐藏当前的要素
   */
  const onShowCurrentElement = (ele: any, index: number) => {
    ele.isShowElement = !ele.isShowElement

    // 关闭鼠标工具,关闭编辑器
    onCloseMouseTool()
    onCloseElementEditor()
    // init 右侧编辑栏选中交互状态
    initElementActive()

    // 显示隐藏相应的要素
    const current = mapState.map.getAllOverlays()?.filter((item: any) => item.getExtData()?.elementId === ele.elementId)
    for (const item of current) {
      if (ele.isShowElement) {
        item.show()
      } else {
        item.hide()
        // 关闭信息窗体
        mapState.map.clearInfoWindow()
      }
    }

    // 判断其中图层的元素是否都显示或隐藏状态，相应展示所在业务图层的显示状态
    mapEditState.mapElementList[index].isShowLayer =
      mapEditState.mapElementList[index]?.elementList.findIndex((target) => target.isShowElement === true) !== -1

    // 判断所有业务图层为隐藏状态，设置全部业务图层为隐藏按钮
    layerState.isShowBusinessLayer =
      mapEditState.mapElementList.findIndex((target) => target.isShowLayer === true) !== -1
  }

  /**
   * 删除要素
   */
  const emitDeleteElement = async (ele: any, index: number, i: number) => {
    // 关闭鼠标工具,关闭编辑器
    onCloseMouseTool()
    onCloseElementEditor()
    // init 右侧编辑栏选中交互状态
    initElementActive()

    const param = {
      id: ele.elementId
    }
    await ElementApi.mapElementDeleting(param)
    mapEditState.mapElementList[index].elementList.splice(i, 1)

    ElNotification({
      message: `删除成功`,
      type: 'success',
      offset: 60
    })

    // 计算要素数量
    getElementSum()

    // 删除相应的要素
    const [current] = mapState.map
      .getAllOverlays()
      ?.filter((item: any) => item.getExtData()?.elementId === ele.elementId)

    mapState.map.remove(current)

    if (ele.elementId === layerState.elementInquiry.id) {
      layerState.elementInquiry = <ElementInquiryParam>{}
    }
  }

  /**
   * 修改要素标签
   */
  const emitMaintenanceTagForElement = (tagList: [], ele: any) => {
    ele.tagList = tagList
  }

  /**
   * 选中元素
   */
  const onSelectElement = (ele: any) => {
    // 关闭鼠标工具,关闭编辑器
    onCloseMouseTool()
    onCloseElementEditor()
    // init 右侧编辑栏选中交互状态
    initElementActive()

    // 当前要素
    const [current] = mapState.map
      .getAllOverlays()
      ?.filter((item: any) => item.getExtData()?.elementId === ele.elementId)
    if (route.path.includes('editor')) {
      switch (current.className) {
        case 'AMap.Marker':
          onClickCurrentMarker(current)
          break
        case 'Overlay.Polyline':
          onClickCurrentPolyline(current)
          break
        case 'Overlay.Circle':
          onClickCurrentCircle(current)
          break
        case 'Overlay.Ellipse':
          onClickCurrentEllipse(current)
          break
        case 'Overlay.Rectangle':
          onClickCurrentRectangle(current)
          break
        case 'Overlay.Polygon':
          onClickCurrentPolygon(current)
          break
        default:
          return
      }
    }
    if (route.path.includes('preview')) {
      previewMapElementInquiry(ele.elementId, current)
    }
    if (route.path.includes('share')) {
      shareMapElementInquiry(ele.elementId, current)
    }
  }

  return {
    onShowCurrentElement,
    emitMaintenanceTagForElement,
    emitDeleteElement,
    onSelectElement
  }
}
