<template>
  <div class="gwin-platform-color">
    <div class="gwin-platform-color__text">{{ props.title }}</div>
    <div class="flex flex-only-center">
      <el-checkbox
        v-if="props.category !== 1"
        v-model="state.isDisplay"
        size="small"
        @change="onChangeElementSelectColor"
      ></el-checkbox>
      <div class="flex flex-column flex-only-center">
        <el-color-picker
          v-model="state.defaultColor"
          show-alpha
          :predefine="state.predefineColors"
          @change="onChangeForColor"
        />
        <p>颜色</p>
      </div>
      <div class="flex flex-column flex-only-center">
        <el-input
          v-model="state.defaultColor"
          :input-style="{
            width: '140px',
            height: '22px',
            color: '#fff',
            background: '#383F4B',
            borderRadius: '2px',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            margin: '0 0 0px 10px'
          }"
          @change="onChangeForColor"
        />
        <p>hex / rgba</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, watchEffect } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

interface Props {
  color: string
  title: string
  category: number
  display: boolean
}

const props = withDefaults(defineProps<Props>(), {
  color: '#3C7DFF',
  title: '填充',
  category: 1,
  display: true
})

const emit = defineEmits(['emitChangeForColor', 'emitChangeElementSelectColor'])

interface StateOption {
  isDisplay: boolean
  defaultColor: string
  predefineColors: string[]
}

const state: StateOption = reactive({
  isDisplay: props.display, // 是否选择颜色
  defaultColor: '', // 初始默认颜色
  predefineColors: store.state.colors.predefineColors // 最近使用颜色 20个
})

watchEffect(() => {
  state.defaultColor = props.color
  state.isDisplay = props.display
})

/**
 * 选择是否显示填充，描边
 */
const onChangeElementSelectColor = () => {
  emit('emitChangeElementSelectColor', state.isDisplay)
}

/**
 * 当绑定值变化时触发
 */
const onChangeForColor = () => {
  if (state.defaultColor) {
    emit('emitChangeForColor', state.defaultColor)
    state.predefineColors.push(state.defaultColor)
    state.predefineColors = [...new Set(state.predefineColors)].slice(-20)
    store.dispatch('setPredefineColors', state.predefineColors)
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
@include b('color') {
  padding: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  div {
    font-size: 12px;
  }
  @include e('text') {
    padding-bottom: 10px;
  }
  :deep(.el-checkbox) {
    margin-right: 10px;
    margin-bottom: 20px;
    .el-checkbox__inner {
      background-color: #2a2f37;
    }
    .el-checkbox__input.is-checked .el-checkbox__inner {
      background-color: #fff;
      border-color: #fff;
    }
  }
  :deep(.el-color-picker) {
    .el-color-picker__trigger,
    .el-color-picker__color {
      border: 0;
    }
    .el-color-picker__trigger {
      padding: 0;
      width: 40px;
      height: 20px;
      border-radius: 2px;
    }
  }
}
</style>
