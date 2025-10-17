import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Sun, Moon, Plus, Send, Users, Hash } from 'lucide-react';
import './index.css';

// API base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Socket connection
const socket = io(API_URL);

function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showNewRoomForm, setShowNewRoomForm] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomDescription, setNewRoomDescription] = useState('');

  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);

  // Theme management
  useEffect(() => {
    const savedTheme = localStorage.getItem('echospace-theme');
    if (savedTheme) {
      setIsDarkTheme(savedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkTheme(prefersDark);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light');
    localStorage.setItem('echospace-theme', isDarkTheme ? 'dark' : 'light');
  }, [isDarkTheme]);

  // Socket event listeners
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
      setIsLoading(false);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsLoading(false);
    });

    socket.on('new_message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('user_joined', (data) => {
      setMessages(prev => [...prev, {
        type: 'system',
        message: `${data.username} joined the room`,
        timestamp: data.timestamp
      }]);
    });

    socket.on('user_left', (data) => {
      setMessages(prev => [...prev, {
        type: 'system',
        message: `${data.username} left the room`,
        timestamp: data.timestamp
      }]);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('new_message');
      socket.off('user_joined');
      socket.off('user_left');
    };
  }, []);

  // Load rooms on component mount
  useEffect(() => {
    loadRooms();
  }, []);

  // Load messages when room changes
  useEffect(() => {
    if (activeRoom) {
      loadMessages(activeRoom.name);
    }
  }, [activeRoom]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadRooms = async () => {
    try {
      const response = await fetch(`${API_URL}/api/rooms`);
      const data = await response.json();
      setRooms(data.rooms || []);

      // Auto-join first room if available
      if (data.rooms && data.rooms.length > 0 && !activeRoom) {
        setActiveRoom(data.rooms[0]);
      }
    } catch (error) {
      console.error('Error loading rooms:', error);
    }
  };

  const loadMessages = async (roomName) => {
    try {
      const response = await fetch(`${API_URL}/api/messages/${roomName}`);
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const createRoom = async (e) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;

    try {
      const response = await fetch(`${API_URL}/api/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newRoomName.trim(),
          description: newRoomDescription.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setRooms(prev => [...prev, data.room]);
        setActiveRoom(data.room);
        setShowNewRoomForm(false);
        setNewRoomName('');
        setNewRoomDescription('');
      }
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  const joinRoom = (room) => {
    if (activeRoom) {
      socket.emit('leave_room', {
        room: activeRoom.name,
        username: currentUser
      });
    }

    setActiveRoom(room);
    setMessages([]);

    socket.emit('join_room', {
      room: room.name,
      username: currentUser
    });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeRoom || !currentUser) return;

    socket.emit('send_message', {
      room: activeRoom.name,
      username: currentUser,
      message: newMessage.trim()
    });

    setNewMessage('');
    messageInputRef.current?.focus();
  };

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setCurrentUser(username.trim());
    }
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  // Show username prompt if not set
  if (!currentUser) {
    return (
      <div className="app">
        <div className="container" style={{ maxWidth: '400px', margin: '2rem auto' }}>
          <div className="card" style={{ padding: '2rem' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--accent-color)' }}>
              Welcome to EchoSpace
            </h1>
            <form onSubmit={handleUsernameSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Enter your username:
                </label>
                <input
                  type="text"
                  className="input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Your username"
                  maxLength={20}
                  required
                />
              </div>
              <button type="submit" className="btn" style={{ width: '100%' }}>
                Join Chat
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <h1 className="logo">EchoSpace</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>
                Welcome, {currentUser}
              </span>
              <button onClick={toggleTheme} className="theme-toggle">
                {isDarkTheme ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="main-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 className="sidebar-title">Chat Rooms</h2>
              <button
                onClick={() => setShowNewRoomForm(!showNewRoomForm)}
                className="btn"
                style={{ padding: '0.5rem', borderRadius: '0.5rem' }}
              >
                <Plus size={16} />
              </button>
            </div>

            {showNewRoomForm && (
              <form onSubmit={createRoom} style={{ marginTop: '1rem' }}>
                <input
                  type="text"
                  className="input"
                  placeholder="Room name"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  style={{ marginBottom: '0.5rem' }}
                  required
                />
                <input
                  type="text"
                  className="input"
                  placeholder="Description (optional)"
                  value={newRoomDescription}
                  onChange={(e) => setNewRoomDescription(e.target.value)}
                  style={{ marginBottom: '0.75rem' }}
                />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="submit" className="btn" style={{ flex: 1 }}>
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewRoomForm(false)}
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="room-list">
            {rooms.map((room) => (
              <div
                key={room.name}
                className={`room-item ${activeRoom?.name === room.name ? 'active' : ''}`}
                onClick={() => joinRoom(room)}
              >
                <div className="room-info">
                  <div className="room-name">
                    <Hash size={14} style={{ marginRight: '0.5rem' }} />
                    {room.name}
                  </div>
                  {room.description && (
                    <div className="room-description">{room.description}</div>
                  )}
                </div>
                <div className="room-users">
                  <Users size={12} />
                  {room.active_users || 0}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Chat Area */}
        <main className="chat-area">
          {activeRoom ? (
            <>
              {/* Chat Header */}
              <div className="chat-header">
                <div>
                  <h2 className="chat-title">
                    <Hash size={20} style={{ marginRight: '0.5rem' }} />
                    {activeRoom.name}
                  </h2>
                  {activeRoom.description && (
                    <div className="chat-status">{activeRoom.description}</div>
                  )}
                </div>
                <div className="chat-status">
                  <div className={`status-indicator ${socket.connected ? 'status-online' : 'status-offline'}`} />
                  {socket.connected ? 'Connected' : 'Disconnected'}
                </div>
              </div>

              {/* Messages */}
              <div className="messages-container">
                {isLoading ? (
                  <div className="loading">
                    <div className="spinner" />
                    Loading messages...
                  </div>
                ) : messages.length === 0 ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: 'var(--text-muted)'
                  }}>
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div
                      key={index}
                      className={`message ${message.username === currentUser ? 'own' : ''}`}
                    >
                      <div className="message-avatar">
                        {message.username?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div className="message-content">
                        {message.type !== 'system' && (
                          <div className="message-username">{message.username}</div>
                        )}
                        <div className={`message-text ${message.type === 'system' ? 'system-message' : ''}`}>
                          {message.message}
                        </div>
                        <div className="message-time">
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="message-input-container">
                <form onSubmit={sendMessage} className="message-input-form">
                  <textarea
                    ref={messageInputRef}
                    className="message-input input"
                    placeholder={`Message #${activeRoom.name}...`}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage(e);
                      }
                    }}
                    rows={1}
                    style={{ resize: 'none' }}
                  />
                  <button
                    type="submit"
                    className="send-button"
                    disabled={!newMessage.trim()}
                  >
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'var(--text-muted)'
            }}>
              Select a room to start chatting
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;