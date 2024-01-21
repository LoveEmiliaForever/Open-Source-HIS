from flask import (
    Blueprint, request, jsonify, abort
)
from .db import cursor, db
from .token import encrypt, decrypt
import datetime
from dateutil import parser
import json

bp = Blueprint('drug-warehouse-work', __name__, url_prefix='/drug-warehouse-work/drugManage')

@bp.route('/drugInfor', methods=['GET'])
def drugInfor():
    cursor.execute("SELECT drugName, MAX(drugType) AS drugType, MAX(appearance) AS appearance, MAX(prescriptionStatus) AS prescriptionStatus, MAX(price) AS drugPrice, warehousingDate, exWarehousingDate, manufactureDate, expirationDate, MAX(storageWay) AS storageWay, COUNT(*) AS drugNum FROM drug_infor, single_drug_infor WHERE drug_infor.drugId = single_drug_infor.drugId GROUP BY drugName, warehousingDate, exWarehousingDate, manufactureDate, expirationDate")
    data = cursor.fetchall()
    result = []
    for item in data:
        item['warehousingDate'] = item['warehousingDate'].strftime("%Y-%m-%d %H:%M:%S")
        if item['exWarehousingDate'] is not None:
            item['exWarehousingDate'] = item['exWarehousingDate'].strftime("%Y-%m-%d %H:%M:%S")
        item['manufactureDate'] = item['manufactureDate'].strftime("%Y-%m-%d %H:%M:%S")
        item['expirationDate'] = item['expirationDate'].strftime("%Y-%m-%d %H:%M:%S")
        result.append(item)
    return jsonify(result)

@bp.route('/warehousing', methods=['POST'])
def warehousing():
    data = request.get_json()
    drugName = data['drugName']
    drugNum = data['drugNum']
    manufactureDate = data['manufactureDate']
    expirationDate = data['expirationDate']
    nowDate = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    cursor.execute(f"SELECT drugId FROM drug_infor WHERE drugName = '{drugName}'")
    drugId = cursor.fetchone()
    drugId = drugId['drugId']
    for i in range(drugNum):
        cursor.execute(f"INSERT INTO single_drug_infor(drugId, warehousingDate, manufactureDate, expirationDate)VALUES({drugId}, '{nowDate}', '{manufactureDate}', '{expirationDate}')")
    db.commit()
    return jsonify({})

@bp.route('/exWarehousing', methods=['POST'])
def exWarehousing():
    data = request.get_json()
    drugName = data['drugName']
    drugNum = data['drugNum']
    nowDate = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    cursor.execute(f"SELECT drugId FROM drug_infor WHERE drugName = '{drugName}'")
    drugId = cursor.fetchone()
    drugId = drugId['drugId']
    cursor.execute(f"SELECT singleDrugId FROM single_drug_infor WHERE drugId = {drugId} AND exWarehousingDate IS NULL")
    list = cursor.fetchall()
    for i in range(drugNum):
        cursor.execute(f"UPDATE single_drug_infor SET exWarehousingDate = '{nowDate}' WHERE singleDrugId = {list[i]['singleDrugId']}")
    db.commit()
    return jsonify({})
