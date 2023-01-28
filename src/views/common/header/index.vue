<template>
  <div class="gwin-platform-header flex flex-between">
    <div class="flex flex-only-center">
      <!-- 返回 -->
      <i v-if="!route.path.includes('share')" class="gwin-platform-back" @click="onBack"></i>
      <!-- 名称 -->
      <div class="gwin-platform-name">
        <div v-if="!headerState.isEditName" class="flex flex-only-center" @click="onEditName">
          <el-tooltip effect="dark" :content="mapEditState.mapBasic?.mapName" placement="bottom">
            <p>{{ mapEditState.mapBasic?.mapName }}</p>
          </el-tooltip>
          <el-tooltip v-if="route.path.includes('editor')" effect="dark" content="编辑" placement="bottom">
            <i class="gwin-platform-name__edit"></i>
          </el-tooltip>
        </div>
        <EditNameInput
          v-else
          :index="0"
          :name="mapEditState.mapBasic?.mapName"
          :bg-color="'#383F4B'"
          @emit-hide-edit-input="emitHideEditInput"
          @emit-edit-name-change="emitEditNameChange"
        ></EditNameInput>
      </div>
    </div>
    <div class="flex flex-only-center">
      <!-- 搜索 -->
      <SearchView></SearchView>
      <!-- 预览 -->
      <el-tooltip v-if="route.path.includes('editor')" effect="dark" content="预览" placement="bottom">
        <i class="gwin-platform-preview" @click="onPreviewMap"></i>
      </el-tooltip>
      <!-- 发布按钮 -->
      <el-tooltip effect="dark" content="发布" placement="bottom">
        <PublishBtn v-if="!route.path.includes('share')" :map-basic="mapEditState.mapBasic"></PublishBtn>
      </el-tooltip>
      <!-- 分享 -->
      <el-tooltip effect="dark" content="分享" placement="bottom">
        <ShareBtn
          v-if="!route.path.includes('share')"
          style="margin-left: 10px"
          :map-basic="mapEditState.mapBasic"
        ></ShareBtn
      ></el-tooltip>
      <!-- 快捷键 -->
      <keyboardBtn></keyboardBtn>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { mapEditState } from '@/views/common/map-config'
import { useHeader, headerState } from './header-config'

// 子组件
import SearchView from './search/search.vue' // 搜索
import keyboardBtn from './keyboard.vue' // 快捷键

// 公共组件
import EditNameInput from '@/components/EditNameInput/index.vue' // 修改名称
import PublishBtn from '@/components/PublishBtn/index.vue' // 发布
import ShareBtn from '@/components/ShareBtn/index.vue' // 分享

const route = useRoute()

const { onBack, onEditName, emitHideEditInput, emitEditNameChange, onPreviewMap } = useHeader()
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
@include b('header') {
  height: 100%;
}
@include b('back') {
  cursor: pointer;
  &::before {
    content: '';
    width: 12px;
    height: 12px;
    display: block;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
    border-width: 0 0 2px 2px;
    border-color: #fff;
    border-style: solid;
  }
}
@include b('name') {
  color: #fff;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  margin-left: 50px;
  &:hover {
    .gwin-platform-name__edit {
      background: url('@/assets/img/editor/icon-name-hover.png') no-repeat 0 0;
      background-size: 100%;
    }
  }
  p {
    max-width: 160px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  @include e('edit') {
    width: 20px;
    height: 20px;
    display: block;
    margin-left: 6px;
    background: url('@/assets/img/editor/icon-name.png') no-repeat 0 0;
    background-size: 100%;
  }
  @include e('input') {
    position: relative;
    color: var(--gwin-font-color);
    :deep(.el-input__inner) {
      height: 26px;
      line-height: 26px;
    }
    i {
      width: 20px;
      height: 20px;
      display: block;
      background: url('@/assets/img/editor/icon-name-save.png') no-repeat 0 0;
      background-size: 100%;
      position: absolute;
      top: 3px;
      right: 10px;
    }
  }
}
@include b('preview') {
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin: 0 10px 0 20px;
  background: url('@/assets/img/editor/icon-preview.png') no-repeat 0 0;
  background-size: 100%;
}
</style>
