export interface StateOptions {
  // 标签列表 state 类型定义
  tagListSearchData: {
    tagCategory: string
    tagName: string
    createName: string
  }
  tagListInquiry: any[]
  tagListInquiryPage: {
    count: number
    pageNum: number
    pageSize: number
  }
  dialog: {
    type: string
    title: string
    visible: boolean
  }
  lookTagDetail: object
}

export interface AddStateOptions {
  // 新建，编辑 标签 state 类型定义
  ruleForm: {
    tagCategory: string
    tagName: string
    memo: string
  }
  rules: {
    tagCategory: [
      {
        required: boolean
        message: string
        trigger: string
      }
    ]
    tagName: [
      {
        required: boolean
        message: string
        trigger: string
      },
      {
        min: number
        max: number
        message: string
        trigger: string
      },
      {
        pattern: any
        message: string
        trigger: string
      }
    ]
  }
}
