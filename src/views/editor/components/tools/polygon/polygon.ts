import { ref } from 'vue'
import { ElNotification } from 'element-plus'
import { mapState } from '@/views/common/map-config'
import { layerState } from '@/views/editor/components/layer/layer.config'
import { elementState, initElementActive } from '@/views/editor/components/tools/element-config'
import { useMouseToolDraw } from '@/views/editor/components/tools/mousetool-draw'
import { useElementEvent } from '@/views/editor/map-element-event'

const { onMouseToolDraw } = useMouseToolDraw()
const { onCloseMouseTool, onCloseElementEditor } = useElementEvent()

export const useElementPolygon = () => {
  const polygonPopover = ref()

  /**
   * 点击矩形按钮
   */
  const setPolygonVisible = () => {
    if (!layerState.activeLayersId?.length) {
      ElNotification({
        message: `请先选择一个业务图层再添加`,
        type: 'warning',
        offset: 60
      })
      return
    }
    elementState.polygonSelectActive = 3
    if (elementState.isActive.square) {
      // 关闭当前鼠标操作
      onCloseMouseTool()

      // 关闭编辑状态
      onCloseElementEditor()

      // 隐藏弹出层
      polygonPopover.value.hide()

      // init 选中交互状态
      initElementActive()

      // 鼠标设为默认箭头
      mapState.map.setDefaultCursor('default')
    }
  }

  /**
   * 添加矩形
   * @param type 元素类型
   */
  const addMapElemenForPolygon = (type: string) => {
    // 关闭当前鼠标操作
    onCloseMouseTool()

    // 关闭编辑状态
    onCloseElementEditor()

    // init 选中交互状态
    initElementActive()

    // 选中矩形按钮高亮状态
    elementState.isActive.square = true

    // 鼠标设为加号
    mapState.map.setDefaultCursor('crosshair')

    // 添加 矩形
    if (type === 'rectangle') {
      elementState.polygonSelectActive = 1 // 选中矩形编辑
      polygonPopover.value.hide()
      addMouseToolForRectangle()
    }

    // 添加 多边形
    if (type === 'polygon') {
      elementState.polygonSelectActive = 2 // 选中多边形编辑
      polygonPopover.value.hide()
      addMouseToolForPolygon()
    }
  }

  /**
   * 添加矩形
   */
  const addMouseToolForRectangle = () => {
    mapState.mapPlugins.mouseTool = new mapState.AMap.MouseTool(mapState.map)
    mapState.mapPlugins?.mouseTool.rectangle({
      cursor: 'pointer', // 指定鼠标悬停时的鼠标样式
      strokeColor: '#3C7DFF', // 线条颜色
      strokeWeight: 1, // 轮廓线宽度
      fillColor: '#3C7DFF', // 填充颜色
      fillOpacity: 0.3 // 填充透明度
    })

    // 绘制完成
    onMouseToolDraw()
  }

  /**
   * 添加多边形
   */
  const addMouseToolForPolygon = () => {
    mapState.mapPlugins.mouseTool = new mapState.AMap.MouseTool(mapState.map)
    mapState.mapPlugins?.mouseTool.polygon({
      cursor: 'pointer', // 指定鼠标悬停时的鼠标样式
      strokeColor: '#3C7DFF', // 线条颜色
      strokeWeight: 3, // 轮廓线宽度
      fillColor: '#3C7DFF', // 填充颜色
      fillOpacity: 0.3 // 填充透明度
    })

    // 绘制完成
    onMouseToolDraw()
  }

  return {
    polygonPopover,
    setPolygonVisible,
    addMapElemenForPolygon
  }
}
