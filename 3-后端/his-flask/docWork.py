from flask import (
    Blueprint, request, jsonify, abort
)
from .db import cursor, db
from .token import encrypt, decrypt
import datetime
from dateutil import parser
import json

bp = Blueprint('docWork', __name__, url_prefix='/doc-work')

@bp.route('/patient-infor/patientRecordInfor', methods=['GET'])
def recordInfor():
    patientId = request.args.get('patientId')
    if patientId == '':
        return jsonify({})
    cursor.execute(f"SELECT name FROM account WHERE accountId = {patientId}")
    patientName = cursor.fetchone()['name']
    cursor.execute(f"SELECT * FROM record_infor WHERE patientId = {patientId}")
    data = cursor.fetchall()
    result = []
    for item in data:
        temp = {
            'patientName': patientName,
            'recordCreatedDate': item['createdDate'].strftime("%Y-%m-%d %H:%M:%S"),
            'visitDate': item['visitDate'].strftime("%Y-%m-%d %H:%M:%S"),
            'tall': item['tall'],
            'weight': item['weight'],
            'temperature': item['temperature'],
            'pulseRate': item['pulseRate'],
            'systolicBloodPressure': item['sbp'],
            'diastolicBloodPressure': item['dbp'],
            'onsetDate': item['onsetDate'].strftime("%Y-%m-%d %H:%M:%S"),
            'PH': item['PH'],
            'HPI': item['HPI'],
            'chiefComplaint': item['CC'],
            'diagnosis': item['diagnosis'],
            'doctorAdvice': item['doctorAdvice']
        }
        cursor.execute(f"SELECT name FROM account WHERE accountId = {item['doctorId']}")
        temp['treatingDoctor'] = cursor.fetchone()['name']

        prescriptionId = json.loads(item['prescriptionId'])
        prescriptionResult = []
        for id in prescriptionId:
            temp2 = {}
            temp2['prescriptionNum'] = "处方单" + str(id)
            cursor.execute(f"SELECT * FROM prescription_infor WHERE prescriptionId = {id}")
            data = cursor.fetchone()
            drugName = json.loads(data['drugName'].replace('u', '\\u'))
            drugNum = json.loads(data['drugNum'].replace('u', '\\u'))
            drugUse = json.loads(data['drugUse'].replace('u', '\\u'))
            drugAdvice = json.loads(data['drugAdvice'].replace('u', '\\u'))
            prescriptionDetail = []
            for index in range(len(drugName)):
                temp3 = {
                    'drugName': drugName[index],
                    'drugNum': drugNum[index],
                    'drugUse': drugUse[index],
                    'doctorDrugAdvice': drugAdvice[index]
                }
                prescriptionDetail.append(temp3)
            temp2['prescriptionDetail'] = prescriptionDetail
            prescriptionResult.append(temp2)
        temp['prescription'] = prescriptionResult

        result.append(temp)
    
    return jsonify(result)

@bp.route('/patient-infor/inpatientInfor', methods=['GET'])
def inpatientInfor():
    patientId = request.args.get('patientId')
    if patientId == '':
        return jsonify({})
    cursor.execute(f"SELECT name FROM account WHERE accountId = {patientId}")
    patientName = cursor.fetchone()['name']
    cursor.execute(f"SELECT * FROM inpatient_infor WHERE patientId = {patientId}")
    data = cursor.fetchall()
    result = []
    for item in data:
        temp = {
            'patientName': patientName,
            'startDate': item['startDate'].strftime("%Y-%m-%d %H:%M:%S"),
            'floor': item['floor'],
            'room': item['room'],
            'bed': item['bed'],
            'inpatientReason': item['inpatientReason'],
            'inpatientOutReason': item['inpatientOutReason']
        }
        cursor.execute(f"SELECT name FROM account WHERE accountId = {item['doctorId']}")
        temp['treatingDoctor'] = cursor.fetchone()['name']
        if item['endDate'] is not None:
            temp['endDate'] = item['endDate'].strftime("%Y-%m-%d %H:%M:%S")
        result.append(temp)
    return jsonify(result)

@bp.route('/patient-infor/patientBasicInfor', methods=['GET'])
def patientBasicInfor():
    patientId = request.args.get('patientId')
    if patientId == '':
        return jsonify({})
    cursor.execute(f"SELECT * FROM account WHERE accountId = {patientId}")
    basicInfor = cursor.fetchone()
    return jsonify({
        'name': basicInfor['name'],
        'gender': basicInfor['gender'],
        'idNum': basicInfor['idNum'],
        'birth': basicInfor['birth'].strftime("%Y-%m-%d"),
        'phoneNum': basicInfor['phoneNum']
    })

