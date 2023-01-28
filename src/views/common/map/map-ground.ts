import { ref } from 'vue'
import { ExtendedDocument } from '@/views/common/interface'

export const useMapGround = () => {
  const editorPageRef = ref() // 编辑页面 全屏显示获取ref
  /**
   * 全屏显示
   */
  const onFullScreen = () => {
    const el = editorPageRef.value
    const htmlDocument: ExtendedDocument = document
    const isFullscreen = htmlDocument.fullScreen || htmlDocument.mozFullScreen || htmlDocument.webkitIsFullScreen
    if (!isFullscreen) {
      // 进入全屏
      el?.requestFullscreen() ||
        el?.mozRequestFullScreen() ||
        el?.webkitRequestFullscreen() ||
        el?.msRequestFullscreen()
    } else {
      // 退出全屏
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (htmlDocument.mozCancelFullScreen) {
        htmlDocument.mozCancelFullScreen()
      } else if (htmlDocument.webkitExitFullscreen) {
        htmlDocument.webkitExitFullscreen()
      }
    }
  }
  return {
    editorPageRef,
    onFullScreen
  }
}
