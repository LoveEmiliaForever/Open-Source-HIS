<template>
  <div id="basic-main">
    <el-page-header :icon="null" id="basic-header">
      <template #title>
        <el-radio-group v-model="menuCollapseFlagTransfer">
          <el-radio-button :label="true">折叠</el-radio-button>
          <el-radio-button :label="false">打开</el-radio-button>
        </el-radio-group>
      </template>
      <template #content>
        <div id="userProfilePhoto"><!--用户头像--></div>
        <p class="userName">{{ userName }}</p>
        <el-tag :type="userRoleTagType" effect="light">{{ userRole }}</el-tag>
        <p class="welcomeLogo">HIS系统欢迎您</p>
      </template>
      <template #extra>
        <div id="author-address">
          <img src="../assets/images/github.webp" alt="GitHub">
          <div>
            <p>作者：<a href="https://github.com/LoveEmiliaForever" target="_blank">LoveEmiliaForever</a></p>
            <p>项目仓库：<a href="www.baidu.com" target="_blank">www.baidu.com</a></p>
          </div>
        </div>
        <el-button type="danger" plain @click="onLogOut">退出HIS系统登录</el-button>
      </template>
    </el-page-header>
    <div id="basic-body">
      <el-menu mode="vertical" :collapse="menuCollapseFlagTransfer" :default-active="this.$router.currentRoute._value.path" router>
        <el-menu-item v-for="(item, index) in Object.entries(permissions)" :index="item[1]" :key="index">
          <el-icon v-if="item[0] == '主页'"><House /></el-icon>
          <el-icon v-else-if="item[0] == '个人页面'"><User /></el-icon>
          <el-icon v-else-if="item[0] == '下属管理'"><Avatar /></el-icon>
          <el-icon v-else-if="item[0] == '教学系统'"><Collection /></el-icon>
          <el-icon v-else-if="item[0] == '物资系统'"><Box /></el-icon>
          <el-icon v-else-if="item[0] == '财务系统'"><Money /></el-icon>
          <el-icon v-else-if="item[0] == '通知'"><ChatLineRound /></el-icon>
          <el-icon v-else-if="item[0] == '窗口工作台'"><ScaleToOriginal /></el-icon>
          <el-icon v-else-if="item[0] == '医生工作台'"><Wallet /></el-icon>
          <el-icon v-else-if="item[0] == '总床位管理'"><ReadingLamp /></el-icon>
          <el-icon v-else-if="item[0] == '护士工作台'"><Sugar /></el-icon>
          <el-icon v-else-if="item[0] == '手术室管理'"><Scissor /></el-icon>
          <el-icon v-else-if="item[0] == '检查医生工作台'"><Help /></el-icon>
          <el-icon v-else-if="item[0] == '药库工作台'"><Goods /></el-icon>
          <el-icon v-else-if="item[0] == '药房工作台'"><SoldOut /></el-icon>
          <el-icon v-else-if="item[0] == '物资总管工作台'"><TakeawayBox /></el-icon>
          <el-icon v-else-if="item[0] == '物资管理工作台'"><TakeawayBox /></el-icon>
          <el-icon v-else-if="item[0] == '物资事务工作台'"><TakeawayBox /></el-icon>
          <el-icon v-else-if="item[0] == '财务审计工作台'"><Tickets /></el-icon>
          <el-icon v-else-if="item[0] == '财务付款工作台'"><Tickets /></el-icon>
          <el-icon v-else-if="item[0] == '财务收款工作台'"><Tickets /></el-icon>
          <el-icon v-else-if="item[0] == '人事管理工作台'"><Grid /></el-icon>
          <el-icon v-else-if="item[0] == '教学管理工作台'"><DataBoard /></el-icon>
          <el-icon v-else-if="item[0] == '信息部主管工作台'"><Platform /></el-icon>
          <el-icon v-else-if="item[0] == '院方科研管理'"><Postcard /></el-icon>
          <el-icon v-else-if="item[0] == '临床试验管理'"><Grid /></el-icon>
          <el-icon v-else-if="item[0] == '科方课题管理'"><Menu /></el-icon>
          <el-icon v-else-if="item[0] == '科研参与人'"><User /></el-icon>
          <el-icon v-else-if="item[0] == '患者主页'"><HomeFilled /></el-icon>
          <el-icon v-else-if="item[0] == '预约挂号'"><Place /></el-icon>
          <el-icon v-else-if="item[0] == '查看病历'"><Files /></el-icon>
          <el-icon v-else-if="item[0] == '查看开支'"><Reading /></el-icon>
          <el-icon v-else-if="item[0] == '个人信息'"><User /></el-icon>
          <el-icon v-else-if="item[0] == '数据可视化'"><Histogram /></el-icon>
          <el-icon v-else><House /></el-icon>
          <template #title>{{ item[0] }}</template>
        </el-menu-item>
      </el-menu>
      <slot></slot>
    </div>
  </div>