@bp.route('/patient-infor/registerInfor', methods=['GET'])
def registerInfor():
    doctorId = decrypt(request.args.get('token'))['basicInfor']['accountId']
    patientId = request.args.get('patientId')
    if patientId == '':
        pass
    else:
        cursor.execute(f"UPDATE register_infor SET completeStatus = 1 WHERE patientId = {patientId} AND doctorId = {doctorId} AND completeStatus = 0 AND registerId = (SELECT * FROM (SELECT MIN(registerId) FROM register_infor WHERE patientId = {patientId} AND completeStatus = 0 AND doctorId = {doctorId}) AS temp)")
        db.commit()
    cursor.execute(f"SELECT patientId FROM register_infor WHERE doctorId={doctorId} AND completeStatus = 0 ORDER BY registerId LIMIT 1")
    nextPatientId = cursor.fetchone()['patientId']
    return jsonify({
        'patientId': nextPatientId
    })

@bp.route('/record/setRecordInfor', methods=['POST'])
def setRecord():
    data = request.get_json()
    patientId = data['patientId']
    doctorId = decrypt(request.get_json()['token'])['basicInfor']['accountId']
    createdDate = parser.parse(data['recordCreatedDate']).strftime("%Y-%m-%d %H:%M:%S")
    visitDate = parser.parse(data['visitDate']).strftime("%Y-%m-%d %H:%M:%S")
    tall = data['tall']
    weight = data['weight']
    temperature = data['temperature']
    pulseRate = data['pulseRate']
    sbp = data['systolicBloodPressure']
    dbp = data['diastolicBloodPressure']
    onsetDate = parser.parse(data['onsetTime']).strftime("%Y-%m-%d %H:%M:%S")
    PH = data['PH']
    HPI = data['HPI']
    CC = data['chiefComplaint']
    diagnosis = data['diagnosis']
    doctorAdvice = data['doctorAdvice']
    try:
        data['recordId']
        flag = True
    except:
        flag = False
    if flag:
        recordId = data['recordId']
        cursor.execute(f"UPDATE record_infor SET tall = {tall}, weight={weight}, temperature={temperature}, pulseRate={pulseRate}, sbp={sbp}, dbp={dbp}, onsetDate='{onsetDate}', PH='{PH}', HPI='{HPI}', CC='{CC}', diagnosis='{diagnosis}', doctorAdvice='{doctorAdvice}' WHERE recordId = {recordId}")
        db.commit()
        return jsonify({})
    else:
        cursor.execute(f"INSERT INTO record_infor(patientId, doctorId, createdDate, visitDate, tall, weight, temperature, pulseRate, sbp, dbp, onsetDate, PH, HPI, CC, diagnosis, doctorAdvice, prescriptionId)VALUES({patientId}, {doctorId}, '{createdDate}', '{visitDate}', {tall}, {weight}, {temperature}, {pulseRate}, {sbp}, {dbp}, '{onsetDate}', '{PH}', '{HPI}', '{CC}', '{diagnosis}', '{doctorAdvice}', '[]')")
        db.commit()
        cursor.execute(f"SELECT recordId FROM record_infor WHERE tall = {tall} AND weight={weight} AND temperature={temperature} AND pulseRate={pulseRate} AND sbp={sbp} AND dbp={dbp} AND onsetDate='{onsetDate}' AND PH={PH} AND HPI={HPI} AND CC={CC} AND diagnosis={diagnosis} AND doctorAdvice={doctorAdvice}")
        recordId = cursor.fetchone()['recordId']
        return jsonify({
            'recordId': recordId
        })

@bp.route('/prescription/prescriptionInfor', methods=['GET'])
def prescriptionInfor():
    recordId = request.args.get('recordId')
    if recordId == 'false':
        return jsonify({})
    cursor.execute(f"SELECT prescriptionId FROM record_infor WHERE recordId={recordId}")
    item = cursor.fetchone()
    prescriptionId = json.loads(item['prescriptionId'])
    prescriptionResult = []
    for id in prescriptionId:
        temp2 = {}
        temp2['prescriptionNum'] = "处方单" + str(id)
        cursor.execute(f"SELECT * FROM prescription_infor WHERE prescriptionId = {id}")
        data = cursor.fetchone()
        drugName = json.loads(data['drugName'].replace('u', '\\u'))
        drugNum = json.loads(data['drugNum'].replace('u', '\\u'))
        drugUse = json.loads(data['drugUse'].replace('u', '\\u'))
        drugAdvice = json.loads(data['drugAdvice'].replace('u', '\\u'))
        prescriptionDetail = []
        for index in range(len(drugName)):
            temp3 = {
                'drugName': drugName[index],
                'drugNum': drugNum[index],
                'drugUse': drugUse[index],
                'doctorDrugAdvice': drugAdvice[index]
            }
            prescriptionDetail.append(temp3)
        temp2['prescriptionDetail'] = prescriptionDetail
        prescriptionResult.append(temp2)
    return jsonify(prescriptionResult)

