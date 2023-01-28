import { reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElNotification } from 'element-plus'
import MapApi from '@/api/map'
import { mapEditState } from '@/views/common/map-config'

interface headerStateOption {
  isEditName: boolean
}

export const headerState: headerStateOption = reactive({
  isEditName: false
})

export const useHeader = () => {
  const router = useRouter()
  const route = useRoute()
  /**
   * 返回首页
   */
  const onBack = () => {
    if (route.path.includes('editor')) {
      window.location.href = '/'
    } else {
      router.back()
    }
  }

  const onEditName = () => {
    if (route.path.includes('editor')) {
      headerState.isEditName = true
    }
  }

  /**
   * 输入框失去焦点，将输入框隐藏，名称显示
   */
  const emitHideEditInput = () => {
    setTimeout(() => {
      headerState.isEditName = false
    }, 200)
  }

  /**
   * 地图名称修改
   */
  const emitEditNameChange = async (VModelName: string) => {
    const param = {
      id: <string>route.query.id,
      mapName: VModelName
    }
    await MapApi.mapBasicInfoMaintenance(param)
    mapEditState.mapBasic.mapName = VModelName
    ElNotification({
      message: '地图名称修改成功',
      type: 'success',
      offset: 60
    })
  }

  /**
   * 预览
   */
  const onPreviewMap = () => {
    router.push({
      path: '/map/preview',
      query: {
        id: mapEditState.mapId
      }
    })
  }
  return {
    onBack,
    onEditName,
    emitHideEditInput,
    emitEditNameChange,
    onPreviewMap
  }
}
