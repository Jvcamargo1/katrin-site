const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env
const { google } = require('googleapis');

const app = express();
app.use(cors());
app.use(express.json());

const port = 3000;

app.post('/send-email', (req, res) => {
  const { nome, email, mensagem } = req.body;
  
  // Log para depuração: mostra os dados recebidos e para onde o e-mail será enviado
  console.log('--- Nova tentativa de envio ---');
  console.log('Dados recebidos:', req.body);
  console.log('Enviando e-mail para:', process.env.EMAIL_TO);
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Usa a variável de ambiente
      pass: process.env.EMAIL_PASS, // Usa a variável de ambiente
    },
  });
app.post('/send-email', async (req, res) => {
  try {
    const { nome, email, mensagem } = req.body;
    console.log('--- Nova submissão recebida ---');
    console.log('Dados:', req.body);

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
    // Autenticação com a conta de serviço
    const auth = new google.auth.GoogleAuth({
      keyFile: 'credentials.json', // O arquivo que você baixou
      scopes: 'https://www.googleapis.com/auth/spreadsheets',
    });

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('ERRO AO ENVIAR E-MAIL:', error); // Usar console.error para destacar o erro
      res.status(500).send('Ocorreu um erro ao enviar o e-mail.');
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).send('E-mail enviado com sucesso!');
    }
  });
    const sheets = google.sheets({ version: 'v4', auth });

    // ID da sua planilha (pegue da URL: docs.google.com/spreadsheets/d/ID_DA_PLANILHA/edit)
    const spreadsheetId = 'COLE_O_ID_DA_SUA_PLANILHA_AQUI';

    // Adiciona a nova linha
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Página1!A:D', // Nome da aba e colunas
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[nome, email, mensagem, new Date().toLocaleString('pt-BR')]],
      },
    });

    console.log('Dados salvos na planilha com sucesso!');
    res.status(200).send('Dados enviados com sucesso!');

  } catch (error) {
    console.error('ERRO AO SALVAR NA PLANILHA:', error);
    res.status(500).send('Ocorreu um erro ao processar a solicitação.');
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