</template>

<style>
#basic-main{
  display: flex;
  flex-direction: column;
  height: 100vh;
}
#basic-header{
  padding: 1%;
  border-bottom: 1px solid rgba(0, 0, 0, 0.041);
}
#basic-header .el-page-header__left{
  width: 50%;
  display: flex;
  justify-content: space-between;
}
#basic-header .el-page-header__content{
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
#userProfilePhoto{
  background-image: url(../assets/images/用户头像图片.webp);
  background-size: cover;
  width: 5vw;
  height: 5vw;
  border-radius: 5vw;
  margin-right: 1rem;
}
#basic-header .userName{
  font-size: 2rem;
  font-weight: 700;
  text-shadow: 0 1px 1px 1px rgba(0, 0, 0, 0.322);
  margin-right: 0.5rem;
}
#basic-header .welcomeLogo{
  font-size: 1.5rem;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.473);
  height: 2rem;
  padding-top: 1.0rem;
  margin-left: 2rem;
}
#basic-header .el-page-header__extra{
  width: 40%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
#basic-header #author-address{
  width: 45%;
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.158);
}
#basic-header #author-address img{
  width: 20%;
}
#basic-header #author-address a:link,#basic-header #author-address a:visited{
  color: rgba(0, 140, 255, 0.808);
  text-decoration: none;
}
#basic-header #author-address a:hover{
  color: rgba(0, 140, 255, 0.418);
  text-decoration: underline;
}
#basic-header #author-address > div{
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
#basic-header #author-address p:nth-of-type(1){
  font-size: 1.1rem;
}
#basic-body{
  display: flex;
  flex: 1;
  height: 10%;
}
#basic-body .el-menu{
  overflow: scroll;
  /* 隐藏 IE、Edge 和 Firefox 的滚动条 */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
/* 隐藏 Chrome、Safari 和 Opera 的滚动条 */
#basic-body .el-menu::-webkit-scrollbar{
  display: none;
}
.contents{
  flex: 1;
  overflow: scroll;
}
</style>

<script>
import { ElNotification } from 'element-plus'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      collapseFlag: false
    }
  },
  computed: {
    ...mapState(['permissions', 'userName', 'userRole']),
    menuCollapseFlagTransfer: {
      get () {
        return this.$store.state.menuCollapseFlag
      },
      set (newValue) {
        this.$store.commit({ type: 'setMenuCollapseFlag', newValue: newValue })
      }
    },
    userRoleTagType: {
      get () {
        switch (this.userRole) {
          case '患者':
            return ''
          case '医生':
            return 'success'
          case '护士':
            return 'danger'
          default:
            return 'warning'
        }
      }
    }
  },
  methods: {
    onLogOut () {
      localStorage.removeItem('token')
      ElNotification({
        title: '账号注销成功',
        message: '退出登录',
        position: 'bottom-right',
        type: 'success'
      })
      this.$router.push({ name: 'login' })
    }
  },
  mounted () {
    if (this.$store.state.permissions === '') {
      this.$store.commit('getPermissions', this)
    }
    if (this.$store.state.userName === '' || this.$store.state.userRole === '') {
      this.$store.commit('getUserData', this)
    }
  }
}
</script>
