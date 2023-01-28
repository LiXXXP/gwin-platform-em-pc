<template>
  <div :class="['gwin-platform-element', { active: layerState.elementActive }]" @click="onClickElementLayer">
    <i class="gwin-platform-icon-layer"></i>
  </div>
  <div
    v-if="layerState.elementActive"
    class="gwin-platform-layer-element"
    :style="{
      height: layerState.businessActive ? 'calc(60% - 42px)' : 'calc(100% - 92px)'
    }"
  >
    <div class="gwin-platform-layer-element__title">
      <p>要素编辑</p>
      <i @click="layerState.elementActive = false"></i>
    </div>
    <div v-if="!Object.keys(layerState.elementInquiry)?.length" class="gwin-platform-layer-element__none">
      <i></i>
      <p>{{ mapEditState.elementSum ? '请选中一个要素进行编辑' : '请使用地图右侧工具栏创建要素后进行编辑' }}</p>
    </div>
    <!-- 选中要素 -->
    <div v-else>
      <div class="gwin-platform-layer-element__name">
        <div class="gwin-platform-name__row flex flex-between flex-only-center">
          <p
            class="gwin-platform-name__No"
            :title="layerState.elementInquiry?.layerName + '/' + layerState.elementInquiry?.elementNo"
          >
            {{ layerState.elementInquiry?.layerName }}/{{ layerState.elementInquiry?.elementNo }}
          </p>
          <!-- 删除 -->
          <DeleteBtn
            :only-icon="true"
            :placement="'right-start'"
            :text="'请确认是否做删除操作？'"
            @emit-delete-event="emitDeleteElement"
          ></DeleteBtn>
        </div>
        <div class="gwin-platform-name__row flex flex-between flex-only-center">
          <div class="gwin-platform-name--width flex flex-only-center">
            <span>名称：</span>
            <p
              v-if="!layerState.elementInquiry?.isEditName"
              class="gwin-platform-editor-name"
              :title="layerState.elementInquiry?.name"
              @click.stop="onEditBusinessLayerName"
            >
              {{ layerState.elementInquiry?.name }}
            </p>
            <EditNameInput
              v-else
              :index="0"
              :name="layerState.elementInquiry?.name"
              @emit-hide-edit-input="emitHideEditInput"
              @emit-edit-name-change="emitEditNameChange"
            ></EditNameInput>
          </div>
          <div class="flex flex-only-center">
            <el-checkbox
              v-model="layerState.elementInquiry.display"
              label="是否可见？"
              size="small"
              @change="onChangeElementDisplay"
            ></el-checkbox>
            <el-tooltip effect="dark" content="取消勾选后，在编辑页和预览页不显示文字标注" placement="right-start">
              <i class="gwin-platform-icons__display"></i>
            </el-tooltip>
          </div>
        </div>
      </div>
      <!-- 名称修改 是否可见 -->
      <div class="gwin-platform-attribute">
        <el-collapse v-model="activeNames">
          <!-- 基础属性 -->
          <el-collapse-item name="1">
            <template #title>
              <div :class="['gwin-platform-attribute__title', { active: activeNames.includes('1') }]">基础属性</div>
            </template>
            <BaseView></BaseView>
          </el-collapse-item>
          <!-- 业务属性 -->
          <el-collapse-item name="2">
            <template #title>
              <div :class="['gwin-platform-attribute__title', { active: activeNames.includes('2') }]">业务属性</div>
            </template>
            <BizView></BizView>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { mapEditState } from '@/views/common/map-config'
import { layerState } from '../layer.config'
import { useElementEditor } from './element-editor'

// 公共组件
import EditNameInput from '@/components/EditNameInput/index.vue' // 修改名称
import DeleteBtn from '@/components/DeleteBtn/index.vue' // 删除按钮

// 子组件
import BaseView from './base.vue' // 基础属性
import BizView from './biz.vue' // 业务属性

const {
  onClickElementLayer,
  emitDeleteElement,
  onEditBusinessLayerName,
  emitHideEditInput,
  emitEditNameChange,
  onChangeElementDisplay
} = useElementEditor()

// 折叠面板打开属性 1 基础属性 2 业务属性
const activeNames = ref(['1', '2'])
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
@include b('element') {
  width: 100%;
  padding: 7px 0;
  box-sizing: border-box;
  &:hover {
    i {
      background-image: url('@/assets/img/business/icon-editor-active.png');
    }
  }
  &.active {
    background-color: #101318;
    border-left: 3px solid var(--gwin-color);
    i {
      background-image: url('@/assets/img/business/icon-editor-active.png');
    }
  }
}
@include b('icon-layer') {
  width: 30px;
  height: 30px;
  display: block;
  cursor: pointer;
  margin: 0 auto;
  background: url('@/assets/img/business/icon-editor.png') no-repeat 0 0;
  background-size: 100%;
}
@include b('layer-element') {
  z-index: 999;
  width: 300px;
  color: #fff;
  font-size: 12px;
  overflow-y: overlay;
  overflow-x: hidden;
  position: fixed;
  bottom: 42px;
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
    left: 50px;
    z-index: 999;
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
  @include e('name') {
    padding: 0 10px;
    margin-top: 44px;
    box-sizing: border-box;
    border-bottom: 1px solid #242931;
  }
  @include e('none') {
    i {
      width: 100px;
      height: 66px;
      display: block;
      margin: 60px auto 10px;
      background: url('@/assets/img/element/icon-none.png') no-repeat 0 0;
      background-size: 100%;
    }
    font-size: 12px;
    text-align: center;
    color: rgba(255, 255, 255, 0.5);
  }
}
@include b('name') {
  @include e('row') {
    height: 35px;
    line-height: 35px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    &:last-child {
      border: 0;
    }
    :deep(.el-input) {
      font-size: 12px;
    }
    span {
      width: 50px;
      font-weight: 600;
    }
  }
  @include e('No') {
    width: 200px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  @include m('width') {
    width: 170px;
    :deep(.el-input__inner) {
      background: #383f4b !important;
    }
  }
}
@include b('editor-name') {
  width: 100px;
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
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
      top: 10px;
    }
  }
}
@include b('icons') {
  @include e('display') {
    width: 20px;
    height: 20px;
    display: block;
    cursor: pointer;
    background: url('@/assets/img/element/icon-display.png') no-repeat 0 0;
    background-size: 100%;
    &:hover {
      background-image: url('@/assets/img/element/icon-display-hover.png');
    }
  }
}
@include b('attribute') {
  padding: 0 10px;
  :deep(.el-collapse) {
    // 要素编辑 折叠面板
    border: 0;
    .el-collapse-item__header {
      height: 36px;
      background-color: #2a2f37;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      .el-icon {
        color: rgba(255, 255, 255, 0.5);
        transform: rotate(-90deg);
      }
      .el-collapse-item__arrow.is-active {
        color: #fff;
        transform: rotate(90deg);
      }
    }
    .el-collapse-item__wrap {
      border: 0;
      overflow: visible;
      .el-collapse-item__content {
        padding: 0;
      }
    }
  }
  @include e('title') {
    color: #fff;
    font-size: 13px;
    padding-left: 5px;
    position: relative;
    &.active {
      font-weight: 600;
      &::after {
        width: 2px;
        height: 12px;
        content: '';
        display: block;
        background-color: #fff;
        position: absolute;
        left: 0;
        top: 50%;
        margin-top: -6px;
      }
    }
  }
}
</style>
