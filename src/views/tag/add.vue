<template>
  <div>
    <el-form
      ref="ruleFormRef"
      :model="state.ruleForm"
      :rules="state.rules"
      label-width="78px"
      class="gwin-platform-add-form"
    >
      <el-form-item label="标签分类" prop="tagCategory">
        <el-select v-model="state.ruleForm.tagCategory" placeholder="请选择标签分类" clearable>
          <el-option label="地图" :value="1"></el-option>
          <el-option label="图层" :value="2"></el-option>
          <el-option label="要素" :value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标签名称" prop="tagName">
        <el-input v-model="state.ruleForm.tagName" placeholder="请输入标签名称" maxlength="4" clearable></el-input>
      </el-form-item>
      <el-form-item label="标签描述" prop="memo">
        <el-input
          v-model="state.ruleForm.memo"
          maxlength="200"
          show-word-limit
          type="textarea"
          placeholder="请输入标签描述"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item class="gwin-platform-add-form__footer">
        <el-button plain class="gwin-platform-default" @click="onBackButton">取消</el-button>
        <el-button type="primary" class="gwin-platform-save" @click="onSaveButton(ruleFormRef)">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { ElForm } from 'element-plus'
import { ElMessage } from 'element-plus'
import TagsApi from '@/api/tags'
import { getUserId } from '@/utils/auth'
import { AddStateOptions } from './interface'

type FormInstance = InstanceType<typeof ElForm>
const ruleFormRef = ref<FormInstance>()

const state: AddStateOptions = reactive({
  ruleForm: {
    tagCategory: '',
    tagName: '',
    memo: ''
  },
  rules: {
    tagCategory: [
      {
        required: true,
        message: '请选择标签分类',
        trigger: 'blur'
      }
    ],
    tagName: [
      {
        required: true,
        message: '请输入标签名称',
        trigger: 'blur'
      },
      {
        min: 0,
        max: 4,
        message: '最多输入4个字',
        trigger: 'blur'
      },
      {
        pattern: /^[^\s]*$/,
        message: '不能含有空格',
        trigger: 'blur'
      }
    ]
  }
})

const emit = defineEmits(['getBackDialogVisible', 'getSaveDialogVisible'])

/**
 * 取消按钮
 */
const onBackButton = () => {
  emit('getBackDialogVisible', false)
  ;({ ...state.ruleForm } = { tagCategory: '', tagName: '', memo: '' })
}

/**
 * 保存按钮
 */
const onSaveButton = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      TagAddition()
    }
  })
}

/**
 * 新增标签
 */
const TagAddition = async () => {
  const param = {
    userId: getUserId(),
    ...state.ruleForm
  }
  await TagsApi.tagAddition(param)
  ElMessage({
    message: '添加成功',
    type: 'success'
  })
  emit('getSaveDialogVisible', false)
  ;({ ...state.ruleForm } = { tagCategory: '', tagName: '', memo: '' })
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
@include b('add-form') {
  text-align: right;
  @include e('footer') {
    margin-bottom: 0;
  }
}
@include b('save') {
  width: 84px;
  font-size: 14px;
  border: 0 !important;
  background: var(--gwin-color) !important;
  &:hover {
    background: #3c7dff !important;
  }
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
