# export FLASK_APP=backend.py
# flask run

from flask import Flask, jsonify
from flaskext.mysql import MySQL
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = 'password'
app.config['MYSQL_DATABASE_DB'] = 'stream_viz'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
mysql = MySQL(app)

# code from https://stackoverflow.com/questions/29020839/mysql-fetchall-how-to-get-data-inside-a-dict-rather-than-inside-a-tuple/29020853#29020853
# converts MySQL results into dictionary


def get_dict(cursor):
    columns = [col[0] for col in cursor.description]
    rows = [dict(zip(columns, row)) for row in cursor.fetchall()]
    return rows


@app.route('/streams')
def streams():
    conn = mysql.get_db().cursor()
    conn.execute("select * from stream")

    return jsonify(get_dict(conn))
