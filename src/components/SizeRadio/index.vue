<template>
  <div class="gwin-platform-size">
    <div>尺寸</div>
    <el-radio-group v-model="state.selectSize" size="small" @change="onChangeForSize">
      <el-radio :label="1">大</el-radio>
      <el-radio :label="2">中</el-radio>
      <el-radio :label="4">小</el-radio>
    </el-radio-group>
  </div>
</template>

<script lang="ts" setup>
import { reactive, watchEffect } from 'vue'

interface Props {
  size: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 4
})

const emit = defineEmits(['emitChangeForSize'])

interface StateOption {
  selectSize: number
}

const state: StateOption = reactive({
  selectSize: props.size // 选中的尺寸
})

watchEffect(() => {
  state.selectSize = props.size
})

/**
 * 当改变大小时，调取方法
 */
const onChangeForSize = () => {
  emit('emitChangeForSize', state.selectSize)
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
@include b('size') {
  padding: 10px;
  padding-bottom: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  div {
    padding-bottom: 10px;
  }
  :deep(.el-radio-group) {
    .el-radio,
    .el-radio__input.is-checked + .el-radio__label {
      color: #fff;
    }
    .el-radio__inner {
      background-color: transparent;
    }
    .el-radio__input.is-checked .el-radio__inner {
      border-color: #fff;
    }
  }
}
</style>
