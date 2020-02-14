var socket = io('http://' + document.domain + ':5001', {'transports': ['websocket', 'polling']})

socket.on('connect', function(){
    socket.emit('no_out_command', 'b *main')
    socket.emit('no_out_command', 'b *main+4')
    socket.emit('no_out_command', 'b *main+16')
    socket.emit('no_out_command', 'r')
    socket.emit('no_out_command', 'c')
    socket.emit('update_disas')
    socket.emit('update_bp')
    console.log('connected')
    var button = $('#step').click(function(){
        console.log('button')
        socket.emit('no_out_command', 'stepi')
        socket.emit('update_registers')
        socket.emit('update_stack')
        socket.emit('update_disas')
    })
})

socket.on('disas', function(data){
    console.log("data: " + data)
    data = data.replace(/\n/g, "<br />")
    $('.disas').html(data)
})

socket.on('registers', function(data){
    console.log("data: " + data)
    data = data.replace(/\n/g, "<br />")
    $('.registers').html(data)
})

socket.on('stack', function(data){
    console.log("data: " + data)
    data = data.replace(/\n/g, "<br />")
    $('.stack').html(data)
})

socket.on('bp', function(data){
    console.log("data: " + data)
    data = data.replace(/\n/g, "<br />")
    $('.breakpoints').html(data)
})
