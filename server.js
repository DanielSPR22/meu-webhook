require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
    const perguntaUsuario = req.body.queryResult.queryText;

    try {
        const respostaChatGPT = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4', 
                messages: [{ role: 'user', content: perguntaUsuario }],
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const resposta = respostaChatGPT.data.choices[0].message.content;

        return res.json({ fulfillmentText: resposta });

    } catch (error) {
        console.error("Erro ao consultar ChatGPT:", error);
        return res.json({ fulfillmentText: "Desculpe, não consegui processar sua pergunta no momento." });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor Webhook rodando na porta ${PORT}`);
});
