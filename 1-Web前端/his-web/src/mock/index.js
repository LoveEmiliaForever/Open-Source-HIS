import Mock from 'mockjs'

function pass (params) {
  return params
}

function getFormatDate (date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

const rootURL = 'http://localhost:8080'

// '/login'的接口------------------------------------------------------------------------------------------------------------------------------------------------------
Mock.mock(/\/login\/token\?.*/, 'get', (options) => {
  const params = new URLSearchParams(new URL(options.url, rootURL).search)
  const userNum = params.get('userNum')
  const passWord = params.get('passWord')
  if (userNum === '1' && passWord === '1') {
    return {
      status: 200,
      message: '登陆成功',
      token: 'correct'
    }
  } else {
    return {
      status: 403,
      message: '登陆失败',
      error: '账号或密码错误，请重新登陆'
    }
  }
})
Mock.mock(/\/login\?.*/, 'get', (options) => {
  const params = new URLSearchParams(new URL(options.url, rootURL).search)
  const token = params.get('token')
  if (token === 'correct') {
    return {
      userAttendance: true,
      userVocationApply: true,
      userEvaluation: true,
      userWorkTime: true,
      userDataShow: true,
      subordinateAttendance: true,
      subordinateVocationApply: true,
      subordinateComplaint: true,
      subordinateEvaluation: true,
      subordinateWorkTime: true,
      windowWorkRegister: true,
      windowWorkCard: true,
      windowWorkPatientInformation: true,
      windowWorkCollection: true,
      docWorkPatientInfor: true,
      docWorkRecord: true,
      docWorkCheck: true,
      docWorkObserve: true,
      docWorkInpatient: true,
      docWorkOperation: true,
      docWorkRegister: true,
      docWorkInforConsent: true,
      docWorkOperationManage: true,
      docWorkInpatientOut: true,
      docWorkPrescription: true,
      bedManageBedInfor: true,
      bedManageBedExchange: true,
      nurseWorkOperationManage: true,
      nurseWorkBedManage: true,
      nurseWorkInpatientOut: true,
      nurseWorkInjection: true,
      operationRoomManageRoom: true,
      operationRoomManageApply: true,
      drugWarehouseWorkDrugManage: true,
      drugWarehouseWorkDrugApply: true
    }
  } else {
    return {
      status: 403,
      message: 'token错误'
    }
  }
})

// '/sign-up'的接口------------------------------------------------------------------------------------------------------------------------------------------------------
Mock.mock('/sign-up/register', 'post', (options) => {
  options.body = JSON.parse(options.body)
  console.log(`patientName: ${options.body.patientName},
patientGender: ${options.body.patientGender},
patientIdNum: ${options.body.patientIdNum},
patientBirth: ${options.body.patientBirth},
patientPhoneNum: ${options.body.patientPhoneNum}`)
  if (options.body.patientIdNum !== 'Duplicate name') {
    return {
      status: 200,
      message: '注册成功'
    }
  } else {
    return {
      status: 403,
      message: '注册失败',
      error: '身份证号与他人重复'
    }
  }
})

// '/permissions'的接口------------------------------------------------------------------------------------------------------------------------------------------------------
Mock.mock(/\/permissions\?.*/, 'get', (options) => {
  const params = new URLSearchParams(new URL(options.url, rootURL).search)
  const token = params.get('token')
  if (token === 'correct') {
    // status: 200, message: 'token正确'
    return {
      // 主页: '/home',
      个人页面: '/user',
      下属管理: '/subordinate',
      // 教学系统: '/education',
      // 物资系统: '/material',
      // 财务系统: '/finance',
      // 通知: '/message',
      窗口工作台: '/window-work',
      医生工作台: '/doc-work',
      总床位管理: '/bed-management',
      护士工作台: '/nurse-work',
      手术室管理: '/operation-room-manage',
      检查医生工作台: '/technician-doc-work',
      药库工作台: '/drug-warehouse-work',
      药房工作台: '/drug-room-work', /*
      物资总管工作台: '/material-manager-work',
      物资管理工作台: '/material-management-work',
      物资事务工作台: '/material-affair-work',
      财务审计工作台: '/financial-audit-work',
      财务付款工作台: '/financial-payment-work',
      财务收款工作台: '/financial-collection-work',
      人事管理工作台: '/personnel-work',
      教学管理工作台: '/education-work',
      信息部主管工作台: '/information-management-work',
      // 科研管理（较独立）'/research'
      院方科研管理: '/research/research-management',
      临床试验管理: '/research/experiment-management',
      科方课题管理: '/research/project-management',
      科研参与人: '/research/participants',
      // 患者系统（较独立）'/patient' */
      患者主页: '/patient/home',
      预约挂号: '/patient/register',
      查看病历: '/patient/medical-record',
      查看开支: '/patient/financial',
      个人信息: '/patient/single-information'
      // 数据可视化: '/patient/data-show'
    }
  } else {
    return {
      status: 403,
      message: 'token错误'
    }
  }
})

Mock.mock(/\/permissions\/user-data\?.*/, 'get', (options) => {
  const params = new URLSearchParams(new URL(options.url, rootURL).search)
  const token = params.get('token')
  if (token === 'correct') {
    return {
      status: 200,
      message: 'token正确',
      userName: '秦始皇:嬴政',
      userRole: '秦朝皇帝'
    }
  } else {
    return {
      status: 403,
      message: 'token错误'
    }
  }
})

// '/user/attendance'的接口------------------------------------------------------------------------------------------------------------------------------------
Mock.mock(/\/user\/attendance\/attendInfor\?.*/, 'get', () => {
  const resultObj = {}
  const array1 = ['day-normal', 'day-late', 'day-absenteeism', 'day-not-data', 'day-vocation']
  for (const dayNum of Mock.Random.range(1, 32)) {
    resultObj[String(dayNum)] = {
      dayStatusClass: array1[Math.floor(Math.random() * array1.length)]
    }
  }
  return resultObj
})
Mock.mock('/user/attendance/attend', 'post', () => {
  return {
    status: 200,
    message: '打卡成功'
  }
})
Mock.mock(/\/user\/attendance\/attendInforDetail\?.*/, 'get', () => {
  const array2 = ['正常签到', '迟到', '旷工', '请假']
  return [
    {
      name: Mock.Random.cname(),
      dateTime: Mock.Random.date('yyyy年M月d日-H:m:s'),
      status: array2[Math.floor(Math.random() * array2.length)]
    }
  ]
})

// '/user/vocation-apply'的接口--------------------------------------------------------------------------------------------------------------------------------------
Mock.mock('/user/vocation-apply/submitApply', 'post', () => {
  return {
    // 提交请假申请
    status: 200
  }
})
Mock.mock(/\/user\/vocation-apply\/applyInfor\?.*/, 'get', () => {
  const tempArray = ['同意', '拒绝', '超时：系统自动拒绝', '暂未审批']
  const resultObj = {}
  for (const applyNum of Mock.Random.range(1, 10)) {
    const tempObj = {}
    tempObj.vocationRange = Mock.Random.date('yyyy-MM-dd HH:mm:ss') + ' - ' + Mock.Random.date('yyyy-MM-dd HH:mm:ss')
    tempObj.applicantReason = Mock.Random.cparagraph(1, 5)
    tempObj.grantStatus = tempArray[Math.floor(Math.random() * tempArray.length)]
    resultObj[applyNum] = tempObj
  }
  return resultObj
})

// '/user/evaluation'的接口--------------------------------------------------------------------------------------------------------------------------------------------
Mock.mock(/\/user\/evaluation\/evaluationScore\?.*/, 'get', () => {
  return { score: Mock.Random.natural(0, 100) }
})
Mock.mock(/\/user\/evaluation\/evaluationScoreDetail\?.*/, 'get', () => {
  const resultObj = []
  const name = Mock.Random.cname()
  for (const applyNum of Mock.Random.range(0, 9)) {
    const tempObj = {}
    tempObj.targetName = name
    tempObj.creationDate = Mock.Random.date('yyyy-MM-dd HH:mm:ss')
    tempObj.scoreChange = Mock.Random.integer(-10, 10)
    tempObj.changeReason = Mock.Random.csentence(5, 8)
    resultObj[applyNum] = tempObj
  }
  return resultObj
})

// '/user/work-time'的接口------------------------------------------------------------------------------------------------------------------------------------------------
Mock.mock(/\/user\/work-time\/workTimeInfor\?.*/, 'get', () => {
  const resultObj = {}
  const array1 = ['门诊', '急诊', '住院']
  const array2 = ['白天', '晚上']
  for (const dayNum of Mock.Random.range(1, 32)) {
    resultObj[String(dayNum)] = {
      workFlag: Mock.Random.boolean(),
      workDepartment: array1[Math.floor(Math.random() * array1.length)],
      workTimeRange: array2[Math.floor(Math.random() * array2.length)]
    }
  }
  return resultObj
})

// '/subordinate/attendance'的接口-----------------------------------------------------------------------------------------------------------------------------------------
Mock.mock(/\/subordinate\/attendance\/attendInforDetail\?.*/, 'get', () => {
  const array2 = ['正常签到', '迟到', '旷工', '请假']
  return [
    {
      name: Mock.Random.cname(),
      dateTime: Mock.Random.date('yyyy年M月d日-H:m:s'),
      status: array2[Math.floor(Math.random() * array2.length)]
    }
  ]
})
Mock.mock(/\/subordinate\/attendance\/staffInfor\?.*/, 'get', () => {
  const resultObj = {}
  const array1 = ['day-normal', 'day-late', 'day-absenteeism', 'day-not-data', 'day-vocation']
  const array2 = ['李斯', '赵高', '扶苏', '子婴', '蒙恬']
  for (const times of Mock.Random.range(0, 5)) {
    const tempObj = {}
    for (const dayNum of Mock.Random.range(1, 32)) {
      tempObj[String(dayNum)] = {
        dayStatusClass: array1[Math.floor(Math.random() * array1.length)]
      }
    }
    resultObj[array2[times]] = tempObj
  }
  return resultObj
})

// '/subordinate/vocation-apply'的接口-----------------------------------------------------------------------------------------------------------------------------------------
Mock.mock(/\/subordinate\/vocation-apply\/vocationApplyInfor\?.*/, 'get', () => {
  const resultArray = []
  const applicantName = ['李斯', '赵高', '扶苏', '子婴', '蒙恬']
  const applyStatus = ['同意', '拒绝', '超时：系统自动拒绝', '待审批']
  for (const num of Mock.Random.range(1, 10)) {
    pass(num)
    const tempObj = {}
    tempObj.applyTime = Mock.Random.date('yyyy-MM-dd HH:mm:ss')
    tempObj.applicantName = applicantName[Math.floor(Math.random() * applicantName.length)]
    tempObj.vocationRange = Mock.Random.date('yyyy-MM-dd HH:mm:ss') + ' - ' + Mock.Random.date('yyyy-MM-dd HH:mm:ss')
    tempObj.applicantReason = Mock.Random.cparagraph(1, 5)
    tempObj.grantStatus = applyStatus[Math.floor(Math.random() * applyStatus.length)]
    resultArray.push(tempObj)
  }
  return resultArray
})
Mock.mock('/subordinate/vocation-apply/applyInforChange', 'post', () => {
  return {
    status: 200
  }
})

// '/subordinate/complaint'的接口---------------------------------------------------------------------------------------------------------------------------------------------
Mock.mock(/\/subordinate\/complaint\/complaintInfor\?.*/, 'get', () => {
  const resultArray = []
  const applicantName = ['李斯', '赵高', '扶苏', '子婴', '蒙恬']
  const applyStatus = ['已回复', '未回复']
  for (const num of Mock.Random.range(1, 10)) {
    pass(num)
    const tempObj = {}
    tempObj.complaintTime = Mock.Random.date('yyyy-MM-dd HH:mm:ss')
    tempObj.complaintName = applicantName[Math.floor(Math.random() * applicantName.length)]
    tempObj.complaintReason = Mock.Random.cparagraph(1, 5)
    tempObj.replyStatus = applyStatus[Math.floor(Math.random() * applyStatus.length)]
    resultArray.push(tempObj)
  }
  return resultArray
})
Mock.mock('/subordinate/complaint/complaintInforChange', 'post', () => {
  return {
    status: 200
  }
})

// '/subordinate/evaluation'的接口----------------------------------------------------------------------------------------------------------------------------------------------
Mock.mock(/\/subordinate\/evaluation\/allEvaluationInfor\?.*/, 'get', () => {
  const array2 = ['李斯', '赵高', '扶苏', '子婴', '蒙恬']
  const resultObj = []
  for (const applyNum of Mock.Random.range(0, 10)) {
    const tempObj = {}
    tempObj.targetName = array2[Math.floor(Math.random() * array2.length)]
    tempObj.creationDate = Mock.Random.date('yyyy-MM-dd HH:mm:ss')
    tempObj.scoreChange = Mock.Random.integer(-10, 10)
    tempObj.changeReason = Mock.Random.csentence(5, 8)
    resultObj[applyNum] = tempObj
  }
  return resultObj
})
Mock.mock('/subordinate/evaluation/evaluationInforChange', 'post', () => {
  return {
    status: 200
  }
})

// '/subordinate/work-time'的接口--------------------------------------------------------------------------------------------------------------------------------------------------
Mock.mock(/\/subordinate\/work-time\/staffInfor\?.*/, 'get', () => {
  const resultObj = {}
  const array2 = ['李斯', '赵高', '扶苏', '子婴', '蒙恬']
  const array1 = ['门诊', '急诊', '住院']
  const array3 = ['白天', '晚上']
  for (const times of Mock.Random.range(0, 5)) {
    const tempObj = {}
    for (const dayNum of Mock.Random.range(1, 32)) {
      tempObj[String(dayNum)] = {
        workFlag: Mock.Random.boolean(),
        workDepartment: array1[Math.floor(Math.random() * array1.length)],
        workTimeRange: array3[Math.floor(Math.random() * array3.length)]
      }
    }
    resultObj[array2[times]] = tempObj
  }
  return resultObj
})
Mock.mock('/subordinate/work-time/workTimeChange', 'post', () => {
  return {
    status: 200
  }
})

// '/window-work/register'的接口---------------------------------------------------------------------------------------------------------------------------------------------------
Mock.mock(/\/window-work\/register\/departmentInfor\?.*/, 'get', () => {
  const department = ['内科', '外科', '儿科', '妇科']
  const resultObj = {}
  for (const times of Mock.Random.range(0, 4)) {
    resultObj[times] = department[times]
  }
  return resultObj
})
Mock.mock('/window-work/register/submitRegisterInfor', 'post', () => {
  return {
    registerNum: 999
  }
})

// '/window-work/card'的接口-------------------------------------------------------------------------------------------------------------------------------------------------------
Mock.mock(/\/window-work\/card\/cardInfor\?.*/, 'get', () => {
  return {
    patientName: '西楚霸王-项羽',
    cardStatus: '在用',
    balance: Mock.Random.float(0, 5000, 2, 2)
  }
})
Mock.mock('/window-work/card/createCard', 'post', () => {
  return {
    cardID: 996996
  }
})
Mock.mock('/window-work/card/replaceCard', 'post', () => {
  return {
    cardID: 985985
  }
})
Mock.mock('/window-work/card/chargeCard', 'post', () => {
  return {
    status: 200
  }
})
Mock.mock('/window-work/card/destroyCard', 'post', () => {
  return {
    status: 200
  }
})

// '/window-work/patient-information'的接口---------------------------------------------------------------------------------------------------------------------------------
Mock.mock('/window-work/patient-information/createPatient', 'post', () => {
  return {
    status: 200
  }
})
Mock.mock(/\/window-work\/patient-information\/searchPatient\?.*/, 'get', () => {
  return {
    gender: '男',
    birth: new Date(),
    phoneNum: '1234567'
  }
})
Mock.mock('/window-work/patient-information/revisePatient', 'post', () => {
  return {
    status: 200
  }
})

// '/window-work/collection'的接口--------------------------------------------------------------------------------------------------------------------------------------------
Mock.mock(/\/window-work\/collection\/searchPatient\?.*/, 'get', () => {
  const resultObj = []
  const name = Mock.Random.cname()
  const itemNameArray = ['挂号', '检查', '手术', '住院', '留院观察', '处方单药品']
  for (const applyNum of Mock.Random.range(0, 20)) {
    const tempObj = {}
    tempObj.patientName = name
    tempObj.itemName = itemNameArray[Math.floor(Math.random() * itemNameArray.length)]
    tempObj.itemMoney = Mock.Random.float(0, 500, 2, 2)
    resultObj[applyNum] = tempObj
  }
  return resultObj
})
Mock.mock('/window-work/collection/payMoney', 'post', () => {
  return {
    status: 200
  }
})

// '/doc-work/patient-infor'的接口--------------------------------------------------------------------------------------------------------------------------------------------
Mock.mock(/\/doc-work\/patient-infor\/registerInfor\?.*/, 'get', () => {
  return {
    patientId: 123
  }
})
Mock.mock(/\/doc-work\/patient-infor\/patientBasicInfor\?.*/, 'get', () => {
  return {
    name: Mock.Random.cname(),
    gender: '男',
    idNum: '440393200010109845',
    birth: `${new Date().toLocaleDateString()}  ${new Date().toLocaleTimeString()}`,
    phoneNum: '77802561285'
  }
})
Mock.mock(/\/doc-work\/patient-infor\/patientRecordInfor\?.*/, 'get', () => {
  const result = []
  for (const applyNum of Mock.Random.range(0, 3)) {
    const tempObj = {}
    tempObj.patientName = Mock.Random.cname()
    tempObj.recordCreatedDate = `${new Date().toLocaleDateString()}  ${new Date().toLocaleTimeString()}`
    tempObj.treatingDoctor = Mock.Random.cname()
    tempObj.visitDate = `${new Date().toLocaleDateString()}  ${new Date().toLocaleTimeString()}`
    tempObj.tall = Mock.Random.natural(150, 180)
    tempObj.weight = Mock.Random.natural(50, 100)
    tempObj.temperature = Mock.Random.float(36.0, 41.0, 1, 1)
    tempObj.pulseRate = Mock.Random.natural(60, 120)
    tempObj.systolicBloodPressure = Mock.Random.natural(70, 150)
    tempObj.diastolicBloodPressure = Mock.Random.natural(70, 150)
    tempObj.onsetTime = `${new Date().toLocaleDateString()}  ${new Date().toLocaleTimeString()}`
    tempObj.PH = Mock.Random.cparagraph(3, 7)
    tempObj.HPI = Mock.Random.cparagraph(3, 7)
    tempObj.chiefComplaint = Mock.Random.cparagraph(3, 10)
    tempObj.diagnosis = Mock.Random.cparagraph(3, 5)
    tempObj.doctorAdvice = Mock.Random.cparagraph(3, 5)

    const prescriptionResult = []
    for (const prescriptionNum of Mock.Random.range(0, 3)) {
      const tempObj2 = {}
      tempObj2.prescriptionNum = `处方单${prescriptionNum + 1}`
      const prescriptionDetail = []
      for (const prescriptionDetailNum of Mock.Random.range(0, 5)) {
        const tempObj3 = {}
        const useArray = ['口服', '外敷', '注射']
        tempObj3.drugName = Mock.Random.cword(4, 7)
        tempObj3.drugNum = Mock.Random.natural(1, 5)
        tempObj3.drugUse = useArray[Math.floor(Math.random() * useArray.length)]
        tempObj3.doctorDrugAdvice = Mock.Random.cparagraph(1, 1)
        prescriptionDetail[prescriptionDetailNum] = tempObj3
      }
      tempObj2.prescriptionDetail = prescriptionDetail
      prescriptionResult[prescriptionNum] = tempObj2
    }
    tempObj.prescription = prescriptionResult

    const checkResult = []
    for (const checkNum of Mock.Random.range(0, 3)) {
      const tempObj4 = {}
      tempObj4.checkName = Mock.Random.cword(7, 7)
      tempObj4.checkDoctor = Mock.Random.cname()
      checkResult[checkNum] = tempObj4
    }
    tempObj.checkResult = checkResult

    const observe = []
    for (const observeNum of Mock.Random.range(0, 3)) {
      const tempObj5 = {}
      tempObj5.observeItem = new Array(3).fill(Mock.Random.cword(2, 2))
      tempObj5.location = `${Mock.Random.natural(1, 5)}楼-${Mock.Random.natural(1, 10)}房-${Mock.Random.natural(1, 4)}床`
      tempObj5.observeReason = Mock.Random.cparagraph(1, 1)
      observe[observeNum] = tempObj5
    }
    tempObj.observe = observe

    const operation = []
    for (const operationNum of Mock.Random.range(0, 3)) {
      const tempObj6 = {}
      tempObj6.operationDoctor = Mock.Random.cname()
      tempObj6.operationDescription = Mock.Random.cparagraph(1, 1)
      tempObj6.operationReport = Mock.Random.cparagraph(5, 10)
      tempObj6.participant = []
      for (const participantNum of Mock.Random.range(0, 3)) {
        const tempObj7 = {}
        tempObj7.participantName = Mock.Random.cname()
        tempObj7.participantJob = Mock.Random.cword(4, 4)
        tempObj7.participantReport = Mock.Random.cparagraph(5, 10)
        tempObj6.participant[participantNum] = tempObj7
      }
      operation[operationNum] = tempObj6
    }
    tempObj.operation = operation

    result[applyNum] = tempObj
  }
  return result
})
Mock.mock(/\/doc-work\/patient-infor\/inpatientInfor\?.*/, 'get', () => {
  const result = []
  for (const applyNum of Mock.Random.range(0, 3)) {
    const tempObj = {}
    tempObj.patientName = Mock.Random.cname()
    tempObj.startDate = `${new Date().toLocaleDateString()}  ${new Date().toLocaleTimeString()}`
    tempObj.treatingDoctor = Mock.Random.cname()
    tempObj.endDate = `${new Date().toLocaleDateString()}  ${new Date().toLocaleTimeString()}`
    tempObj.floor = Mock.Random.natural(1, 5)
    tempObj.room = Mock.Random.natural(1, 10)
    tempObj.bed = Mock.Random.natural(1, 4)
    tempObj.inpatientReason = Mock.Random.cparagraph(3, 7)
    tempObj.inpatientOutReason = Mock.Random.cparagraph(3, 7)
    result[applyNum] = tempObj
  }
  return result
})

// '/doc-work/record'的接口---------------------------------------------------------------------------------------------------------------------------------------------------
Mock.mock('/doc-work/record/setRecordInfor', 'post', () => {
  return {
    recordId: 1
  }
})

// '/doc-work/prescription'的接口---------------------------------------------------------------------------------------------------------------------------------------------
Mock.mock(/\/doc-work\/prescription\/prescriptionInfor\?.*/, 'get', () => {
  const prescriptionResult = []
  for (const prescriptionNum of Mock.Random.range(0, 3)) {
    const tempObj2 = {}
    tempObj2.prescriptionNum = `处方单${prescriptionNum + 1}`
    const prescriptionDetail = []
    for (const prescriptionDetailNum of Mock.Random.range(0, 5)) {
      const tempObj3 = {}
      const useArray = ['口服', '外敷', '注射']
      tempObj3.drugName = Mock.Random.cword(4, 7)
      tempObj3.drugNum = Mock.Random.natural(1, 5)
      tempObj3.drugUse = useArray[Math.floor(Math.random() * useArray.length)]
      tempObj3.doctorDrugAdvice = Mock.Random.cparagraph(1, 1)
      prescriptionDetail[prescriptionDetailNum] = tempObj3
    }
    tempObj2.prescriptionDetail = prescriptionDetail
    prescriptionResult[prescriptionNum] = tempObj2
  }
  return prescriptionResult
})
Mock.mock('/doc-work/prescription/addPrescriptionInfor', 'post', () => {
  return {
  }
})
Mock.mock(/\/doc-work\/prescription\/drugNameInfor\?.*/, 'get', () => {
  return ['感冒药', '退烧药', '抗病毒', '抗生素']
})

// '/doc-work/check'的接口---------------------------------------------------------------------------------------------------------------------------------------------
Mock.mock(/\/doc-work\/check\/checkResult\?.*/, 'get', () => {
  const checkResult = []
  for (const checkNum of Mock.Random.range(0, 3)) {
    const tempObj4 = {}
    tempObj4.checkName = Mock.Random.cword(7, 7)
    tempObj4.checkDoctor = Mock.Random.cname()
    checkResult[checkNum] = tempObj4
  }
  return checkResult
})
Mock.mock('/doc-work/check/addCheckItem', 'post', () => {
  return {
  }
})
Mock.mock(/\/doc-work\/check\/checkItemInfor\?.*/, 'get', () => {
  return ['拍X光片', '做穿刺', '血常规', '尿检']
})

// '/doc-work/observe'的接口---------------------------------------------------------------------------------------------------------------------------------------------
Mock.mock(/\/doc-work\/observe\/observe\?.*/, 'get', () => {
  const observe = []
  for (const observeNum of Mock.Random.range(0, 3)) {
    const tempObj5 = {}
    tempObj5.observeItem = new Array(3).fill(Mock.Random.cword(2, 2))
    tempObj5.location = `${Mock.Random.natural(1, 5)}楼-${Mock.Random.natural(1, 10)}房-${Mock.Random.natural(1, 4)}床`
    tempObj5.observeReason = Mock.Random.cparagraph(1, 1)
    observe[observeNum] = tempObj5
  }
  return observe
})
Mock.mock('/doc-work/observe/addObserve', 'post', () => {
  return {
  }
})

// '/doc-work/operation'的接口---------------------------------------------------------------------------------------------------------------------------------------------
Mock.mock(/\/doc-work\/operation\/operation\?.*/, 'get', () => {
  const operation = []
  for (const operationNum of Mock.Random.range(0, 3)) {
    const tempObj6 = {}
    tempObj6.operationDoctor = Mock.Random.cname()
    tempObj6.operationDescription = Mock.Random.cparagraph(1, 1)
    tempObj6.operationReport = Mock.Random.cparagraph(5, 10)
    tempObj6.participant = []
    for (const participantNum of Mock.Random.range(0, 3)) {
      const tempObj7 = {}
      tempObj7.participantName = Mock.Random.cname()
      tempObj7.participantJob = Mock.Random.cword(4, 4)
      tempObj7.participantReport = Mock.Random.cparagraph(5, 10)
      tempObj6.participant[participantNum] = tempObj7
    }
    operation[operationNum] = tempObj6
  }
  return operation
})
Mock.mock(/\/doc-work\/operation\/staffInfor\?.*/, 'get', () => {
  return [
    {
      name: '徐福',
      job: '医生'
    },
    {
      name: '长桑君',
      job: '医生'
    },
    {
      name: '李豹',
      job: '护士'
    },
    {
      name: '子阳',
      job: '护士'
    }
  ]
})
Mock.mock('/doc-work/operation/addOperation', 'post', () => {
  return {
  }
})

// '/doc-work/inpatient'的接口---------------------------------------------------------------------------------------------------------------------------------------------
Mock.mock(/\/doc-work\/inpatient\/inpatientFlag\?.*/, 'get', () => {
  return {
    inpatientFlag: false
  }
})
Mock.mock(/\/doc-work\/inpatient\/inpatientInfor\?.*/, 'get', () => {
  const tempObj = {}
  tempObj.patientName = Mock.Random.cname()
  tempObj.startDate = `${new Date().toLocaleDateString()}  ${new Date().toLocaleTimeString()}`
  tempObj.treatingDoctor = Mock.Random.cname()
  tempObj.endDate = `${new Date().toLocaleDateString()}  ${new Date().toLocaleTimeString()}`
  tempObj.floor = Mock.Random.natural(1, 5)
  tempObj.room = Mock.Random.natural(1, 10)
  tempObj.bed = Mock.Random.natural(1, 4)
  tempObj.inpatientReason = Mock.Random.cparagraph(3, 7)
  tempObj.inpatientOutReason = Mock.Random.cparagraph(3, 7)
  return tempObj
})
Mock.mock('/doc-work/inpatient/inpatientInforSubmit', 'post', () => {
  return {
  }
})

// '/doc-work/inpatient-out'的接口---------------------------------------------------------------------------------------------------------------------------------------------
Mock.mock(/\/doc-work\/inpatient-out\/inpatientInfor\?.*/, 'get', () => {
  const resultObj = []
  for (const applyNum of Mock.Random.range(0, 9)) {
    const tempObj = {}
    tempObj.patientName = Mock.Random.cname()
    tempObj.startDate = Mock.Random.date('yyyy-MM-dd HH:mm:ss')
    tempObj.patientId = Mock.Random.integer(1, 100)
    resultObj[applyNum] = tempObj
  }
  return resultObj
})
Mock.mock('/doc-work/inpatient-out/inpatientInforChange', 'post', () => {
  return {
  }
})

// '/doc-work/operation-manage'的接口---------------------------------------------------------------------------------------------------------------------------------------------
Mock.mock(/\/doc-work\/operation-manage\/operationInfor\?.*/, 'get', () => {
  const resultObj = []
  const jobArray = ['主刀', '辅助医生', '护士']
  for (const applyNum of Mock.Random.range(0, 9)) {
    const tempObj = {}
    tempObj.patientName = Mock.Random.cname()
    tempObj.job = jobArray[Math.floor(Math.random() * jobArray.length)]
    tempObj.operationRoom = Mock.Random.integer(1, 100)
    tempObj.startDate = Mock.Random.date()
    tempObj.endDate = Mock.Random.date()
    resultObj[applyNum] = tempObj
  }
  return resultObj
})
Mock.mock('/doc-work/operation-manage/operationInforChange', 'post', () => {
  return {
  }
})

// '/bed-management'的接口-------------------------------------------------------------------------------------------------------------------------------------------------------
Mock.mock(/\/bed-management\/bedInfor\?.*/, 'get', () => {
  const resultObj = []
  const jobArray = ['使用中', '需清理', '空闲中']
  for (const applyNum of Mock.Random.range(0, 5)) {
    const rooms = []
    for (const roomNum of Mock.Random.range(0, 10)) {
      const beds = []
      for (const bedNum of Mock.Random.range(0, 4)) {
        const tempObj = {}
        tempObj.bedName = `${applyNum + 1}-${roomNum + 1}-${bedNum + 1}`
        tempObj.status = jobArray[Math.floor(Math.random() * jobArray.length)]
        tempObj.patientName = Mock.Random.cname()
        tempObj.nurse = Mock.Random.cname()
        beds[bedNum] = tempObj
      }
      rooms[roomNum] = beds
    }
    resultObj[applyNum] = rooms
  }
  return resultObj
})
Mock.mock(/\/bed-management\/ExchangeApplyInfor\?.*/, 'get', () => {
  const resultArray = []
  const applyStatus = ['同意', '拒绝', '超时：系统自动拒绝', '待审批']
  for (const num of Mock.Random.range(1, 10)) {
    pass(num)
    const tempObj = {}
    tempObj.applyTime = Mock.Random.date('yyyy-MM-dd HH:mm:ss')
    tempObj.applicantName = `${Mock.Random.natural(1, 5)}-${Mock.Random.natural(1, 10)}-${Mock.Random.natural(1, 4)}`
    tempObj.targetName = `${Mock.Random.natural(1, 5)}-${Mock.Random.natural(1, 10)}-${Mock.Random.natural(1, 4)}`
    tempObj.applicantReason = Mock.Random.cparagraph(1, 5)
    tempObj.grantStatus = applyStatus[Math.floor(Math.random() * applyStatus.length)]
    resultArray.push(tempObj)
  }
  return resultArray
})
Mock.mock('/bed-management/applyInforChange', 'post', () => {
  return {
    status: 200
  }
})

// '/nurse-work/bedManage'的接口-------------------------------------------------------------------------------------------------------------------------------------------------
Mock.mock(/\/nurse-work\/bedManage\/bedInfor\?.*/, 'get', () => {
  const resultObj = []
  const jobArray = ['未清洁', '已清洁']
  for (const bedNum of Mock.Random.range(0, 4)) {
    const tempObj = {}
    tempObj.bedName = `${Mock.Random.natural(1, 5)}-${Mock.Random.natural(1, 10)}-${Mock.Random.natural(1, 4)}`
    tempObj.patientName = Mock.Random.cname()
    tempObj.doctor = Mock.Random.cname()
    tempObj.startDate = Mock.Random.date('yyyy-MM-dd HH:mm:ss')
    tempObj.clearStatus = jobArray[Math.floor(Math.random() * jobArray.length)]
    tempObj.treatingDoctor = Mock.Random.cname()
    tempObj.floor = Mock.Random.natural(1, 5)
    tempObj.room = Mock.Random.natural(1, 10)
    tempObj.bed = Mock.Random.natural(1, 4)
    tempObj.inpatientReason = Mock.Random.cparagraph(3, 7)

    const prescriptionResult = []
    for (const prescriptionNum of Mock.Random.range(0, 3)) {
      const tempObj2 = {}
      tempObj2.prescriptionNum = `处方单${prescriptionNum + 1}`
      const prescriptionDetail = []
      for (const prescriptionDetailNum of Mock.Random.range(0, 5)) {
        const tempObj3 = {}
        const useArray = ['口服', '外敷']
        tempObj3.drugName = Mock.Random.cword(4, 7)
        tempObj3.drugNum = Mock.Random.natural(1, 5)
        tempObj3.drugUse = useArray[Math.floor(Math.random() * useArray.length)]
        tempObj3.doctorDrugAdvice = Mock.Random.cparagraph(1, 1)
        prescriptionDetail[prescriptionDetailNum] = tempObj3
      }
      tempObj2.prescriptionDetail = prescriptionDetail
      prescriptionResult[prescriptionNum] = tempObj2
    }
    tempObj.prescription = prescriptionResult

    resultObj[bedNum] = tempObj
  }
  return resultObj
})
Mock.mock('/nurse-work/bedManage/bedClear', 'post', () => {
  return {
    status: 200
  }
})
Mock.mock('/nurse-work/bedManage/exchangeBed', 'post', () => {
  return {
    status: 200
  }
})
Mock.mock(/\/nurse-work\/bedManage\/injectionInfor\?.*/, 'get', () => {
  const resultObj = []
  for (const bedNum of Mock.Random.range(0, 4)) {
    const tempObj = {}
    tempObj.bedName = `${Mock.Random.natural(1, 5)}-${Mock.Random.natural(1, 10)}-${Mock.Random.natural(1, 4)}`
    tempObj.patientName = Mock.Random.cname()
    tempObj.injectionStatus = '未注射'
    tempObj.prescriptionId = Mock.Random.natural(1, 10)

    const prescriptionDetail = []
    for (const prescriptionDetailNum of Mock.Random.range(0, 5)) {
      const tempObj3 = {}
      const useArray = ['注射']
      tempObj3.drugName = Mock.Random.cword(4, 7)
      tempObj3.drugNum = Mock.Random.natural(1, 5)
      tempObj3.drugUse = useArray[Math.floor(Math.random() * useArray.length)]
      tempObj3.doctorDrugAdvice = Mock.Random.cparagraph(1, 1)
      prescriptionDetail[prescriptionDetailNum] = tempObj3
    }
    tempObj.prescriptionDetail = prescriptionDetail

    resultObj[bedNum] = tempObj
  }
  return resultObj
})
Mock.mock('/nurse-work/bedManage/injectStatusChange', 'post', () => {
  return {
    status: 200
  }
})
Mock.mock(/\/nurse-work\/bedManage\/ExchangeApplyInfor\?.*/, 'get', () => {
  const resultArray = []
  const applyStatus = ['同意', '拒绝', '超时：系统自动拒绝', '待审批']
  for (const num of Mock.Random.range(1, 10)) {
    pass(num)
    const tempObj = {}
    tempObj.applyTime = Mock.Random.date('yyyy-MM-dd HH:mm:ss')
    tempObj.applicantName = `${Mock.Random.natural(1, 5)}-${Mock.Random.natural(1, 10)}-${Mock.Random.natural(1, 4)}`
    tempObj.targetName = `${Mock.Random.natural(1, 5)}-${Mock.Random.natural(1, 10)}-${Mock.Random.natural(1, 4)}`
    tempObj.applicantReason = Mock.Random.cparagraph(1, 5)
    tempObj.grantStatus = applyStatus[Math.floor(Math.random() * applyStatus.length)]
    resultArray.push(tempObj)
  }
  return resultArray
})

// '/nurse-work/inpatientOut'的接口---------------------------------------------------------------------------------------------------------------------------------------------
Mock.mock(/\/nurse-work\/inpatientOut\/inpatientOutInfor\?.*/, 'get', () => {
  const resultArray = []
  for (const num of Mock.Random.range(1, 10)) {
    pass(num)
    const tempObj = {}
    tempObj.bedName = `${Mock.Random.natural(1, 5)}-${Mock.Random.natural(1, 10)}-${Mock.Random.natural(1, 4)}`
    resultArray.push(tempObj)
  }
  return resultArray
})
Mock.mock('/nurse-work/inpatientOut/inpatientOutInforChange', 'post', () => {
  return {
    status: 200
  }
})

// '/nurse-work/injection'的接口---------------------------------------------------------------------------------------------------------------------------------------------
Mock.mock(/\/nurse-work\/injection\/injectionInfor\?.*/, 'get', () => {
  const resultObj = []
  for (const bedNum of Mock.Random.range(0, 4)) {
    const tempObj = {}
    tempObj.patientName = Mock.Random.cname()
    tempObj.injectionStatus = '未注射'
    tempObj.prescriptionId = Mock.Random.natural(1, 10)

    const prescriptionDetail = []
    for (const prescriptionDetailNum of Mock.Random.range(0, 5)) {
      const tempObj3 = {}
      const useArray = ['注射']
      tempObj3.drugName = Mock.Random.cword(4, 7)
      tempObj3.drugNum = Mock.Random.natural(1, 5)
      tempObj3.drugUse = useArray[Math.floor(Math.random() * useArray.length)]
      tempObj3.doctorDrugAdvice = Mock.Random.cparagraph(1, 1)
      prescriptionDetail[prescriptionDetailNum] = tempObj3
    }
    tempObj.prescriptionDetail = prescriptionDetail

    resultObj[bedNum] = tempObj
  }
  return resultObj
})
Mock.mock('/nurse-work/injection/injectStatusChange', 'post', () => {
  return {
    status: 200
  }
})

// '/nurse-work/operationManage'的接口-----------------------------------------------------------------------------------------------------------------------------------------
Mock.mock(/\/nurse-work\/operationManage\/operationInfor\?.*/, 'get', () => {
  const resultObj = []
  const jobArray = ['护士']
  for (const applyNum of Mock.Random.range(0, 9)) {
    const tempObj = {}
    tempObj.patientName = Mock.Random.cname()
    tempObj.job = jobArray[Math.floor(Math.random() * jobArray.length)]
    tempObj.operationRoom = Mock.Random.integer(1, 100)
    tempObj.startDate = Mock.Random.date()
    tempObj.endDate = Mock.Random.date()
    resultObj[applyNum] = tempObj
  }
  return resultObj
})
Mock.mock('/nurse-work/operationManage/operationInforChange', 'post', () => {
  return {
  }
})

// '/operation-room-manage'的接口-----------------------------------------------------------------------------------------------------------------------------------------
Mock.mock(/\/operation-room-manage\/operationRoom\?.*/, 'get', () => {
  const resultObj = {}
  const nowDate = new Date()
  const endDate = new Date()
  endDate.setDate(endDate.getDate() + 3)
  resultObj.chartStart = getFormatDate(nowDate)
  resultObj.chartEnd = getFormatDate(endDate)
  const allInfor = []
  for (const roomNum of Mock.Random.range(0, 5)) {
    const tempArray = []
    for (const applyNum of Mock.Random.range(0, 7)) {
      const tempObj = {}
      const startTime = new Date()
      const endTime = new Date()
      startTime.setDate(startTime.getDate() + applyNum)
      endTime.setDate(endTime.getDate() + applyNum + 1)
      tempObj.start = getFormatDate(startTime)
      tempObj.end = getFormatDate(endTime)
      tempObj.label = Mock.Random.cname()
      tempObj.ganttBarConfig = {
        id: `${roomNum}室-${applyNum}场手术`,
        label: Mock.Random.cname(),
        hasHandles: false,
        immobile: true,
        style: {
          borderRadius: '0.5rem',
          border: '1px solid black',
          opacity: '0.75',
          backgroundColor: '#ecf5ff'
        }
      }
      tempArray[applyNum] = tempObj
    }
    allInfor[roomNum] = tempArray
  }
  resultObj.allInfor = allInfor
  return resultObj
})
Mock.mock(/\/operation-room-manage\/operationManage\/applyInfor\?.*/, 'get', () => {
  const resultArray = []
  for (const num of Mock.Random.range(1, 5)) {
    pass(num)
    const tempObj = {}
    tempObj.tiemRange = `${getFormatDate(new Date())} 到 ${getFormatDate(new Date())}`
    tempObj.operationId = Mock.Random.natural(1, 10)
    resultArray.push(tempObj)
  }
  return resultArray
})
Mock.mock('/operation-room-manage/operationManage/applyInforChange', 'post', () => {
  return {
  }
})

// '/technician-doc-work'的接口-----------------------------------------------------------------------------------------------------------------------------------------
Mock.mock(/\/technician-doc-work\/registerInfor\?.*/, 'get', () => {
  return {
    patientId: 123,
    checkId: 123
  }
})
Mock.mock(/\/technician-doc-work\/patientBasicInfor\?.*/, 'get', () => {
  return {
    name: Mock.Random.cname(),
    gender: '男',
    idNum: '440393200010109845',
    birth: `${new Date().toLocaleDateString()}  ${new Date().toLocaleTimeString()}`,
    phoneNum: '77802561285'
  }
})
Mock.mock('/technician-doc-work/checkInforChange', 'post', () => {
  return {
  }
})

// '/drug-warehouse-work/drugManage'的接口-----------------------------------------------------------------------------------------------------------------------------------------
Mock.mock(/\/drug-warehouse-work\/drugManage\/drugInfor\?.*/, 'get', () => {
  const resultObj = []
  for (const applyNum of Mock.Random.range(0, 20)) {
    const tempObj = {}
    const drugTypeArray = ['中药', '西药']
    const appearanceArray = ['药片', '胶囊', '液体', '药膏']
    const statusArray = ['处方药', '非处方药']
    tempObj.drugName = Mock.Random.cword(2, 4)
    tempObj.drugNum = Mock.Random.natural(1, 100)
    tempObj.drugType = drugTypeArray[Math.floor(Math.random() * drugTypeArray.length)]
    tempObj.appearance = appearanceArray[Math.floor(Math.random() * appearanceArray.length)]
    tempObj.prescriptionStatus = statusArray[Math.floor(Math.random() * statusArray.length)]
    tempObj.manufactureDate = Mock.Random.date()
    tempObj.expirationDate = Mock.Random.date()
    tempObj.warehousingDate = Mock.Random.date()
    tempObj.ExWarehousingDate = Mock.Random.date()
    tempObj.drugPrice = Mock.Random.natural(1, 100)
    resultObj[applyNum] = tempObj
  }
  return resultObj
})
Mock.mock('/drug-warehouse-work/drugManage/warehousing', 'post', () => {
  return {
  }
})
Mock.mock('/drug-warehouse-work/drugManage/exWarehousing', 'post', () => {
  return {
  }
})
Mock.mock('/drug-warehouse-work/drugManage/losses', 'post', () => {
  return {
  }
})

// '/drug-warehouse-work/drugApply'的接口-----------------------------------------------------------------------------------------------------------------------------------------
Mock.mock('/drug-warehouse-work/drugApply/applyInforChange', 'post', () => {
  return {
  }
})
Mock.mock(/\/drug-warehouse-work\/drugApply\/applyInfor\?.*/, 'get', () => {
  const resultArray = []
  const applyStatus = ['同意', '拒绝', '待审批']
  for (const num of Mock.Random.range(1, 10)) {
    pass(num)
    const tempObj = {}
    tempObj.applyTime = Mock.Random.date('yyyy-MM-dd HH:mm:ss')
    tempObj.drugName = Mock.Random.cword(2)
    tempObj.drugNum = Mock.Random.natural(2, 4)
    tempObj.applicantReason = Mock.Random.cparagraph(1, 5)
    tempObj.grantStatus = applyStatus[Math.floor(Math.random() * applyStatus.length)]
    resultArray.push(tempObj)
  }
  return resultArray
})

// '/drug-room-work'的接口-----------------------------------------------------------------------------------------------------------------------------------------
Mock.mock(/\/drug-room-work\/prescription\?.*/, 'get', () => {
  const result = {}
  const genderArray = ['男', '女']
  result.patientName = Mock.Random.cname()
  result.patientGender = genderArray[Math.floor(Math.random() * genderArray.length)]
  result.prescriptionId = Mock.Random.natural(1000, 9999)

  const temp = []
  for (const num of Mock.Random.range(1, 20)) {
    pass(num)
    const tempObj = {}
    tempObj.drugName = Mock.Random.cword(2, 4)
    tempObj.drugNum = Mock.Random.natural(1, 10)
    temp.push(tempObj)
  }
  result.prescription = temp

  return result
})
Mock.mock('/drug-room-work/prescriptionChange', 'post', () => {
  return {
  }
})

// '/patient/home'的接口-----------------------------------------------------------------------------------------------------------------------------------------
Mock.mock(/\/patient\/home\/registerInfor\?.*/, 'get', () => {
  const resultObj = []
  for (const applyNum of Mock.Random.range(0, 9)) {
    const tempObj = {}
    tempObj.doctor = Mock.Random.cname()
    tempObj.department = Mock.Random.cword(2, 4)
    tempObj.startDate = Mock.Random.date()
    tempObj.endDate = Mock.Random.date()
    resultObj[applyNum] = tempObj
  }
  return resultObj
})
Mock.mock(/\/patient\/home\/financialInfor\?.*/, 'get', () => {
  const resultObj = []
  const itemNameArray = ['挂号', '检查', '手术', '住院', '留院观察', '处方单药品']
  for (const applyNum of Mock.Random.range(0, 20)) {
    const tempObj = {}
    tempObj.itemName = itemNameArray[Math.floor(Math.random() * itemNameArray.length)]
    tempObj.itemMoney = Mock.Random.float(0, 500, 2, 2)
    resultObj[applyNum] = tempObj
  }
  return resultObj
})

// '/patient/register'的接口-----------------------------------------------------------------------------------------------------------------------------------------
Mock.mock(/\/patient\/register\/registerInfor\?.*/, 'get', () => {
  const allInfor = []
  for (const day of Mock.Random.range(0, 7)) {
    const tempArray = []
    const nowDate = new Date()
    nowDate.setDate(nowDate.getDate() + day)
    const tempDate = nowDate.toLocaleDateString()
    for (const register of Mock.Random.range(0, 7)) {
      const tempObj = {}
      const startTime = new Date()
      const endTime = new Date()
      startTime.setHours(startTime.getHours() + register)
      endTime.setHours(endTime.getHours() + register + 1)
      tempObj.date = tempDate
      tempObj.start = getFormatDate(startTime)
      tempObj.end = getFormatDate(endTime)
      tempObj.label = '已被预约'
      tempObj.ganttBarConfig = {
        id: `${day}-${register}`,
        label: '已被预约',
        hasHandles: false,
        immobile: true,
        style: {
          borderRadius: '0.5rem',
          border: '1px solid black',
          opacity: '0.75',
          backgroundColor: '#ecf5ff'
        }
      }
      tempArray[register] = tempObj
    }
    const startTime = new Date()
    const endTime = new Date()
    startTime.setHours(12)
    startTime.setMinutes(0)
    endTime.setHours(14)
    endTime.setMinutes(0)
    tempArray.push({
      start: getFormatDate(startTime),
      end: getFormatDate(endTime),
      label: '医生午休',
      ganttBarConfig: {
        id: `${day}-none`,
        label: '医生午休',
        hasHandles: false,
        immobile: true,
        style: {
          borderRadius: '0.5rem',
          border: '1px solid black',
          opacity: '0.75',
          backgroundColor: '#dedfe0'
        }
      }
    })
    allInfor[day] = tempArray
  }
  return allInfor
})
Mock.mock(/\/patient\/register\/departmentInfor\?.*/, 'get', () => {
  return ['儿科', '妇科', '内科', '外科']
})
Mock.mock(/\/patient\/register\/doctorInfor\?.*/, 'get', () => {
  const resultObj = []
  const jobArray = ['儿科', '妇科', '内科', '外科']
  for (const applyNum of Mock.Random.range(0, 9)) {
    const tempObj = {}
    tempObj.doctor = Mock.Random.cname()
    tempObj.doctorId = 111
    tempObj.department = jobArray[Math.floor(Math.random() * jobArray.length)]
    tempObj.doctorIntroduction = Mock.Random.cparagraph(5)
    resultObj[applyNum] = tempObj
  }
  return resultObj
})
Mock.mock('/patient/register/register', 'post', () => {
  return {
  }
})

// '/patient/medical-record'的接口-----------------------------------------------------------------------------------------------------------------------------------------
Mock.mock(/\/patient\/medical-record\/patientRecordInfor\?.*/, 'get', () => {
  const result = []
  for (const applyNum of Mock.Random.range(0, 3)) {
    const tempObj = {}
    tempObj.patientName = Mock.Random.cname()
    tempObj.recordCreatedDate = `${new Date().toLocaleDateString()}  ${new Date().toLocaleTimeString()}`
    tempObj.treatingDoctor = Mock.Random.cname()
    tempObj.visitDate = `${new Date().toLocaleDateString()}  ${new Date().toLocaleTimeString()}`
    tempObj.tall = Mock.Random.natural(150, 180)
    tempObj.weight = Mock.Random.natural(50, 100)
    tempObj.temperature = Mock.Random.float(36.0, 41.0, 1, 1)
    tempObj.pulseRate = Mock.Random.natural(60, 120)
    tempObj.systolicBloodPressure = Mock.Random.natural(70, 150)
    tempObj.diastolicBloodPressure = Mock.Random.natural(70, 150)
    tempObj.onsetTime = `${new Date().toLocaleDateString()}  ${new Date().toLocaleTimeString()}`
    tempObj.PH = Mock.Random.cparagraph(3, 7)
    tempObj.HPI = Mock.Random.cparagraph(3, 7)
    tempObj.chiefComplaint = Mock.Random.cparagraph(3, 10)
    tempObj.diagnosis = Mock.Random.cparagraph(3, 5)
    tempObj.doctorAdvice = Mock.Random.cparagraph(3, 5)

    const prescriptionResult = []
    for (const prescriptionNum of Mock.Random.range(0, 3)) {
      const tempObj2 = {}
      tempObj2.prescriptionNum = `处方单${prescriptionNum + 1}`
      const prescriptionDetail = []
      for (const prescriptionDetailNum of Mock.Random.range(0, 5)) {
        const tempObj3 = {}
        const useArray = ['口服', '外敷', '注射']
        tempObj3.drugName = Mock.Random.cword(4, 7)
        tempObj3.drugNum = Mock.Random.natural(1, 5)
        tempObj3.drugUse = useArray[Math.floor(Math.random() * useArray.length)]
        tempObj3.doctorDrugAdvice = Mock.Random.cparagraph(1, 1)
        prescriptionDetail[prescriptionDetailNum] = tempObj3
      }
      tempObj2.prescriptionDetail = prescriptionDetail
      prescriptionResult[prescriptionNum] = tempObj2
    }
    tempObj.prescription = prescriptionResult

    const checkResult = []
    for (const checkNum of Mock.Random.range(0, 3)) {
      const tempObj4 = {}
      tempObj4.checkName = Mock.Random.cword(7, 7)
      tempObj4.checkDoctor = Mock.Random.cname()
      checkResult[checkNum] = tempObj4
    }
    tempObj.checkResult = checkResult

    const observe = []
    for (const observeNum of Mock.Random.range(0, 3)) {
      const tempObj5 = {}
      tempObj5.observeItem = new Array(3).fill(Mock.Random.cword(2, 2))
      tempObj5.location = `${Mock.Random.natural(1, 5)}楼-${Mock.Random.natural(1, 10)}房-${Mock.Random.natural(1, 4)}床`
      tempObj5.observeReason = Mock.Random.cparagraph(1, 1)
      observe[observeNum] = tempObj5
    }
    tempObj.observe = observe

    const operation = []
    for (const operationNum of Mock.Random.range(0, 3)) {
      const tempObj6 = {}
      tempObj6.operationDoctor = Mock.Random.cname()
      tempObj6.operationDescription = Mock.Random.cparagraph(1, 1)
      tempObj6.operationReport = Mock.Random.cparagraph(5, 10)
      tempObj6.participant = []
      for (const participantNum of Mock.Random.range(0, 3)) {
        const tempObj7 = {}
        tempObj7.participantName = Mock.Random.cname()
        tempObj7.participantJob = Mock.Random.cword(4, 4)
        tempObj7.participantReport = Mock.Random.cparagraph(5, 10)
        tempObj6.participant[participantNum] = tempObj7
      }
      operation[operationNum] = tempObj6
    }
    tempObj.operation = operation

    result[applyNum] = tempObj
  }
  return result
})
Mock.mock(/\/patient\/medical-record\/inpatientInfor\?.*/, 'get', () => {
  const result = []
  for (const applyNum of Mock.Random.range(0, 3)) {
    const tempObj = {}
    tempObj.patientName = Mock.Random.cname()
    tempObj.startDate = `${new Date().toLocaleDateString()}  ${new Date().toLocaleTimeString()}`
    tempObj.treatingDoctor = Mock.Random.cname()
    tempObj.endDate = `${new Date().toLocaleDateString()}  ${new Date().toLocaleTimeString()}`
    tempObj.floor = Mock.Random.natural(1, 5)
    tempObj.room = Mock.Random.natural(1, 10)
    tempObj.bed = Mock.Random.natural(1, 4)
    tempObj.inpatientReason = Mock.Random.cparagraph(3, 7)
    tempObj.inpatientOutReason = Mock.Random.cparagraph(3, 7)
    result[applyNum] = tempObj
  }
  return result
})

// '/patient/financial'的接口-----------------------------------------------------------------------------------------------------------------------------------------
Mock.mock(/\/patient\/financial\/financialInfor\?.*/, 'get', () => {
  const resultObj = []
  const name = Mock.Random.cname()
  const itemNameArray = ['挂号', '检查', '手术', '住院', '留院观察', '处方单药品']
  const status = ['已缴费', '未缴费']
  for (const applyNum of Mock.Random.range(0, 20)) {
    const tempObj = {}
    tempObj.patientName = name
    tempObj.itemName = itemNameArray[Math.floor(Math.random() * itemNameArray.length)]
    tempObj.payStatus = status[Math.floor(Math.random() * status.length)]
    tempObj.itemMoney = Mock.Random.float(0, 500, 2, 2)
    resultObj[applyNum] = tempObj
  }
  return resultObj
})

// '/patient/single-information'的接口-----------------------------------------------------------------------------------------------------------------------------------------
Mock.mock(/\/patient\/single-information\/patientBasicInfor\?.*/, 'get', () => {
  return {
    name: Mock.Random.cname(),
    gender: '男',
    idNum: '440393200010109845',
    birth: `${new Date().toLocaleDateString()}  ${new Date().toLocaleTimeString()}`,
    phoneNum: '77802561285'
  }
})
Mock.mock('/patient/single-information/changePhoneNumAPI', 'post', () => {
  return {
  }
})
