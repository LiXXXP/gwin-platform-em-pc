import { reactive, ref } from 'vue'
import { ElNotification } from 'element-plus'
import { mapState, mapEditState } from '@/views/common/map-config'
import { layerState } from '@/views/editor/components/layer/layer.config'
import { elementState, initElementActive } from '@/views/editor/components/tools/element-config'
import ElementApi from '@/api/element'
import { useElementAdd } from '@/views/editor/map-element-add'
import { useElementEvent } from '@/views/editor/map-element-event'

const { mapElementListInquiry } = useElementAdd()
const { onCloseMouseTool, onCloseElementEditor } = useElementEvent()

export const useElementSetUp = () => {
  const importPopover = ref()

  const importState = reactive({
    isProgress: false, // 导入中
    isError: false, // 导入失败
    replyText: '' // 失败信息
  })

  /**
   * 批量导入
   * @returns
   */
  const addMouseToolForImport = () => {
    if (!layerState.activeLayersId?.length) {
      ElNotification({
        message: `请先选择业务图层在导入`,
        type: 'warning',
        offset: 60
      })
      return
    }

    // 关闭当前鼠标操作
    onCloseMouseTool()
    // 关闭编辑状态
    onCloseElementEditor()

    if (elementState.isActive.import) {
      // init 选中交互状态
      initElementActive()

      // 鼠标设为默认箭头
      mapState.map.setDefaultCursor('default')
    } else {
      // init 选中交互状态
      initElementActive()

      // 选中批量导入按钮高亮状态
      elementState.isActive.import = true

      // 当前导入的业务图层
      elementState.layerId = layerState.activeLayersId[layerState.activeLayersId.length - 1]
      const layer = mapEditState.mapElementList.find((item) => item.layerId === elementState.layerId)
      elementState.layerName = layer?.layerName
    }
  }

  /**
   * 获取导入的文件
   */
  let fileInput: any
  const emitUploadFileSuccess = async (fileInputRef: any) => {
    fileInput = fileInputRef
  }

  /**
   * excel 导入
   */
  const onUploadFile = async () => {
    if (fileInput) {
      await fileInput.value?.submit()
    }
  }

  /**
   * 导入中
   */
  const emitUploadFileProgress = () => {
    importState.isProgress = true
  }

  /**
   * 导入成功
   */
  const emitSuccess = async (response: any) => {
    importState.isProgress = false
    if (response.status.success) {
      if (response.status.replyText) {
        importState.isError = true
        importState.replyText = response.status.replyText
      } else {
        importState.isError = false
        ElNotification({
          message: '导入成功',
          type: 'success',
          offset: 60
        })
        importPopover.value.hide()
        // init 选中交互状态
        initElementActive()
        await mapElementListInquiry()
      }
    } else {
      importState.isError = false
      ElNotification({
        message: `导入失败`,
        type: 'error',
        offset: 60
      })
    }
  }

  /**
   * 下载地址模版
   */
  const onDownloadTemplate = async () => {
    await ElementApi.mapElementTemplateFileDownload()
  }

  /**
   * 批量导入弹窗取消按钮
   */
  const onCancel = () => {
    importPopover.value.hide()

    // init 选中交互状态
    initElementActive()
    importState.isProgress = false
    importState.isError = false

    // 清空上传的文件
    if (fileInput) {
      fileInput.value?.clearFiles()
      elementState.layerId = ''
    }
  }

  return {
    importPopover,
    importState,
    addMouseToolForImport,
    onDownloadTemplate,
    emitUploadFileSuccess,
    onUploadFile,
    onCancel,
    emitSuccess,
    emitUploadFileProgress
  }
}
