<template>
  <div>
    <!-- 我的地图列表 -->
    <div class="gwin-platform-my">
      <div class="flex flex-between flex-only-center" @mouseenter="onMouseleaveHide">
        <div class="gwin-platform-title">我的地图</div>
        <div class="gwin-platform-add" @click="onAddMap">
          <i></i>
          <span>新建地图</span>
        </div>
      </div>
      <div v-if="state.myMapList?.length" class="flex flex-only-center flex-wrap">
        <div
          v-for="(item, index) in state.myMapList"
          :key="item.id"
          class="gwin-platform-my__map"
          @mouseenter="onMouseenterShow(index)"
        >
          <!-- 地图模版 -->
          <div class="gwin-platform-handle">
            <img :src="item.coverUri" />
            <div v-if="item.isShowHandle" class="gwin-platform-handle--hover">
              <div class="flex flex-center">
                <div class="gwin-platform-use" @click="onPreviewMap(item.id)">预览</div>
                <div class="gwin-platform-use" @click="onEditMyMap(item.id)">编辑</div>
              </div>
              <div class="gwin-platform-icons flex flex-between flex-only-center">
                <div class="flex flex-only-center">
                  <!-- 分享按钮 -->
                  <el-tooltip effect="dark" content="分享" placement="top">
                    <ShareBtn :map-basic="item" @emit-publish-map="emitPublishMap"></ShareBtn>
                  </el-tooltip>
                  <!-- 发布按钮 -->
                  <el-tooltip effect="dark" content="发布" placement="top">
                    <PublishBtn :map-basic="item" @emit-publish-map="emitPublishMap"></PublishBtn>
                  </el-tooltip>
                  <!-- 标签按钮 -->
                  <el-tooltip effect="dark" content="标签" placement="top">
                    <TagBtn
                      :popover="true"
                      :biz-id="item.id"
                      :only-icon="true"
                      :placement="'right-start'"
                      :tag-category="1"
                      :tag-list="item.tagList || []"
                      @emit-maintenance-tag="emitMaintenanceTag"
                    ></TagBtn>
                  </el-tooltip>
                </div>
                <!-- 删除按钮 -->
                <el-tooltip effect="dark" content="删除" placement="top">
                  <DeleteBtn
                    :only-icon="true"
                    :placement="'bottom-start'"
                    :text="'地图删除后不可恢复，请确认是否删除'"
                    @emit-delete-event="emitDeleteMap(item.id)"
                  ></DeleteBtn>
                </el-tooltip>
              </div>
            </div>
          </div>
          <!-- 地图名称 -->
          <div class="gwin-platform-name">
            <div v-if="!item.isEditName" class="flex flex-only-center" @click="onEditName(index)">
              <el-tooltip effect="dark" :content="item.mapName" placement="bottom">
                <p>{{ item.mapName }}</p>
              </el-tooltip>
              <el-tooltip effect="dark" content="编辑" placement="top">
                <i class="gwin-platform-name__edit"></i>
              </el-tooltip>
            </div>
            <EditNameInput
              v-else
              :index="index"
              :name="item.mapName"
              @emit-hide-edit-input="emitHideEditInput(index)"
              @emit-edit-name-change="emitEditNameChange($event, item.id, index)"
            ></EditNameInput>
          </div>
          <!-- 地图标签 -->
          <div class="gwin-platform-tags flex flex-only-center">
            <p v-for="t in item.tagList" :key="t.tagId">{{ t.tagName }}</p>
          </div>
          <!-- 地图编辑,发布日期 -->
          <div class="gwin-platform-date">
            <p style="margin-bottom: 4px">最后编辑于{{ formatDate(item.updateAt, 'h:m:s') }}</p>
            <p v-if="item.publishAt">最近发布于{{ formatDate(item.publishAt, 'h:m:s') }}</p>
          </div>
        </div>
      </div>
      <div v-else class="gwin-platform-none flex flex-column flex-center flex-only-center">
        <i></i>
        <div>
          <p>暂未创建任何地图样式～</p>
          <p>可以点击右上角【新建地图】按钮创建或从模版中创建</p>
        </div>
      </div>
    </div>
    <!-- 模版地图模版 -->
    <div class="gwin-platform-template" @mouseenter="onMouseleaveHide">
      <div class="gwin-platform-title" style="padding-left: 20px">模版创建地图</div>
      <div class="flex flex-only-center flex-wrap">
        <div v-for="item in state.templateMapList" :key="item.id" class="gwin-platform-template__base">
          <img :src="item.coverUri" />
          <p>{{ item.name }}</p>
          <div class="gwin-platform-template__base--hover">
            <div class="flex flex-center flex-only-center">
              <span @click="onLookMap(item.templateNo)">预览</span>
              <span @click="onUseMapTemplate(item.id)">使用该模版</span>
            </div>
          </div>
        </div>
      </div>
      <el-pagination
        v-model:currentPage="state.templateMapListPage.pageNum"
        class="gwin-platform-template__pagination flex flex-center"
        small
        background
        hide-on-single-page
        :page-sizes="[10, 20, 30, 40]"
        :page-size="state.templateMapListPage.pageSize"
        layout="total, prev, pager, next, sizes, jumper"
        :total="state.templateMapListPage.count"
        @size-change="handleSizeChangeByTemplate"
        @current-change="handleCurrentChangeByTemplate"
      ></el-pagination>
    </div>
  </div>
  <!-- 模版预览 -->
  <templateView v-if="state.isShowMapTemplate" @get-show-map-template="getShowMapTemplate"></templateView>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { ElNotification } from 'element-plus'
