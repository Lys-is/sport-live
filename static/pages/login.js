let regForm = get('#regForm'),
loginForm = get('#loginForm');

regForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let data = {
        email: regForm.email.value,
        password: regForm.password.value
    }
    sendFetch('/api/auth/post__registration', JSON.stringify(data), 'POST')
})
loginForm.addEventListener('submit', async(e) => {
    e.preventDefault();
    let data = {
        email: loginForm.email.value,
        password: loginForm.password.value
    }
    let res = await sendFetch('/api/auth/post__login', JSON.stringify(data), 'POST')
    console.log(res)
    if(res.accessToken){
        createCookie('token', res.accessToken, 1)
    }
    window.location.href = '/lk';
})