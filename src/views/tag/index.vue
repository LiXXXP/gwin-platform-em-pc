<template>
  <div class="gwin-platform-tags">
    <div class="gwin-platform-tags__select">
      <el-row justify="space-around" :gutter="20">
        <el-col :sm="{ span: 12 }" :lg="{ span: 6 }" :xl="{ span: 6 }" style="margin-bottom: 20px">
          <el-select
            v-model="state.tagListSearchData.tagCategory"
            placeholder="请选择标签分类"
            clearable
            style="width: 100%"
          >
            <el-option label="地图" :value="1"></el-option>
            <el-option label="业务图层" :value="2"></el-option>
            <el-option label="要素" :value="4"></el-option>
          </el-select>
        </el-col>
        <el-col :sm="{ span: 12 }" :lg="{ span: 6 }" :xl="{ span: 6 }" style="margin-bottom: 20px">
          <el-input v-model="state.tagListSearchData.tagName" placeholder="请输入标签名称" clearable />
        </el-col>
        <el-col :sm="{ span: 12 }" :lg="{ span: 6 }" :xl="{ span: 6 }" style="margin-bottom: 20px">
          <el-input v-model="state.tagListSearchData.createName" placeholder="请输入操作者" clearable />
        </el-col>
        <el-col :sm="{ span: 12 }" :lg="{ span: 6 }" :xl="{ span: 6 }" style="text-align: right">
          <el-button plain class="gwin-platform-tags__default" @click="onResetButton">重置</el-button>
          <el-button type="primary" class="gwin-platform-tags__inquire" @click="onSearchButton">查询</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="gwin-platform-tags__table">
      <el-row :gutter="20" justify="end">
        <el-col :sm="{ span: 6 }" :lg="{ span: 4 }" :xl="{ span: 4 }" style="text-align: right">
          <el-button type="primary" class="gwin-platform-tags__inquire" @click="onAddTagButton">新建</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="state.tagListInquiry"
        :header-row-style="{
          height: '54px',
          color: '#1A2234',
          fontSize: '14px',
          fontWeight: 600
        }"
        :row-style="{
          color: '#606A78',
          fontSize: '14px',
          height: '52px'
        }"
      >
        <el-table-column type="index" label="序号" width="70"></el-table-column>
        <el-table-column prop="tagType" label="标签分类"></el-table-column>
        <el-table-column prop="tagName" label="标签名称"></el-table-column>
        <el-table-column prop="createName" label="操作者"></el-table-column>
        <el-table-column prop="updateAt" label="更新时间"></el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <span class="gwin-platform-tags__table--color" @click="onLookTag(scope.row)">查看</span>
            <span class="gwin-platform-tags__table--color" @click="onEditTag(scope.row)">编辑</span>
            <el-popconfirm
              confirm-button-text="确认"
              cancel-button-text="取消"
              title="删除后已打标签会同步被删除，请确认是否做删除操作?"
              @confirm="onDeleteConfirm(scope.row.id)"
            >
              <template #reference>
                <span class="gwin-platform-tags__table--color">删除</span>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      v-model:currentPage="state.tagListInquiryPage.pageNum"
      class="gwin-platform-tags__pagination flex flex-center"
      small
      background
      :page-sizes="[10, 20, 30, 40]"
      :page-size="state.tagListInquiryPage.pageSize"
      layout="total, prev, pager, next, sizes, jumper"
      :total="state.tagListInquiryPage.count"
      @size-change="handleSizeChangeByTags"
      @current-change="handleCurrentChangeByTags"
    ></el-pagination>
  </div>
  <el-dialog v-model="state.dialog.visible" :title="state.dialog.title" width="35%" center>
    <!-- 新建标签 -->
    <add-view
      v-if="state.dialog.type === 'add'"
      @get-back-dialog-visible="getBackDialogVisible"
      @get-save-dialog-visible="getSaveDialogVisible"
    ></add-view>
    <!-- 查看标签 -->
    <look-view
      v-if="state.dialog.type === 'look'"
      :look-tag-detail="state.lookTagDetail"
      @get-back-dialog-visible="getBackDialogVisible"
    ></look-view>
    <!-- 编辑标签 -->
    <edit-view
      v-if="state.dialog.type === 'edit'"
      :look-tag-detail="state.lookTagDetail"
      @get-back-dialog-visible="getBackDialogVisible"
      @get-save-dialog-visible="getSaveDialogVisible"
    ></edit-view>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import TagsApi from '@/api/tags'
import { getUserId } from '@/utils/auth'
import { formatDate } from '@/utils/index'
import { StateOptions } from './interface'
import addView from './add.vue'
import lookView from './look.vue'
import editView from './edit.vue'

