from flask import Flask, request
from flask_socketio import SocketIO
import socket
import sys

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")

gdb_sock = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) 
server_path = "/tmp/debug_socket"
try:
    gdb_sock.connect(server_path)
except(socket.error):
    print("Failed to connect")
    sys.exit(1)


@socketio.on("command")
def gdb_recv(methods=['GET','POST']):
    print("Received command")
    gdb_sock.sendall(b"disas main")

if __name__ == '__main__':
    socketio.run(app, debug=True, port=5001)