const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env

const app = express();
app.use(cors());
app.use(express.json());

const port = 3000;

app.post('/send-email', (req, res) => {
  const { nome, email, mensagem } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Usa a variável de ambiente
      pass: process.env.EMAIL_PASS, // Usa a variável de ambiente
    },
  });

  const mailOptions = {
    from: `"${nome}" <${email}>`,
    to: process.env.EMAIL_TO, // Usa a variável de ambiente
    subject: 'Novo Pedido de Orçamento do Site',
    html: `
      <h2>Novo pedido de orçamento recebido pelo site:</h2>
      <p><strong>Nome:</strong> ${nome}</p>
      <p><strong>E-mail:</strong> ${email}</p>
      <p><strong>Mensagem:</strong></p>
      <p>${mensagem}</p>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send('Ocorreu um erro ao enviar o e-mail.');
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).send('E-mail enviado com sucesso!');
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
