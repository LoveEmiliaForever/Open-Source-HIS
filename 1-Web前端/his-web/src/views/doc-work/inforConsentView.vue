<template>
  <el-tabs id="docWorkInforConsent">
    <el-tab-pane label="手术知情书">
      <el-button type="success" @click="printNotice('operationNotice')">打印知情同意书</el-button>
        <div class="notice">
          <h1>手术知情书</h1>
          <p class="text">我，________________（患者姓名），已经充分理解了我将要接受的手术________________（手术名称）的目的、过程、可能的风险和并发症，以及其他可能的治疗方案。我明白没有任何手术能保证完全成功，我已经有足够的机会向医生提问并讨论我的疑虑。</p>
          <p class="text">我理解手术可能会带来一些并发症，包括但不限于感染、出血、疼痛、麻醉并发症、器官损伤、术后并发症和可能的再次手术。我明白这些风险可能会对我的健康产生长期影响。</p>
          <p class="text">我同意________________（医生姓名）医生和他/她的团队进行上述手术。我明白医生会尽他/她的最大努力来预防并发症，但是不能保证手术结果。</p>
          <p class="text">我已经阅读并理解了这份免责声明，我签名表示我同意接受手术。</p>
          <p class="date">日期：{{ `${new Date().toLocaleDateString()}  ${new Date().toLocaleTimeString()}` }}</p>
          <div class="sign">
            <p class="patientSign">患者签名：</p>
            <p class="doctorSign">医生签名：</p>
          </div>
        </div>
    </el-tab-pane>
    <el-tab-pane label="用药知情书">
      <el-button type="success" @click="printNotice('drugNotice')">打印知情同意书</el-button>
      <div class="notice">
        <h1>用药知情书</h1>
        <p class="text">我，________________（患者姓名），已经充分理解了我将要使用的药品________________（药品名称）的目的、用法、可能的副作用和风险，以及其他可能的治疗方案。我明白没有任何药品能保证完全无副作用，我已经有足够的机会向医生提问并讨论我的疑虑。</p>
        <p class="text">我理解药品可能会带来一些副作用，包括但不限于过敏反应、肝肾功能损害、消化系统反应等。我明白这些风险可能会对我的健康产生长期影响。</p>
        <p class="text">我同意按照医生的建议使用上述药品。我明白医生会尽他/她的最大努力来预防副作用，但是不能保证药品效果。</p>
        <p class="text">我已经阅读并理解了这份免责声明，我签名表示我同意使用药品。</p>
        <p class="date">日期：{{ `${new Date().toLocaleDateString()}  ${new Date().toLocaleTimeString()}` }}</p>
        <div class="sign">
          <p class="patientSign">患者签名：</p>
          <p class="doctorSign">医生签名：</p>
        </div>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<style>
#docWorkInforConsent .notice{
  margin: 2rem 10%;
  width: 80%;
  display: flex;
  flex-direction: column;
}
#docWorkInforConsent h1{
  align-self: center;
  margin: 1rem 0;
}
#docWorkInforConsent .text{
  margin-left: 3%;
  margin: 1rem 3%;
  text-indent:2em;
}
#docWorkInforConsent .date{
  margin-top: 1rem;
  margin-left: 3%;
}
#docWorkInforConsent .sign{
  margin: 1rem 0;
  margin-left: 5%;
  width: 30%;
  display: flex;
  justify-content: space-between;
}
</style>

<script>
import { mapMutations, mapState } from 'vuex'
// import axios from 'axios'
// .catch((result) => { this.$store.state.errorReport(result) })

export default {
  name: 'inforConsentView',
  data () {
    return {}
  },
  computed: {
    ...mapState('docWork', ['patientId2', 'recordId2']),
    patientId: {
      get () {
        return this.patientId2
      },
      set (newValue) {
        this.setPatientId(newValue)
      }
    },
    recordId: {
      get () {
        return this.recordId2
      },
      set (newValue) {
        this.setRecordId(newValue)
      }
    }
  },
  methods: {
    ...mapMutations('docWork', ['setPatientId', 'setRecordId']),
    printNotice (routerName) {
      window.open(this.$router.resolve({ name: routerName }).href, '_blank')
    }
  },
  async beforeMount () {}
}
</script>
