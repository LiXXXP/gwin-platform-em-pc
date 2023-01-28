<template>
  <div class="gwin-platform-attribute__biz">
    <div class="gwin-platform-memo">
      <p>描述</p>
      <el-input
        v-model="layerState.elementInquiry.memo"
        maxlength="200"
        placeholder="请输入内容"
        show-word-limit
        type="textarea"
        :input-style="{
          color: '#fff',
          fontSize: '12px',
          padding: '5px 10px',
          background: '#383F4B',
          borderColor: 'rgba(255, 255, 255, 0.1)'
        }"
        :autosize="{ minRows: 2, maxRows: 4 }"
        @change="onChangeElementMemo(layerState.elementInquiry.memo)"
      />
    </div>
    <div class="gwin-platform-memo">
      <div class="flex flex-between flex-only-center">
        <p>标签</p>
        <p style="color: rgba(255, 255, 255, 0.6)">最多选择3个标签</p>
      </div>
      <TagBtn
        :popover="false"
        :biz-id="layerState.elementInquiry.id"
        :only-icon="false"
        :placement="'right-start'"
        :tag-category="4"
        :tag-list="layerState.elementInquiry.tagList || []"
        @emit-maintenance-tag="emitMaintenanceTags"
      ></TagBtn>
    </div>
    <div class="gwin-platform-memo">
      <p>图片上传</p>
      <ImgUpload
        :images="layerState.elementInquiry.pictures"
        :file-type="'jpeg'"
        :type="'picture-card'"
        :limit="20"
        @on-upload-success="onImageUploadSuccess"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { layerState } from '../layer.config'
import { useElementBiz } from './element-biz'

// 公共组件
import TagBtn from '@/components/TagBtn/index.vue' // 标签按钮
import ImgUpload from '@/components/ImgUpload/index.vue' // 图片上传

const { onChangeElementMemo, emitMaintenanceTags, onImageUploadSuccess } = useElementBiz()
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
@include b('attribute') {
  @include e('biz') {
    color: #fff;
    font-size: 12px;
    box-sizing: border-box;
    background-color: #2a2f37;
  }
}
@include b('memo') {
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  p {
    font-weight: 600;
    padding-bottom: 10px;
  }
  :deep(.el-textarea .el-input__count) {
    color: rgba(255, 255, 255, 0.8);
    background-color: transparent;
  }
  :deep(.el-upload--picture-card) {
    width: 66px;
    height: 50px;
    margin-top: 10px;
    background-color: #303741;
    i {
      margin-top: 10px;
      font-size: 14px;
    }
    .el-icon svg {
      width: 14px;
      height: 14px;
    }
  }
  :deep(.el-upload-list--picture-card) {
    display: none;
  }
}
</style>
