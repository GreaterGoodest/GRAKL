import socket
import gdb

class DebugConnection:

  def __init__(self, sock=None):
      if sock is None:
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
      else:
        self.socket = sock

  def listen(self, port):
    self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1) 
    self.socket.bind(('localhost', port))
    self.socket.listen()
    self.connection, address = self.socket.accept()

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
debug.listen(12345)
debug.handleCommands(instance)
