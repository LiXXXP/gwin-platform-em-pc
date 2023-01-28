<template>
  <div v-if="props.popover" class="gwin-platform-popover">
    <el-popover
      ref="popover"
      :width="370"
      trigger="click"
      :placement="props.placement"
      :teleported="route.path.includes('editor') ? false : true"
      :popper-options="{ boundariesElement: 'body', gpuAcceleration: false }"
      popper-class="gwin-platform-popover--default"
    >
      <template v-if="props.onlyIcon" #reference>
        <i class="gwin-platform-icons-tag" @click="onClickTag"></i>
      </template>
      <template v-else #reference>
        <div class="gwin-platform-more flex flex-only-center" @click="onClickTag">
          <i class="gwin-platform-icons__tag"></i>
          <p>标签</p>
        </div>
      </template>
      <template #default>
        <div class="gwin-platform-popover__title">
          <p>标签</p>
          <i @click="onCancel"></i>
        </div>
        <div class="gwin-platform-popover__content">
          <p>标签</p>
          <el-select
            v-model="state.tagList"
            :popper-class="state.newTagClass"
            placeholder="请输入标签"
            allow-create
            filterable
            multiple
            remote
            style="font-size: 12px"
            :default-first-option="state.firstOption"
            value-key="value"
            :teleported="false"
            :reserve-keyword="false"
            :multiple-limit="3"
            :automatic-dropdown="true"
            :remote-method="onRemoteMethod"
            @change="onChangeTags"
            @visible-change="onVisibleChange"
          >
            <el-option v-for="item in state.tagsOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option
          ></el-select>
          <p style="margin-top: 10px">最多支持添加3个标签</p>
        </div>
        <div class="gwin-platform-popover__footer">
          <el-button plain class="gwin-platform-default" @click="onCancel">取消</el-button>
          <el-button type="primary" class="gwin-platform-save" @click="tagLinkMaintenance">确认</el-button>
        </div>
      </template>
    </el-popover>
  </div>
  <div v-else class="gwin-platform-tag">
    <el-select
      v-model="state.tagList"
      :popper-class="state.newTagClass"
      placeholder="请输入标签"
      allow-create
      filterable
      multiple
      remote
      :default-first-option="state.firstOption"
      value-key="value"
      :teleported="false"
      :reserve-keyword="false"
      :multiple-limit="3"
      :automatic-dropdown="true"
      :remote-method="onRemoteMethod"
      @change="onChangeTags"
      @visible-change="onVisibleChange"
      @remove-tag="tagLinkMaintenance"
    >
      <el-option v-for="item in state.tagsOptions" :key="item.value" :label="item.label" :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watchEffect, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
import TagsApi from '@/api/tags' // api
import MapApi from '@/api/map' // api
import { getUserId } from '@/utils/auth'

const popover = ref()
const route = useRoute()

interface Props {
  popover: boolean
  bizId?: string
  onlyIcon: boolean
  placement: string
  tagCategory: number
  tagList: TagListParam[]
}

const props = withDefaults(defineProps<Props>(), {
  popover: true, // 是否有弹出层
  bizId: '', // 关联的id
  onlyIcon: true, // 是否只显示icon
  placement: '', // 弹出层显示方向
  tagCategory: 1, // 标签所属类别
  tagList: () => [] // 标签列表
})

const emit = defineEmits(['emitMaintenanceTag'])

const state: StateOption = reactive({
  tagInquiry: [], // 接口返回的标签列表
  tagsOptions: [], // 标签列表选项
  tagList: props.tagList, // 自身的标签列表
  firstOption: false, // 在输入键上选择第一个匹配选项
  hasChange: null,
  newTagClass: props.popover ? 'gwin-platform-tag__select' : 'gwin-platform-tag__popper' // 存在新标签时的class
})

interface StateOption {
  tagInquiry: TagInquiryParam[]
  tagsOptions: TagsOptionsParam[]
  tagList: any[]
  firstOption: boolean
  hasChange: any
  newTagClass: string
}

interface TagInquiryParam {
  id: string
  tagName: string
}

interface TagsOptionsParam {
  value: string
  label: string
}

interface TagListParam {
  tagId: string
  tagName: string
}

