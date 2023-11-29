import {useEffect, useState} from 'react'
//import $ from "jquery"

const App = () => {

    const [value, setValue] = useState(null)
    const [message, setMessage] = useState(null)
    const [previousChats, setPreviousChats] = useState([])
    const [currentTitle, setCurrentTitle] = useState(null)

    const createNewChat = () => {
        setMessage(null)
        setValue("")
        setCurrentTitle(null)
    }

    const handleClick = (uniqueTitle) => {
        setCurrentTitle(uniqueTitle)
        setMessage(null)
        setValue("")
    }

    const loadPDFFiles = async () => {
        console.log('PDF files which will be selected, will be embedded!!!')
        fetch('http://127.0.0.1:5000/get_file')
            .then(response => response.json())
            .then(data => {
                // console.log("PDF files selected : ", data.filesSelected);
                setPreviousChats(prevChats => (
                    [...prevChats,
                        {
                            title: currentTitle,
                            role: "Assistant",
                            content: "Files selected are loaded into the embedding model"
                        }]
                ))

            })
            .catch(error => console.error('Error:', error));
    }

    const getMessages = async () => {
        const options = {
            method: "POST",
            /*body : JSON.stringify({
                message: value
            }),*/
            body: JSON.stringify({
                message: value
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }
        try {
            const response = await fetch('http://localhost:8000/finalcompletions', options)
            const data = await response.json()
            console.log('In APP.js response for the Prompt request is', data.choices[0].text)
            setMessage(data.choices[0].text)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if (!currentTitle && value && message) {
            setCurrentTitle(value)
        }

        if (currentTitle && value && message) {
            setPreviousChats(prevChats => (
                [...prevChats,
                    {
                        title: currentTitle,
                        role: "user",
                        content: value
                    },
                    {
                        title: currentTitle,
                        role: "Assistant",
                        content: message
                    }]
            ))
        }

    }, [message, currentTitle])

    const currentChat = previousChats.filter(previousChat => previousChat.title === currentTitle)

    const uniqueTitles = Array.from(new Set(previousChats.map(previousChat => previousChat.title)))

    return (
        <div className="app">
            <section className="side-bar">
                <div id="bitslogo"></div>
                <button onClick={createNewChat}>+ New Chat</button>
                <ul className="history">
                    {uniqueTitles?.map((uniqueTitle, index) => <li key={index}
                                                                   onClick={() => handleClick(uniqueTitle)}>{uniqueTitle}</li>)}
                </ul>

                <nav id="sideBottom">
                    <p>Made by Rakshith R Student ID: 2023MT12133</p>
                    <div id="myPic"></div>
                </nav>
            </section>
            <section className="main">
                {!currentTitle && <h1>AI Assignment GPT</h1>}
                <ul className="feed">
                    {currentChat?.map((chatMessage, index) => <li key={index}>
                        <p className="role">{chatMessage.role}</p>
                        <p>{chatMessage.content}</p>
                    </li>)}
                </ul>
                <div className="bottom-section">
                    <input value={value} onChange={(e) => setValue(e.target.value)}/>
                    <div id="submit"  onClick={getMessages}>➢</div>
                    <div id="pdfRead" onClick={loadPDFFiles}></div>
                    <p className="info">
                        This is GPT is for training the model with the multiple PDF files in which it is embedded into the excel along with the floating values obtained from Open AI embeddings API and then when the question is posted then the embeddings for the question is obtained and matched with excel embeddings with cosine_similarity having high is selected and invoked the davinci model correct answer.
                    </p>
                </div>
            </section>
        </div>
    );
}

export default App
