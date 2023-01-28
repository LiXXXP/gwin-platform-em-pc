<template>
  <div class="gwin-platform-popover">
    <el-popover
      ref="popover"
      placement="bottom-start"
      :width="290"
      trigger="click"
      :teleported="route.path.includes('editor') ? false : true"
      :popper-options="{ boundariesElement: 'body', gpuAcceleration: false }"
    >
      <template #reference>
        <i class="gwin-platform-icons-share" @click="onShareMap"></i>
      </template>
      <template #default>
        <div class="gwin-platform-popover__title">
          <p>{{ state.isUpdate || !state.hasPublish ? '是否发布' : '分享' }}</p>
          <i @click="onClose"></i>
        </div>
        <div v-if="state.isUpdate || !state.hasPublish" class="gwin-platform-popover__content">
          <p>发布后，已分享的链接将访问本次发布的版本</p>
          <p>最后编辑于{{ formatDate(state.mapBasic.updateAt, 'h:m:s') }}</p>
          <p v-if="state.mapBasic.publishAt">最近发布于{{ formatDate(state.mapBasic.publishAt, 'h:m:s') }}</p>
        </div>
        <div v-else class="gwin-platform-popover__content">
          <p>分享已发布版本 {{ state.mapBasic?.publishEdition }}</p>
          <p v-if="state.mapBasic?.publishAt">发布时间 {{ formatDate(state.mapBasic?.publishAt, 'h:m:s') }}</p>
        </div>
        <div class="gwin-platform-popover__footer">
          <el-button plain class="gwin-platform-default" @click="onCancel">取消</el-button>
          <el-button
            :disabled="state.disabled"
            type="primary"
            :class="['gwin-platform-save', { disabled: state.disabled }]"
            @click="onCopyShareMapLink"
            >{{ state.isUpdate || !state.hasPublish ? '确认' : state.encryptText }}</el-button
          >
        </div>
      </template>
    </el-popover>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onUnmounted, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
import { formatDate } from '@/utils/index' // 时间转换
import MapApi from '@/api/map' // api
import config from '@/config'

const popover = ref()
const route = useRoute()

interface mapBasicParam {
  updateAt: number
  publishAt: number
  isUpdate: boolean
  id: string
  publishEdition: string
}

interface Props {
  mapBasic: mapBasicParam
}

const props = withDefaults(defineProps<Props>(), {
  mapBasic: () => <mapBasicParam>{}
})

const emit = defineEmits(['emitPublishMap'])

interface StateOption {
  mapBasic: mapBasicParam
  hasPublish: boolean
  isUpdate: boolean
  encryptUrl: string
  encryptText: string
  disabled: boolean
  timer: any
}
const state: StateOption = reactive({
  mapBasic: props.mapBasic, // 地图信息
  hasPublish: !!props.mapBasic?.publishAt, // 是否第一次发布
  isUpdate: props.mapBasic?.isUpdate, // 是否有更新
  encryptUrl: '', // 分享链接
  encryptText: '复制链接', // 分享按钮文案
  disabled: false, // 禁用状态
  timer: null // 定时器
})

watchEffect(() => {
  state.mapBasic = props.mapBasic
})

onUnmounted(() => {
  clearTimeout(state.timer)
})

const onClose = () => {
  popover.value.hide()
}

/**
 * 取消
 */
const onCancel = () => {
  if (state.isUpdate) {
    if (!state.hasPublish) {
      popover.value.hide()
      return
    }
    state.isUpdate = false
  } else {
    popover.value.hide()
  }
}

/**
 * 分享, 先判断是否第一次发布过
 */
const onShareMap = async () => {
  const param = {
    id: props.mapBasic?.id
  }
  const res = await MapApi.mapShare(param)
  state.isUpdate = res.body.isUpdate
  state.hasPublish = !!res.body.publishAt
  state.encryptUrl = `${document.location.protocol}${config.GWIN_URL_SHARE}map/share?id=${props.mapBasic?.id}&encryptId=${res.body.encryptId}`
}

/**
 * 复制分享链接
 */
const onCopyShareMapLink = async () => {
  // 如有编辑内容，分享之前 需要先发布
  if (state.isUpdate || !state.hasPublish) {
    const param = {
      id: props.mapBasic.id
    }
    const res = await MapApi.mapPublish(param)
    state.isUpdate = false
    state.hasPublish = true
    state.mapBasic.publishEdition = res.body.publishVersion
    ElNotification({
      message: '地图发布成功',
      type: 'success',
      offset: 60
    })
    emit('emitPublishMap')
  } else {
    // 已发布，复制分享链接
    state.encryptText = '复制成功'
    state.disabled = true
    copyToClipboard(state.encryptUrl)
    clearTimeout(state.timer)
    state.timer = setTimeout(() => {
      state.encryptText = '复制链接'
      state.disabled = false
    }, 2000)
  }
}

/**
 * 复制方法
 */
const copyToClipboard = (textToCopy: any) => {
  ElNotification({
    message: '复制成功',
    type: 'success',
    offset: 60
  })
  // navigator clipboard 需要https等安全上下文
  if (navigator.clipboard && window.isSecureContext) {
    // navigator clipboard 向剪贴板写文本
    return navigator.clipboard.writeText(textToCopy)
  } else {
    // 创建text area
    const textArea = document.createElement('textarea')
    textArea.value = textToCopy
    // 使text area不在viewport，同时设置不可见
    textArea.style.position = 'absolute'
    textArea.style.opacity = '0'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    return new Promise((res, rej) => {
      // 执行复制命令并移除文本框
      document.execCommand('copy') ? res() : rej()
      textArea.remove()
    })
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
@include b('icons-share') {
  width: 20px;
  height: 20px;
  display: block;
  cursor: pointer;
  background: url('@/assets/img/map/icon-share.png') no-repeat 0 0;
  background-size: 100%;
}
@include b('popover') {
  @include e('title') {
    font-size: 16px;
    font-weight: 600;
    text-align: center;
    padding-bottom: 10px;
    color: var(--gwin-font-color);
    border-bottom: 1px solid rgba(225, 229, 245, 0.5);
    position: relative;
    i {
      width: 20px;
      height: 20px;
      display: block;
      cursor: pointer;
      background: url('@/assets/img/map/icon-close.png') no-repeat 0 0;
      background-size: 100%;
      position: absolute;
      right: 10px;
      top: 0;
    }
  }
  @include e('content') {
    font-size: 12px;
    padding: 20px 0;
    line-height: 20px;
    color: var(--gwin-font-color-secondary);
    p:first-child {
      font-size: 14px;
      color: var(--gwin-font-color);
      margin-bottom: 10px;
    }
  }
  @include e('footer') {
    text-align: right;
    padding-top: 10px;
    border-top: 1px solid rgba(225, 229, 245, 0.5);
  }
}

@include b('save') {
  width: 68px;
  padding: 0;
  min-height: 36px;
  font-size: 14px;
  border: 0 !important;
  background: var(--gwin-color) !important;
  &:hover {
    background: #3c7dff !important;
  }
  &.disabled {
    background: var(--gwin-font-color-secondary) !important;
  }
}
@include b('default') {
  width: 68px;
  padding: 0;
  min-height: 36px;
  font-size: 14px;
  color: var(--gwin-font-color-secondary) !important;
  border-color: var(--gwin-font-color-secondary) !important;
  &:hover {
    color: var(--gwin-font-color-placeholder) !important;
    border-color: var(--gwin-font-color-placeholder) !important;
  }
}
</style>
