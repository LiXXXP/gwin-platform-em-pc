<template>
  <div class="gwin-platform-name-input">
    <el-input
      :ref="
        (el) => {
          if (el) nameInputRef[props.index] = el
        }
      "
      v-model="state.VModelName"
      maxlength="30"
      :input-style="route.path.includes('editor') ? { color: '#fff', background: props.bgColor, border: 0 } : {}"
      @blur.stop="onHideEditInput"
      @keyup.enter="onEditNameChange"
    />
    <i
      :class="[route.path.includes('editor') ? 'gwin-platform-icon-white' : 'gwin-platform-icon-blue']"
      @click.stop="onEditNameChange"
    ></i>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick, onMounted, reactive } from 'vue'
import { ElNotification } from 'element-plus'
import { useRoute } from 'vue-router'

const route = useRoute()

const nameInputRef = ref<HTMLInputElement | any>([])

interface Props {
  index: number
  name: string
  bgColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  index: 0,
  name: '',
  bgColor: ''
})

const emit = defineEmits(['emitHideEditInput', 'emitEditNameChange'])

const state = reactive({
  VModelName: props.name
})

onMounted(() => {
  nextTick(() => {
    nameInputRef.value[props.index]?.focus()
  })
})

/**
 * 输入框失去焦点，将输入框隐藏，名称显示
 */
const onHideEditInput = () => {
  emit('emitHideEditInput')
}

/**
 * 点击修改名称输入框对勾时, 修改完成
 */
const onEditNameChange = () => {
  if (!state.VModelName) {
    ElNotification({
      message: `名称不能为空`,
      type: 'warning',
      offset: 60
    })
    return
  }
  emit('emitEditNameChange', state.VModelName)
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
@include b('name-input') {
  width: 100%;
  position: relative;
  color: var(--gwin-font-color);
  :deep(.el-input__inner) {
    height: 26px;
    line-height: 26px;
    padding-right: 30px;
    box-sizing: border-box;
  }
  i {
    width: 20px;
    height: 20px;
    display: block;
    cursor: pointer;
    position: absolute;
    top: 50%;
    right: 10px;
    margin-top: -10px;
  }
  @include b('icon-blue') {
    background: url('../../assets/img/map/icon-save.png') no-repeat 0 0;
    background-size: 100%;
  }
  @include b('icon-white') {
    background: url('../../assets/img/editor/icon-name-save.png') no-repeat 0 0;
    background-size: 100%;
    right: 5px;
  }
}
</style>