import { useRouter } from 'vue-router'
import { getEntityId } from '@/utils/auth' // 企业id
import { formatDate } from '@/utils/index' // 时间转换
import MapApi from '@/api/map' // api
import { state } from './map-config'
// 子组件
import templateView from './components/template/index.vue' // 模版预览

// 公共组件
import EditNameInput from '@/components/EditNameInput/index.vue' // 修改名称
import DeleteBtn from '@/components/DeleteBtn/index.vue' // 删除按钮
import TagBtn from '@/components/TagBtn/index.vue' // 标签按钮
// 公共组件
import PublishBtn from '@/components/PublishBtn/index.vue' // 发布
import ShareBtn from '@/components/ShareBtn/index.vue' // 分享

const router = useRouter()

onMounted(() => {
  // 我的地图列表
  mapListInquiry()

  // 地图底图模版列表
  mapTemplateListInquiry()
})

/**
 * 我的地图列表
 */
const mapListInquiry = async () => {
  const param = {
    subjectId: getEntityId()
  }
  const res = await MapApi.mapListInquiry(param)
  state.myMapList = res.body.dataList
  // 为地图列表添加 点击修改地图名称按钮，是否展示输入框
  for (const item of state.myMapList) {
    item.isEditName = false // 是否点击编辑名称
    item.isShowHandle = false // 是否显示操作面板
  }
}

/**
 * 地图模版列表
 */
const mapTemplateListInquiry = async () => {
  const param = {
    page: { ...state.templateMapListPage }
  }
  const res = await MapApi.mapTemplateListInquiry(param)
  state.templateMapList = res.body.dataList
  // 地图模版列表分页总条数
  state.templateMapListPage.count = res.body.page.count
}

/**
 * 地图模版列表 分页 选择每页多少条数据
 */
const handleSizeChangeByTemplate = async (val: number) => {
  state.templateMapListPage.pageSize = val
  state.templateMapListPage.pageNum = 1
  await mapTemplateListInquiry()
}

/**
 * 地图模版列表 分页 当前第几页
 */
const handleCurrentChangeByTemplate = async (val: number) => {
  state.templateMapListPage.pageNum = val
  await mapTemplateListInquiry()
}

/**
 * 新增地图
 */
const onAddMap = () => {
  if (state.myMapList.length > 4) {
    ElNotification({
      message: '最多创建5个地图',
      type: 'warning',
      offset: 60
    })
    return
  }
  state.templateNo = 'normal'
  state.isShowMapTemplate = true
}

