var socket = io('http://' + document.domain + ':5001', {'transports': ['websocket', 'polling']})

class Breakpoint{
    constructor(id, address, symbol_data){
        this.id = id;
        this.address = address;
        this.symbol_data = symbol_data;
        this.active = true;
    }
}

var breakpoints = {}

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
    data = data.replace(/\n/g, "<br />")
    $('.disas').html(data)
})

socket.on('registers', function(data){
    data = data.replace(/\n/g, "<br />")
    $('.registers').html(data)
})

socket.on('stack', function(data){
    data = data.replace(/\n/g, "<br />")
    $('.stack').html(data)
})


function populate_bp(){
    for (var id in breakpoints){
        console.log(breakpoints[id])
        //append to text id of html element
    }

}

socket.on('bp', function(data){
    data = data.split("\n")
    data = data.slice(1)
    for (bp_info of data){
        bp_info = bp_info.split(" ")
        clean_info = []
        for (value of bp_info){
            if (value){
                clean_info.push(value)
            }
        }
        if (clean_info[clean_info.length-1] == "time" || clean_info.length == 0){
            continue
        }
        symbol_data = clean_info.slice(6)
        bp = new Breakpoint(clean_info[0], clean_info[4], symbol_data.join(" "))
        breakpoints[bp.id] = bp
    }
    populate_bp()
})
