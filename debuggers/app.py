from flask import Flask, request
import socket
import sys

app = Flask(__name__)

sock = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) 
server_path = "/tmp/debug_socket"
try:
    sock.connect(server_path)
except(socket.error):
    print("Failed to connect")
    sys.exit(1)

@app.route('/')
def index():
    sock.sendall(b"disas main")