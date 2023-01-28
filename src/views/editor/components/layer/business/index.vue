<template>
  <div :class="['gwin-platform-business', { active: layerState.businessActive }]" @click="onClickBusinessLayer">
    <i class="gwin-platform-business__icon"></i>
  </div>
  <div
    v-show="layerState.businessActive"
    class="gwin-platform-layer-business"
    :style="{
      height: !route.path.includes('editor')
        ? 'calc(100% - 86px)'
        : layerState.elementActive
        ? 'calc(40% - 50px)'
        : 'calc(100% - 86px)'
    }"
  >
    <div class="gwin-platform-layer-business__title">
      <p>业务图层</p>
      <i @click="layerState.businessActive = false"></i>
    </div>
    <div class="gwin-platform-layer-business__gather">
      <p>业务图层({{ mapEditState.mapElementList?.length }}) | 要素({{ mapEditState.elementSum }})</p>
      <div class="gwin-platform-icons flex flex-only-center">
        <!-- 业务图层显示隐藏 -->
        <i
          :class="[
            {
              'gwin-platform-icons__preview': layerState.isShowBusinessLayer,
              'gwin-platform-icons__close': !layerState.isShowBusinessLayer
            }
          ]"
          @click="onShowBusinessLayer"
        ></i>
        <!-- 添加业务图层 -->
        <i v-if="route.path.includes('editor')" class="gwin-platform-icons__add" @click="onAddBusinessLayer"></i>
      </div>
    </div>
    <!-- 业务图层列表 -->
    <el-collapse v-model="layerState.activeLayersId" @change="onChangeBusinessLayer">
      <el-collapse-item v-for="(item, index) in mapEditState.mapElementList" :key="item.layerId" :name="item.layerId">
        <template #title>
          <div
            :class="[
              'gwin-platform-collapse flex flex-between flex-only-center',
              { active: layerState.activeLayersId[layerState.activeLayersId.length - 1] === item.layerId }
            ]"
          >
            <div class="flex flex-only-center">
              <!-- 上下箭头 -->
              <span
                :class="[
                  {
                    'gwin-platform-triangle-down': !item.isSelect,
                    'gwin-platform-triangle-top': item.isSelect
                  }
                ]"
              ></span>
              <!-- 文件夹图标 -->
              <i
                :class="[
                  {
                    'gwin-platform-icons__file_close': !item.isSelect,
                    'gwin-platform-icons__file_open': item.isSelect
                  }
                ]"
              ></i>
              <!-- 业务图层名称，显示8个字，超出隐藏 -->
              <div :class="[route.path.includes('editor') ? 'gwin-platform-name' : 'gwin-platform-share-name']">
                <p v-if="!item.isEditName" :title="item.layerName" @click.stop="onEditBusinessLayerName(index)">
                  {{ item.layerName }}
                </p>
                <EditNameInput
                  v-else
                  :index="index"
                  :name="item.layerName"
                  :bg-color="'#2A2F37'"
                  @emit-hide-edit-input="emitHideEditInput(index)"
                  @emit-edit-name-change="emitEditNameChange($event, item.layerId, index)"
                ></EditNameInput>
              </div>
            </div>
            <div class="flex flex-only-center">
              <!-- 业务图层标签 -->
              <el-popover
                v-if="item.tagList?.length"
                placement="top"
                :width="100"
                trigger="hover"
                popper-class="gwin-platform-popover--bg gwin-platform-popover--padding"
              >
                <template #reference>
                  <i class="gwin-platform-icons__tag"></i>
                </template>
                <template v-if="route.path.includes('editor')" #default>
                  <p v-for="t in item.tagList" :key="t.tagId" class="gwin-platform-collapse__tag">
                    {{ t.tagName }}
                  </p>
                </template>
                <template v-else #default>
                  <p v-for="t in item.tagList" :key="t" class="gwin-platform-collapse__tag">{{ t }}</p>
                </template>
              </el-popover>
              <!-- 业务图层显示隐藏 -->
              <i
                :class="[
                  {
                    'gwin-platform-icons__preview': item.isShowLayer,
                    'gwin-platform-icons__close': !item.isShowLayer
                  }
                ]"
                @click.stop="onShowCurrentLayer(item, index)"
              ></i>
              <!-- 业务图层更多 -->
              <el-popover
                v-if="route.path.includes('editor')"
                placement="right-start"
                :width="100"
                trigger="click"
                popper-class="gwin-platform-popover--bg gwin-platform-popover--padding"
              >
                <template #reference>
                  <i class="gwin-platform-icons__more" @click.stop=""></i>
                </template>
                <template #default>
                  <!-- 标签 -->
                  <TagBtn
                    :popover="true"
                    :biz-id="item.layerId"
                    :only-icon="false"
                    :placement="'right-start'"
                    :tag-category="2"
                    :tag-list="item.tagList || []"
                    @emit-maintenance-tag="emitMaintenanceTagForLayer($event, item)"
                  ></TagBtn>
                  <!-- 删除 -->
                  <DeleteBtn
                    :only-icon="false"
                    :placement="'right-start'"
                    :text="'请确认是否做删除操作？'"
                    @emit-delete-event="emitDeleteLayer(item.layerId, index)"
                  ></DeleteBtn>
                </template>
              </el-popover>
            </div>
          </div>
        </template>
        <!-- 要素列表 -->
        <div v-if="!item.elementList.length" class="gwin-platform-collapse__element">
          <p style="color: rgba(255, 255, 255, 0.5)">暂无数据</p>
        </div>
        <div v-else>
          <virtual-list
            class="list-infinite"
            :data-sources="item.elementList"
            :data-key="'elementId'"
            :extra-props="{ mapElementListIndex: index }"
            :keeps="30"
            :estimate-size="30"
            :data-component="Item"
          ></virtual-list>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
