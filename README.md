# EchoSpace - Real-Time Chat Application

A modern, real-time chat platform with clean and minimalistic design, built with React.js frontend and Flask + Socket.IO backend.

## Features

- **Real-time messaging** with Socket.IO
- **Clean, minimalistic UI** with light/dark theme support
- **User authentication** and room management
- **Media sharing** capabilities
- **Docker support** for easy local development
- **MongoDB** for data persistence

## Tech Stack

- **Frontend**: React.js, Socket.IO client
- **Backend**: Flask, Socket.IO, Python
- **Database**: MongoDB
- **Containerization**: Docker, Docker Compose

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js (for local development without Docker)
- Python 3.8+ (for local development without Docker)

### Running with Docker (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd echospace

# Start all services
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
```

### Local Development

1. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   python app.py
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Database Setup**
   ```bash
   # MongoDB will run via Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

## Project Structure

```
echospace/
├── backend/          # Flask application
│   ├── app.py       # Main application file
│   ├── models.py    # Database models
│   └── requirements.txt
├── frontend/         # React application
│   ├── src/         # Source code
│   ├── public/      # Static files
│   └── package.json
├── docker/          # Docker configuration
└── README.md
```

## Development

- Frontend runs on `http://localhost:3000`
- Backend API runs on `http://localhost:5000`
- Socket.IO events are handled on the same ports

## License

MIT License