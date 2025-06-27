import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { chatService } from '../utils/api.js';

const ChatRoom = ({ classId, className }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const wsRef = useRef(null);

  useEffect(() => {
    // Initialize WebSocket connection for real-time chat
    const connectWebSocket = () => {
      const wsUrl = `ws://192.168.1.2:3000/chat/${classId}?userId=${user.userId}&username=${user.username}`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        setIsConnected(true);
        console.log('Chat WebSocket connected');
      };

      wsRef.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        setMessages(prev => [...prev, message]);
      };

      wsRef.current.onclose = () => {
        setIsConnected(false);
        console.log('Chat WebSocket disconnected');
        // Attempt to reconnect after 3 seconds
        setTimeout(connectWebSocket, 3000);
      };

      wsRef.current.onerror = (error) => {
        console.error('Chat WebSocket error:', error);
      };
    };

    // Load chat history
    const loadChatHistory = async () => {
      try {
        const history = await chatService.getChatHistory(classId);
        setMessages(history);
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    };

    if (classId && user) {
      loadChatHistory();
      connectWebSocket();
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [classId, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !isConnected) return;

    const message = {
      classId,
      userId: user.userId,
      username: user.username,
      role: user.role,
      content: newMessage.trim(),
      timestamp: new Date().toISOString()
    };

    wsRef.current.send(JSON.stringify(message));
    setNewMessage('');
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'TEACHER': return 'text-blue-600';
      case 'ADMIN': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Class Chat</h3>
          <p className="text-sm text-gray-500">{className}</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm text-gray-500">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.userId === user.userId ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.userId === user.userId
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <div className="flex items-center space-x-2 mb-1">
                <span className={`font-medium text-sm ${
                  message.userId === user.userId ? 'text-blue-100' : getRoleColor(message.role)
                }`}>
                  {message.username}
                </span>
                <span className={`text-xs ${
                  message.userId === user.userId ? 'text-blue-200' : 'text-gray-500'
                }`}>
                  {formatTime(message.timestamp)}
                </span>
              </div>
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={sendMessage} className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            disabled={!isConnected}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || !isConnected}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <span>Send</span>
            <span className="material-icons text-sm">send</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;