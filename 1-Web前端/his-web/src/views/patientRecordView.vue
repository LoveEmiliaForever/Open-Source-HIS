<template>
  <BasicFrame>
    <div id="patientRecord" class="contents">
      <el-tabs>
        <el-tab-pane label="病历信息">
          <el-table :data="recordInfor" border>
            <el-table-column type="expand">
              <template #default="props">
                <table border class="record-table table">
                  <tr class="table-header">
                    <td>病人名字</td>
                    <td>治疗医生</td>
                    <td>病历创建时间</td>
                    <td>就诊时间</td>
                  </tr>
                  <tr>
                    <td>{{ props.row.patientName }}</td>
                    <td>{{ props.row.treatingDoctor }}</td>
                    <td>{{ props.row.recordCreatedDate }}</td>
                    <td>{{ props.row.visitDate }}</td>
                  </tr>
                  <tr class="table-header">
                    <td>身高/cm</td>
                    <td>体温/°C</td>
                    <td>收缩压/mmHg</td>
                    <td>发病时间</td>
                  </tr>
                  <tr>
                    <td>{{ props.row.tall }}</td>
                    <td>{{ props.row.temperature }}</td>
                    <td>{{ props.row.systolicBloodPressure }}</td>
                    <td rowspan="3">{{ props.row.onsetTime }}</td>
                  </tr>
                  <tr class="table-header">
                    <td>体重/kg</td>
                    <td>脉率/次每分钟</td>
                    <td>舒张压/mmHg</td>
                  </tr>
                  <tr>
                    <td>{{ props.row.weight }}</td>
                    <td>{{ props.row.pulseRate }}</td>
                    <td>{{ props.row.diastolicBloodPressure }}</td>
                  </tr>
                  <tr class="table-header">
                    <td colspan="4">既往史</td>
                  </tr>
                  <tr class="table-big-td">
                    <td colspan="4">{{ props.row.PH }}</td>
                  </tr>
                  <tr class="table-header">
                    <td colspan="4">现病史</td>
                  </tr>
                  <tr class="table-big-td">
                    <td colspan="4">{{ props.row.HPI }}</td>
                  </tr>
                  <tr class="table-header">
                    <td colspan="4">主诉</td>
                  </tr>
                  <tr class="table-big-td">
                    <td colspan="4">{{ props.row.chiefComplaint }}</td>
                  </tr>
                  <tr class="table-header">
                    <td colspan="4">诊断</td>
                  </tr>
                  <tr class="table-big-td">
                    <td colspan="4">{{ props.row.diagnosis }}</td>
                  </tr>
                  <tr class="table-header">
                    <td colspan="4">医嘱</td>
                  </tr>
                  <tr class="table-big-td">
                    <td colspan="4">{{ props.row.doctorAdvice }}</td>
                  </tr>
                  <tr class="table-header">
                    <td colspan="4">开具处方</td>
                  </tr>
                  <tr>
                    <td colspan="4">
                      <el-table :data="props.row.prescription" border class="table-complex">
                        <el-table-column type="expand">
                          <template #default="props2">
                            <el-table :data="props2.row.prescriptionDetail" border>
                              <el-table-column prop="drugName" label="药品名">
                              </el-table-column>
                              <el-table-column prop="drugNum" label="药品数">
                              </el-table-column>
                              <el-table-column prop="drugUse" label="药品用法">
                              </el-table-column>
                              <el-table-column prop="doctorDrugAdvice" label="药品医嘱">
                              </el-table-column>
                            </el-table>
                          </template>
                        </el-table-column>
                        <el-table-column prop="prescriptionNum" label="处方名字"></el-table-column>
                      </el-table>
                    </td>
                  </tr>
                  <tr class="table-header">
                    <td colspan="4">检查结果</td>
                  </tr>
                  <tr>
                    <td colspan="4">
                      <el-table :data="props.row.checkResult" border>
                        <el-table-column type="expand">
                          <template #default>
                            <div class="check-image">
                              <img src="../assets/images/医学检查图片.webp">
                            </div>
                          </template>
                        </el-table-column>
                        <el-table-column prop="checkName" label="检查项目"></el-table-column>
                        <el-table-column prop="checkDoctor" label="检查医生"></el-table-column>
                      </el-table>
                    </td>
                  </tr>
                  <tr class="table-header">
                    <td colspan="4">留院观察</td>
                  </tr>
                  <tr>
                    <td colspan="4">
                      <el-table :data="props.row.observe" border>
                        <el-table-column type="expand">
                          <template #default="props3">
                            <p>留院观察理由：</p>
                            <p>{{ props3.row.observeReason }}</p>
                          </template>
                        </el-table-column>
                        <el-table-column prop="observeItem" label="观察项目"></el-table-column>
                        <el-table-column prop="location" label="观察地址"></el-table-column>
                      </el-table>
                    </td>
                  </tr>
                  <tr class="table-header">
                    <td colspan="4">手术记录</td>
                  </tr>
                  <tr>
                    <td colspan="4">
                      <el-table :data="props.row.operation" border>
                        <el-table-column type="expand">
                          <template #default="props4">
                            <el-table :data="props4.row.participant" border>
                              <el-table-column type="expand">
                                <template #default="props5">
                                  <p>手术报告：</p>
                                  <p>{{ props5.row.participantReport }}</p>
                                </template>
                              </el-table-column>
                              <el-table-column prop="participantName" label="参与者姓名"></el-table-column>
                              <el-table-column prop="participantJob" label="参与者职务"></el-table-column>
                            </el-table>
                            <p>手术报告：</p>
                            <p>{{ props4.row.operationReport }}</p>
                          </template>
                        </el-table-column>
                        <el-table-column prop="operationDoctor" label="主刀医生"></el-table-column>
                        <el-table-column prop="operationDescription" label="手术简介"></el-table-column>
                      </el-table>
                    </td>
                  </tr>
                </table>
              </template>
            </el-table-column>
            <el-table-column label="病人名字" prop="patientName"></el-table-column>
            <el-table-column label="就诊时间" prop="recordCreatedDate"></el-table-column>
            <el-table-column label="看病医生" prop="treatingDoctor"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="住院信息">
          <el-table :data="inpatientInfor" border>
            <el-table-column type="expand">
              <template #default="inpatientProps">
                <table border class="record-table table">
                  <tr class="table-header">
                    <td>病人名字</td>
                    <td>治疗医生</td>
                    <td>入院时间</td>
                    <td>出院时间</td>
                  </tr>
                  <tr>
                    <td>{{ inpatientProps.row.patientName }}</td>
                    <td>{{ inpatientProps.row.treatingDoctor }}</td>
                    <td>{{ inpatientProps.row.startDate }}</td>
                    <td>{{ inpatientProps.row.endDate }}</td>
                  </tr>
                  <tr class="table-header">
                    <td>楼层号</td>
                    <td>房间号</td>
                    <td colspan="2">床位号</td>
                  </tr>
                  <tr>
                    <td>{{ inpatientProps.row.floor }}</td>
                    <td>{{ inpatientProps.row.room }}</td>
                    <td colspan="2">{{ inpatientProps.row.bed }}</td>
                  </tr>
                  <tr class="table-header">
                    <td colspan="4">入院理由</td>
                  </tr>
                  <tr class="table-big-td">
                    <td colspan="4">{{ inpatientProps.row.inpatientReason }}</td>
                  </tr>
                  <tr class="table-header">
                    <td colspan="4">出院理由</td>
                  </tr>
                  <tr class="table-big-td">
                    <td colspan="4">{{ inpatientProps.row.inpatientOutReason }}</td>
                  </tr>
                </table>
              </template>
            </el-table-column>
            <el-table-column label="病人名字" prop="patientName"></el-table-column>
            <el-table-column label="入院时间" prop="startDate"></el-table-column>
            <el-table-column label="看病医生" prop="treatingDoctor"></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </BasicFrame>