const state: StateOptions = reactive({
  tagListSearchData: {
    // 标签列表查询选项
    tagCategory: '', // 标签分类，1 地图 2 图层 4 要素
    tagName: '', // 标签名称
    createName: '' // 操作者
  },
  tagListInquiry: [], // 标签列表
  tagListInquiryPage: {
    // 标签列表分页
    count: 0,
    pageNum: 1,
    pageSize: 10
  },
  dialog: {
    type: '', // 弹窗类型
    title: '', // 弹窗标题
    visible: false // 新增，编辑，查看弹窗显示状态
  },
  lookTagDetail: {} // 每行标签详情
})

onMounted(() => {
  getTagListInquiry()
})

/**
 * 标签列表查询
 */
const getTagListInquiry = async () => {
  const param = {
    userId: getUserId(),
    ...state.tagListSearchData,
    page: {
      returnCount: true,
      pageNum: state.tagListInquiryPage.pageNum,
      pageSize: state.tagListInquiryPage.pageSize
    }
  }
  const res = await TagsApi.tagListInquiry(param)
  // 标签列表
  state.tagListInquiry = res.body.dataList
  // 标签列表分页总条数
  state.tagListInquiryPage.count = res.body.page.count
  // 过滤标签列表中 标签分类 时间 显示问题
  state.tagListInquiry.filter((item: any) => {
    item.tagType = getTagCategory(item.tagCategory)
    item.updateAt = formatDate(item.updateAt, 'h:m:s')
  })
}

/**
 * 标签分类，1 地图 2 图层 4要素
 */
const getTagCategory = (type: number): string | undefined => {
  switch (type) {
    case 1:
      return '地图'
    case 2:
      return '业务图层'
    case 4:
      return '要素'
    default:
      break
  }
}

/**
 * 重置按钮
 */
const onResetButton = () => {
  ;({ ...state.tagListSearchData } = { tagCategory: '', tagName: '', createName: '' })
}

/**
 * 查询按钮
 */
const onSearchButton = async () => {
  await getTagListInquiry()
}

/**
 * 新建按钮
 */
const onAddTagButton = () => {
  if (state.tagListInquiryPage.count >= 2000) {
    ElMessage({
      message: '最多添加2000条标签，如需扩展请联系管理员！',
      type: 'warning'
    })
    return
  }
  ;({ ...state.dialog } = { type: 'add', title: '新增标签', visible: true })
}

/**
 * 标签列表 分页 选择每页多少条数据
 */
const handleSizeChangeByTags = async (val: number) => {
  state.tagListInquiryPage.pageSize = val
  state.tagListInquiryPage.pageNum = 1
  await getTagListInquiry()
}

/**
 * 标签列表 分页 当前第几页
 */
const handleCurrentChangeByTags = async (val: number) => {
  state.tagListInquiryPage.pageNum = val
  await getTagListInquiry()
}

/**
 * 标签弹窗中返回按钮
 */
const getBackDialogVisible = (val: boolean) => {
  state.dialog.visible = val
}

/**
 * 标签弹窗中保存按钮
 */
const getSaveDialogVisible = async (val: boolean) => {
  state.dialog.visible = val
  await getTagListInquiry()
}

/**
 * 查看标签
 */
const onLookTag = (row: any) => {
  state.lookTagDetail = row
  ;({ ...state.dialog } = { type: 'look', title: '查看标签', visible: true })
}

/**
 * 编辑标签
 */
const onEditTag = (row: any) => {
  state.lookTagDetail = row
  ;({ ...state.dialog } = { type: 'edit', title: '编辑标签', visible: true })
}

/**
 * 确认删除标签
 */
const onDeleteConfirm = async (id: string) => {
  const param = {
    id: id
  }
  await TagsApi.tagDeleting(param)
  ElMessage({
    message: '删除成功',
    type: 'success'
  })
  getTagListInquiry()
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
@include b('tags') {
  padding: 20px;
  overflow-x: auto;
  box-sizing: border-box;
  background-color: #fff;
  @include e('table') {
    margin-top: 20px;
    box-sizing: border-box;
    @include m('color') {
      color: #3860f4;
      cursor: pointer;
    }
  }
  @include e('pagination') {
    text-align: center;
    margin-top: 30px;
  }
  @include e('inquire') {
    width: 84px;
    font-size: 14px;
    border: 0 !important;
    background: var(--gwin-color) !important;
    &:hover {
      background: #3c7dff !important;
    }
  }
  @include e('default') {
    width: 84px;
    font-size: 14px;
    color: var(--gwin-color) !important;
    border-color: var(--gwin-color) !important;
    &:hover {
      color: #3c7dff !important;
      border-color: #3c7dff !important;
    }
  }
  @include e('table') {
    @include m('color') {
      color: var(--gwin-color);
      cursor: pointer;
      margin-right: 10px;
    }
  }
  @include e('pagination') {
    text-align: center;
    margin-top: 30px;
  }
}
</style>
