import { mapState, mapEditState } from '@/views/common/map-config'
import { layerState, ElementInquiryParam } from '../layer.config'
import { ElNotification } from 'element-plus'
import ElementApi, { MapElementBizInfoMaintenanceParam } from '@/api/element'
import { useElementEvent } from '@/views/editor/map-element-event'
const { getElementSum, onCloseElementEditor } = useElementEvent()

export const useElementEditor = () => {
  /**
   * 点击要素编辑按钮
   */
  const onClickElementLayer = () => {
    layerState.elementActive = !layerState.elementActive
  }

  /**
   * 删除要素
   */
  const emitDeleteElement = async () => {
    const param = {
      id: layerState.elementInquiry?.id
    }
    await ElementApi.mapElementDeleting(param)

    mapEditState.mapElementList.forEach((item) => {
      const index = item.elementList?.findIndex((ele) => ele.elementId === layerState.elementInquiry?.id)
      item.elementList.splice(index, 1)
    })

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
      ?.filter((item: any) => item.getExtData()?.elementId === layerState.elementInquiry?.id)
    mapState.map.remove(current)

    layerState.elementInquiry = <ElementInquiryParam>{}

    // 关闭编辑器
    onCloseElementEditor()
  }

  /**
   * 修改要素名称
   */
  const onEditBusinessLayerName = () => {
    layerState.elementInquiry.isEditName = true
  }

  /**
   * 输入框失去焦点，将输入框隐藏，名称显示
   */
  const emitHideEditInput = () => {
    setTimeout(() => {
      layerState.elementInquiry.isEditName = false
    }, 200)
  }

  /**
   * 要素名称修改
   */
  const emitEditNameChange = async (VModelName: string) => {
    await mapElementBizInfoMaintenance({ name: VModelName })
    layerState.elementInquiry.name = VModelName
    layerState.elementInquiry.isEditName = false

    // 赋值给要素列表中要素的名称
    for (const item of mapEditState.mapElementList) {
      for (const ele of item.elementList) {
        if (ele.elementId === layerState.elementInquiry?.id) {
          ele.name = VModelName
        }
      }
    }
  }

  /**
   * 是否可见
   */
  const onChangeElementDisplay = async () => {
    await mapElementBizInfoMaintenance({ display: layerState.elementInquiry?.display })
  }

  /**
   * 地图要素业务信息修改
   */
  const mapElementBizInfoMaintenance = async (args: MapElementBizInfoMaintenanceParam) => {
    const param = {
      ...args,
      id: args.id ? args.id : layerState.elementInquiry?.id
    }
    await ElementApi.mapElementBizInfoMaintenance(param)
  }

  return {
    onClickElementLayer,
    emitDeleteElement,
    onEditBusinessLayerName,
    emitHideEditInput,
    emitEditNameChange,
    onChangeElementDisplay,
    mapElementBizInfoMaintenance
  }
}
