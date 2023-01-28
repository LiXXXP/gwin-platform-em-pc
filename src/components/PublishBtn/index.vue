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
        <i class="gwin-platform-icons-publish"></i>
      </template>
      <template #default>
        <div class="gwin-platform-popover__title">
          <p>发布</p>
          <i @click="onCancel"></i>
        </div>
        <div class="gwin-platform-popover__content">
          <p>发布后，已分享的链接将访问本次发布的版本</p>
          <p>最后编辑于{{ formatDate(props.mapBasic.updateAt, 'h:m:s') }}</p>
          <p v-if="props.mapBasic.publishAt">最近发布于{{ formatDate(props.mapBasic.publishAt, 'h:m:s') }}</p>
        </div>
        <div class="gwin-platform-popover__footer">
          <el-button plain class="gwin-platform-default" @click="onCancel">取消</el-button>
          <el-button type="primary" class="gwin-platform-save" @click="onPublishMap">确认发布</el-button>
        </div>
      </template>
    </el-popover>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
import { formatDate } from '@/utils/index' // 时间转换
import MapApi from '@/api/map' // api

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

/**
 * 取消
 */
const onCancel = () => {
  popover.value.hide()
}

/**
 * 发布
 */
const onPublishMap = async () => {
  const param = {
    id: props.mapBasic.id
  }
  const res = await MapApi.mapPublish(param)
  if (res.status.success) {
    if (res.body.publishVersion === props.mapBasic.publishEdition) {
      // 是否存在新的编辑内容
      ElNotification({
        message: '当前没有新编辑内容，无需发布',
        type: 'warning',
        offset: 60
      })
    } else {
      ElNotification({
        message: '地图发布成功',
        type: 'success',
        offset: 60
      })
      emit('emitPublishMap')
    }
    onCancel()
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
@include b('icons-publish') {
  width: 20px;
  height: 20px;
  display: block;
  margin: 0 10px;
  cursor: pointer;
  background: url('@/assets/img/map/icon-publish.png') no-repeat 0 0;
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
  padding: 0;
  width: 68px;
  font-size: 14px;
  min-height: 36px;
  border: 0 !important;
  background: var(--gwin-color) !important;
  &:hover {
    background: #3c7dff !important;
  }
}
@include b('default') {
  padding: 0;
  width: 68px;
  font-size: 14px;
  min-height: 36px;
  color: var(--gwin-font-color-secondary) !important;
  border-color: var(--gwin-font-color-secondary) !important;
  &:hover {
    color: var(--gwin-font-color-placeholder) !important;
    border-color: var(--gwin-font-color-placeholder) !important;
  }
}
</style>
