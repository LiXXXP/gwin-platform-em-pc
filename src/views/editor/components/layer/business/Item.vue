<template>
  <div
    :class="[
      'gwin-platform-collapse__element flex flex-between flex-only-center',
      {
        active: source.isSelect
      }
    ]"
    @click="onSelectElement(source)"
  >
    <div class="flex flex-only-center">
      <!-- ，显示8个字，超出隐藏 -->
      <div class="gwin-platform-collapse__name">
        <p :title="source.name">{{ source.name }}</p>
      </div>
    </div>
    <div class="flex flex-only-center">
      <!-- 要素标签 -->
      <el-popover
        v-if="source.tagList?.length"
        placement="top"
        :width="100"
        trigger="hover"
        popper-class="gwin-platform-popover--bg gwin-platform-popover--padding"
      >
        <template #reference>
          <i class="gwin-platform-icons__tag"></i>
        </template>
        <template v-if="route.path.includes('editor')" #default>
          <p v-for="t in source.tagList" :key="t.tagId" class="gwin-platform-collapse__tag">
            {{ t.tagName }}
          </p>
        </template>
        <template v-else #default>
          <p v-for="t in source.tagList" :key="t" class="gwin-platform-collapse__tag">{{ t }}</p>
        </template>
      </el-popover>
      <!-- 显示隐藏 -->
      <i
        :class="[
          {
            'gwin-platform-icons__preview': source.isShowElement,
            'gwin-platform-icons__close': !source.isShowElement
          }
        ]"
        @click.stop="onShowCurrentElement(source, mapElementListIndex)"
      ></i>
      <!-- 要素更多 -->
      <el-popover
        v-if="route.path.includes('editor')"
        placement="right-start"
        :width="100"
        trigger="click"
        popper-class="gwin-platform-popover--bg gwin-platform-popover--padding"
      >
        <template #reference>
          <i class="gwin-platform-icons__more"></i>
        </template>
        <template #default>
          <!-- 标签 -->
          <TagBtn
            :popover="true"
            :biz-id="source.elementId"
            :only-icon="false"
            :placement="'right-start'"
            :tag-category="4"
            :tag-list="source.tagList || []"
            @emit-maintenance-tag="emitMaintenanceTagForElement($event, source)"
          ></TagBtn>
          <!-- 删除 -->
          <DeleteBtn
            :only-icon="false"
            :placement="'right-start'"
            :text="'请确认是否做删除操作？'"
            @emit-delete-event="emitDeleteElement(source, mapElementListIndex, index)"
          ></DeleteBtn>
        </template>
      </el-popover>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { useElementAdd } from './element-add'

// 公共组件
import DeleteBtn from '@/components/DeleteBtn/index.vue' // 删除按钮
import TagBtn from '@/components/TagBtn/index.vue' // 标签按钮

const route = useRoute()

const { onShowCurrentElement, emitMaintenanceTagForElement, emitDeleteElement, onSelectElement } = useElementAdd()

defineProps({
  // item
  source: {
    type: Object,
    default: () => ({})
  },
  // 业务图层下，要素列表 index
  index: {
    type: Number,
    default: 0
  },
  // 业务图层列表 index
  mapElementListIndex: {
    type: Number,
    default: 0
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
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
  @include e('more') {
    margin-left: 2px;
    background: url('@/assets/img/business/icon-more.png') no-repeat 0 0;
    background-size: 100%;
    &:hover {
      background-image: url('@/assets/img/business/icon-more-active.png');
    }
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
</style>
