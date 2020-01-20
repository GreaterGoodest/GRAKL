var socket = io.connect('http://' + document.domain + ':5001') 

socket.on('connect', function(){
    socket.emit('no_out_command', 'b *main')
    socket.emit('no_out_command', 'r')
    socket.emit('update_disas')
    var button = $('#step').click(function(){
        socket.emit('no_out_command', 'stepi')
        socket.emit('update_registers')
        socket.emit('update_stack')
        socket.emit('update_disas')
    })
})

socket.on('output', function(msg){
    console.log("message: " + msg)
    msg = msg.replace(/\n/g, "<br />")
    $('span.debug_output').append(msg)
})

socket.on('disas', function(data){
    console.log("data: " + data)
    data = data.replace(/\n/g, "<br />")
    $('span.disas').html(data)
})

socket.on('registers', function(data){
    console.log("data: " + data)
    data = data.replace(/\n/g, "<br />")
    $('span.registers').html(data)
})

socket.on('stack', function(data){
    console.log("data: " + data)
    data = data.replace(/\n/g, "<br />")
    $('span.stack').html(data)
})