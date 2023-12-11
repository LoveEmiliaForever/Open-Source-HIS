<template>
  <div id="windowWorkCard">
    <div id="cardInforShower">
      <el-form :model="cardForm" ref="cardForm" :rules="cardFormRules">
        <el-form-item label="卡片ID" prop="cardID">
          <el-input v-model="cardForm.cardID" style="width: 50%;" placeholder="输入卡片ID(真实情况下通过读卡器自动输入)"></el-input>
          <el-button type="primary" @click="searchCard">查找卡片信息</el-button>
        </el-form-item>
      </el-form>
      <table border>
        <tr>
          <td>卡片ID：{{ this.cardInfor.cardID }}</td>
          <td>持有者：{{ this.cardInfor.patientName }}</td>
        </tr>
        <tr>
          <td>卡片状态：{{ this.cardInfor.cardStatus }}</td>
          <td>金额余额：{{ this.cardInfor.balance }}</td>
        </tr>
      </table>
    </div>
    <div id="cardActionShower">
      <el-button type="primary" @click="createCardDialog = true">办卡</el-button>
        <el-dialog v-model="createCardDialog" title="创建新卡片">
          <el-form :model="createForm" ref="createForm" :rules="createFormRules">
            <el-form-item label="办卡人姓名" prop="patientName">
              <el-input v-model="patientName" placeholder="输入办卡人名字"></el-input>
            </el-form-item>
            <el-form-item label="办卡人身份证号" prop="idNum">
              <el-input v-model="idNum" placeholder="输入办卡人身份证"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="createCard">立即办卡</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      <el-button type="success" @click="replaceCardDialog = true">补卡</el-button>
        <el-dialog v-model="replaceCardDialog" title="补办遗失卡片">
          <el-form :model="createForm" ref="createForm" :rules="createFormRules">
            <el-form-item label="补卡人姓名" prop="patientName">
              <el-input v-model="patientName" placeholder="输入补卡人名字"></el-input>
            </el-form-item>
            <el-form-item label="补卡人身份证号" prop="idNum">
              <el-input v-model="idNum" placeholder="输入补卡人身份证"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="success" @click="replaceCard">补办卡片</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      <el-button type="warning" @click="chargeCardDialog = true">充钱</el-button>
        <el-dialog v-model="chargeCardDialog" title="给卡片充钱" @closed="chargeCardDialogClosed">
          <el-form :model="chargeForm" ref="chargeForm" :rules="chargeFormRules">
            <el-form-item label="卡片ID" prop="cardID">
              <el-input v-model="cardForm.cardID" placeholder="输入充钱卡片ID"></el-input>
            </el-form-item>
            <el-form-item label="充钱金额" prop="money">
              <el-slider v-model="chargeForm.money" placeholder="输入金额大小" :min="0" :max="5000" :step="0.01" show-input></el-slider>
            </el-form-item>
            <el-form-item>
              <el-button type="warning" @click="chargeCard">确认充钱</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      <el-button type="danger" @click="destroyCardDialog = true">销卡</el-button>
        <el-dialog v-model="destroyCardDialog" title="注销卡片" @closed="destroyCardDialog">
          <p>确定要注销cardID为{{ cardForm.cardID }} 的卡片吗？</p>
          <p style="margin-bottom: 1rem;">这样会让卡片失效，且卡内余额也将冻结</p>
          <el-button type="danger" @click="destroyCard">确认</el-button>
          <el-button @click="destroyCardDialog = false">取消</el-button>
        </el-dialog>
    </div>
  </div>
</template>

<style>
#windowWorkCard{
  display: flex;
  justify-content: space-around;
}
#cardInforShower{
  width: 75%;
  margin-top: 3%;
}
#cardInforShower .el-button{
  margin-left: 2rem;
}
#cardInforShower table{
  margin-top: 5%;
  margin-left: 5%;
  width: 60%;
  height: 50%;
  font-size: 1.2rem;
  border-collapse: collapse;
  text-align: center;
}
#cardActionShower{
  width: 10%;
  height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
#cardActionShower > .el-button{
  font-size: 1.5rem;
  border-radius: 2rem;
  height: 10%;
}
</style>

