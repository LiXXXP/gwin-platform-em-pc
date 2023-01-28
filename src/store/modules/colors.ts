import Cookies from 'js-cookie'

const Publish_Color_KEY = 'Colors'

interface StateOptions {
  predefineColors: string[]
}

const state: StateOptions = {
  predefineColors: JSON.parse(<string>Cookies.get(Publish_Color_KEY) || '[]')
}

const mutations = {
  SET_Predefine_Colors: (state: StateOptions, predefineColors: string[]) => {
    state.predefineColors = predefineColors
    Cookies.set(Publish_Color_KEY, JSON.stringify(predefineColors))
  }
}

const actions = {
  setPredefineColors({ commit }: any, predefineColors: string[]) {
    commit('SET_Predefine_Colors', predefineColors)
  }
}

export default {
  state,
  mutations,
  actions
}
