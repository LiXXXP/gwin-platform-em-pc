<template>
  <div class="gwin-platform-look">
    <el-descriptions :column="1">
      <el-descriptions-item label="标签分类：">{{ props.lookTagDetail.tagType }}</el-descriptions-item>
      <el-descriptions-item label="标签名称：">{{ props.lookTagDetail.tagName }}</el-descriptions-item>
      <el-descriptions-item label="操作者：">{{ props.lookTagDetail.createName }}</el-descriptions-item>
      <el-descriptions-item label="更新时间：">{{ props.lookTagDetail.updateAt }}</el-descriptions-item>
      <el-descriptions-item label="标签描述：">{{ props.lookTagDetail.memo }}</el-descriptions-item>
    </el-descriptions>
    <el-button plain class="gwin-platform-default" @click="onBackButton">取消</el-button>
  </div>
</template>

<script setup lang="ts">
interface lookTagDetailParam {
  createName?: string
  id?: string
  memo?: string
  tagType?: string
  tagName?: string
  updateAt?: string
}

interface Props {
  lookTagDetail: lookTagDetailParam
}

const props = withDefaults(defineProps<Props>(), {
  lookTagDetail: () => <lookTagDetailParam>{}
})

const emit = defineEmits(['getBackDialogVisible'])

/**
 * 取消按钮
 */
const onBackButton = () => {
  emit('getBackDialogVisible', false)
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
@include b('look') {
  text-align: right;
}
@include b('default') {
  width: 84px;
  font-size: 14px;
  color: var(--gwin-font-color-secondary) !important;
  border-color: var(--gwin-font-color-secondary) !important;
  &:hover {
    color: var(--gwin-font-color-placeholder) !important;
    border-color: var(--gwin-font-color-placeholder) !important;
  }
}
</style>
