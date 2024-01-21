from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
import json
import base64

password = b'HSI-oneSystem123'
aes = AES.new(password, AES.MODE_ECB)

def encrypt(dic):
    dicJSON = json.dumps(dic)
    binaryDicJSON = pad(dicJSON.encode('utf-8'), 16)
    en_text = aes.encrypt(binaryDicJSON)
    base64_str = base64.b64encode(en_text).decode('utf-8')
    return base64_str

def decrypt(base64_str):
    en_text = base64.b64decode(base64_str.encode('utf-8'))
    binaryDicJSON = aes.decrypt(en_text)
    dicJSON = unpad(binaryDicJSON, 16).decode('utf-8')
    dic = json.loads(dicJSON)
    return dic
