import { ref } from 'vue'
import { ElNotification } from 'element-plus'
import { mapState } from '@/views/common/map-config'
import { layerState } from '@/views/editor/components/layer/layer.config'
import { elementState, initElementActive } from '@/views/editor/components/tools/element-config'
import { useElementEvent } from '@/views/editor/map-element-event'
import { useMouseToolDraw } from '@/views/editor/components/tools/mousetool-draw'

const { onMouseToolDraw, mapElementAddition } = useMouseToolDraw()
const { onClickCurrentEllipse, onCloseMouseTool, onCloseElementEditor } = useElementEvent()

export const useElementCircle = () => {
  const circlePopover = ref()
  /**
   * 设置 编辑圆 显示状态
   */
  const setCircleVisible = () => {
    if (!layerState.activeLayersId?.length) {
      ElNotification({
        message: `请先选择一个业务图层再添加`,
        type: 'warning',
        offset: 60
      })
      return
    }
    elementState.circleSelectActive = 3
    if (elementState.isActive.round) {
      // 关闭当前鼠标操作
      onCloseMouseTool()

      // 关闭编辑状态
      onCloseElementEditor()

      // 隐藏弹出层
      circlePopover.value.hide()

      // init 选中交互状态
      initElementActive()

      // 鼠标设为默认箭头
      mapState.map.setDefaultCursor('default')
    }
  }

  /**
   * 添加元素
   * @param type 元素类型
   */
  const addMapElemenForCircle = (type: string) => {
    // 关闭当前鼠标操作
    onCloseMouseTool()

    // 关闭编辑状态
    onCloseElementEditor()

    // init 选中交互状态
    initElementActive()

    // 选中圆按钮高亮状态
    elementState.isActive.round = true

    // 鼠标设为加号
    mapState.map.setDefaultCursor('crosshair')

    // 添加 圆
    if (type === 'circle') {
      elementState.circleSelectActive = 1 // 选中圆编辑
      circlePopover.value.hide()
      addMouseToolForCircle()
    }

    // 添加 椭圆
    if (type === 'ellipse') {
      elementState.circleSelectActive = 2 // 选中椭圆编辑
      circlePopover.value.hide()
      addMouseToolForEllipse()
    }
  }

  /**
   * 添加圆形
   */
  const addMouseToolForCircle = () => {
    mapState.mapPlugins.mouseTool = new mapState.AMap.MouseTool(mapState.map)
    mapState.mapPlugins?.mouseTool.circle({
      cursor: 'pointer', // 指定鼠标悬停时的鼠标样式
      strokeColor: '#3C7DFF', // 线条颜色
      strokeWeight: 1, // 轮廓线宽度
      fillColor: '#3C7DFF', // 圆形填充颜色
      fillOpacity: 0.3 // 圆形填充透明度
    })

    // 添加完成
    onMouseToolDraw()
  }

  /**
   * 添加椭圆
   */
  const addMouseToolForEllipse = async () => {
    const ellipse = new mapState.AMap.Ellipse({
      center: [mapState.map.getCenter().lng, mapState.map.getCenter().lat], // 椭圆的圆心位置
      radius: [2000, 1000], // 椭圆的半径
      cursor: 'pointer', // 指定鼠标悬停时的鼠标样式
      strokeColor: '#3C7DFF', // 线条颜色
      strokeWeight: 3, // 轮廓线宽度
      fillColor: '#3C7DFF', // 圆形填充颜色
      fillOpacity: 0.3 // 圆形填充透明度
    })

    ellipse.setMap(mapState.map)

    // 自动缩放地图到合适的视野级别
    mapState.map.setFitView(ellipse, true, [0, 0, 0, 0], 12)

    // 椭圆定义数据
    const params = {
      category: 4, // 要素类型 1 点 2 线 4 面
      lng: ellipse?.getCenter().lng, // 经度
      lat: ellipse?.getCenter().lat, // 纬度
      basicAttr: {
        drawJson: {
          shape: 2, // 面的形状，1: 圆形 2: 椭圆 3: 矩形 4: 多边形
          center: ellipse?.getCenter(), // 圆心位置
          radius: ellipse?.getRadius(), // 圆半径，单位:米
          strokeWeight: 1 // 轮廓线宽度
        },
        lineCategory: 1, // 线形状 1 实线 2 虚线
        strokeColor: '#3C7DFF', // 线条颜色
        fillColor: '#3C7DFF', // 填充颜色
        transparency: 0.3 // 填充透明度
      }
    }

    await mapElementAddition(params, ellipse)

    // 点击当前椭圆方法
    ellipse.on('click', () => {
      onClickCurrentEllipse(ellipse)
    })
  }

  return {
    circlePopover,
    setCircleVisible,
    addMapElemenForCircle
  }
}