// @ts-ignore
import VirtualList from 'vue3-virtual-scroll-list'
import { mapEditState } from '@/views/common/map-config'
import { layerState } from '../layer.config'
import { useBusinessEditor } from './business-editor'

// 公共组件
import Item from './Item.vue'
import EditNameInput from '@/components/EditNameInput/index.vue' // 修改名称
import DeleteBtn from '@/components/DeleteBtn/index.vue' // 删除按钮
import TagBtn from '@/components/TagBtn/index.vue' // 标签按钮

const route = useRoute()

const {
  onClickBusinessLayer,
  onChangeBusinessLayer,
  onShowBusinessLayer,
  onAddBusinessLayer,
  onShowCurrentLayer,
  onEditBusinessLayerName,
  emitHideEditInput,
  emitEditNameChange,
  emitDeleteLayer,
  emitMaintenanceTagForLayer
} = useBusinessEditor()
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
.list-infinite {
  height: auto;
  max-height: 100vh;
  overflow-y: overlay;
  overflow-x: hidden;
  background-color: #2a2f37;
  &::-webkit-scrollbar {
    width: 5px;
    display: none;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background-color: rgba(144, 147, 153, 0.5);
  }
}
@include b('business') {
  width: 100%;
  padding: 7px 0;
  margin-bottom: 1px;
  box-sizing: border-box;
  &:hover {
    i {
      background-image: url('@/assets/img/business/icon-layer-active.png');
    }
  }
  &.active {
    background-color: #101318;
    border-left: 3px solid var(--gwin-color);
    i {
      background-image: url('@/assets/img/business/icon-layer-active.png');
    }
  }
  @include e('icon') {
    width: 30px;
    height: 30px;
    display: block;
    cursor: pointer;
    margin: 0 auto;
    background: url('@/assets/img/business/icon-layer.png') no-repeat 0 0;
    background-size: 100%;
  }
}
@include b('layer-business') {
  z-index: 999;
  width: 300px;
  overflow-y: overlay;
  overflow-x: hidden;
  position: fixed;
  top: 50px;
  left: 50px;
  background-color: #2a2f37;
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background-color: rgba(144, 147, 153, 0.5);
  }
  @include e('title') {
    width: 300px;
    height: 44px;
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    line-height: 44px;
    text-align: center;
    box-sizing: border-box;
    background-color: #1c2028;
    position: fixed;
    top: 50px;
    left: 50px;
    z-index: 9999;
    i {
      width: 20px;
      height: 20px;
      display: block;
      cursor: pointer;
      background: url('@/assets/img/business/icon-pack.png') no-repeat 0 0;
      background-size: 100%;
      position: absolute;
      right: 10px;
      top: 12px;
    }
  }
  @include e('gather') {
    color: #fff;
    width: 300px;
    height: 36px;
    font-size: 12px;
    line-height: 36px;
    text-align: center;
    margin-bottom: 1px;
    background-color: #383f4b;
    position: fixed;
    top: 94px;
    left: 50px;
    z-index: 9999;
  }
  :deep(.el-collapse) {
    // 业务图层 折叠面板
    border: 0;
    margin-top: 81px;
    .el-collapse-item__header {
      height: 36px;
      border-bottom: 1px solid #2a2f37;
      background-color: #383f4b;
      .el-icon {
        display: none;
      }
    }
    .el-collapse-item__wrap {
      border: 0;
      .el-collapse-item__content {
        padding: 0;
      }
    }
  }
}
@include b('icons') {
  position: absolute;
  right: 10px;
  top: 8px;
  i {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
  @include e('preview') {
    background: url('@/assets/img/business/icon-preview.png') no-repeat 0 0;
    background-size: 100%;
    &:hover {
      background-image: url('@/assets/img/business/icon-preview-active.png');
    }
  }
  @include e('close') {
    background: url('@/assets/img/business/icon-preview-close.png') no-repeat 0 0;
    background-size: 100%;
  }
  @include e('add') {
    margin-left: 2px;
    background: url('@/assets/img/business/icon-add.png') no-repeat 0 0;
    background-size: 100%;
  }
  @include e('more') {
    margin-left: 2px;
    background: url('@/assets/img/business/icon-more.png') no-repeat 0 0;
    background-size: 100%;
    &:hover {
      background-image: url('@/assets/img/business/icon-more-active.png');
    }
  }
  @include e('file_open') {
    margin-right: 2px;
    background: url('@/assets/img/business/icon-file-open.png') no-repeat 0 0;
    background-size: 100%;
  }
  @include e('file_close') {
    margin-right: 2px;
    background: url('@/assets/img/business/icon-file-close.png') no-repeat 0 0;
    background-size: 100%;
  }
  @include e('tag') {
    background: url('@/assets/img/business/icon-tag.png') no-repeat 0 0;
    background-size: 100%;
    &:hover {
      background-image: url('@/assets/img/business/icon-tag-hover.png');
    }
  }
}
@include b('collapse') {
  width: 100%;
  height: 36px;
  color: #fff;
  padding: 0 10px;
  font-size: 12px;
  box-sizing: border-box;
  &.active {
    border-left: 3px solid var(--gwin-color);
  }
  i {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
  @include e('element') {
    color: #fff;
    padding: 10px;
    cursor: pointer;
    font-size: 12px;
    padding-left: 42px;
    box-sizing: border-box;
    background-color: #2a2f37;
    border-left: 3px solid transparent;
    &:hover {
      color: #b1cbff;
    }
    &.active {
      background-color: #2e353f;
      border-left: 3px solid var(--gwin-color);
      .gwin-platform-icons__preview {
        background-image: url('@/assets/img/business/icon-preview-active.png');
      }
      .gwin-platform-icons__more {
        background-image: url('@/assets/img/business/icon-more-active.png');
      }
      .gwin-platform-icons__tag {
        background-image: url('@/assets/img/business/icon-tag-hover.png');
      }
    }
    i {
      width: 20px;
      height: 20px;
      cursor: pointer;
    }
  }
  @include e('tag') {
    padding: 5px;
  }
  @include e('name') {
    p {
      width: 160px;
      overflow: hidden;
      margin-right: 5px;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
@include b('name') {
  width: 100px;
  :deep(.el-input) {
    font-size: 12px;
  }
  p {
    width: 100px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    position: relative;
    &:hover {
      &::after {
        content: '';
        display: block;
        width: 20px;
        height: 20px;
        background: url('@/assets/img/editor/icon-name-hover.png') no-repeat 0 0;
        background-size: 80%;
        position: absolute;
        right: 0;
        top: 16px;
      }
    }
  }
}
@include b('share-name') {
  width: 100px;
  p {
    width: 100px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
@include b('triangle-down') {
  width: 0;
  height: 0;
  margin-right: 2px;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 5px solid rgba(255, 255, 255, 0.5);
}
@include b('triangle-top') {
  width: 0;
  height: 0;
  margin-right: 2px;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 5px solid rgba(255, 255, 255, 0.5);
}
</style>
