from flask import Flask, request
from flask_socketio import SocketIO
import gdb
import socket
import os

class GDBProcess:

  def __init__(self, binary):
    gdb.execute('file {}'.format(binary)) 

  def run_command(self, command):
    output = gdb.execute(command, to_string=True)
    print(output)
    return output


app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")

instance = GDBProcess("../tests/binaries/hello")

@socketio.on("command")
def gdb_recv(methods=['GET','POST']):
    print("Received command")
    output = instance.run_command("disas main")
    socketio.emit('output', output)

socketio.run(app, debug=False, port=5001)