/**
 * tag init
 */
const initTag = () => {
  // 将数据改为select支持的格式
  state.tagList = props.tagList?.map((item) => ({
    value: item.tagId,
    label: item.tagName
  }))
}

watchEffect(() => {
  initTag()
})

onMounted(async () => {
  if (!props.popover) {
    // 初始时请求标签接口，不做任何匹配项
    await tagAllListInquiry()
  }
})

/**
 * 打开标签弹框
 */
const onClickTag = async () => {
  initTag()
  // 初始时请求标签接口，不做任何匹配项
  await tagAllListInquiry()
}

/**
 * 下拉框出现/隐藏时触发
 * @param val 出现则为 true，隐藏则为 false
 */
const onVisibleChange = async (val: boolean) => {
  if (val) {
    const notIncloudedTag = []
    if (!props.popover) {
      for (const item of state.tagList) {
        const obj = state.tagInquiry.find((ele) => ele.tagName === item.label)
        if (obj) {
          notIncloudedTag.push(obj?.id)
          item.value = obj?.id
        }
      }
    } else {
      for (const item of state.tagList) {
        notIncloudedTag.push(item.value)
      }
    }
    await tagSearchListInquiry('', notIncloudedTag)
  } else {
    if (!props.popover && state.hasChange) {
      // 地图编辑页面 标签编辑栏中的 标签选项有更改时
      await tagLinkMaintenance()
      await tagAllListInquiry()
    }
  }
}

/**
 * 当输入值改变时调用的函数
 * @param keyword 输入的关键字
 */
const onRemoteMethod = async (keyword: string) => {
  // class初始， 当没有输入关键字时
  if (!keyword) {
    state.firstOption = false
    state.newTagClass = props.popover ? 'gwin-platform-tag__select' : 'gwin-platform-tag__popper'
  } else {
    // 关键字只支持四个字，多于四个字不再请求接口
    if (keyword.length > 4) {
      ElNotification({
        message: '标签最多可支持四个字',
        type: 'error',
        offset: 60
      })
      return
    }

    // 关键字小于四个字时，请求接口
    if (keyword.length <= 4) {
      // 输入关键字后，代开回车选中第一个
      state.firstOption = true
      const notIncloudedTag = []
      for (const item of state.tagList) {
        if (item.value !== item.label) {
          notIncloudedTag.push(item.value)
        }
      }
      await tagSearchListInquiry(keyword.substring(0, 4), notIncloudedTag)
    }
  }
}

/**
 * 选中值发生变化时触发, 标签选择后的回显
 */
const onChangeTags = async (val: any) => {
  state.hasChange = val
  // 将改变的值的存为一个数组，若是已有数据存id，新数据为关键字
  const changes: string[] = []

  for (const item of val) {
    if (item instanceof Object) {
      changes.push(item.value)
    } else {
      changes.push(item)
    }
  }
  // 匹配到新标签还是原有标签，做回显
  const tagList = [...new Set(changes)].map((item) => {
    const obj = state.tagInquiry.find((ele) => ele.id === item)
    if (obj) {
      return {
        value: obj.id,
        label: obj.tagName
      }
    } else {
      return {
        value: item,
        label: item
      }
    }
  })

  const res = new Map()
  state.tagList = tagList.filter((item) => {
    return !res.has(item.label) && res.set(item.label, 1)
  })

  // 当值有变化时请求接口，更新标签列表
  const notIncloudedTag = []
  for (const item of state.tagList) {
    if (item.value !== item.label) {
      notIncloudedTag.push(item.value)
    }
  }
  await tagSearchListInquiry('', notIncloudedTag)

  // class初始
  state.newTagClass = props.popover ? 'gwin-platform-tag__select' : 'gwin-platform-tag__popper'
}

/**
 * 标签全部列表查询
 */
const tagAllListInquiry = async () => {
  const param = {
    userId: getUserId(),
    tagCategory: props.tagCategory
  }
  const res = await TagsApi.tagListInquiry(param)
  state.tagInquiry = res.body.dataList
  state.tagList = state.tagList.map((item) => {
    const obj = state.tagInquiry.find((ele) => ele.tagName === item.label)
    if (obj) {
      return {
        value: obj.id,
        label: obj.tagName
      }
    } else {
      return {
        value: item,
        label: item
      }
    }
  })
}