@bp.route('/prescription/drugNameInfor', methods=['GET'])
def drugNameInfor():
    cursor.execute("SELECT drugName FROM drug_infor")
    data = cursor.fetchall()
    drugList = []
    for item in data:
        drugList.append(item['drugName'])
    return jsonify(drugList)

@bp.route('/prescription/addPrescriptionInfor', methods=['POST'])
def addPrescriptionInfor():
    recordId = request.get_json()['recordId']
    data = request.get_json()['prescriptionData']
    drugName = []
    drugNum = []
    drugUse = []
    drugAdvice = []
    price = 0.00
    for item in data:
        drugName.append(item['drugName'])
        cursor.execute(f"SELECT price FROM drug_infor WHERE drugName = '{item['drugName']}'")
        price += cursor.fetchone()['price']
        drugNum.append(item['drugNum'])
        cursor.execute(f"SELECT drugUse FROM drug_infor WHERE drugName = '{item['drugName']}'")
        drugUse.append(cursor.fetchone()['drugUse'])
        drugAdvice.append(item['doctorDrugAdvice'])
    cursor.execute(f"INSERT INTO prescription_infor(drugName, drugNum, drugUse, drugAdvice, prescriptionPrice)VALUES('{json.dumps(drugName)}', '{json.dumps(drugNum)}', '{json.dumps(drugUse)}', '{json.dumps(drugAdvice)}', {price})")
    db.commit()
    cursor.execute(f"SELECT prescriptionId FROM prescription_infor WHERE JSON_CONTAINS(drugName, '{json.dumps(drugName)}') AND JSON_CONTAINS(drugNum, '{json.dumps(drugNum)}') AND JSON_CONTAINS(drugUse, '{json.dumps(drugUse)}') AND JSON_CONTAINS(drugAdvice, '{json.dumps(drugAdvice)}') AND prescriptionPrice = {price}")
    prescriptionId = cursor.fetchone()['prescriptionId']
    cursor.execute(f"SELECT prescriptionId FROM record_infor WHERE recordId = {recordId}")
    prescriptionIdList = json.loads(cursor.fetchone()['prescriptionId'])
    prescriptionIdList.append(prescriptionId)
    prescriptionIdList = json.dumps(prescriptionIdList)
    cursor.execute(f"UPDATE record_infor SET prescriptionId = '{prescriptionIdList}' WHERE recordId = {recordId}")
    db.commit()
    return jsonify({})

@bp.route('/inpatient/inpatientFlag', methods=['GET'])
def inpatientFlag():
    patientId = request.args.get('patientId')
    if patientId == '':
        return jsonify({
            'inpatientFlag': False
        })
    cursor.execute(f"SELECT endDate FROM inpatient_infor WHERE patientId = {patientId}")
    endDate = cursor.fetchone()
    if endDate is not None:
        return jsonify({
            'inpatientFlag': False
        })
    else:
        return jsonify({
            'inpatientFlag': True
        })

@bp.route('/inpatient/inpatientInfor', methods=['GET'])
def inpatientInfor2():
    patientId = request.args.get('patientId')
    if patientId == '':
        return jsonify({})
    cursor.execute(f"SELECT name FROM account WHERE accountId = {patientId}")
    patientName = cursor.fetchone()['name']
    cursor.execute(f"SELECT * FROM inpatient_infor WHERE patientId = {patientId}")
    item = cursor.fetchone()
    temp = {
        'patientName': patientName,
        'startDate': item['startDate'].strftime("%Y-%m-%d %H:%M:%S"),
        'floor': item['floor'],
        'room': item['room'],
        'bed': item['bed'],
        'inpatientReason': item['inpatientReason'],
        'inpatientOutReason': item['inpatientOutReason']
    }
    cursor.execute(f"SELECT name FROM account WHERE accountId = {item['doctorId']}")
    temp['treatingDoctor'] = cursor.fetchone()['name']
    if item['endDate'] is not None:
        temp['endDate'] = item['endDate'].strftime("%Y-%m-%d %H:%M:%S")
    return jsonify(temp)

