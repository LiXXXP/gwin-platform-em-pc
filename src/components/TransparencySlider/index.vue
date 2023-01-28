<template>
  <div class="gwin-platform-transparency">
    <div class="gwin-platform-transparency__title">透明度</div>
    <el-slider
      v-model="state.transparency"
      :show-tooltip="false"
      show-input
      :min="0"
      :max="1"
      :step="0.1"
      @change="onChangeForTransparency"
    ></el-slider>
  </div>
</template>

<script lang="ts" setup>
import { reactive, watchEffect } from 'vue'

interface Props {
  transparency: number
}

const props = withDefaults(defineProps<Props>(), {
  transparency: 1
})

const emit = defineEmits(['emitChangeForTransparency'])

interface StateOption {
  transparency: number
}

const state: StateOption = reactive({
  transparency: props.transparency
})

watchEffect(() => {
  state.transparency = props.transparency
})

/**
 * 值改变时触发
 */
const onChangeForTransparency = (val: number) => {
  emit('emitChangeForTransparency', val)
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
@include b('transparency') {
  padding: 10px;
  border-bottom: 1px solid #242931;
  @include e('title') {
    padding-bottom: 10px;
  }
  :deep(.el-slider) {
    .el-slider__runway {
      background-color: #383f4b;
    }
    .el-slider__button {
      transform: scale(0.7);
      background-color: #2a2f37;
      border-color: rgba(255, 255, 255, 0.5);
    }
    .el-slider__input {
      transform: scale(0.7);
    }
    .el-input-number__increase,
    .el-input-number__decrease {
      background-color: #383f4b;
      color: rgba(255, 255, 255, 0.5);
      border-color: rgba(255, 255, 255, 0.1);
    }
    .el-input__inner {
      color: #fff;
      font-size: 15px;
      background-color: #383f4b;
      border-color: rgba(255, 255, 255, 0.1);
    }
    .el-slider__runway.show-input {
      margin: 0;
    }
  }
}
</style>
