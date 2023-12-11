<template>
  <BasicFrame>
    <el-tabs type="border-card" class="contents" v-if="childrenPermissions">
      <el-tab-pane label="病人信息查询" v-if="childrenPermissions.docWorkPatientInfor">
        <patientInforView></patientInforView>
      </el-tab-pane>
      <el-tab-pane label="病历书写" v-if="childrenPermissions.docWorkRecord">
        <recordView></recordView>
      </el-tab-pane>
      <el-tab-pane label="开具药品处方单" v-if="childrenPermissions.docWorkPrescription">
        <prescriptionView></prescriptionView>
      </el-tab-pane>
      <el-tab-pane label="医学检查申请" v-if="childrenPermissions.docWorkCheck">
        <checkView></checkView>
      </el-tab-pane>
      <el-tab-pane label="留院观察申请" v-if="childrenPermissions.docWorkObserve">
        <observeView></observeView>
      </el-tab-pane>
      <el-tab-pane label="住院申请" v-if="childrenPermissions.docWorkInpatient">
        <inpatientView></inpatientView>
      </el-tab-pane>
      <el-tab-pane label="手术申请" v-if="childrenPermissions.docWorkOperation">
        <operationView></operationView>
      </el-tab-pane>
      <!--
      <el-tab-pane label="复诊预约" v-if="childrenPermissions.docWorkRegister">
        <registerView></registerView>
      </el-tab-pane>-->
      <el-tab-pane label="打印知情同意书" v-if="childrenPermissions.docWorkInforConsent">
        <inforConsentView></inforConsentView>
      </el-tab-pane>
      <el-tab-pane label="手术管理" v-if="childrenPermissions.docWorkOperationManage">
        <operationManageView></operationManageView>
      </el-tab-pane>
      <el-tab-pane label="出院管理（住院部）" v-if="childrenPermissions.docWorkInpatientOut">
        <inpatientOutView></inpatientOutView>
      </el-tab-pane>
    </el-tabs>
  </BasicFrame>
</template>

<style>
</style>

<script>
import BasicFrame from '@/components/basicFrame.vue'
import checkView from './doc-work/checkView.vue'
import inforConsentView from './doc-work/inforConsentView.vue'
import inpatientView from './doc-work/inpatientView.vue'
import inpatientOutView from './doc-work/inpatientOutView.vue'
import observeView from './doc-work/observeView.vue'
import operationView from './doc-work/operationView.vue'
import operationManageView from './doc-work/operationManageView.vue'
import patientInforView from './doc-work/patientInforView.vue'
import recordView from './doc-work/recordView.vue'
// import registerView from './doc-work/registerView.vue'
import prescriptionView from './doc-work/prescriptionView.vue'
import { mapState } from 'vuex'

export default {
  name: 'userView',
  components: {
    BasicFrame,
    checkView,
    inforConsentView,
    inpatientView,
    inpatientOutView,
    observeView,
    operationView,
    operationManageView,
    patientInforView,
    recordView,
    // registerView,
    prescriptionView
  },
  computed: mapState(['childrenPermissions'])
}
</script>
