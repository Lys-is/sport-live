let regForm = get('#regForm'),
loginForm = get('#loginForm');
if(regForm){
    regForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        let data = await formGetData(regForm)
        sendFetch('/api/auth/post__registration', JSON.stringify(data), 'POST')
    })
}
else if(loginForm){
    loginForm.addEventListener('submit', async(e) => {
        e.preventDefault();
        let data = await formGetData(loginForm)
        let res = await sendFetch('/api/auth/post__login', JSON.stringify(data), 'POST')
        console.log(res)
        if(res.accessToken){
            createCookie('token', res.accessToken, 1)
        }
        window.location.href = '/lk?page=profile';
    })
}
initMasks()