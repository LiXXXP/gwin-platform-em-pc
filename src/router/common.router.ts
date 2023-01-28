import { RouteConfig } from '#/global'

const commonRoutes: Array<RouteConfig> = [
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import('@/views/error/404.vue'),
    hidden: true
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/error/403.vue'),
    hidden: true
  },
  {
    path: '/not',
    name: 'not',
    component: () => import('@/views/error/not.vue'),
    hidden: true
  }
]

export default commonRoutes
