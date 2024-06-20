socket.emit('join_table');

socket.on('update_data', (data) => {
    console.log(data)
    let el = get(`input[name="${data.name}"]`);
    el.value = data.value
    console.log('update_data')
})

socket.on('update_event', (data) => {
    
})