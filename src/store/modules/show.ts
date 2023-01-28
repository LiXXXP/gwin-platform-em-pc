import Cookies from 'js-cookie'

const Publish_Show_KEY = 'Show'

interface StateOptions {
  isShowEditOption: boolean
}

const state: StateOptions = {
  isShowEditOption: JSON.parse(<string>Cookies.get(Publish_Show_KEY) || 'true')
}

const mutations = {
  SET_Show_Edit_Option: (state: StateOptions, isShowEditOption: string) => {
    state.isShowEditOption = JSON.parse(isShowEditOption)
    Cookies.set(Publish_Show_KEY, isShowEditOption)
  }
}

const actions = {
  setShowEditOption({ commit }: any, isShowEditOption: string) {
    commit('SET_Show_Edit_Option', isShowEditOption)
  }
}

export default {
  state,
  mutations,
  actions
}
