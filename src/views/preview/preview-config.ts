import { reactive } from 'vue'

export const previewState = reactive({
  infoWindow: <any>{}, // 信息窗体
  isPreview: false, // 图片预览
  index: 0, // 预览图片index
  text: <any>{}
})
