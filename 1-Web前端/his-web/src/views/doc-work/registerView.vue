<template>
  <div>
    <div v-if="!this.recordId">
      <p style="color: red;font-weight: 700;font-size: 1.2rem;">还没有创建并提交病历，先行创建并提交病历后开放此页面</p>
    </div>
    <div>
    </div>
  </div>
</template>

<style></style>

<script>
import { mapMutations, mapState } from 'vuex'
// import axios from 'axios'
// .catch((result) => { this.$store.state.errorReport(result) })

export default {
  name: 'registerView',
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
    ...mapMutations('docWork', ['setPatientId', 'setRecordId'])
  },
  async beforeMount () {}
}
</script>
