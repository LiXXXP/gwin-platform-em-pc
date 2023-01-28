<template>
  <el-upload
    ref="fileInputRef"
    action="/yt/v1/MapElementBatchAddition"
    :accept="state.accept"
    :data="state.fileDate"
    :limit="1"
    :auto-upload="false"
    :before-upload="handleBeforeUpload"
    :on-change="handleChange"
    :on-remove="handleRemove"
    :on-progress="onProgress"
    :on-success="onSuccess"
    :class="['flex flex-only-center', { hide: state.hideUpload }]"
  >
    <div class="upload">
      <el-icon><svg-icon class-name="icon" icon-class="add"></svg-icon></el-icon>
      <p class="file">选择文件</p>
    </div>
    <template #tip>
      <div class="tip">支持excel格式，文件大小不超过2M，表格数据不超过2000行，文件表头必须包括名称、坐标</div>
    </template>
  </el-upload>
</template>

<script lang="ts" setup>
import { ref, reactive, watchEffect } from 'vue'
import { ElNotification } from 'element-plus'
import type { ElUpload } from 'element-plus'
import { getUserId, getEntityId } from '@/utils/auth'

const fileInputRef = ref<InstanceType<typeof ElUpload>>()

interface UploadProps {
  mapId: string
  layerId: string
}
const props = withDefaults(defineProps<UploadProps>(), {
  mapId: '',
  layerId: ''
})

const emit = defineEmits(['emitUploadFileSuccess', 'emitSuccess', 'emitUploadFileProgress'])

const state = reactive({
  hideUpload: false,
  fileDate: {
    entityId: getEntityId(),
    layerId: props.layerId,
    mapId: props.mapId,
    userId: getUserId()
  },
  accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
})

watchEffect(() => {
  state.fileDate.layerId = props.layerId
  state.fileDate.mapId = props.mapId
})

/**
 * 文件格式
 * @param file 文件对象
 */
const handleBeforeUpload = (file: any) => {
  const isIMAGE = file.name.includes('xlsx' || 'xls')
  const isLt500KB = file.size / 1024 / 1024 < 2
  if (!isIMAGE) {
    ElNotification({
      message: '只支持 excel 格式！',
      type: 'error',
      offset: 60
    })
  }
  if (!isLt500KB) {
    ElNotification({
      message: '上传文件大小不能超过 2M!',
      type: 'error',
      offset: 60
    })
  }
  return isIMAGE && isLt500KB
}

/**
 * 文件上传时的钩子
 */
const onProgress = (evt: any, file: any, fileList: any[]) => {
  state.hideUpload = fileList.length >= 1
  emit('emitUploadFileProgress')
}

/**
 * 文件改变
 * @param file
 * @param fileList
 */
const handleChange = (file: any, fileList: any[]) => {
  state.hideUpload = fileList.length >= 1
  updateChange()
}

/**
 * 文件上传成功时的钩子
 * @param file
 * @param fileList
 */
const onSuccess = (response: any, file: any, fileList: any[]) => {
  emit('emitSuccess', response)
}

/**
 * 文件列表移除文件时的钩子
 */
const handleRemove = (file: any, fileList: any[]) => {
  setTimeout(() => {
    state.hideUpload = fileList.length >= 1
  }, 500)
}

/**
 * 文件更新
 */
const updateChange = () => {
  emit('emitUploadFileSuccess', fileInputRef)
}
</script>

<style lang="scss" scoped>
.hide {
  :deep(.el-upload.el-upload--text),
  .tip {
    display: none;
  }
}
:deep(.el-upload-list) {
  overflow: hidden;
}
.upload {
  width: 88px;
  height: 60px;
  border-radius: 2px;
  border: 1px solid #d9d9d9;
  i {
    margin-top: 10px;
    font-size: 20px;
  }
  .el-icon svg {
    width: 14px;
    height: 14px;
  }
}
.file {
  font-size: 12px;
  margin-top: -5px;
  color: #606a78;
}
.tip {
  width: 220px;
  font-size: 12px;
  margin-left: 6px;
  color: #606a78;
}
</style>
