const nodemailer = require('nodemailer');

class MailService {

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.beget.com',
            port: '2525',
            secureConnection: false,
            tls: {
                ciphers: "SSLv3",
              },
            auth: {
                user: 'sporlive@sporlive.ru',
                pass: 'dgm&RSKB8oHy'
            }
        })
    }

    async sendMail(to, link) {
        try {
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
        } catch (e) {
            throw e
        }
        
    }
}

module.exports = new MailService();
