<template>
  <div id="subordinateEvaluation">
    <el-button type="success" @click="addScoreDialog = true">下属考评加分</el-button>
    <el-dialog v-model="addScoreDialog" title="为下属考评加分" @closed="dialogClosed">
      <el-form :model="evaluationForm" ref="evaluationForm" :rules="rules">
        <el-form-item label="被加分人：" prop="targetName">
          <el-select v-model="evaluationForm.targetName" placeholder="选择加分下属">
            <el-option v-for="(item, index) of subordinateNames" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="加分多少：" prop="scoreChange">
          <el-slider v-model="evaluationForm.scoreChange" :min="1" :max="10" show-stops show-input></el-slider>
        </el-form-item>
        <el-form-item label="加分原因：" prop="changeReason">
          <el-input v-model="evaluationForm.changeReason" type="textarea" placeholder="输入加分原因"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitNewEvaluation">提交加分</el-button>
          <el-button @click="this.$refs.evaluationForm.resetFields()">重置内容</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-button type="danger" @click="minusScoreDialog = true">下属考评减分</el-button>
    <el-dialog v-model="minusScoreDialog" title="给下属考评减分" @closed="dialogClosed">
      <el-form :model="evaluationForm" ref="evaluationForm" :rules="rules">
        <el-form-item label="被减分人：" prop="targetName">
          <el-select v-model="evaluationForm.targetName" placeholder="选择减分下属">
            <el-option v-for="(item, index) of subordinateNames" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="减分多少：" prop="scoreChange">
          <el-slider v-model="evaluationForm.scoreChange" :min="-10" :max="-1" show-stops show-input></el-slider>
        </el-form-item>
        <el-form-item label="减分原因：" prop="changeReason">
          <el-input v-model="evaluationForm.changeReason" type="textarea" placeholder="输入减分原因"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitNewEvaluation">提交减分</el-button>
          <el-button @click="this.$refs.evaluationForm.resetFields()">重置内容</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-table :data="allEvaluationInfor" :row-class-name="tableRowClassName" v-if="allEvaluationInfor">
      <el-table-column prop="targetName" label="被评分人" :filters="nameFilters" :filter-method="nameFilterMethod"></el-table-column>
      <el-table-column prop="creationDate" label="评分时间" sortable></el-table-column>
      <el-table-column prop="scoreChange" label="评分变化" sortable></el-table-column>
      <el-table-column prop="changeReason" label="理由"></el-table-column>
    </el-table>
  </div>
</template>

<style>
#subordinateEvaluation .great-row{
  color: #529b2e;
  background-color: #f0f9eb;
}
#subordinateEvaluation .bad-row{
  color: #c45656;
  background-color: #fef0f0;
}
#subordinateEvaluation .el-button{
  margin-right: 1rem
}
</style>

<script>
import axios from 'axios'
import { ElMessage } from 'element-plus'
// .catch((result) => { this.$store.state.errorReport(result) })

export default {
  name: 'evaluationView',
  data () {
    return {
      allEvaluationInfor: false,
      addScoreDialog: false,
      minusScoreDialog: false,
      evaluationForm: {
        targetName: '',
        scoreChange: '',
        changeReason: ''
      },
      rules: {
        targetName: [
          { required: true, message: '选择目标下属', trigger: 'blur' }
        ],
        scoreChange: [
          { required: true, message: '选择分数变化', trigger: 'blur' }
        ],
        changeReason: [
          { required: true, message: '输入原因', trigger: 'blur' }
        ]
      },
      allEvaluationInforAPI: '/subordinate/evaluation/allEvaluationInfor',
      evaluationInforChangeAPI: '/subordinate/evaluation/evaluationInforChange'
    }
  },
  computed: {
    subordinateNames: {
      get () {
        const temp = []
        for (const item of Object.entries(this.allEvaluationInfor)) {
          temp.push(item[1].targetName)
        }
        return [...new Set(temp)]
      }
    },
    nameFilters: {
      get () {
        const result = []
        const temp = []
        for (const item of Object.entries(this.allEvaluationInfor)) {
          temp.push(item[1].targetName)
        }
        for (const item of [...new Set(temp)]) {
          const tempObj = {}
          tempObj.text = item
          tempObj.value = item
          result.push(tempObj)
        }
        return result
      }
    }
  },
  methods: {
    tableRowClassName ({ row, rowIndex }) {
      if (row.scoreChange < 0) {
        return 'bad-row'
      } else {
        return 'great-row'
      }
    },
    dialogClosed () { this.$refs.evaluationForm.resetFields() },
    submitNewEvaluation () {
      this.$refs.evaluationForm.validate()
        .then(() => {
          axios.post(this.evaluationInforChangeAPI, {
            targetName: this.evaluationForm.targetName,
            creationDate: new Date(),
            scoreChange: this.evaluationForm.scoreChange,
            changeReason: this.evaluationForm.changeReason
          }).then(() => {
            this.addScoreDialog = false
            this.minusScoreDialog = false
            this.$refs.evaluationForm.resetFields()
            ElMessage({
              message: '提交成功',
              type: 'success'
            })
          }).catch((result) => { this.$store.state.errorReport(result) })
        })
        .catch(() => {})
    },
    nameFilterMethod (value, row) {
      return row.targetName === value
    },
    async getAllEvaluationInfor () {
      await axios.get(this.allEvaluationInforAPI, {
        params: {
          token: localStorage.getItem('token')
        }
      }).then((result) => { this.allEvaluationInfor = result.data })
        .catch((result) => { this.$store.state.errorReport(result) })
    }
  },
  async beforeMount () {
    this.getAllEvaluationInfor()
  }
}
</script>
