import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

//console.log(process.env.OPENAI_API_KEY);

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Zaddy says Hey',
    })
});

let messagesPersist = [
    {"role": "system", "content": "You are a helpful assistant, with a dominant attitude."},
];

app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt;

        messagesPersist.push({"role": "user", "content": prompt});

        const response = await openai.createChatCompletion({
            // model: "text-davinci-003",
            model: "gpt-3.5-turbo",
            // prompt: `${prompt}`,
            messages: messagesPersist,
            temperature: 0.2,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });
        
        const botResponse = response.data.choices[0].message.content;

        messagesPersist.push({"role": "assistant", "content": botResponse});

        res.status(200).send({
            bot: botResponse
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({ error });
    }
})

app.post('/reset', (req, res) => {
    messages = [
        {"role": "system", "content": "You are a helpful assistant, with a dominant attitude."},
    ];
    res.status(200).send({ status: "Reset successful" });
});

app.listen(5000, () => console.log('Server is running on port http://localhost:5000'));