@bp.route('/inpatient/inpatientInforSubmit', methods=['POST'])
def inpatientInforSubmit():
    doctorId = decrypt(request.get_json()['token'])['basicInfor']['accountId']
    patientId = request.get_json()['patientId']
    startDate = parser.parse(request.get_json()['startDate']).strftime("%Y-%m-%d %H:%M:%S")
    inpatientReason = request.get_json()['inpatientReason']
    cursor.execute(f"INSERT INTO inpatient_infor(patientId, doctorId, startDate, inpatientReason)VALUES({patientId}, {doctorId}, '{startDate}', '{inpatientReason}')")
    db.commit()
    return jsonify({})

@bp.route('/medical-record/patientRecordInfor', methods=['GET'])
def historyRecord():
    doctorId = decrypt(request.args.get('token'))['basicInfor']['accountId']
    cursor.execute(f"SELECT * FROM record_infor WHERE doctorId = {doctorId}")
    data = cursor.fetchall()
    result = []
    for item in data:
        cursor.execute(f"SELECT name FROM account WHERE accountId = {item['patientId']}")
        patientName = cursor.fetchone()['name']
        temp = {
            'patientName': patientName,
            'recordCreatedDate': item['createdDate'].strftime("%Y-%m-%d %H:%M:%S"),
            'visitDate': item['visitDate'].strftime("%Y-%m-%d %H:%M:%S"),
            'tall': item['tall'],
            'weight': item['weight'],
            'temperature': item['temperature'],
            'pulseRate': item['pulseRate'],
            'systolicBloodPressure': item['sbp'],
            'diastolicBloodPressure': item['dbp'],
            'onsetTime': item['onsetDate'].strftime("%Y-%m-%d %H:%M:%S"),
            'PH': item['PH'],
            'HPI': item['HPI'],
            'chiefComplaint': item['CC'],
            'diagnosis': item['diagnosis'],
            'doctorAdvice': item['doctorAdvice']
        }
        cursor.execute(f"SELECT name FROM account WHERE accountId = {item['doctorId']}")
        temp['treatingDoctor'] = cursor.fetchone()['name']

        prescriptionId = json.loads(item['prescriptionId'])
        prescriptionResult = []
        for id in prescriptionId:
            temp2 = {}
            temp2['prescriptionNum'] = "处方单" + str(id)
            cursor.execute(f"SELECT * FROM prescription_infor WHERE prescriptionId = {id}")
            data = cursor.fetchone()
            drugName = json.loads(data['drugName'].replace('u', '\\u'))
            drugNum = json.loads(data['drugNum'].replace('u', '\\u'))
            drugUse = json.loads(data['drugUse'].replace('u', '\\u'))
            drugAdvice = json.loads(data['drugAdvice'].replace('u', '\\u'))
            prescriptionDetail = []
            for index in range(len(drugName)):
                temp3 = {
                    'drugName': drugName[index],
                    'drugNum': drugNum[index],
                    'drugUse': drugUse[index],
                    'doctorDrugAdvice': drugAdvice[index]
                }
                prescriptionDetail.append(temp3)
            temp2['prescriptionDetail'] = prescriptionDetail
            prescriptionResult.append(temp2)
        temp['prescription'] = prescriptionResult

        result.append(temp)
    
    return jsonify(result)

@bp.route('/patient-infor/register', methods=['GET'])
def getRegisterCall():
    doctorId = decrypt(request.args.get('token'))['basicInfor']['accountId']
    doctorName = decrypt(request.args.get('token'))['basicInfor']['name']
    cursor.execute(f"SELECT * FROM register_infor WHERE doctorId = {doctorId} AND completeStatus = 0")
    data = cursor.fetchall()
    result = []
    for item in data:
        cursor.execute(f"SELECT name FROM account WHERE accountId = {item['patientId']}")
        patientName = cursor.fetchone()['name']
        temp = {
            'patientName': patientName,
            'doctorName': doctorName,
            'startTime': item['startTime'].strftime("%Y-%m-%d %H:%M:%S"),
            'endTime': item['endTime'].strftime("%Y-%m-%d %H:%M:%S"),
            'patientId': item['patientId']
        }
        result.append(temp)
    return jsonify(result)