</template>

<style>
#patientRecord{
  padding: 2rem;
}
#patientRecord .table{
  border-collapse: collapse;
  text-align: center;
  width: 100%;
}
#patientRecord .record-table{
  border-collapse: collapse;
  text-align: center;
  margin: 2rem 10%;
  width: 80%;
}
#patientRecord .table-header{
  font-weight: 700;
}
#patientRecord .table td{
  padding: 0.5rem;
}
#patientRecord .table-big-td td{
  padding: 3rem 0.5rem;
}
#patientRecord .table-complex td{
  padding: 0.5rem 0.5rem;
}
#patientRecord .check-image{
  width: 50%;
  margin: 0 25%;
}
#patientRecord .check-image img{
  width: 100%;
}
</style>

<script>
import axios from 'axios'
import BasicFrame from '@/components/basicFrame.vue'
import { mapState } from 'vuex'

export default {
  name: 'userView',
  components: {
    BasicFrame
  },
  data () {
    return {
      recordInfor: false,
      inpatientInfor: false,
      patientRecordInforAPI: '/patient/medical-record/patientRecordInfor',
      inpatientInforAPI: '/patient/medical-record/inpatientInfor'
    }
  },
  computed: mapState(['childrenPermissions']),
  methods: {
    async getRecordInfor () {
      await axios.get(this.patientRecordInforAPI, {
        params: {
          token: localStorage.getItem('token')
        }
      }).then((result) => {
        this.recordInfor = result.data
      }).catch((result) => { this.$store.state.errorReport(result) })
    },
    async getInpatientInfor () {
      await axios.get(this.inpatientInforAPI, {
        params: {
          token: localStorage.getItem('token')
        }
      }).then((result) => {
        this.inpatientInfor = result.data
      }).catch((result) => { this.$store.state.errorReport(result) })
    }
  },
  async beforeMount () {
    await this.getRecordInfor()
    await this.getInpatientInfor()
  }
}
</script>
