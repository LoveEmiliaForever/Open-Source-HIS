import pymysql

db = pymysql.connect(host='localhost', port=3306, user='root', password='root', database='his-information', cursorclass=pymysql.cursors.DictCursor)
cursor = db.cursor()
