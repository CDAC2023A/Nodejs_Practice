const nodemailer = require("nodemailer");

const sendMail = async (req, resp) => {
  let testAccount = await nodemailer.createTestAccount();

  let transporter = await nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: "edd72@ethereal.email",
      pass: "6Jd6k5aGEyM5TGpt2Z",
    },
  });
  let info = await transporter.sendMail({
    from: '"Akash Niwane 👻" <akash@gmail.com>', // sender address
    to: "akashniwane1995@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello Akash", // plain text body
    html: "<b>Hello how are you</b>", // html body
  });
  resp.json(info);
};

module.exports = sendMail;
