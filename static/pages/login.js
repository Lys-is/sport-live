let regForm = get('#regForm'),
loginForm = get('#loginForm'),
resetForm = get('#resetForm'),
newPassForm = get('#newPasswordForm')
if(regForm){
    regForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        let data = await formGetData(regForm)
        sendFetch('/api/auth/post__registration', JSON.stringify(data), 'POST')
    })
}
else if(loginForm){
    let em = localStorage.getItem('em'),
    ps = localStorage.getItem('ps')
    if(em && ps){
        loginForm.email.value = em
        loginForm.password.value = ps
        loginForm.remember_me.checked = true
    }
    else {
        localStorage.removeItem('em')
        localStorage.removeItem('ps')
        loginForm.remember_me.checked = false
    }
    loginForm.addEventListener('submit', async(e) => {
        e.preventDefault();
        let data = await formGetData(loginForm)

        let res = await sendFetch('/api/auth/post__login', JSON.stringify(data), 'POST')
        console.log(data)
        
        if(res.accessToken){
            createCookie('token', res.accessToken, 1)
        }
        if(data.remember_me){
            localStorage.setItem('em', data.email)
            localStorage.setItem('ps', data.password)
        }
        else {
            localStorage.removeItem('em')
            localStorage.removeItem('ps')
        }
        window.location.href = '/lk?page=profile';
    })
}
else if(resetForm){
    resetForm.addEventListener('submit', async(e) => {
        e.preventDefault();
        let data = await formGetData(resetForm)
        sendFetch('/api/auth/post__reset_password', JSON.stringify(data), 'POST')
    })
}
else if(newPassForm){
    newPassForm.addEventListener('submit', async(e) => {
        e.preventDefault();
        let data = await formGetData(newPassForm)
        data.token = params.get['token']
        sendFetch('/api/auth/post__new_password', JSON.stringify(data), 'POST')
    })
}
initMasks()