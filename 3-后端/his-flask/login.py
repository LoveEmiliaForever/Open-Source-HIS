from flask import (
    Blueprint, request, jsonify, abort
)
from .db import cursor
from .token import encrypt, decrypt
from dateutil import parser

bp = Blueprint('login', __name__, url_prefix='/login')

@bp.route('/token', methods=['GET'])
def getToken():
    tokenDic = {}
    userNum = request.args.get('userNum')
    passWord = request.args.get('passWord')
    cursor.execute("SELECT * FROM account WHERE idNum = %s AND passWord = %s", (userNum, passWord))
    basicInfor = cursor.fetchone()
    basicInfor['birth'] = basicInfor['birth'].strftime("%Y-%m-%d")
    if basicInfor is not None:
        cursor.execute(f"SELECT * FROM function_power WHERE accountId = {basicInfor['accountId']}")
        functionPower = cursor.fetchone()
        cursor.execute(f"SELECT * FROM page_power WHERE accountId = {basicInfor['accountId']}")
        pagePower = cursor.fetchone()

        tokenDic['basicInfor'] = basicInfor
        tokenDic['functionPower'] = functionPower
        tokenDic['pagePower'] = pagePower

        token = encrypt(tokenDic)
        return jsonify({
            'token': token
        })
    else:
        abort(403)

@bp.route('/', methods=['GET'])
def getPagePower():
    result = {}
    token = decrypt(request.args.get('token'))
    pagePower = token['pagePower']
    for page in pagePower:
        if page == 'accountId':
            continue
        else:
            if pagePower[page] == 1:
                result[page] = True
            else:
                result[page] = False
    return jsonify(result)