<script>
import { mapMutations, mapState } from 'vuex'
import axios from 'axios'
import { ElMessage } from 'element-plus'
// .catch((result) => { this.$store.state.errorReport(result) })

export default {
  name: 'cardView',
  data () {
    return {
      cardForm: {
        cardID: ''
      },
      cardFormRules: {
        cardID: [
          { required: true, message: '输入卡片ID', trigger: 'blur' }
        ]
      },
      cardInfor: {
        cardID: '',
        patientName: '',
        cardStatus: '',
        balance: ''
      },
      createCardDialog: false,
      replaceCardDialog: false,
      chargeCardDialog: false,
      destroyCardDialog: false,
      createForm: {
        patientName: '',
        idNum: ''
      },
      createFormRules: {
        patientName: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        idNum: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      },
      chargeForm: {
        cardID: '',
        money: ''
      },
      chargeFormRules: {
        cardID: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        money: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      },
      cardInforAPI: '/window-work/card/cardInfor',
      createCardAPI: '/window-work/card/createCard',
      replaceCardAPI: '/window-work/card/replaceCard',
      chargeCardAPI: '/window-work/card/chargeCard',
      destroyCardAPI: '/window-work/card/destroyCard'
    }
  },
  computed: {
    ...mapState('windowWork', ['patientName2', 'idNum2']),
    patientName: {
      get () {
        return this.patientName2
      },
      set (newValue) {
        this.setPatientName(newValue)
      }
    },
    idNum: {
      get () {
        return this.idNum2
      },
      set (newValue) {
        this.setIdNum(newValue)
      }
    }
  },
  methods: {
    ...mapMutations('windowWork', ['setPatientName', 'setIdNum']),
    searchCard () {
      this.$refs.cardForm.validate()
        .then(() => {
          axios.get(this.cardInforAPI, {
            params: {
              token: localStorage.getItem('token'),
              cardID: this.cardForm.cardID
            }
          }).then((result) => {
            this.cardInfor.cardID = this.cardForm.cardID
            this.cardInfor.patientName = result.data.patientName
            this.cardInfor.cardStatus = result.data.cardStatus
            this.cardInfor.balance = result.data.balance
          }).catch((result) => { this.$store.state.errorReport(result) })
        }).catch(() => {})
    },
    createCard () {
      this.createForm.patientName = this.patientName
      this.createForm.idNum = this.idNum
      this.$refs.createForm.validate()
        .then(() => {
          axios.post(this.createCardAPI, {
            patientName: this.createForm.patientName,
            idNum: this.createForm.idNum
          }).then((result) => {
            alert(`刚刚创建的卡片ID为：${result.data.cardID}`)
            this.createCardDialog = false
          }).catch((result) => { this.$store.state.errorReport(result) })
        })
        .catch(() => {})
    },
    replaceCard () {
      this.createForm.patientName = this.patientName
      this.createForm.idNum = this.idNum
      this.$refs.createForm.validate()
        .then(() => {
          axios.post(this.replaceCardAPI, {
            patientName: this.createForm.patientName,
            idNum: this.createForm.idNum
          }).then((result) => {
            alert(`补办的卡片ID为：${result.data.cardID}`)
            this.replaceCardDialog = false
          }).catch((result) => { this.$store.state.errorReport(result) })
        })
        .catch(() => {})
    },
    chargeCard () {
      this.chargeForm.cardID = this.cardForm.cardID
      this.$refs.chargeForm.validate()
        .then(() => {
          axios.post(this.chargeCardAPI, {
            cardID: this.chargeForm.cardID,
            money: this.chargeForm.money
          }).then((result) => {
            ElMessage({
              type: 'success',
              message: '充钱成功'
            })
            this.chargeCardDialog = false
            this.searchCard()
          }).catch((result) => { this.$store.state.errorReport(result) })
        })
        .catch(() => {})
    },
    destroyCard () {
      axios.post(this.destroyCardAPI, {
        cardID: this.cardForm.cardID
      }).then(() => {
        ElMessage({
          type: 'success',
          message: '已成功注销卡片'
        })
        this.destroyCardDialog = false
      }).catch((result) => { this.$store.state.errorReport(result) })
    }
  }
}
</script>
