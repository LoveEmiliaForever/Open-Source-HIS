<template>
  <BasicFrame>
    <div class="contents" id="patientHome">
      <el-carousel trigger="click">
        <el-carousel-item>
          <el-icon><Place /></el-icon>
          <div class="function-description">
            <h2>预约挂号功能</h2>
            <p>1：选择你想要挂号的科室与医生</p>
            <p>2：选择该医生的空闲时间段</p>
            <p>3：点击预约挂号</p>
          </div>
        </el-carousel-item>
        <el-carousel-item>
          <el-icon><Files /></el-icon>
          <div class="function-description">
            <h2>病历查看功能</h2>
            <p>1：查看自己的病历记录</p>
            <p>2：查看自己的住院记录</p>
          </div>
        </el-carousel-item>
        <el-carousel-item>
          <el-icon><Reading /></el-icon>
          <div class="function-description">
            <h2>开支查看功能</h2>
            <p>1：查看所有的开支</p>
          </div>
        </el-carousel-item>
        <el-carousel-item>
          <el-icon><User /></el-icon>
          <div class="function-description">
            <h2>个人信息管理功能</h2>
            <p>1：查看修改个人信息</p>
          </div>
        </el-carousel-item>
      </el-carousel>
      <a class="function-link" title="预约挂号" href="/#/patient/register">
        <el-icon><Place /></el-icon>
        <p>预约挂号</p>
      </a>
      <a class="function-link" title="病历查看" href="/#/patient/medical-record">
        <el-icon><Files /></el-icon>
        <p>病历查看</p>
      </a>
      <a class="function-link" title="开支查看" href="/#/patient/financial">
        <el-icon><Reading /></el-icon>
        <p>开支查看</p>
      </a>
      <a class="function-link" title="个人信息" href="/#/patient/single-information">
        <el-icon><User /></el-icon>
        <p>个人信息</p>
      </a>
      <!--挂号信息展示-->
      <div class="register-infor">
        <el-table v-if="registerInfor" :data="registerInfor" border>
          <el-table-column prop="doctor" label="挂号医生">
          </el-table-column>
          <el-table-column prop="department" label="看诊部门">
          </el-table-column>
          <el-table-column prop="startDate" label="开始时间" sortable>
          </el-table-column>
          <el-table-column prop="endDate" label="结束时间" sortable>
          </el-table-column>
        </el-table>
      </div>
      <!--应缴信息展示-->
      <div class="financial-infor">
        <el-table v-if="financialInfor" :data="financialInfor" border>
          <el-table-column prop="itemName" label="缴费项目">
          </el-table-column>
          <el-table-column prop="itemMoney" label="应缴金额">
          </el-table-column>
        </el-table>
      </div>
    </div>
  </BasicFrame>
</template>

<style>
#patientHome{
  padding: 1rem;
  display: grid;
  grid-template-columns:  repeat(4, 1fr);
  grid-template-rows: repeat(5, 1fr);
  gap: 1rem;
}
#patientHome .el-carousel{
  grid-column: 1/5;
  grid-row: 1/3;
}
#patientHome .el-carousel .el-carousel__container{
  width: 100%;
  height: 100%;
}
#patientHome .el-carousel .el-carousel__item{
  display: grid;
  grid-template-columns:  repeat(3, 1fr);
  grid-template-rows: repeat(1, 1fr);
  gap: 1rem;
  border-radius: 1rem;
}
#patientHome .el-carousel .el-carousel__item:nth-of-type(1){
  background-color: #ecf5ff;
}
#patientHome .el-carousel .el-carousel__item:nth-of-type(2){
  background-color: #f0f9eb;
}
#patientHome .el-carousel .el-carousel__item:nth-of-type(3){
  background-color: #fdf6ec;
}
#patientHome .el-carousel .el-carousel__item:nth-of-type(4){
  background-color: #fef0f0;
}
#patientHome .el-carousel .el-carousel__item .el-icon{
  grid-column: 1;
  grid-row: 1;
  align-self: center;
  justify-self: center;
  width: 80%;
  height: 80%;
  border: 1px solid rgba(0, 0, 0, 0.107);
  background-color: white;
  border-radius: 1rem;
}
#patientHome .el-carousel .el-carousel__item .el-icon svg{
  width: 50%;
  height: 50%;
}
#patientHome .el-carousel .el-carousel__item .function-description{
  grid-column: 2/4;
  grid-row: 1;
  padding-left: 3rem;
}
#patientHome .function-description h2{
  font-size: 2.5rem;
  line-height: 6rem;
}
#patientHome .function-description p{
  text-indent: 2rem;
  font-size: 1.5rem;
  line-height: 2.5rem;
}
#patientHome a:link,#patientHome a:visited{
  text-decoration: none;
  color: black;
}
#patientHome a:hover{
  color: #337ecc;
}
#patientHome a:active{
  color: #79bbff;
}
#patientHome .function-link{
  grid-row: 3;
  display: grid;
  align-self: center;
  justify-self: center;
  grid-template-columns:  repeat(1, 1fr);
  grid-template-rows: 1fr auto;
  align-items: center;
  justify-items: center;
}
#patientHome .function-link .el-icon{
  grid-column: 1;
  grid-row: 1;
  width: 5vw;
  height: 5vw;
  border: 1px solid rgba(0, 0, 0, 0.107);
  background-color: white;
  border-radius: 30rem;
}
#patientHome .function-link .el-icon svg{
  width: 50%;
  height: 50%;
}
#patientHome .function-link p{
  grid-column: 1;
  grid-row: 2;
  line-height: 2rem;
}
#patientHome .register-infor{
  grid-column: 1/3;
  grid-row: 4/6;
  border: 1px solid rgba(0, 0, 0, 0.107);
  border-radius: 1rem;
  overflow: scroll;
}
#patientHome .financial-infor{
  grid-column: 3/5;
  grid-row: 4/6;
  border: 1px solid rgba(0, 0, 0, 0.107);
  border-radius: 1rem;
  overflow: scroll;
}
</style>

<script>
import axios from 'axios'
import BasicFrame from '@/components/basicFrame.vue'
import { mapState } from 'vuex'

export default {
  name: 'patientHomeView',
  components: {
    BasicFrame
  },
  data () {
    return {
      registerInfor: false,
      registerInforAPI: '/patient/home/registerInfor',
      financialInfor: false,
      financialInforAPI: '/patient/home/financialInfor'
    }
  },
  computed: mapState(['childrenPermissions']),
  methods: {
    async getRegisterInfor () {
      await axios.get(this.registerInforAPI, {
        params: {
          token: localStorage.getItem('token')
        }
      }).then((result) => {
        this.registerInfor = result.data
      }).catch((result) => { this.$store.state.errorReport(result) })
    },
    async getFinancialInfor () {
      await axios.get(this.financialInforAPI, {
        params: {
          token: localStorage.getItem('token')
        }
      }).then((result) => {
        this.financialInfor = result.data
      }).catch((result) => { this.$store.state.errorReport(result) })
    }
  },
  async beforeMount () {
    await this.getRegisterInfor()
    await this.getFinancialInfor()
  }
}
</script>
