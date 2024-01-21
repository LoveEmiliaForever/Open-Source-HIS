from flask import (
    Blueprint, request, jsonify, abort
)
from .db import cursor, db
from .token import encrypt, decrypt
import datetime
from dateutil import parser
import json

bp = Blueprint('admin', __name__)

@bp.route('/keShi', methods=['GET'])
def keShi():
    cursor.execute(f"SELECT department, COUNT(*) AS num FROM account WHERE role = '医生' GROUP BY department")
    data = cursor.fetchall()
    result = []
    for item in data:
        temp = {
            'department': item['department'],
            'num': item['num'],
            'price': '5.00'
        }
        result.append(temp)
    return jsonify(result)

@bp.route('/yiSheng', methods=['GET'])
def yiSheng():
    cursor.execute(f"SELECT accountId, name, idNum, department FROM account WHERE role = '医生'")
    data = cursor.fetchall()
    result = []
    for item in data:
        temp = {
            'accountId': item['accountId'],
            'name': item['name'],
            'idNum': item['idNum'],
            'department': item['department']
        }
        result.append(temp)
    return jsonify(result)

@bp.route('/yiSheng/add', methods=['POST'])
def yiShengAdd():
    data = request.get_json()
    name = data['name']
    idNum = data['idNum']
    department = data['department']
    cursor.execute(f"INSERT INTO account(name, idNum, birth, gender, phoneNum, role, department, doc_introduction)VALUES('{name}', '{idNum}', '2000-01-01', '男', '12345', '医生', '{department}', '这是一个医生')")
    db.commit()
    return jsonify({})

@bp.route('/huanZhe', methods=['GET'])
def huanZhe():
    cursor.execute(f"SELECT accountId, name, idNum, phoneNum, gender, birth FROM account WHERE role = '患者'")
    data = cursor.fetchall()
    result = []
    for item in data:
        temp = {
            'accountId': item['accountId'],
            'name': item['name'],
            'idNum': item['idNum'],
            'phoneNum': item['phoneNum'],
            'gender': item['gender'],
            'birth': item['birth'].strftime("%Y-%m-%d")
        }
        result.append(temp)
    return jsonify(result)

@bp.route('/huanZhe/add', methods=['POST'])
def huanZheAdd():
    data = request.get_json()
    name = data['name']
    idNum = data['idNum']
    gender = data['gender']
    phoneNum = data['phoneNum']
    birth = data['birth']
    cursor.execute(f"INSERT INTO account(name, idNum, birth, gender, phoneNum, role, department, doc_introduction)VALUES('{name}', '{idNum}', '{birth}', '{gender}', '{phoneNum}', '患者', '', '')")
    db.commit()
    return jsonify({})

@bp.route('/yaoPin', methods=['GET'])
def yaoPin():
    cursor.execute(f"SELECT drugId, drugName, price, drugUnit, drugUse, drugType, appearance, prescriptionStatus, storageWay FROM drug_infor")
    data = cursor.fetchall()
    result = []
    for item in data:
        temp = {
            'drugId': item['drugId'],
            'drugName': item['drugName'],
            'price': item['price'],
            'drugUnit': item['drugUnit'],
            'drugUse': item['drugUse'],
            'drugType': item['drugType'],
            'appearance': item['appearance'],
            'prescriptionStatus': item['prescriptionStatus'],
            'storageWay': item['storageWay']
        }
        result.append(temp)
    return jsonify(result)

@bp.route('/yaoPin/add', methods=['POST'])
def yaoPinAdd():
    data = request.get_json()
    drugName = data['drugName']
    price = data['price']
    drugUnit = data['drugUnit']
    cursor.execute(f"INSERT INTO drug_infor(drugName, drugUse, drugType, appearance, prescriptionStatus, price, drugUnit, storageWay)VALUES('{drugName}', '口服', '中药', '固体', '非处方药', '{price}', '{drugUnit}', '常温保存')")
    db.commit()
    return jsonify({})

@bp.route('/yaoPin/change', methods=['POST'])
def yaoPinChange():
    data = request.get_json()
    drugId = data['drugId']
    storageWay = data['storageWay']
    price = data['price']
    print('kkk'+str(storageWay)+str(price))
    if storageWay != '':
        cursor.execute(f"UPDATE drug_infor SET storageWay = '{storageWay}' WHERE drugId = {drugId}")
        db.commit()
    if price != '':
        cursor.execute(f"UPDATE drug_infor SET price = {price} WHERE drugId = {drugId}")
        db.commit()
    return jsonify({})
