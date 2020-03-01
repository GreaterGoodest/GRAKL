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
    socket.emit('no_out_command', 'start')
    socket.emit('update_disas')
    socket.emit('update_stack')
    socket.emit('update_registers')
    console.log('connected')

    var delete_button = $('#bp_delete').click(function(){
        console.log('delete')
        var to_delete = $('.bp_checkbox').filter(':checked')
        var del_ids = []
        for (i in to_delete){
            del_ids.push(to_delete[i].id)
            delete breakpoints[to_delete[i].id]
        }
        socket.emit('delete_bp', del_ids)
        socket.emit('update_bp')
    })

    var add_button = $('#bp_add').click(function(){
        console.log('add');
        var to_add = $('#add_bp').val();
        if (to_add != ""){
            if(to_add.substr(0,2) != "0x"){
                to_add = "0x".concat(to_add);
            }
            if(to_add.length > 18){
                return;
            }
            socket.emit('add_bp', to_add);
            socket.emit('update_bp')
        }
    })

    var run_button = $('#run').click(function(){
        socket.emit('no_out_command', 'r')
        socket.emit('update_registers')
        socket.emit('update_stack')
        socket.emit('update_disas')
    })

    var run_button = $('#continue').click(function(){
        socket.emit('no_out_command', 'c')
        socket.emit('update_registers')
        socket.emit('update_stack')
        socket.emit('update_disas')
    })

    var run_button = $('#finish').click(function(){
        socket.emit('no_out_command', 'fin')
        socket.emit('update_registers')
        socket.emit('update_stack')
        socket.emit('update_disas')
    })

    var stepi_button = $('#step_i').click(function(){
        socket.emit('no_out_command', 'si')
        socket.emit('update_registers')
        socket.emit('update_stack')
        socket.emit('update_disas')
    })

    var stepo_button = $('#step_o').click(function(){
        socket.emit('no_out_command', 'ni')
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

    var live_bps = document.getElementsByClassName("bp_checkbox"); //remove deleted bp checkboxes
    while (live_bps[0]){
        live_bps[0].parentNode.removeChild(live_bps[0]);
    }

    var bp_labels = document.getElementsByClassName("bp_label"); //remove deleted bp labels
    while (bp_labels[0]){
        bp_labels[0].parentNode.removeChild(bp_labels[0]);
    }

    for (var id in breakpoints){ //create checkboxes/labels for breakpoints
        //append to text id of html element
        bp = breakpoints[id];
        form = document.getElementById('breakpoints');

        var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.name = bp.id;
        checkbox.value = bp.address;
        checkbox.id = bp.id;
        checkbox.classList.add("bp_checkbox");

        var label = document.createElement('label');
        label.classList.add("bp_label");
        label.htmlFor = bp.id;
        label.appendChild(document.createTextNode(bp.address + ' ' + bp.symbol_data));

        form.appendChild(checkbox);
        form.appendChild(label);
        form.appendChild(document.createElement("br"));
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
        if (!(bp.id in breakpoints)){
            breakpoints[bp.id] = bp
        }
    }
    populate_bp()
    var bpCheckBoxes = $('.bp_checkbox');
    bpCheckBoxes.change(function(){
        $('#bp_delete').prop('disabled', !bpCheckBoxes.filter(':checked').length);
    })
    bpCheckBoxes.change();
})
