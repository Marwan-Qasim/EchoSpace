from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')
CORS(app, origins=["http://localhost:3000"])

# Initialize SocketIO with CORS
socketio = SocketIO(app, cors_allowed_origins="http://localhost:3000")

# Simple in-memory storage for demo (replace with MongoDB for production)
import json
import os
from collections import defaultdict

# In-memory storage (for demo purposes)
rooms_storage = {
    "general": {
        "name": "general",
        "description": "General discussion room",
        "created_at": datetime.utcnow(),
        "active_users": 0
    },
    "random": {
        "name": "random",
        "description": "Random conversations",
        "created_at": datetime.utcnow(),
        "active_users": 0
    }
}

messages_storage = defaultdict(list)

@app.route('/')
def index():
    return jsonify({"message": "EchoSpace Backend API", "status": "running"})

@app.route('/api/rooms', methods=['GET'])
def get_rooms():
    """Get all available chat rooms"""
    try:
        rooms = list(rooms_storage.values())
        return jsonify({"rooms": rooms})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/rooms', methods=['POST'])
def create_room():
    """Create a new chat room"""
    try:
        data = request.get_json()
        room_name = data.get('name')
        room_description = data.get('description', '')

        if not room_name:
            return jsonify({"error": "Room name is required"}), 400

        if room_name in rooms_storage:
            return jsonify({"error": "Room already exists"}), 400

        room_data = {
            "name": room_name,
            "description": room_description,
            "created_at": datetime.utcnow(),
            "active_users": 0
        }

        rooms_storage[room_name] = room_data
        return jsonify({"room": room_data}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@socketio.on('connect')
def handle_connect():
    print(f"Client connected: {request.sid}")

@socketio.on('disconnect')
def handle_disconnect():
    print(f"Client disconnected: {request.sid}")
    # Remove user from all rooms they were in
    for room in rooms_collection.find():
        leave_room(room['name'])

@socketio.on('join_room')
def handle_join_room(data):
    """Handle user joining a chat room"""
    room_name = data.get('room')
    username = data.get('username')

    if room_name and username and room_name in rooms_storage:
        join_room(room_name)

        # Update active users count
        rooms_storage[room_name]["active_users"] += 1

        # Broadcast to room that user joined
        emit('user_joined', {
            'username': username,
            'room': room_name,
            'timestamp': datetime.utcnow().isoformat()
        }, room=room_name)

        print(f"{username} joined room: {room_name}")

@socketio.on('leave_room')
def handle_leave_room(data):
    """Handle user leaving a chat room"""
    room_name = data.get('room')
    username = data.get('username')

    if room_name and username and room_name in rooms_storage:
        leave_room(room_name)

        # Update active users count
        rooms_storage[room_name]["active_users"] = max(0, rooms_storage[room_name]["active_users"] - 1)

        # Broadcast to room that user left
        emit('user_left', {
            'username': username,
            'room': room_name,
            'timestamp': datetime.utcnow().isoformat()
        }, room=room_name)

        print(f"{username} left room: {room_name}")

@socketio.on('send_message')
def handle_message(data):
    """Handle incoming chat message"""
    room_name = data.get('room')
    username = data.get('username')
    message = data.get('message')

    if room_name and username and message and room_name in rooms_storage:
        # Save message to in-memory storage
        message_data = {
            "room": room_name,
            "username": username,
            "message": message,
            "timestamp": datetime.utcnow(),
            "type": "text"
        }

        messages_storage[room_name].append(message_data)

        # Keep only last 100 messages per room
        if len(messages_storage[room_name]) > 100:
            messages_storage[room_name] = messages_storage[room_name][-100:]

        # Broadcast message to room
        emit('new_message', {
            'username': username,
            'message': message,
            'room': room_name,
            'timestamp': message_data['timestamp'].isoformat(),
            'type': 'text'
        }, room=room_name)

        print(f"Message from {username} in {room_name}: {message}")

@app.route('/api/messages/<room_name>', methods=['GET'])
def get_messages(room_name):
    """Get recent messages for a room"""
    try:
        limit = int(request.args.get('limit', 50))
        messages = messages_storage.get(room_name, [])

        # Get last 'limit' messages and reverse to show oldest first
        recent_messages = messages[-limit:]
        recent_messages.reverse()

        return jsonify({"messages": recent_messages})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("Starting EchoSpace Backend...")
    print("Server will run on http://localhost:5000")
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)