# 🚘 RideSafe AI – Telematics & Driver Monitoring Platform

![RideSafe AI Dashboard](./docs/demo.gif) *(Placeholder for Demo Video/GIF)*

RideSafe AI is an enterprise-grade, real-time driver safety and fleet management platform. It leverages edge AI (MediaPipe) to track driver eye movement and blink rate (PERCLOS) directly in the browser, streaming real-time telemetry to a distributed backend via WebSockets. Critical fatigue events trigger instant alerts on a live fleet management command center.

## ✨ Features

- **Real-Time Edge AI**: Face tracking and drowsiness detection running directly in the browser using MediaPipe.
- **PERCLOS Algorithm**: Scientific blink-rate and eye-closure calculation to precisely measure driver fatigue.
- **Live Fleet Telemetry**: Sub-second socket streaming of driver status to the backend.
- **Risk Engine**: Server-side processing of events to dynamically calculate driver safety scores.
- **Fleet Command Center**: Real-time WebSocket subscriptions displaying critical driver alerts across the entire fleet instantly.
- **Trip Lifecycle Orchestration**: Granular start/end session state with comprehensive historical trip summaries and Recharts analytics.
- **Robust JWT Authentication**: Secure user management and authentication flow.

## 🛠 Tech Stack

**Frontend Architecture:**
- React 18 & TypeScript
- Vite
- Zustand (Global State Management)
- React Router v6.4 (Data API Architecture)
- MediaPipe Vision API (Edge Inference)
- Socket.IO-client (Real-time events)
- Recharts (Analytics Data Visualization)
- Tailwind CSS & Lucide Icons (Styling)

**Backend Architecture:**
- Node.js & Express
- Socket.IO (Bidirectional Event Streaming)
- Mongoose (MongoDB persistence)
- Zod (Validation)
- JWT (Authentication)

## 🏗 Architecture Diagram

```txt
[ Browser Edge AI ] --> (MediaPipe FaceLandmarker) --> [ Zustand Global State ]
         |
    (WebSockets)
         |
         v
[ Node.js Backend ] --> (Risk Engine / Scoring) --> [ MongoDB ]
         |
    (WebSockets)
         |
         v
[ Fleet Manager Dashboard (Live Alerts) ]
```

## 🚀 Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/ridesafe-ai.git
   cd ridesafe-ai
   ```

2. **Install Dependencies:**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   ```

3. **Configure Environment:**
   - Create `.env` in the root (Frontend)
     ```env
     VITE_API_URL=http://localhost:5000/api
     VITE_SOCKET_URL=http://localhost:5000
     ```
   - Create `.env` in `backend/`
     ```env
     MONGO_URI="mongodb://127.0.0.1:27017/ridesafe"
     JWT_SECRET="your-super-secret-key"
     PORT=5000
     ```

4. **Start the Application:**
   Run the backend:
   ```bash
   cd backend
   npm run dev -- --host 0.0.0.0
   ```

   Run the frontend in a new terminal:
   ```bash
   npm run dev
   ```

### Expo mobile client

The `mobile/` client is Expo SDK 54 and uses the same backend, MongoDB database, REST endpoints, and Socket.IO server as the web client. For a physical phone, set `EXPO_PUBLIC_API_URL` to the computer's LAN address instead of `localhost`.

```powershell
cd mobile
npm install
Copy-Item .env.example .env
# Edit .env and replace the sample LAN address with your computer IPv4 address.
npm start
```

Then scan the Expo QR code with Expo Go, or run `npm run android` with an Android emulator/device attached.

## ☁️ Cloud Deployment (Production)

The platform is designed to be deployed across modern cloud providers:

1. **Database:** Deploy MongoDB Atlas and update `MONGO_URI` in the backend `.env`.
2. **Backend:** Deploy the `backend/` directory as a Web Service on [Render](https://render.com/). Set the build command to `npm install && npm run build` and start command to `npm start`. Ensure `MONGO_URI` and `JWT_SECRET` are configured.
3. **Frontend:** Import the project into [Vercel](https://vercel.com/). Add `VITE_API_URL` and `VITE_SOCKET_URL` pointing to your Render backend instance.

---

> Built with ❤️ by [Your Name] - Transforming road safety through AI.