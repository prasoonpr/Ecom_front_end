
import  { useState } from 'react';
import { 
  TextField, 
  Button, 
  Slide, 
  Paper, 
  IconButton 
} from '@mui/material';
import { 
  Send as SendIcon, 
  Close as CloseIcon, 
  Message as MessageIcon 
} from '@mui/icons-material';

const ContactPage = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted');
  };
  
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };
  
  const sendChatMessage = () => {
    if (message.trim()) {
      setChatMessages([...chatMessages, { text: message, sender: 'user' }]);
      setMessage('');
      // Simulate admin response
      setTimeout(() => {
        setChatMessages(prev => [...prev, { text: "Thanks for your message. An admin will respond shortly.", sender: 'admin' }]);
      }, 1000);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl overflow-hidden flex">
        {/* Contact Form */}
        <div className="w-2/3 p-8">
          <h2 className="text-3xl font-bold mb-6 text-indigo-800">Get in Touch</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextField 
              fullWidth 
              label="Name" 
              variant="outlined" 
              className="bg-purple-50"
              />
            <TextField 
              fullWidth 
              label="Email" 
              variant="outlined" 
              type="email" 
              className="bg-purple-50"
              />
            <TextField 
              fullWidth 
              label="Message" 
              variant="outlined" 
              multiline 
              rows={4} 
              className="bg-purple-50"
              />
            <Button 
              type="submit" 
              variant="contained" 
              endIcon={<SendIcon />}
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
              >
              Send Message
            </Button>
          </form>
        </div>

        {/* Image and Chat Button */}
        <div className="w-1/3 bg-indigo-600 p-8 flex flex-col justify-between items-center">
          <img 
            src="/placeholder.svg?height=200&width=200" 
            alt="Contact" 
            className="w-48 h-48 object-cover rounded-full border-4 border-white shadow-lg"
            />
          <Button
            variant="contained"
            startIcon={<MessageIcon />}
            onClick={toggleChat}
            className="mt-8 bg-white text-indigo-600 hover:bg-indigo-100 py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
            >
            Message Admin
          </Button>
        </div>
      </div>

      {/* Chat Panel */}
      <Slide direction="up" in={isChatOpen} mountOnEnter unmountOnExit>
        <Paper elevation={4} className="fixed bottom-5 right-8 w-96 h-3/4 rounded-t-lg overflow-hidden flex flex-col">
          <div className="bg-indigo-600 p-4 flex justify-between items-center">
            <h3 className="text-white font-bold">Chat with Admin</h3>
            <IconButton onClick={toggleChat} size="small" className="text-white">
              <CloseIcon />
            </IconButton>
          </div>
          <div className="flex-grow p-4 overflow-y-auto bg-gray-100">
            {chatMessages.map((msg, index) => (
              <div 
              key={index} 
              className={`mb-2 p-2 rounded-lg ${
                msg.sender === 'user' ? 'bg-indigo-200 ml-auto' : 'bg-white'
              } max-w-[80%]`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="p-4 bg-white flex">
            <TextField 
              fullWidth 
              variant="outlined" 
              placeholder="Type a message..." 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              size="small"
              />
            <IconButton onClick={sendChatMessage} color="primary">
              <SendIcon />
            </IconButton>
          </div>
        </Paper>
      </Slide>
    </div>
  );
}


export default ContactPage