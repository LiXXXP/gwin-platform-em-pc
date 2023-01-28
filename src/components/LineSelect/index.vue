<template>
  <div class="gwin-platform-line">
    <div class="gwin-platform-line__title">线形</div>
    <div class="flex flex-between flex-only-center">
      <el-select
        v-model="state.lineCategory"
        size="small"
        class="gwin-platform-line__category"
        popper-class="gwin-platform-line__category"
        @change="onChangeForLineCategory"
      >
        <el-option :value="1" label="————————————">
          <p class="gwin-platform-solid"></p>
        </el-option>
        <el-option :value="2" label="------------------------------------">
          <p class="gwin-platform-dashed"></p>
        </el-option>
      </el-select>
      <el-select
        v-model="state.strokeWeight"
        size="small"
        filterable
        :filter-method="onFilterMethod"
        class="gwin-platform-line__weight"
        popper-class="gwin-platform-line__category"
        @change="onChangeForStrokeWeight"
      >
        <el-option v-for="item in state.strokeWeightOptions" :key="item" :label="item" :value="item"></el-option>
      </el-select>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, watchEffect } from 'vue'

interface Props {
  lineCategory: number
  strokeWeight: number
}

const props = withDefaults(defineProps<Props>(), {
  lineCategory: 1,
  strokeWeight: 1
})

const emit = defineEmits(['emitChangeForLineCategory', 'emitChangeForStrokeWeight'])

interface StateOption {
  lineCategory: number
  strokeWeight: string
  strokeWeightOptions: any[]
}

const state: StateOption = reactive({
  lineCategory: props.lineCategory, // 线样式，1 实线 2 虚线
  strokeWeight: props.strokeWeight + '', // 线条宽度
  strokeWeightOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] // 线条宽度选项
})

watchEffect(() => {
  state.lineCategory = props.lineCategory
  state.strokeWeight = props.strokeWeight + ''
})

const onFilterMethod = (keyword: string) => {
  if (Number(keyword) > 10) {
    state.strokeWeight = '10'
  } else if (Number(keyword) < 1) {
    state.strokeWeight = '1'
  } else {
    state.strokeWeight = keyword
  }

  onChangeForStrokeWeight(Number(state.strokeWeight))
}

/**
 * 当绑定值变化时触发, 线条形状
 */
const onChangeForLineCategory = (val: any): void => {
  emit('emitChangeForLineCategory', val)
}

/**
 * 当绑定值变化时触发, 线条宽度
 */
const onChangeForStrokeWeight = (val: any): void => {
  if (state.strokeWeightOptions.includes(val)) {
    emit('emitChangeForStrokeWeight', val)
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
@include b('line') {
  padding: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  @include e('title') {
    padding-bottom: 10px;
  }
  @include e('category') {
    width: 210px;
  }
  @include e('weight') {
    width: 52px;
    margin-left: 10px;
  }
  :deep(.el-select) {
    .el-input__inner {
      color: #fff;
      background-color: #383f4b;
      border-color: rgba(255, 255, 255, 0.1);
    }
    .el-popper.is-light {
      background: #39404c !important;
    }
  }
}
@include b('solid') {
  width: 100%;
  margin-top: 17px;
  border-top: 1px solid #fff;
}
@include b('dashed') {
  width: 100%;
  margin-top: 17px;
  border-top: 1px dashed #fff;
}
</style>
