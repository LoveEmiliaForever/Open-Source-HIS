import { createStore } from 'vuex'
import axios from 'axios'
import { ElNotification } from 'element-plus'

const windowWork = {
  namespaced: true,
  state: {
    patientName2: '',
    idNum2: ''
  },
  mutations: {
    setPatientName (state, payObj) {
      state.patientName2 = payObj
    },
    setIdNum (state, payObj) {
      state.idNum2 = payObj
    }
  }
}

const docWork = {
  namespaced: true,
  state: {
    patientId2: '',
    recordId2: true
  },
  mutations: {
    setPatientId (state, payObj) {
      state.patientId2 = payObj
    },
    setRecordId (state, payObj) {
      state.recordId2 = payObj
    }
  }
}

export default createStore({
  state: {
    permissions: '', // name: undefined// name是路径名字，undefined是路径的字符串
    childrenPermissions: false,
    userName: '',
    userRole: '',
    menuCollapseFlag: false,
    // axios报错用的函数
    errorReport (result) {
      if (result.response) {
        ElNotification({
          duration: 1500,
          title: '错误',
          message: result.response.data.error,
          position: 'bottom-right',
          type: 'error'
        })
      } else {
        ElNotification({
          duration: 1500,
          title: '未知错误',
          message: '出现未知错误',
          position: 'bottom-right',
          type: 'error'
        })
      }
    }
  },
  getters: {
  },
  mutations: {
    getPermissions (state, VueSelf) {
      axios.get('/permissions', {
        params: {
          token: localStorage.getItem('token')
        }
      }).then((result) => {
        state.permissions = result.data
      }).catch(() => {
        ElNotification({
          title: '登录信息过期或错误：请重新登录',
          message: 'permissions get error',
          position: 'bottom-right',
          type: 'error'
        })
        localStorage.removeItem('token')
        VueSelf.$router.push({ name: 'login' })
      })
    },
    setChildrenPermissions (state, payObj) {
      state.childrenPermissions = payObj.newValue
    },
    getUserData (state, VueSelf) {
      axios.get('/permissions/user-data', {
        params: {
          token: localStorage.getItem('token')
        }
      }).then((result) => {
        state.userName = result.data.userName
        state.userRole = result.data.userRole
      }).catch(() => {
        ElNotification({
          title: '登录信息过期或错误：请重新登录',
          message: 'permissions get error',
          position: 'bottom-right',
          type: 'error'
        })
        localStorage.removeItem('token')
        VueSelf.$router.push({ name: 'login' })
      })
    },
    setMenuCollapseFlag (state, payObj) {
      state.menuCollapseFlag = payObj.newValue
    }
  },
  actions: {
  },
  modules: {
    windowWork,
    docWork
  }
})
