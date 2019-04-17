from flask import Flask, redirect, url_for
from flaskext.mysql import MySQL
from flask_cors import CORS, cross_origin
import json

app = Flask(__name__)
CORS(app)
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = 'password'
app.config['MYSQL_DATABASE_DB'] = 'stream_viz'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
mysql = MySQL(app)

# code from https://stackoverflow.com/questions/29020839/mysql-fetchall-how-to-get-data-inside-a-dict-rather-than-inside-a-tuple/29020853#29020853
# also deals with organizing data to arrange it in a nice format
# converts MySQL results into dictionary


def get_dict(cursor):
    columns = [col[0] for col in cursor.description]
    rows = []
    row = cursor.fetchone()
    while row is not None:
        row = [None if i is None else str(i) for i in row]
        rows.append(dict(zip(columns, row)))
        row = cursor.fetchone()
    return rows


@app.route('/')
def index():
    return redirect(url_for('streams'))


@app.route('/streams')
def streams():
    conn = mysql.get_db().cursor()
    conn.execute("select * from stream")

    return json.dumps(get_dict(conn))
