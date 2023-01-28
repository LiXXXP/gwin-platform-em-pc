<template>
  <div class="gwin-platform-search">
    <div class="flex flex-only-center">
      <div class="gwin-platform-search__select">
        <el-select
          v-model="searchState.searchType"
          popper-class="gwin-platform-search__popper"
          @visible-change="searchState.isResultShow = false"
        >
          <el-option label="位置" :value="1"> </el-option>
          <el-option label="要素" :value="2"> </el-option>
        </el-select>
      </div>
      <div class="gwin-platform-search__select gwin-platform-search__input">
        <el-input
          v-model="searchState.searchValue"
          style="width: 100%"
          popper-class="gwin-platform-search__popper"
          :placeholder="searchState.searchType === 1 ? '请输入位置' : '请输入要素'"
          @input="onSearch"
        >
          <el-option :label="1" :value="1"></el-option>
        </el-input>
        <i class="gwin-platform-icon-search" @click="onSearch"></i>
      </div>
    </div>
    <div v-if="searchState.isResultShow" class="gwin-platform-search__result">
      <!-- 位置搜索结果列表 -->
      <div v-if="searchState.locationResultList?.length && searchState.searchType === 1">
        <div
          v-for="item in searchState.locationResultList"
          :key="item.id"
          class="gwin-platform-result-list flex flex-only-center"
          @click="onSetMapCenter(item.location, item.name)"
        >
          <span class="gwin-platform-result-name">{{ item.name }}</span>
          <span class="gwin-platform-result-address" :title="item.address">{{ item.address }}</span>
        </div>
      </div>
      <!-- 要素搜索结果列表 -->
      <div v-else-if="searchState.elementResultList?.length && searchState.searchType === 2">
        <div
          v-for="item in searchState.elementResultList"
          :key="item.id"
          class="gwin-platform-result-list flex flex-only-center"
          @click="onSetMapCenter({ lng: item.lng, lat: item.lat }, item.name)"
        >
          <span>{{ item.name }}</span>
        </div>
      </div>
      <!-- 无结果 -->
      <div v-else class="gwin-platform-result-none">无相关结果</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { searchState } from './search-config'
import { useSearch } from '@/views/common/header/search/search-config'

const route = useRoute()
searchState.searchType = route.path.includes('editor') ? 1 : 2
const { onSearch, onSetMapCenter } = useSearch()
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
@include b('search') {
  width: 280px;
  border-radius: 4px;
  position: relative;
  @include e('select') {
    width: 75px;
    :deep(.el-input__inner) {
      border: 0;
      color: #fff;
      border-radius: 0;
      background: #39404c;
    }
  }
  @include e('input') {
    width: 205px;
    position: relative;
    &::before {
      content: '';
      display: block;
      width: 1px;
      height: 20px;
      z-index: 99;
      background-color: #4c5563;
      position: absolute;
      top: 6px;
      left: 0;
    }
  }
  @include e('result') {
    z-index: 999;
    width: 280px;
    color: #fff;
    font-size: 14px;
    max-height: 400px;
    box-sizing: border-box;
    background-color: #39404c;
    position: absolute;
    top: 35px;
    left: 0;
  }
}
@include b('result-list') {
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: #2a2f37;
  }
}
@include b('result-name') {
  max-width: 110px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
@include b('result-address') {
  max-width: 150px;
  margin-left: 10px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: rgba(255, 255, 255, 0.5);
}
@include b('result-none') {
  padding: 10px 0;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
}
@include b('icon-search') {
  width: 20px;
  height: 20px;
  z-index: 99;
  display: block;
  cursor: pointer;
  background: url('@/assets/img/editor/icon-search.png') no-repeat 0 0;
  background-size: 100%;
  position: absolute;
  top: 6px;
  right: 5px;
  &:hover {
    background-image: url('@/assets/img/editor/icon-search-hover.png');
  }
}
</style>
