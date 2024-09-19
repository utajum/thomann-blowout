import nodemailer from 'nodemailer';

import { axiosInstance as axios } from './envSetup';

const sendMail = (html) =>
  new Promise(async (resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const catImage =
      (
        await axios('https://api.thecatapi.com/v1/images/search?mime_types=gif', {
          params: { limit: 1, size: 'small' },
        })
      )?.data?.[0]?.url || '';

    const mailOptions = {
      from: process.env.GMAIL_USERNAME,
      to: process.env.SEND_MAIL_TO,
      subject: `Thomann Blowout ${new Date()
        .toString()
        .split(' ')
        .filter((e, i) => [0, 1, 2, 3, 4].includes(i))
        .toString()
        .replaceAll(',', ' ')}`,
      html: `<img src=${catImage}> ${html}`,
    };

    console.log('sending');

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        reject(new Error(err));
      } else {
        resolve(info);
      }
    });
  });

export default sendMail;
