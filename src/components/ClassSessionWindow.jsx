import React, { useState } from 'react';

const ClassSessionWindow = ({ classItem, course, onClose }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Teacher', text: 'Welcome to the class!', time: '10:00 AM' },
    { id: 2, sender: 'You', text: 'Hello everyone!', time: '10:01 AM' },
  ]);

  // This would typically come from your backend/database
  const allowedApps = [
    { id: 1, name: 'Visual Studio Code', icon: 'code', status: 'allowed' },
    { id: 2, name: 'Chrome Browser', icon: 'public', status: 'allowed' },
    { id: 3, name: 'Terminal', icon: 'terminal', status: 'allowed' },
    { id: 4, name: 'File Explorer', icon: 'folder', status: 'restricted' },
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          sender: 'You',
          text: message,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setMessage('');
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 ml-64">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
            >
              <span className="material-icons">arrow_back</span>
            </button>
            <div>
              <h2 className="text-2xl font-bold">{classItem.title}</h2>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                <span>{course.name}</span>
                <span>•</span>
                <span>{classItem.duration}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <span className="material-icons">record_voice_over</span>
              <span>Start Recording</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="h-[calc(100vh-80px)] overflow-hidden ml-64 flex">
        {/* Left Side - Allowed Applications */}
        <div className="w-1/4 border-r border-gray-200 p-6 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Allowed Applications</h3>
          <div className="space-y-4">
            {allowedApps.map((app) => (
              <div 
                key={app.id}
                className={`p-4 rounded-lg border ${
                  app.status === 'allowed' 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-yellow-200 bg-yellow-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="material-icons text-gray-600">{app.icon}</span>
                  <div>
                    <h4 className="font-medium">{app.name}</h4>
                    <p className="text-sm text-gray-600">
                      {app.status === 'allowed' ? 'Allowed' : 'Restricted'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Chat Room */}
        <div className="flex-1 flex flex-col">
          {/* Chat Messages */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[70%] rounded-lg p-3 ${
                      msg.sender === 'You' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium">{msg.sender}</span>
                      <span className="text-xs opacity-75">{msg.time}</span>
                    </div>
                    <p>{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Input */}
          <div className="border-t border-gray-200 p-4">
            <form onSubmit={handleSendMessage} className="flex space-x-4">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <span>Send</span>
                <span className="material-icons">send</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassSessionWindow; 