from flask import (
    Blueprint, request, jsonify, abort
)
from .db import cursor
from .token import encrypt, decrypt

bp = Blueprint('permissions', __name__, url_prefix='/permissions')

@bp.route('/', methods=['GET'])
def getFunctionPower():
    result = {}
    token = decrypt(request.args.get('token'))
    functionPower = token['functionPower']
    for func in functionPower:
        if func == 'accountId':
            continue
        elif func == 'user' and functionPower['user'] == 1:
            result['个人页面'] = '/user'
        elif func == 'subordinate' and functionPower['subordinate'] == 1:
            result['下属管理'] = '/subordinate'
        elif func == 'window_work' and functionPower['window_work'] == 1:
            result['窗口工作台'] = '/window-work'
        elif func == 'doc_work' and functionPower['doc_work'] == 1:
            result['医生工作台'] = '/doc-work'
        elif func == 'bed_management' and functionPower['bed_management'] == 1:
            result['总床位管理'] = '/bed-management'
        elif func == 'nurse_work' and functionPower['nurse_work'] == 1:
            result['护士工作台'] = '/nurse-work'
        elif func == 'operation_room_manage' and functionPower['operation_room_manage'] == 1:
            result['手术室管理'] = '/operation-room-manage'
        elif func == 'technician_doc_work' and functionPower['technician_doc_work'] == 1:
            result['检查医生工作台'] = '/technician-doc-work'
        elif func == 'drug_warehouse_work' and functionPower['drug_warehouse_work'] == 1:
            result['药库工作台'] = '/drug-warehouse-work'
        elif func == 'drug_room_work' and functionPower['drug_room_work'] == 1:
            result['药房工作台'] = '/drug-room-work'
        elif func == 'patient_page' and functionPower['patient_page'] == 1:
            result['个人信息'] = '/patient/single-information'
            result['患者主页'] = '/patient/home'
            result['预约挂号'] = '/patient/register'
            result['查看病历'] = '/patient/medical-record'
            result['查看开支'] = '/patient/financial'
        # 作业要求
        elif func == 'admin' and functionPower['admin'] == 1:
            result['科室管理'] = '/keShi'
            result['医生管理'] = '/yiSheng'
            result['药品管理'] = '/yaoPin'
            result['患者管理'] = '/huanZhe'
    return jsonify(result)

@bp.route('/user-data', methods=['GET'])
def getUserData():
    result = {}
    token = decrypt(request.args.get('token'))
    return jsonify ({
        'userName': token['basicInfor']['name'],
        'userRole': token['basicInfor']['role']
    })
