const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');

const app = express();
app.use(cors());
app.use(express.json());

const port = 3000;

app.post('/send-email', async (req, res) => {
  try {
    const { nome, email, mensagem } = req.body;
    console.log('--- Nova submissão recebida ---');
    console.log('Dados:', req.body);

    // Autenticação com a conta de serviço
    const auth = new google.auth.GoogleAuth({
      keyFile: 'credentials.json', // O arquivo que você baixou
      scopes: 'https://www.googleapis.com/auth/spreadsheets',
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
