import { createStore } from 'vuex'

import getters from './getters'

const modulesFiles = import.meta.globEager('./modules/**/*.ts')
const pathList: string[] = []

for (const path in modulesFiles) {
  pathList.push(path)
}

const modules = pathList.reduce((modules: { [x: string]: any }, modulePath: string) => {
  const moduleName = modulePath.replace(/^\.\/modules\/(.*)\.\w+$/, '$1')
  const value = modulesFiles[modulePath]
  modules[moduleName] = value.default
  return modules
}, {})

const store = createStore({
  modules,
  getters
})
export default store
