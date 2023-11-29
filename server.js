const PORT = 8000
const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())

const API_KEY ='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'

app.post('/completions', async (req, res) => {
    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: req.body.message}],
            max_tokens: 100,

        })
    }
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', options);
        const data = await response.json();
        res.send(data)

    } catch (error) {
        console.error(error)
    }
})

app.post ('/finalcompletions', async (req, res) => {
    const option_for_promt = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            content: req.body.message,
        })
    }

    // Get Final Prompt from Python Server and then from OpenAI
    //try {
    const response = await fetch ('http://127.0.0.1:5000/get_final_prompt', option_for_promt)
    const finalPrompt = await response.json()
    console.log (finalPrompt.finalPromptString)
    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "text-davinci-003",
            prompt: finalPrompt.finalPromptString,
            max_tokens: 64,
        })
    }
    try {
        const response = await fetch ('https://api.openai.com/v1/completions', options)
        const data = await response.json()
        console.log (data)
        res.send (data)
    } catch (error) {
        console.log ("Error in API Call")
        console.error();
    }
})

app.post('/embeddings', async (req, res) => {
    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            input: req.body.message,
            model: "text-embedding-ada-002",
            encoding_format: "float"

        })
    }
    try {
        const response = await fetch('https://api.openai.com/v1/embeddings', options);
        const data = await response.json();
        console.log(data)
        res.send(data)

    } catch (error) {
        console.error(error)
    }

})

app.listen(PORT, () => console.log(PORT => 'Your server is running on PORT' + PORT))