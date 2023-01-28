<template>
  <div class="gwin-platform-popover">
    <el-popover
      ref="popover"
      :width="290"
      trigger="click"
      :placement="props.placement"
      :teleported="(props.onlyIcon && route.path?.includes('editor')) || route.path?.includes('index') ? true : false"
      popper-class="gwin-platform-popover--default"
    >
      <template v-if="props.onlyIcon && route.path?.includes('index')" #reference>
        <i class="gwin-platform-icons-delete"></i>
      </template>
      <template v-else-if="props.onlyIcon && route.path?.includes('editor')" #reference>
        <i class="gwin-platform-icons__delete"></i>
      </template>
      <template v-else #reference>
        <div class="gwin-platform-more flex flex-only-center">
          <i class="gwin-platform-icons__delete"></i>
          <p>删除</p>
        </div>
      </template>
      <template #default>
        <div class="gwin-platform-popover__title">
          <p>删除</p>
          <i @click="onCancel"></i>
        </div>
        <div class="gwin-platform-popover__content">
          <p>{{ props.text }}</p>
        </div>
        <div class="gwin-platform-popover__footer">
          <el-button plain class="gwin-platform-default" @click="onCancel">取消</el-button>
          <el-button type="primary" class="gwin-platform-save" @click="onDeleteEvent">删除</el-button>
        </div>
      </template>
    </el-popover>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const popover = ref()

const route = useRoute()

interface Props {
  onlyIcon: boolean
  placement: string
  text: string
}

const props = withDefaults(defineProps<Props>(), {
  onlyIcon: true,
  placement: '',
  text: ''
})

const emit = defineEmits(['emitDeleteEvent'])

/**
 * 取消
 */
const onCancel = () => {
  popover.value.hide()
}

/**
 * 删除
 */
const onDeleteEvent = () => {
  emit('emitDeleteEvent')
  onCancel()
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
@include b('icons-delete') {
  width: 20px;
  height: 20px;
  display: block;
  cursor: pointer;
  background: url('@/assets/img/map/icon-delete.png') no-repeat 0 0;
  background-size: 100%;
}
@include b('icons') {
  @include e('delete') {
    width: 20px;
    height: 20px;
    cursor: pointer;
    display: block;
    background: url('@/assets/img/business/icon-delete.png') no-repeat 0 0;
    background-size: 100%;
    &:hover {
      background-image: url('@/assets/img/business/icon-delete-hover.png');
    }
  }
}
@include b('more') {
  padding: 10px;
  cursor: pointer;
  border-radius: 4px;
  box-sizing: border-box;
  i {
    margin-right: 5px;
  }
  &:hover {
    color: #fff;
    background-color: #2e353f;
    .gwin-platform-icons__delete {
      background-image: url('@/assets/img/business/icon-delete-hover.png');
    }
  }
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
    font-size: 14px;
    padding: 20px 20px 40px;
    color: var(--gwin-font-color);
  }
  @include e('footer') {
    text-align: right;
    padding: 10px 12px 0 0;
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
