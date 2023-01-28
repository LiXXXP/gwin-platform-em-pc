import { ElNotification } from 'element-plus'
import { mapState } from '@/views/common/map-config'
import { layerState } from '@/views/editor/components/layer/layer.config'
import { elementState, initElementActive } from '@/views/editor/components/tools/element-config'
import { useMouseToolDraw } from '@/views/editor/components/tools/mousetool-draw'
import { useElementEvent } from '@/views/editor/map-element-event'

const { onCloseMouseTool, onCloseElementEditor } = useElementEvent()
const { onMouseToolDraw } = useMouseToolDraw()

export const useElementPolyline = () => {
  /**
   * 点击折线按钮
   */
  const addMapElemenForPolyline = () => {
    if (!layerState.activeLayersId?.length) {
      ElNotification({
        message: `请先选择一个业务图层再添加`,
        type: 'warning',
        offset: 60
      })
      return
    }

    // 关闭当前鼠标操作
    onCloseMouseTool()
    // 关闭编辑状态
    onCloseElementEditor()

    if (elementState.isActive.line) {
      // init 选中交互状态
      initElementActive()

      // 鼠标设为默认箭头
      mapState.map.setDefaultCursor('default')
    } else {
      // init 选中交互状态
      initElementActive()

      // 选中线按钮高亮状态
      elementState.isActive.line = true

      // 鼠标设为加号
      mapState.map.setDefaultCursor('crosshair')

      // 加载业务图层要素列表
      addMouseToolForPolyline()
    }
  }

  /**
   * 添加折线
   */
  const addMouseToolForPolyline = () => {
    mapState.mapPlugins.mouseTool = new mapState.AMap.MouseTool(mapState.map)
    mapState.mapPlugins?.mouseTool.polyline({
      cursor: 'pointer', // 指定鼠标悬停时的鼠标样式
      strokeColor: '#3C7DFF', // 线条颜色
      strokeWeight: 3 // 线条宽度
    })

    // 添加完成
    onMouseToolDraw()
  }
  return {
    addMapElemenForPolyline
  }
}
