import gdb

class GDB_Process:

  def __init__(self, binary):
    gdb.execute('file {}'.format(binary)) 

  def run_command(self, command):
    return gdb.execute(command, to_string=True)

instance = GDB_Process("../tests/binaries/hello")
result = instance.run_command("disassemble main")
