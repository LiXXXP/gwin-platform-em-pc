import { ElNotification } from 'element-plus'
import { mapState } from '@/views/common/map-config'
import { layerState } from '@/views/editor/components/layer/layer.config'
import { elementState, initElementActive } from '@/views/editor/components/tools/element-config'
import { useMouseToolDraw } from '@/views/editor/components/tools/mousetool-draw'
import { useElementEvent } from '@/views/editor/map-element-event'

const { onCloseMouseTool, onCloseElementEditor } = useElementEvent()
const { onMouseToolDraw } = useMouseToolDraw()

export const useElementMarker = () => {
  // 点击点按钮 添加点标记
  const addMapElemenForMarker = () => {
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

    if (elementState.isActive.marker) {
      // init 选中交互状态
      initElementActive()

      // 鼠标设为默认箭头
      mapState.map.setDefaultCursor('default')
    } else {
      // init 选中交互状态
      initElementActive()

      // 选中点按钮高亮状态
      elementState.isActive.marker = true

      // 鼠标设为加号
      mapState.map.setDefaultCursor('crosshair')

      // 加载业务图层要素列表
      addMouseToolForMarker()
    }
  }

  // 添加点标记方法
  const addMouseToolForMarker = () => {
    mapState.mapPlugins.mouseTool = new mapState.AMap.MouseTool(mapState.map)
    // 添加点标记
    mapState.mapPlugins?.mouseTool?.marker({
      content: '<div class="gwin-map-marker" style="background: #3C7DFF";></div>', // 点标记显示内容
      offset: new mapState.AMap.Pixel(-13, -30), // 点标记显示位置偏移量
      topWhenClick: true // 鼠标点击时marker是否置顶
    })

    // 添加完成
    onMouseToolDraw()
  }

  return {
    addMapElemenForMarker
  }
}
