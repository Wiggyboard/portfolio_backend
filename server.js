const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const fs = require('fs');
const https = require('https');
require('dotenv').config();


const app = express();
const port = 4000;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/send', (req, res) => {
    const { name, email, message } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'scottfreedman2@gmail.com',
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: email,
        to: 'scottfreedman2@gmail.com',
        subject: 'New Form Submission',
        text: `From: ${name}\nEmail: ${email}\n\n${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(error.toString());
        }
        res.send('Email sent: ' + info.response);
    });
});

const credentials = {
    key: fs.readFileSync('/etc/letsencrypt/live/api.wiggyboard.com/privkey.pem', 'utf8'),
    cert: fs.readFileSync('/etc/letsencrypt/live/api.wiggyboard.com/fullchain.pem', 'utf8')
};

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, 'https://api.wiggyboard.com', () => {
    console.log(`Server is running at https://api.wiggyboard.com:${port}`);
});