/**
 * 标签搜索结果列表，默认显示5条
 */
const tagSearchListInquiry = async (tagName: string, notIncloudedTag: string[]) => {
  const param = {
    userId: getUserId(),
    tagCategory: props.tagCategory,
    tagName: tagName,
    notIncloudedTag: notIncloudedTag,
    page: {
      returnCount: false,
      pageNum: 1,
      pageSize: 5
    }
  }

  const res = await TagsApi.tagListInquiry(param)

  // 标签列表，含有结果的前五条
  state.tagsOptions = res.body.dataList
    .map((item: TagInquiryParam) => ({
      value: item.id,
      label: item.tagName
    }))
    .slice(0, 5)

  // 存在新标签
  if (tagName) {
    let newTag: TagsOptionsParam[] = []

    if (state.tagsOptions.length) {
      for (const item of state.tagsOptions) {
        if (item.label !== tagName) {
          newTag = [{ value: tagName, label: tagName + '(新标签)' }]
        }
      }
    } else {
      newTag = [{ value: tagName, label: tagName + '(新标签)' }]
    }

    if (props.popover) {
      state.newTagClass = newTag.length ? 'gwin-platform-new__popper' : 'gwin-platform-tag__select'
    } else {
      state.newTagClass = newTag.length ? 'gwin-platform-none__popper' : 'gwin-platform-tag__popper'
    }

    state.tagsOptions = newTag.length ? newTag.concat(state.tagsOptions) : state.tagsOptions
  }
}

/**
 * 提交标签修改
 */
const tagLinkMaintenance = async () => {
  const tags = state.tagList.map((item) => ({
    addFlag: item.value === item.label,
    tagId: item.value === item.label ? null : item.value,
    tagName: item.label
  }))
  const param = {
    bizId: props.bizId,
    tagCategory: props.tagCategory,
    tagList: tags,
    userId: getUserId()
  }
  await MapApi.tagLinkMaintenance(param)
  ElNotification({
    message: '标签修改成功',
    type: 'success',
    offset: 60
  })
  emit('emitMaintenanceTag', tags)
  if (props.popover) {
    onCancel()
  }
}

/**
 * 取消
 */
const onCancel = () => {
  initTag()

  // 关闭弹窗
  popover.value.hide()
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
@include b('icons-tag') {
  width: 20px;
  height: 20px;
  display: block;
  background: url('@/assets/img/map/icon-tag.png') no-repeat 0 0;
  background-size: 100%;
}
@include b('more') {
  padding: 10px;
  cursor: pointer;
  border-radius: 4px;
  box-sizing: border-box;
  &:hover {
    color: #fff;
    background-color: #2e353f;
    .gwin-platform-icons__tag {
      background-image: url('../../assets/img/business/icon-tag-hover.png');
    }
  }
  .gwin-platform-icons__tag {
    width: 20px;
    height: 20px;
    margin-right: 5px;
    background: url('../../assets/img/business/icon-tag.png') no-repeat 0 0;
    background-size: 100%;
  }
}
@include b('popover') {
  position: relative;
  @include e('title') {
    font-size: 16px;
    font-weight: 600;
    text-align: center;
    padding-bottom: 10px;
    color: var(--gwin-font-color);
    border-bottom: 1px solid rgba(225, 229, 245, 0.5);
    position: relative;
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
    padding: 20px;
    font-size: 12px;
    color: var(--gwin-font-color-secondary);
    p:first-child {
      font-size: 14px;
      color: var(--gwin-font-color);
      margin-bottom: 10px;
    }
  }
  @include e('footer') {
    text-align: right;
    padding: 10px 12px 0 0;
    border-top: 1px solid rgba(225, 229, 245, 0.5);
  }
}
@include b('tag') {
  :deep(.el-select) {
    .el-input__inner {
      font-size: 12px;
      background-color: #383f4b !important;
      border-color: rgba(255, 255, 255, 0.1);
    }
    .el-select__tags .el-tag--info {
      color: #fff;
      background-color: #2a2f37;
    }
    .el-select__input {
      color: #fff;
    }
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
</style>