/**
 * 鼠标经过页面位置
 */
const onMouseleaveHide = () => {
  state.myMapList.forEach((item) => (item.isShowHandle = false))
}

/**
 * 鼠标经过显示操作面板浮层
 */
const onMouseenterShow = (index: number) => {
  state.myMapList.forEach((item) => (item.isShowHandle = false))
  state.myMapList[index].isShowHandle = true
}

/**
 * 我的地图 预览
 * @param id 地图id
 */
const onPreviewMap = (id: string) => {
  router.push({
    path: '/map/preview',
    query: { id: id }
  })
}

/**
 * 我的地图 编辑
 * @param id 地图id
 */
const onEditMyMap = (id: string) => {
  router.push({
    path: '/map/editor',
    query: { id: id }
  })
}

/**
 * 地图模版预览
 */
const onLookMap = (templateNo: string) => {
  state.templateNo = templateNo
  state.isShowMapTemplate = true
}

/**
 * 地图模版编辑 属于新增地图
 * @param templateNo 样式编号
 */
const onUseMapTemplate = async (id: string) => {
  if (state.myMapList.length > 4) {
    ElNotification({
      message: '最多创建5个地图',
      type: 'warning',
      offset: 60
    })
    return
  }
  const param = {
    lat: 116.397428,
    lng: 39.90923,
    templateId: id
  }
  const res = await MapApi.MapAddition(param)
  router.push({
    path: '/map/editor',
    query: { id: res.body.id }
  })
}

/**
 * 关闭地图模版预览
 */
const getShowMapTemplate = (val: false) => {
  state.isShowMapTemplate = val
}

/**
 * 地图发布 分享之后
 */
const emitPublishMap = async () => {
  await mapListInquiry()
}

/**
 * 地图标签修改成功后
 */
const emitMaintenanceTag = async () => {
  await mapListInquiry()
}

/**
 * 地图删除
 */
const emitDeleteMap = async (id: string) => {
  const param = {
    id: id
  }
  await MapApi.mapDeleting(param)
  ElNotification({
    message: '地图删除成功',
    type: 'success',
    offset: 60
  })
  mapListInquiry()
}

/**
 * 输入框失去焦点，将输入框隐藏，地图名称显示
 */
const emitHideEditInput = (index: number) => {
  setTimeout(() => {
    state.myMapList[index].isEditName = false
  }, 200)
}

/**
 * 点击地图名称修改按钮
 * 展示修改地图名称输入框
 */
const onEditName = (index: number) => {
  state.myMapList[index].isEditName = true
}

/**
 * 我的地图信息修改
 * 点击修改名称输入框对勾时，请求接口
 */
