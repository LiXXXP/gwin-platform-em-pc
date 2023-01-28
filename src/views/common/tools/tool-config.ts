import { mapState } from '@/views/common/map-config'
import { elementState, initElementActive } from '@/views/editor/components/tools/element-config'
import { useElementEvent } from '@/views/editor/map-element-event'

const { onCloseMouseTool, onCloseElementEditor } = useElementEvent()

export const useMouseTool = () => {
  /**
   * 测距工具
   */
  const setMouseToolForRule = () => {
    // 关闭当前鼠标操作
    onCloseMouseTool()

    // 关闭编辑状态
    onCloseElementEditor()

    if (elementState.isActive.ranging) {
      // init 选中交互状态
      initElementActive()

      // 关闭当前鼠标操作
      onCloseMouseTool()

      // 鼠标设为默认箭头
      mapState.map.setDefaultCursor('default')
    } else {
      // 选中测距按钮高亮状态
      elementState.isActive.ranging = true

      // 鼠标设为加号
      mapState.map.setDefaultCursor('crosshair')

      // 测距
      mapState.mapPlugins.mouseTool = new mapState.AMap.MouseTool(mapState.map)
      mapState.mapPlugins?.mouseTool.rule()
    }
  }

  /**
   * 测面工具
   */
  const setMouseToolForArea = () => {
    // 关闭当前鼠标操作
    onCloseMouseTool()

    // 关闭编辑状态
    onCloseElementEditor()

    if (elementState.isActive.area) {
      // init 选中交互状态
      initElementActive()

      // 关闭当前鼠标操作
      onCloseMouseTool()

      // 鼠标设为默认箭头
      mapState.map.setDefaultCursor('default')
    } else {
      // init 选中交互状态
      initElementActive()

      // 选中测面按钮高亮状态
      elementState.isActive.area = true

      // 鼠标设为加号
      mapState.map.setDefaultCursor('crosshair')

      // 测面
      mapState.mapPlugins.mouseTool = new mapState.AMap.MouseTool(mapState.map)
      mapState.mapPlugins?.mouseTool.measureArea()
      mapState.mapPlugins?.mouseTool.on('draw', (type: any) => {
        for (const item of mapState.map.getAllOverlays('text')) {
          item.setText(item.getText() + '  x')
          item.setStyle({
            'font-size': '12px'
          })
          item.on('click', () => {
            item.hide() // 文本隐藏
            type.obj.hide() // 测面隐藏
            // 关闭当前鼠标操作
            onCloseMouseTool()
            // init 选中交互状态
            initElementActive()
          })
        }
      })
    }
  }

  return {
    setMouseToolForRule,
    setMouseToolForArea
  }
}
