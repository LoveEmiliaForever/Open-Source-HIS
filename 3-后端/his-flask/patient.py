from flask import (
    Blueprint, request, jsonify, abort
)
from .db import cursor, db
from .token import encrypt, decrypt
import datetime
import json

bp = Blueprint('patient', __name__, url_prefix='/patient')

@bp.route('/single-information/patientBasicInfor', methods=['GET'])
def patientBasicInfor():
    token = decrypt(request.args.get('token'))
    basicInfor = token['basicInfor']
    return jsonify({
        'name': basicInfor['name'],
        'gender': basicInfor['gender'],
        'idNum': basicInfor['idNum'],
        'birth': basicInfor['birth'],
        'phoneNum': basicInfor['phoneNum']
    })

@bp.route('/single-information/changePhoneNumAPI', methods=['POST'])
def changePhoneNumAPI():
    token = decrypt(request.get_json()['token'])
    accountId = token['basicInfor']['accountId']
    newPhoneNum = request.get_json()['phoneNum']
    cursor.execute(f"UPDATE account SET phoneNum = {newPhoneNum} WHERE accountId = {accountId}")
    db.commit()
    return jsonify({})

@bp.route('/register/departmentInfor', methods=['GET'])
def departmentInfor():
    cursor.execute("SELECT DISTINCT department FROM account")
    data = cursor.fetchall()
    result = []
    for item in data:
        if item['department'] == None:
            continue
        else:
            result.append(item['department'])
    return jsonify(result)

@bp.route('/register/doctorInfor', methods=['GET'])
def doctorInfor():
    cursor.execute(f"SELECT name, accountId, department, doc_introduction FROM account WHERE role='医生'")
    data = cursor.fetchall()
    result = []
    for item in data:
        temp = {}
        temp['doctor'] = item['name']
        temp['doctorId'] = item['accountId']
        temp['department'] = item['department']
        temp['doctorIntroduction'] = item['doc_introduction']
        result.append(temp)
    return jsonify(result)

@bp.route('/register/registerInfor', methods=['GET'])
def registerInfor():
    today = datetime.datetime.now().replace(hour=9, minute=0, second=0).strftime("%Y-%m-%d %H:%M")
    lastDay = datetime.datetime.now() + datetime.timedelta(days=7)
    lastDay = lastDay.replace(hour=18, minute=0, second=0).strftime("%Y-%m-%d %H:%M")
    doctorId = request.args.get('doctorId')
    cursor.execute(f"SELECT * FROM register_infor WHERE doctorId = {doctorId} AND startTime >= '{today}' AND endTime <= '{lastDay}'")
    data = cursor.fetchall()
    result = []
    for day in range(0, 7):
        tempArray = []
        registerDate = datetime.datetime.now() + datetime.timedelta(days=day)
        registerDate = registerDate.strftime("%Y-%m-%d")
        for register in data:
            if register['startTime'].strftime("%Y-%m-%d") != registerDate:
                continue
            temp = {}
            temp['date'] = registerDate
            temp['start'] = register['startTime'].replace(year=2023, month=12, day=5).strftime("%Y-%m-%d %H:%M")
            temp['end'] = register['endTime'].replace(year=2023, month=12, day=5).strftime("%Y-%m-%d %H:%M")
            temp['label'] = "已被预约"
            temp['ganttBarConfig'] = {
                                'id': f'{day}天-{register["registerId"]}挂号单',
                                'label': '已被预约',
                                'hasHandles': False,
                                'immobile': True,
                                'style': {
                                    'borderRadius': '0.5rem',
                                    'border': '1px solid black',
                                    'opacity': '0.75',
                                    'backgroundColor': '#ecf5ff'
                                }
                            }
            tempArray.append(temp)
        temp = {
            'date': registerDate,
            'start': '2023-12-05 12:00',
            'end': '2023-12-05 14:00',
            'label': '医生午休',
            'ganttBarConfig': {
                                'id': f'{day}-none',
                                'label': '医生午休',
                                'hasHandles': False,
                                'immobile': True,
                                'style': {
                                    'borderRadius': '0.5rem',
                                    'border': '1px solid black',
                                    'opacity': '0.75',
                                    'backgroundColor': '#dedfe0'
                                }
                            }
        }
        tempArray.append(temp)
        result.append(tempArray)
    return jsonify(result)

@bp.route('/register/register', methods=['POST'])
def registerAdd():
    date = request.get_json()['registerDate']
    startTime = date + ' ' + request.get_json()['registerStartTime'] + ':00'
    endTime = date + ' ' + request.get_json()['registerEndTime'] + ':00'
    doctorId = request.get_json()['doctorId']
    patientId = decrypt(request.get_json()['token'])['basicInfor']['accountId']
    cursor.execute(f"INSERT INTO register_infor(patientId, doctorId, startTime, endTime)VALUES({patientId}, {doctorId}, '{startTime}', '{endTime}')")
    db.commit()
    return jsonify({})

@bp.route('/financial/financialInfor', methods=['GET'])
def financialInfor():
    result = []
    patientId = decrypt(request.args.get('token'))['basicInfor']['accountId']
    cursor.execute(f"SELECT price, payStatus FROM register_infor WHERE patientId = {patientId}")
    registerItem = cursor.fetchall()
    for item in registerItem:
        print(item)
        temp = {
            'patientName': decrypt(request.args.get('token'))['basicInfor']['name'],
            'itemName': '挂号',
            'payStatus': '已缴费' if item['payStatus'] == 1 else '未缴费',
            'itemMoney': item['price']
        }
        result.append(temp)
    return jsonify(result)

@bp.route('/home/registerInfor', methods=['GET'])
def homeRegisterInfor():
    result = []
    patientId = decrypt(request.args.get('token'))['basicInfor']['accountId']
    cursor.execute(f"SELECT name, department, startTime, endTime FROM register_infor, account WHERE register_infor.doctorId = account.accountId AND register_infor.patientId = {patientId}")
    data = cursor.fetchall()
    for item in data:
        temp = {
            'doctor': item['name'],
            'department': item['department'],
            'startDate': item['startTime'].strftime("%Y-%m-%d %H:%M"),
            'endDate': item['endTime'].strftime("%Y-%m-%d %H:%M")
        }
        result.append(temp)
    return jsonify(result)

@bp.route('/home/financialInfor', methods=['GET'])
def homeFinancialInfor():
    result = []
    patientId = decrypt(request.args.get('token'))['basicInfor']['accountId']
    cursor.execute(f"SELECT price FROM register_infor WHERE patientId = {patientId} AND payStatus=0")
    registerItem = cursor.fetchall()
    for item in registerItem:
        print(item)
        temp = {
            'itemName': '挂号',
            'itemMoney': item['price']
        }
        result.append(temp)
    return jsonify(result)

@bp.route('/medical-record/patientRecordInfor', methods=['GET'])
def recordInfor():
    patientId = decrypt(request.args.get('token'))['basicInfor']['accountId']
    patientName = decrypt(request.args.get('token'))['basicInfor']['name']
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

@bp.route('/medical-record/inpatientInfor', methods=['GET'])
def inpatientInfor():
    patientId = decrypt(request.args.get('token'))['basicInfor']['accountId']
    patientName = decrypt(request.args.get('token'))['basicInfor']['name']
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
