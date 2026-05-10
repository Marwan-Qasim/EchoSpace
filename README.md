# EchoSpace

EchoSpace is a full-stack real-time chat app built with React, Vite, Node.js, Express, MongoDB, and Socket.IO. It lets users create an account, log in, update their profile, and chat with other users in real time, including image messages.

## What the project does

- User signup and login
- Protected chat experience for authenticated users
- Real-time messaging with Socket.IO
- Profile updates with image upload support
- Welcome email support after signup

## Tech stack

- Frontend: React, Vite, Tailwind CSS, DaisyUI, Zustand, Axios
- Backend: Node.js, Express, MongoDB, Mongoose, Socket.IO
- Services: Cloudinary, Resend, Arcjet

## Run locally

### 1. Install dependencies

Install dependencies for both apps:

```bash
cd frontend
npm install
cd ../backend
npm install
```

### 2. Create backend environment variables

Create a `.env` file inside `backend/` and add:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
CLIENT_URL=http://localhost:5173

RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=your_verified_sender_email
EMAIL_FROM_NAME=EchoSpace

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

ARCJET_KEY=your_arcjet_key
ARCJET_ENV=development
```

Notes:

- `MONGO_URI`, `JWT_SECRET`, and `CLIENT_URL` are needed for normal local development.
- `Cloudinary` is needed if you want image uploads to work.
- `Resend` is needed if you want welcome emails to work.
- `Arcjet` is used by the backend middleware in this project.

### 3. Start the backend

From the `backend/` folder:

```bash
npm run dev
```

The API will run on `http://localhost:3000`.

### 4. Start the frontend

From the `frontend/` folder:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`.

## Project structure

```text
frontend/   React client
backend/    Express API, database models, auth, sockets
```

## Production notes

The root `package.json` includes:

- `npm run build` to install frontend/backend dependencies and build the frontend
- `npm start` to start the backend
