<template>
  <div id="evaluation">
    <p v-if="evaluationScore">当前评分为：<span>{{ evaluationScore }} 分</span></p>
    <p>评分细节查看：</p>
    <el-table v-if="evaluationScoreDetail" :data="evaluationScoreDetail" :row-class-name="tableRowClassName">
      <el-table-column prop="targetName" label="被评分人"></el-table-column>
      <el-table-column prop="creationDate" label="评分时间"></el-table-column>
      <el-table-column prop="scoreChange" label="评分变化"></el-table-column>
      <el-table-column prop="changeReason" label="理由"></el-table-column>
    </el-table>
  </div>
</template>

<style>
#evaluation .great-row{
  color: #529b2e;
  background-color: #f0f9eb;
}
#evaluation .bad-row{
  color: #c45656;
  background-color: #fef0f0;
}
#evaluation > p:nth-of-type(1){
  font-size: 1.4rem;
  margin-bottom: 1rem;
}
#evaluation > p:nth-of-type(1) span{
  font-weight: 700;
  color: grey;
}
#evaluation > .el-table{
  height: 65vh;
}
</style>

<script>
import axios from 'axios'
export default {
  name: 'evaluationView',
  data () {
    return {
      evaluationScore: false,
      evaluationScoreDetail: false,
      evaluationScoreAPI: '/user/evaluation/evaluationScore',
      evaluationScoreDetailAPI: '/user/evaluation/evaluationScoreDetail'
    }
  },
  methods: {
    tableRowClassName ({ row, rowIndex }) {
      if (row.scoreChange < 0) {
        return 'bad-row'
      } else {
        return 'great-row'
      }
    }
  },
  async beforeMount () {
    await axios.get(this.evaluationScoreAPI, {
      params: {
        token: localStorage.getItem('token')
      }
    }).then((result) => { this.evaluationScore = result.data.score })
      .catch((result) => { this.$store.state.errorReport(result) })
    await axios.get(this.evaluationScoreDetailAPI, {
      params: {
        token: localStorage.getItem('token')
      }
    }).then((result) => { this.evaluationScoreDetail = result.data })
      .catch((result) => { this.$store.state.errorReport(result) })
  }
}
</script>