const emitEditNameChange = async (VModelName: string, id: string, index: number) => {
  const param = {
    id: id,
    mapName: VModelName.replace(/(^\s*)|(\s*$)/g, '')
  }
  const res = await MapApi.mapBasicInfoMaintenance(param)
  state.myMapList[index].mapName = res.body.mapName
  state.myMapList[index].isEditName = false
  ElNotification({
    message: '地图名称修改成功',
    type: 'success',
    offset: 60
  })
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
@include b('my') {
  width: 100%;
  padding: 20px;
  background-color: #fff;
  @include e('map') {
    width: 204px;
    height: 240px;
    padding: 12px;
    cursor: pointer;
    margin-top: 20px;
    margin-right: 15px;
    border-radius: 2px;
    background: #ffffff;
    box-sizing: border-box;
    border: 1px solid #e1e5f5;
    &:last-child {
      margin-right: 0;
    }
    &:hover {
      box-shadow: 0px 2px 20px 0px rgba(0, 0, 0, 0.1);
    }
  }
}
@include b('title') {
  color: #121212;
  font-weight: 600;
  font-size: 16px;
  &::before {
    content: '';
    width: 4px;
    height: 18px;
    margin-right: 6px;
    display: inline-block;
    vertical-align: text-bottom;
    background-color: var(--gwin-color);
  }
}
@include b('add') {
  font-size: 16px;
  cursor: pointer;
  color: var(--gwin-color);
  i {
    width: 20px;
    height: 20px;
    margin-right: 2px;
    display: inline-block;
    vertical-align: text-bottom;
    background: url('@/assets/img/map/icon-add.png') no-repeat 0 0;
    background-size: 100%;
  }
}
@include b('handle') {
  width: 100%;
  height: 108px;
  overflow: hidden;
  border-radius: 2px;
  margin-bottom: 8px;
  position: relative;
  img {
    width: 100%;
    height: 100%;
  }
  @include m('hover') {
    width: 100%;
    height: 100%;
    padding: 10px;
    box-sizing: border-box;
    background: rgba(0, 0, 0, 0.5);
    position: absolute;
    top: 0;
    left: 0;
    animation: anim 0.6s;
  }
}
@include b('use') {
  width: 52px;
  height: 28px;
  color: #fff;
  margin: 20px 10px;
  line-height: 28px;
  text-align: center;
  border-radius: 2px;
  border: 1px solid #ffffff;
}
@include b('name') {
  color: #1a2234;
  height: 26px;
  font-size: 14px;
  font-weight: 600;
  line-height: 26px;
  &:hover {
    .gwin-platform-name__edit {
      background: url('@/assets/img/map/icon-edit-name-active.png') no-repeat 0 0;
      background-size: 100%;
    }
  }
  p {
    max-width: 150px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  @include e('edit') {
    width: 20px;
    height: 20px;
    display: block;
    margin-left: 6px;
    background: url('@/assets/img/map/icon-edit-name.png') no-repeat 0 0;
    background-size: 100%;
  }
}
@include b('tags') {
  margin: 8px 0 10px;
  p {
    padding: 2px;
    font-size: 12px;
    margin-right: 10px;
    border: 1px solid #d9d9d9;
    color: var(--gwin-font-color-primary);
    &:last-child {
      margin-right: 0;
    }
  }
}
@include b('date') {
  font-size: 12px;
  color: var(--gwin-font-color-secondary);
}
@include b('none') {
  font-size: 12px;
  line-height: 20px;
  text-align: center;
  color: var(--gwin-font-color-secondary);
  i {
    width: 120px;
    height: 78px;
    background: url('@/assets/img/map/icon-none.png') no-repeat 0 0;
    background-size: 100%;
  }
}
@include b('template') {
  padding: 20px;
  padding-left: 0;
  margin-top: 20px;
  background-color: #fff;
  @include e('base') {
    width: 200px;
    height: 120px;
    margin-top: 20px;
    margin-left: 20px;
    border-radius: 4px;
    overflow: hidden;
    text-align: center;
    position: relative;
    &::before {
      z-index: 99;
      content: '';
      width: 100%;
      height: 60px;
      display: block;
      background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.3) 100%);
      position: absolute;
      bottom: 0;
      left: 0;
    }
    &:hover {
      .gwin-platform-template__base--hover {
        display: block;
      }
    }
    img {
      width: 100%;
      height: 100%;
    }
    p {
      z-index: 99;
      color: #fff;
      font-size: 14px;
      font-weight: 600;
      text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.2);
      position: absolute;
      left: 50%;
      bottom: 8px;
      -webkit-transform: translate(-50%, 0);
      -moz-transform: translate(-50%, 0);
      transform: translate(-50%, 0);
    }
    @include m('hover') {
      width: 100%;
      height: 100%;
      color: #fff;
      cursor: pointer;
      background: rgba(0, 0, 0, 0.5);
      position: absolute;
      top: 0;
      left: 0;
      display: none;
      animation: anim 0.6s;
      span {
        width: auto;
        height: 28px;
        color: #fff;
        display: block;
        padding: 0 5px;
        box-sizing: border-box;
        line-height: 28px;
        text-align: center;
        border-radius: 2px;
        margin: 36px 10px 0;
        border: 1px solid #ffffff;
      }
    }
  }
  @include e('pagination') {
    margin-top: 30px;
  }
}
@keyframes anim {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
