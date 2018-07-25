'use strict';
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require("fs");
const ejs = require('ejs');

// 内容来自html文件
const htmlData = fs.readFileSync('email/template.html','utf-8');

// 内容来自ejs模板
const template = ejs.compile(fs.readFileSync(path.resolve(__dirname, 'email/email.ejs'), 'utf8'));
const ejsData = template({
  title: 'Ejs',
  desc: '使用Ejs渲染模板',
});

const config = {
	host: 'smtp.qq.com',
	service: 'QQ',
	user: 'xxx@qq.com',
	pass: 'xxxxxxxx',
};

	// create reusable transporter object using the default SMTP transport
	let transporter = nodemailer.createTransport({
		// host: config.host,
		service: config.service, // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
		port: 465,
		secure: true, // true for 465, false for other ports
		auth: {
			user: config.user, // generated ethereal user
			pass: config.pass // generated ethereal password
		}
	});

	// setup email data with unicode symbols
	let mailOptions = {
		from: '"sun" <'+ config.user+'>', // sender address
		to: '"sun" <xxx@qq.com>, xxx@xxx.com', // list of receivers
		subject: 'nodemailer测试demo', // Subject line
		// text: 'Hello', // plain text body
		// html: ejsData, // 内容来自ejs模板
		html: htmlData, // 内容来自html文件
		attachments: [
			{   // utf-8 string as an attachment
				filename: 'text1.txt',
				path: path.resolve(__dirname, 'attachments/text.txt')
			},
			{   // utf-8 string as an attachment
				filename: 'text2.txt',
				content: 'i am text2.txt'
			},
			{
				filename: '蚂蚁头像.jpg',
				path: path.resolve(__dirname, 'attachments/mayi.jpg'),
				cid: 'mayi.jpg'
			},
			{
				filename: '二维码',
				path: path.resolve(__dirname, 'attachments/canvas.png'),
				cid: 'qrcode'
			}
		]
	};

	// send mail with defined transport object
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			return console.log(error);
		}
		console.log('Message sent: %s', info.messageId);
		// Preview only available when sending through an Ethereal account
		console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

		// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
		// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
	});