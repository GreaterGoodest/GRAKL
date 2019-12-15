import socket
import gdb
import os

class DebugConnection:

  def __init__(self, sock=None):
      if sock is None:
        self.socket = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
      else:
        self.socket = sock

  def listen(self):
    server_path = '/tmp/debug_socket'
    try:
      os.unlink(server_path)
    except OSError:
      if os.path.exists(server_path):
        raise
    self.socket.bind(server_path)
    self.socket.listen(1)
    self.connection, self.address = self.socket.accept()

  def handleCommands(self, instance):
    while True:
      command = self.connection.recv(1024)
      command = command.rstrip().decode("utf-8")
      try:
        output = instance.run_command(command)
      except gdb.error as e:
        print(str(e)) 
        continue

      print(output)


class GDB_Process:

  def __init__(self, binary):
    gdb.execute('file {}'.format(binary)) 

  def run_command(self, command):
    return gdb.execute(command, to_string=True)

instance = GDB_Process("../tests/binaries/hello")
debug = DebugConnection()
debug.listen()
debug.handleCommands(instance)
