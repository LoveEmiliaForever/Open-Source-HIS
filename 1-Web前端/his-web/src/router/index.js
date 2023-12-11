import { createRouter, createWebHashHistory } from 'vue-router'
import axios from 'axios'
import { ElNotification } from 'element-plus'
import store from '../store'

import homeView from '../views/homeView.vue'
import loginView from '../views/loginView.vue'
import signUpView from '../views/signUpView.vue'
import userView from '../views/userView.vue'
import subordinateView from '../views/subordinateView.vue'
import windowWorkView from '../views/windowWorkView.vue'
import docWorkView from '../views/docWorkView.vue'
import operationNotice from '../views/doc-work/notices/operationNotice.vue'
import drugNotice from '../views/doc-work/notices/drugNotice.vue'
import bedManageView from '../views/bedManageView.vue'
import nurseWorkView from '../views/nurseWorkView.vue'
import operationRoomManageView from '../views/operationRoomManageView.vue'
import technicianDocWorkView from '../views/technicianDocWorkView.vue'
import patientHomeView from '../views/patientHomeView.vue'
import patientRegisterView from '../views/patientRegisterView.vue'
import patientRecordView from '../views/patientRecordView.vue'
import patientFinancialView from '../views/patientFinancialView.vue'
import patientInforView from '../views/patientInforView.vue'
import drugWarehouseWorkView from '../views/drugWarehouseWorkView.vue'
import drugRoomWorkView from '../views/drugRoomWorkView.vue'

const routes = [
  {
    path: '/',
    redirect: { name: 'user' },
    name: 'root'
  },
  {
    path: '/login',
    component: loginView,
    name: 'login'
  },
  {
    path: '/sign-up',
    component: signUpView,
    name: 'signUp'
  },
  {
    path: '/home',
    component: homeView,
    name: 'home'
  },
  {
    path: '/user',
    component: userView,
    name: 'user'
  },
  {
    path: '/subordinate',
    component: subordinateView,
    name: 'subordinate'
  },
  {
    path: '/window-work',
    component: windowWorkView,
    name: 'windowWork'
  },
  {
    path: '/doc-work',
    component: docWorkView,
    name: 'docWork'
  },
  {
    path: '/doc-work/operationNotice',
    name: 'operationNotice',
    component: operationNotice
  },
  {
    path: '/doc-work/drugNotice',
    name: 'drugNotice',
    component: drugNotice
  },
  {
    path: '/bed-management',
    name: 'bedManage',
    component: bedManageView
  },
  {
    path: '/nurse-work',
    name: 'nurseWork',
    component: nurseWorkView
  },
  {
    path: '/operation-room-manage',
    name: 'operationRoomManage',
    component: operationRoomManageView
  },
  {
    path: '/technician-doc-work',
    name: 'technicianDocWork',
    component: technicianDocWorkView
  },
  {
    path: '/drug-warehouse-work',
    name: 'drugWarehouseWork',
    component: drugWarehouseWorkView
  },
  {
    path: '/drug-room-work',
    name: 'drugRoomWork',
    component: drugRoomWorkView
  },
  {
    path: '/patient/home',
    name: 'patientHome',
    component: patientHomeView
  },
  {
    path: '/patient/register',
    name: 'patientRegister',
    component: patientRegisterView
  },
  {
    path: '/patient/medical-record',
    name: 'patientRecord',
    component: patientRecordView
  },
  {
    path: '/patient/financial',
    name: 'patientFinancial',
    component: patientFinancialView
  },
  {
    path: '/patient/single-information',
    name: 'patientInfor',
    component: patientInforView
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const skipURLs = ['/login', '/sign-up']
  let flag = false
  for (const url of skipURLs) {
    if (to.path === url) {
      flag = true
      break
    }
  }
  if (flag) {
    next()
  } else {
    if (localStorage.getItem('token') !== null) {
      axios.get('/login', {
        params: {
          targetURL: to,
          token: localStorage.getItem('token')
        }
      }).then((result) => {
        store.commit({
          type: 'setChildrenPermissions',
          newValue: result.data
        })
        next()
      }).catch(() => {
        ElNotification({
          title: '登录信息过期或错误',
          message: '请重新登录',
          position: 'bottom-right',
          type: 'error'
        })
        localStorage.removeItem('token')
        next({ name: 'login' })
      })
    } else {
      next({ name: 'login' })
    }
  }
})

export default router
