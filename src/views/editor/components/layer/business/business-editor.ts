import { useRoute, useRouter } from 'vue-router'
import { ElNotification } from 'element-plus'
import EditorApi from '@/api/editor'
import { mapState, mapEditState } from '@/views/common/map-config'
import { initElementActive } from '@/views/editor/components/tools/element-config'
import { layerState, ElementInquiryParam } from '../layer.config'
import { useElementEvent } from '../../../map-element-event'

const { getElementSum, onCloseElementEditor, onCloseMouseTool } = useElementEvent()

export const useBusinessEditor = () => {
  const route = useRoute()
  const router = useRouter()
  /**
   * 点击业务图层按钮
   */
  const onClickBusinessLayer = () => {
    layerState.businessActive = !layerState.businessActive
  }

  /**
   * 选择的业务图层
   * @param val 当前选择展开的id值
   */

  const onChangeBusinessLayer = (val: string[]) => {
    // 关闭鼠标工具,关闭编辑器
    onCloseMouseTool()
    onCloseElementEditor()
    // init 右侧编辑栏选中交互状态
    initElementActive()

    // 先将选中状态设为默认样式
    mapEditState.mapElementList.forEach((item) => (item.isSelect = false))

    // 选择每条数据layerId相等
    const selectLayer = mapEditState.mapElementList.filter((item) => val.indexOf(item.layerId) > -1)

    const overlayList = <any>[]
    for (const item of selectLayer) {
      // 设置选中图层的样式
      item.isSelect = true

      if (item.layerId === val[val.length - 1]) {
        for (const ele of item.elementList) {
          // 图层下要素的集合
          overlayList.push(
            mapState.map?.getAllOverlays().find((lay: any) => ele.elementId === lay.getExtData()?.elementId)
          )
        }
      }
    }
    // 根据地图上添加的覆盖物分布情况，自动缩放地图到合适的视野级别
    mapState.map.setFitView(overlayList, true, [0, 0, 0, 0], 12)
    // 设置鼠标状态
    mapState.map.setDefaultCursor('default')
  }

  /**
   * 显示隐藏 全部的业务图层
   */
  const onShowBusinessLayer = () => {
    // 控制小眼睛图标
    layerState.isShowBusinessLayer = !layerState.isShowBusinessLayer

    // 关闭鼠标工具,关闭编辑器
    onCloseMouseTool()
    onCloseElementEditor()
    // init 右侧编辑栏选中交互状态
    initElementActive()

    // 所有图层要素 切换显示隐藏图标
    mapEditState.mapElementList.forEach((item) => {
      item.isShowLayer = layerState.isShowBusinessLayer
      item.elementList.forEach((ele) => {
        ele.isShowElement = layerState.isShowBusinessLayer
      })
    })

    // 所有图层的要素显示隐藏
    mapState.map.getAllOverlays()?.forEach((item: any) => {
      if (layerState.isShowBusinessLayer) {
        !item.type.includes('AMap.InfoWindow') && item.show()
      } else {
        item.hide()
      }
    })

    // 关闭信息窗体
    mapState.map.clearInfoWindow()

    // 设置鼠标状态
    mapState.map.setDefaultCursor('default')
  }

  /**
   * 地图业务图层新增
   */
  const onAddBusinessLayer = async () => {
    // 关闭鼠标工具,关闭编辑器
    onCloseMouseTool()
    onCloseElementEditor()
    // init 右侧编辑栏选中交互状态
    initElementActive()

    if (mapEditState.mapElementList?.length >= 20) {
      ElNotification({
        message: `最多可添加20个业务图层`,
        type: 'warning',
        offset: 60
      })
      return
    }
    const param = {
      mapId: <string>route.query?.id
    }
    const res = await EditorApi.mapLayerCategoryAddition(param)

    // 添加业务图层，倒叙排列
    mapEditState.mapElementList.unshift({
      elementList: [], // 要素列表
      layerId: res.body.id, // 图层id
      layerName: res.body.name, // 图层名称
      tagList: [], // 图层标签
      isSelect: false, // 是否选中
      isShowLayer: true, // 显示隐藏
      isEditName: false // 修改业务图层名称状态
    })

    // 设置鼠标状态
    mapState.map.setDefaultCursor('default')
  }

  /**
   * 显示隐藏当前的业务图层
   */
  const onShowCurrentLayer = (item: any, index: number) => {
    item.isShowLayer = !item.isShowLayer

    // 关闭鼠标工具,关闭编辑器
    onCloseMouseTool()
    onCloseElementEditor()
    // init 右侧编辑栏选中交互状态
    initElementActive()

    // 判断每个业务图层是否都显示或隐藏状态，相应展示全部业务图层的显示状态
    layerState.isShowBusinessLayer = mapEditState.mapElementList.findIndex((target) => target.isShowLayer === true) > -1

    // 判断选中的业务图层的所有要素显示状态，相应展示所在业务图层显示状态
    mapEditState.mapElementList[index].elementList.forEach((ele) => {
      ele.isShowElement = item.isShowLayer

      // 图层下所有的要素
      const overlayList = mapState.map
        ?.getAllOverlays()
        .filter((lay: any) => ele.elementId === lay.getExtData()?.elementId)

      // 所选图层显示隐藏其所有要素
      overlayList.forEach((eles: any) => {
        if (ele.isShowElement) {
          eles.show()
        } else {
          eles.hide()
        }
      })
    })

    // 关闭信息窗体
    mapState.map.clearInfoWindow()

    // 设置鼠标状态
    mapState.map.setDefaultCursor('default')
  }

  /**
   * 修改业务图层名称
   * 展示修改名称输入框
   */
  const onEditBusinessLayerName = (index: number) => {
    if (route.path.includes('editor')) {
      mapEditState.mapElementList[index].isEditName = true
    }
  }

  /**
   * 输入框失去焦点，将输入框隐藏，名称显示
   */
  const emitHideEditInput = (index: number) => {
    setTimeout(() => {
      mapEditState.mapElementList[index].isEditName = false
    }, 200)
  }

  /**
   * 我的地图信息修改
   * 点击修改名称输入框对勾时，请求接口
   */
  const emitEditNameChange = async (VModelName: string, id: string, index: number) => {
    const param = {
      id: id,
      name: VModelName.replace(/(^\s*)|(\s*$)/g, '')
    }
    const res = await EditorApi.mapLayerCategoryMaintenance(param)
    if (res.status.replyCode === '102') {
      router.push('/not')
    }
    mapEditState.mapElementList[index].layerName = res.body.name
    mapEditState.mapElementList[index].isEditName = false
    ElNotification({
      message: '图层名称修改成功',
      type: 'success',
      offset: 60
    })
  }

  /**
   * 删除业务图层
   */
  const emitDeleteLayer = async (layerId: string, index: number) => {
    if (mapEditState.mapElementList?.length <= 1) {
      ElNotification({
        message: `只有一个业务图层时不允许删除`,
        type: 'warning',
        offset: 60
      })
      return
    }

    // 判断选中的业务图层的所有要素，进行删除
    mapEditState.mapElementList[index].elementList.forEach((ele) => {
      // 图层下所有的要素
      const overlayList = mapState.map
        ?.getAllOverlays()
        .filter((lay: any) => ele.elementId === lay.getExtData()?.elementId)
      // 删除所选图层中所有要素
      mapState.map.remove(overlayList)
      if (ele.elementId === layerState.elementInquiry.id) {
        layerState.elementInquiry = <ElementInquiryParam>{}
      }
    })

    const param = {
      id: layerId
    }
    await EditorApi.mapLayerCategoryDeleting(param)
    mapEditState.mapElementList?.splice(index, 1)
    layerState.activeLayersId = []
    for (const item of mapEditState.mapElementList) {
      item.isSelect = false
    }

    ElNotification({
      message: `删除成功`,
      type: 'success',
      offset: 60
    })

    // 计算要素数量
    getElementSum()

    // 关闭鼠标工具,关闭编辑器
    onCloseMouseTool()
    onCloseElementEditor()
    // init 右侧编辑栏选中交互状态
    initElementActive()
    // 设置鼠标状态
    mapState.map.setDefaultCursor('default')
  }

  /**
   * 修改业务图层标签
   */
  const emitMaintenanceTagForLayer = (tagList: [], item: any) => {
    item.tagList = tagList
  }

  return {
    onClickBusinessLayer,
    onChangeBusinessLayer,
    onShowBusinessLayer,
    onAddBusinessLayer,
    onShowCurrentLayer,
    onEditBusinessLayerName,
    emitHideEditInput,
    emitEditNameChange,
    emitDeleteLayer,
    emitMaintenanceTagForLayer
  }
}
