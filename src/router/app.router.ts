import Layout from '@/layout/index.vue'
import { RouteConfig } from '#/global'

const appRoutes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: '/map'
  },
  {
    path: '/map',
    name: 'maps',
    redirect: '/map/index',
    component: Layout,
    meta: { title: '我的地图', icon: 'yt-map' },
    children: [
      {
        path: 'index',
        name: 'Index',
        component: () => import('@/views/my-map/index.vue'),
        meta: { title: '我的地图' }
      }
    ]
  },
  {
    path: '/map/editor',
    name: 'editors',
    hidden: true,
    meta: { title: '我的地图编辑' },
    component: () => import('@/views/editor/index.vue')
  },
  {
    path: '/map/preview',
    name: 'preview',
    hidden: true,
    meta: { title: '我的地图预览' },
    component: () => import('@/views/preview/index.vue')
  },
  {
    path: '/map/share',
    name: 'share',
    hidden: true,
    meta: { title: '地图分享' },
    component: () => import('@/views/share/index.vue')
  },
  {
    path: '/tags',
    name: 'tagss',
    redirect: '/tags/tags',
    component: Layout,
    meta: { title: '标签管理', icon: 'yt-tag' },
    children: [
      {
        path: 'tags',
        name: 'Tags',
        component: () => import('@/views/tag/index.vue'),
        meta: { title: '标签管理' }
      }
    ]
  }
]

export default appRoutes
