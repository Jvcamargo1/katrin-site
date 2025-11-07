const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const port = 3000;

app.post('/send-email', (req, res) => {
  const { nome, email, mensagem } = req.body;

  // --- IMPORTANTE: COLOQUE A SENHA DE APP AQUI ---
  const appPassword = 'SUA_SENHA_DE_APP_AQUI';
  // ----------------------------------------------

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'eletricakatrin@gmail.com',
      pass: appPassword,
    },
  });

  const mailOptions = {
    from: `"${nome}" <${email}>`,
    to: 'katrineletrica@hotmail.com',
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
