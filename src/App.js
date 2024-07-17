import React, { useState } from 'react';
import { useSpeechSynthesis } from 'react-speech-kit';
import './index.css'; // Import the CSS file

function App() {
  const [message, setMessage] = useState('');
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [error, setError] = useState('');
  const { speak, voices } = useSpeechSynthesis();

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: userInput }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setMessage(data.message);
        setChatHistory([...chatHistory, { type: 'prompt', text: userInput }, { type: 'response', text: data.message }]);
        setUserInput(''); // Clear the input field
        speak({ text: data.message, voice: voices[106] }); // Convert response to speech
      })
      .catch((error) => setError(error.message));
  };

  return (
    <div className="app">
      <div className="messenger">
        <header className="messenger-header">
          <h1>llama3 Chat</h1>
        </header>
        <div className="chat-window">
          <div className="chat-history">
            {chatHistory.map((chat, index) => (
              <div key={index} className={`chat-message ${chat.type === 'prompt' ? 'sent' : 'received'}`}>
                <p className="message-text">{chat.text}</p>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="chat-form">
            <input
              type="text"
              value={userInput}
              onChange={handleInputChange}
              placeholder="Type a message"
              className="chat-input"
            />
            <button type="submit" className="send-button">Send</button>
          </form>
        </div>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default App;
