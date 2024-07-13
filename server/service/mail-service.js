const nodemailer = require('nodemailer');

class MailService {

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.beget.com',
            port: '2525',
            secure: false,
            auth: {
                user: 'sporlive@sporlive.ru',
                pass: 'dgm&RSKB8oHy'
            }
        })
    }

    async sendMail(to, link) {
        await this.transporter.sendMail({
            from: 'sporlive@sporlive.ru',
            to,
            subject: 'Восстановление пароля',
            text: '',
            html:
                `
                    <div>
                        <h1>Для активации перейдите по ссылке</h1>
                        <a href="${link}">${link}</a>
                    </div>
                `
        })
    }
}

module.exports = new MailService();
