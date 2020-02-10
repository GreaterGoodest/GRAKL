from flask import Flask, render_template, request
from flask_bootstrap import Bootstrap
from flask_socketio import SocketIO

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
Bootstrap(app)
socketio = SocketIO(app)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    socketio.run(app, debug=True, host="0.0.0.0")