
# AI-Enhanced Smart Emergency Civic Response System

An integrated emergency response platform that automatically dispatches drivers (ambulance, firefighter, etc.) based on complaints reported by citizens. The system uses AI to analyze complaint text, prioritizes responses, and notifies drivers via Telegram.  

---

## Features

- Submit complaints via web dashboard (text, location, images).  
- AI-driven complaint analysis (category, priority, urgency).  
- Auto-dispatch drivers based on service type (Ambulance, Firefighter, Plumber, Electrician).  
- Telegram notifications to assigned drivers.  
- Drivers can mark complaints as **completed** via Telegram.  
- Track status of complaints (Pending → Approved → Dispatched → Completed).  
- Real-time map integration for location tracking.  

---

## Project Structure

```

AI-Enhanced-Smart-Emergency-Civic-Response-System/
├── frontend/          # React frontend
│   └── aip/           # React app
├── backend/           # Node.js + Express backend
├── ai_service/        # Python FastAPI AI microservice
├── README.md
└── ...

````

---

## Tech Stack

- **Frontend:** React.js, Leaflet (maps), Tailwind CSS  
- **Backend:** Node.js, Express, MongoDB  
- **AI Service:** Python, FastAPI  
- **Messaging:** Telegram Bot API  

---

## Prerequisites

- Node.js >= 18  
- npm >= 8  
- Python 3.9+  
- MongoDB instance (local or cloud)  
- Telegram Bot Token  

---

## Setup Instructions

### 1. Backend

1. Navigate to backend folder:

```bash
cd backend
````

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
```

4. Start backend server:

```bash
npm start
```

* ✅ Runs at `http://localhost:5001`

---

### 2. Frontend

1. Navigate to frontend React app:

```bash
cd frontend/aip
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file:

```env
REACT_APP_API_URL=http://localhost:5001/api
```

4. Start React development server:

```bash
npm start
```

* ✅ Open `http://localhost:3000` in your browser

5. Build for production (for Netlify deployment):

```bash
npm run build
```

---

### 3. AI Service (Priority Analysis)

1. Navigate to AI service folder:

```bash
cd ai_service
```

2. Create virtual environment:

```bash
python -m venv venv
```

3. Activate virtual environment:

* Windows:

```bash
venv\Scripts\activate
```

* macOS/Linux:

```bash
source venv/bin/activate
```

4. Install dependencies:

```bash
pip install -r requirements.txt
```

5. Start FastAPI server:

```bash
uvicorn priority:app --reload
```

* ✅ Runs at `http://localhost:8000`

---

### 4. Telegram Bot Integration

* Telegram bot is integrated with backend via polling.
* Drivers receive assignments and mark complaints as **completed**.
* Ensure your `.env` contains the Telegram Bot Token.

---

### 5. Deployment

**Frontend:**

* Deploy React frontend to **Netlify**:

  * Build folder: `frontend/aip/build`
  * Set environment variable: `REACT_APP_API_URL` to backend URL

**Backend:**

* Deploy Node.js backend to cloud services like Render, Railway, or Heroku
* Make sure MongoDB is accessible publicly
* Keep `TELEGRAM_BOT_TOKEN` in environment variables

**AI Service:**

* Deploy on Render, Railway, or any Python-compatible host
* Update backend/frontend to point to deployed AI service URL

---

### 6. Usage

1. Open frontend web app
2. Submit a complaint with text, location, and optional image
3. System analyzes complaint and auto-dispatches available drivers
4. Drivers receive Telegram notifications
5. Drivers mark complaint as completed via Telegram
6. Admin can approve, monitor, and complete jobs from backend

---

### 7. Important Notes

* MongoDB must be running and accessible
* Ensure Telegram Bot token is valid
* AI service must be running for automatic priority assignment
* Configure CORS in backend if frontend and backend are on different domains

---

### 8. License

MIT License

```

