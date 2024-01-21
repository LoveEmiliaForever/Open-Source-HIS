from flask import (
    Blueprint, request, jsonify, abort
)
from .db import cursor, db

bp = Blueprint('signUp', __name__, url_prefix='/sign-up')

@bp.route('/register', methods=['POST'])
def registerNewPatient():
    data = request.get_json()
    name = data['patientName']
    gender = data['patientGender']
    idNum = data['patientIdNum']
    birth = data['patientBirth']
    phoneNum = data['patientPhoneNum']
    passWord = data['patientPassWord']
    cursor.execute(f"SELECT idNum FROM account WHERE idNum={idNum}")
    result = cursor.fetchone()
    if result is None:
        cursor.execute(f"""
                INSERT INTO account(name, gender, idNum, birth, phoneNum, passWord, role)
                VALUES('{name}', '{gender}', '{idNum}', '{birth}', '{phoneNum}', '{passWord}', '患者')
                """)
        cursor.execute(f"""
                INSERT INTO function_power(patient_page)
                VALUES(1)
                """)
        cursor.execute(f"""
                INSERT INTO page_power()
                VALUES()
                """)
        db.commit()
        return jsonify({
            'message': '注册成功'
        })
    else:
        abort(403)
