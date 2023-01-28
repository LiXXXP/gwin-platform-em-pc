import { mapState } from '@/views/common/map-config'
import { layerState } from '@/views/editor/components/layer/layer.config'
import { elementState, initElementActive } from '@/views/editor/components/tools/element-config'
import { useElementEditor } from '@/views/editor/components/layer/element/element-editor'
import { useElementEvent } from '@/views/editor/map-element-event'
import ElementApi from '@/api/element'
const { mapElementBizInfoMaintenance } = useElementEditor()
const { onCloseElementEditor, onCloseMouseTool } = useElementEvent()

export const useElementMove = () => {
  /**
   * 要素移动
   */
  const setElementDraggable = () => {
    // 关闭当前鼠标操作
    onCloseMouseTool()
    // 关闭编辑状态
    onCloseElementEditor()

    // 选中移动按钮高亮状态
    if (elementState.isActive.move) {
      // init 选中交互状态
      initElementActive()
    } else {
      // init 选中交互状态
      initElementActive()
      elementState.isActive.move = true
    }

    mapState.map.getAllOverlays()?.forEach((item: any) => {
      // 给元素添加可移动属性
      if (elementState.isActive.move) {
        item.setDraggable(true)
        // 鼠标设为移动符号
        mapState.map.setDefaultCursor('move')
      } else {
        item.setDraggable(false)
        // 鼠标设为移动符号
        mapState.map.setDefaultCursor('default')
      }

      // 元素拖拽移动结束触发事件
      item.on('dragend', async (passedPath: any) => {
        if (item.type === 'AMap.Marker') {
          const param = {
            id: item.getExtData()?.elementId,
            lng: passedPath.lnglat.lng,
            lat: passedPath.lnglat.lat
          }
          await mapElementBizInfoMaintenance(param)
        } else {
          layerState.elementbaseParam.id = item.getExtData()?.elementId
          let param: any = {}
          switch (item.className) {
            case 'Overlay.Polyline':
              layerState.elementbaseParam.drawJson = {
                path: item.getPath()[0],
                strokeWeight: item.getOptions().strokeWeight
              }
              param = {
                id: item.getExtData()?.elementId,
                lng: layerState.elementbaseParam.drawJson.path[0].lng,
                lat: layerState.elementbaseParam.drawJson.path[0].lat
              }
              item.setPath(item.getPath()[0])
              break
            case 'Overlay.Circle':
              layerState.elementbaseParam.drawJson = {
                shape: 1,
                center: item.getCenter(),
                radius: item.getRadius(),
                strokeWeight: item.getOptions().strokeWeight
              }
              param = {
                id: item.getExtData()?.elementId,
                lng: layerState.elementbaseParam.drawJson.center.lng,
                lat: layerState.elementbaseParam.drawJson.center.lat
              }
              item.setCenter(item.getCenter())
              break
            case 'Overlay.Ellipse':
              layerState.elementbaseParam.drawJson = {
                shape: 2,
                center: item.getCenter(),
                radius: item.getRadius(),
                strokeWeight: item.getOptions().strokeWeight
              }
              param = {
                id: item.getExtData()?.elementId,
                lng: layerState.elementbaseParam.drawJson.center.lng,
                lat: layerState.elementbaseParam.drawJson.center.lat
              }
              item.setCenter(item.getCenter())
              break
            case 'Overlay.Rectangle':
              layerState.elementbaseParam.drawJson = {
                shape: 3,
                bounds: item.getBounds(),
                strokeWeight: item.getOptions().strokeWeight
              }
              param = {
                id: item.getExtData()?.elementId,
                lng: layerState.elementbaseParam.drawJson.bounds.northEast.lng,
                lat: layerState.elementbaseParam.drawJson.bounds.northEast.lat
              }
              item.setBounds(item.getBounds())
              break
            case 'Overlay.Polygon':
              layerState.elementbaseParam.drawJson = {
                shape: 4,
                path: item.getPath(),
                strokeWeight: item.getOptions().strokeWeight
              }
              param = {
                id: item.getExtData()?.elementId,
                lng: layerState.elementbaseParam.drawJson.path[0].lng,
                lat: layerState.elementbaseParam.drawJson.path[0].lat
              }
              item.setPath(item.getPath())
              break
            default:
              return
          }
          await ElementApi.mapElementBasicInfoMaintenance(layerState.elementbaseParam)
          await mapElementBizInfoMaintenance(param)
        }
      })
    })
  }
  return {
    setElementDraggable
  }
}
