from gevent.monkey import patch_all
patch_all()

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
    return output


app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")

instance = GDBProcess("../tests/binaries/hello")

@socketio.on("command")
def gdb_recv(command, methods=['GET','POST']):
    output = instance.run_command(str(command))
    print(output)
    socketio.emit('output', output)

@socketio.on("update_registers")
def update_registers(methods=['GET','POST']):
    print("registers")
    registers = instance.run_command("i r")
    socketio.emit('registers', registers)

@socketio.on("update_stack")
def update_stack(methods=['GET','POST']):
    print("stack")
    stack = instance.run_command("x/52x $rsp") #only handles 64 bit for now (rsp)
    socketio.emit('stack', stack)

@socketio.on("update_disas")
def update_disas(methods=['GET','POST']):
    print("disas")
    disas = instance.run_command("x/10i $rip") #not sure how to get previous lines...
    socketio.emit('disas', disas)

@socketio.on("update_bp")
def update_bp(methods=['GET','POST']):
    print("bp")
    bp = instance.run_command("i b")
    socketio.emit('bp', bp)

@socketio.on('add_bp')
def add_bp(to_add, methods=['GET', 'POST']):
    try:
        set_bp = instance.run_command("b *" + to_add)
        print(set_bp)
    except gdb.error:
        print("Invalid BP")

@socketio.on("delete_bp")
def delete_bp(to_delete, methods=['GET','POST']):
    print('del bp')
    i = 0
    while to_delete[i]:
        instance.run_command("d " + to_delete[i])
        print(instance.run_command("i b"))
        i+=1

@socketio.on("no_out_command")#no output desired
def gdb_recv_no_out(command, methods=['GET','POST']):
    output = instance.run_command(str(command))
    print(output)

socketio.run(app, debug=False, port=5001)
