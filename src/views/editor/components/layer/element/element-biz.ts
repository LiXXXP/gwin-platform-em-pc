import { mapEditState } from '@/views/common/map-config'
import { useElementEditor } from '@/views/editor/components/layer/element/element-editor'

const { mapElementBizInfoMaintenance } = useElementEditor()

export const useElementBiz = () => {
  /**
   * 要素描述
   */
  const onChangeElementMemo = async (memo: string) => {
    await mapElementBizInfoMaintenance({ memo: memo })
  }

  /**
   * 修改标签
   */
  const emitMaintenanceTags = (tagList: []) => {
    for (const item of mapEditState.mapElementList) {
      for (const ele of item.elementList) {
        if (ele.isSelect) {
          ele.tagList = tagList
        }
      }
    }
  }

  /**
   * 图片上传
   */
  const onImageUploadSuccess = async (imgList: string[]) => {
    await mapElementBizInfoMaintenance({ pictures: imgList })
  }

  return {
    onChangeElementMemo,
    emitMaintenanceTags,
    onImageUploadSuccess
  }
}
