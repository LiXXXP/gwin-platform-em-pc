<!--
 * @Author: Jin Biao
 * @Date: 2021-12-07 13:40:32
 * @LastEditTime: 2021-12-23 17:02:52
 * @Description:  上传图片组件

  使用方法：
  <ImgUpload @onUploadSuccess="bannerImageUploadSuccess" :images="data" :limit="3" />

  参数说明：
  fileType="pdf"   jpeg  pdf
  type="text"      text/picture/picture-card
  limit            文件数量
  @onUploadSuccess 上传成功回调
-->

<template>
  <Draggable
    :list="state.fileList"
    :animation="100"
    item-key="item"
    class="flex flex-only-center flex-wrap"
    @change="onMoveCallback"
  >
    <template #item="{ element }">
      <div class="draggable">
        <el-image
          ref="preview"
          fit="cover"
          :src="element"
          :preview-src-list="state.fileList"
          :initial-index="state.index"
        ></el-image>
        <div class="draggable-hover flex flex-only-center flex-center">
          <el-tooltip effect="dark" content="预览" placement="top">
            <el-icon class="look" @click="onPictureCardPreview(element)">
              <View />
            </el-icon>
          </el-tooltip>
          <el-tooltip effect="dark" content="删除" placement="top">
            <el-icon class="del" @click="onRemoveimg(element)">
              <delete />
            </el-icon>
          </el-tooltip>
        </div>
      </div>
    </template>
  </Draggable>
  <el-upload
    ref="codeInputRefs"
    action="/cos/v1/FileUpload"
    :accept="state.accept"
    :data="state.fileDate"
    :list-type="props.type"
    :limit="props.limit"
    :file-list="state.fileList"
    :on-exceed="handleOnExceed"
    :before-upload="handleBeforeUpload"
    :on-success="handleSuccess"
    :on-change="handleChange"
    :class="['flex flex-only-center', { hide: state.hideUpload }]"
  >
    <el-button v-if="props.type == 'text'" size="small" type="primary">点击上传</el-button>
    <div v-else>
      <el-icon><svg-icon class-name="icon" icon-class="add"></svg-icon></el-icon>
      <p class="file">选择文件</p>
    </div>
    <template #tip>
      <div class="tip">
        <p>最多选择20张, 支持单文件上传</p>
        <p>每张图片不能超过5M</p>
        <p>支持jpg、jpeg、png</p>
      </div>
    </template>
  </el-upload>
</template>

<script lang="ts" setup>
import { ref, reactive, watchEffect } from 'vue'
import { ElNotification } from 'element-plus'
import { Delete, View } from '@element-plus/icons-vue'
import Draggable from 'vuedraggable'

const codeInputRefs = ref<HTMLInputElement | any>([])
const preview = ref()

const emit = defineEmits(['onUploadSuccess'])

interface UploadProps {
  limit: number
  images: Array<string>
  type: string
  fileType: string
}
const props = withDefaults(defineProps<UploadProps>(), {
  limit: 1,
  iamges: [],
  type: 'picture-card',
  fileType: 'jpeg'
})

const state = reactive({
  fileList: <any | string>[],
  index: 0,
  dialogVisible: false,
  hideUpload: false,
  fileDate: {
    channel: 'gwin-cloud',
    fileName: Date.parse(new Date())
  },
  accept:
    props.fileType === 'jpeg' ? 'image/jpeg,image/png,image/jpg,image/JPG,image/PNG,image/JPEG' : 'application/pdf'
})

watchEffect(() => {
  state.fileList = []
  props.images.forEach((item: any) => {
    state.fileList.push(item)
  })
})

/**
 * 文件数量
 */
const handleOnExceed = () => {
  ElNotification({
    message: `最多只能上传${props.limit}个！`,
    type: 'error',
    offset: 60
  })
}

/**
 * 文件格式
 * @param file 文件对象
 */
const handleBeforeUpload = (file: any) => {
  // 检测图片
  if (props.type === 'picture-card') {
    const isIMAGE =
      file.type.includes('jpeg') ||
      file.type.includes('png') ||
      file.type.includes('jpg') ||
      file.type.includes('JPG') ||
      file.type.includes('PNG') ||
      file.type.includes('JPEG')
    const isLt500KB = file.size / 1024 / 1024 < 5
    if (!isIMAGE) {
      ElNotification({
        message: '支持 JPG、JPEG、PNG 格式！',
        type: 'error',
        offset: 60
      })
    }
    if (!isLt500KB) {
      ElNotification({
        message: '上传文件大小不能超过 5M!',
        type: 'error',
        offset: 60
      })
    }
    return isIMAGE && isLt500KB
  }
}

/**
 * 图片删除
 * @param file
 */
const onRemoveimg = (element: any) => {
  state.hideUpload = state.fileList.length >= props.limit
  state.fileList.splice(state.fileList.indexOf(element), 1)
  updateChange()
}

/**
 * 预览
 * @param file
 */
const onPictureCardPreview = (element: string) => {
  preview.value.clickHandler()
  state.index = state.fileList.findIndex((item: string) => item === element)
}

/**
 * 上传成功
 * @param response
 * @param file
 * @param fileList
 */
const handleSuccess = (response: any, file: any, fileList: any) => {
  state.fileList.push(file.response?.body?.fileUrl)
  updateChange()
}

/**
 * 文件改变
 * @param file
 * @param fileList
 */
const handleChange = (file: any, fileList: any) => {
  let name = Date.parse(new Date())
  name += file.name
  codeInputRefs.value.data.fileName = name
  state.hideUpload = fileList.length >= props.limit
}

/**
 * 文件拖动
 */
const onMoveCallback = () => {
  updateChange()
}

/**
 * 文件更新
 */
const updateChange = () => {
  emit('onUploadSuccess', state.fileList)
}
</script>

<style lang="scss" scoped>
.hide :deep(.el-upload--picture-card) {
  display: none;
}
.file {
  font-size: 12px;
  margin-top: -5px;
  color: rgba(255, 255, 255, 0.8);
}
.tip {
  font-size: 12px;
  margin-left: 6px;
  margin-top: 10px;
  color: rgba(255, 255, 255, 0.8);
  p {
    line-height: 16px;
  }
}

.draggable {
  width: 65px;
  height: 50px;
  cursor: pointer;
  overflow: hidden;
  border-radius: 2px;
  margin-right: 5px;
  margin-bottom: 5px;
  position: relative;
  &:nth-child(4n) {
    margin-right: 0;
  }
  &:hover {
    .draggable-hover {
      display: flex;
    }
  }
  .draggable-hover {
    width: 100%;
    height: 100%;
    font-size: 14px;
    background-color: rgba(0, 0, 0, 0.8);
    position: absolute;
    top: 0;
    left: 0;
    display: none;
    animation: anim 0.6s;
  }
  &:last-child {
    margin-right: 0;
  }
  .el-image {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .look {
    margin-right: 5px;
  }
}
@keyframes anim {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
