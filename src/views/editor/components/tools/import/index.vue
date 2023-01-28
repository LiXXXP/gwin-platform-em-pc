<template>
  <el-tooltip effect="dark" content="批量导入" placement="left">
    <div class="gwin-platform-popover">
      <el-popover
        ref="importPopover"
        placement="left-start"
        :width="290"
        :trigger="layerState.activeLayersId?.length ? 'click' : 'contextmenu'"
        popper-class="gwin-platform-import__popover"
      >
        <template #reference>
          <i
            :class="[
              'gwin-platform-element__icon-import',
              {
                active: elementState.isActive.import
              }
            ]"
            @click="addMouseToolForImport"
          ></i>
        </template>
        <template #default>
          <div class="gwin-platform-popover__title">
            <el-tooltip effect="dark" :content="elementState.layerName" placement="top">
              <p>批量导入到"{{ elementState.layerName }}"</p>
            </el-tooltip>
            <i v-if="!importState.isProgress" @click="onCancel"></i>
          </div>
          <div v-if="!importState.isProgress && !importState.isError" class="gwin-platform-popover__content">
            <FileUpload
              v-if="elementState.layerId"
              :map-id="mapId"
              :layer-id="elementState.layerId"
              @emit-upload-file-success="emitUploadFileSuccess"
              @emit-success="emitSuccess"
              @emit-upload-file-progress="emitUploadFileProgress"
            ></FileUpload>
            <span v-if="elementState.layerId" class="gwin-platform-popover__download" @click="onDownloadTemplate">
              地址模板下载
            </span>
          </div>
          <div v-if="importState.isProgress" class="gwin-platform-popover__content">导入中...</div>
          <div v-else-if="importState.isError" class="gwin-platform-popover__content">
            <p>{{ importState.replyText }}</p>
            <p>（建议全量检查表格数据是否合规范，否则仍有导入失败的可能）</p>
          </div>
          <div v-if="!importState.isProgress && !importState.isError" class="gwin-platform-popover__footer">
            <el-button plain class="gwin-platform-default" @click="onCancel">取消</el-button>
            <el-button type="primary" class="gwin-platform-save" @click="onUploadFile">导入</el-button>
          </div>
        </template>
      </el-popover>
    </div>
  </el-tooltip>
  <div v-if="importState.isProgress" class="gwin-platform-cover"></div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

// 公共组件
import FileUpload from '@/components/FileUpload/index.vue' // 文件导入

import { layerState } from '@/views/editor/components/layer/layer.config'
import { elementState } from '@/views/editor/components/tools/element-config'
import { useElementSetUp } from './import'

const route = useRoute()
const mapId = ref(<string>route.query.id)

const {
  importPopover,
  importState,
  addMouseToolForImport,
  onDownloadTemplate,
  emitUploadFileSuccess,
  onUploadFile,
  onCancel,
  emitSuccess,
  emitUploadFileProgress
} = useElementSetUp()
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
@include b('element') {
  i {
    width: 32px;
    height: 32px;
    display: block;
    cursor: pointer;
    border-radius: 4px;
    margin-bottom: 8px;
    box-sizing: border-box;
    background-color: transparent;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background-size: 70%;
    &.active {
      background-color: #1c2028;
      border: 1px solid rgba(255, 255, 255, 0.5);
    }
  }
  @include e('icon-import') {
    background-image: url('@/assets/img/toolbar/icon-import.png');
    &.active,
    &:hover {
      background-image: url('@/assets/img/toolbar/icon-import-hover.png');
    }
  }
}
@include b('popover') {
  @include e('title') {
    font-size: 16px;
    font-weight: 600;
    padding-bottom: 10px;
    color: var(--gwin-font-color);
    border-bottom: 1px solid rgba(225, 229, 245, 0.5);
    position: relative;
    p {
      width: 260px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
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
  @include e('download') {
    margin-top: 10px;
    cursor: pointer;
    display: inline-block;
    color: var(--gwin-color);
    border-bottom: 1px solid var(--gwin-color);
  }
  @include e('footer') {
    text-align: right;
    padding-top: 10px;
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
@include b('cover') {
  width: 100%;
  height: 100%;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
}
</style>
