# AI Smart Focus & Dynamic Subject Tracking System

Complete integration of frontend and backend for AI-powered video subject tracking with real-time blur effects.

## 🎯 Key Features

### ✅ **Upload from Your Laptop**
- Drag & drop video files
- Automatic upload to processing server
- Support for MP4, WebM, AVI, MOV formats

### ✅ **Process on Friend's RTX 4060 Laptop**
- Remote GPU-accelerated processing
- YOLOv8 AI model for subject detection
- ByteTrack for multi-object tracking
- Real-time frame processing

### ✅ **Get Processed Result Back**
- Automatic video download
- Rendered with blur effect applied
- High-quality output preservation

### ✅ **Click on Person → Blur Everything Else**
- Click-to-select any subject
- AI identifies and locks onto the person
- Background gets Gaussian blur
- Selected subject stays razor-sharp
- Real-time preview of effect

## Architecture

```
┌─────────────────────────┐
│   Your Laptop           │
│   (Frontend - Browser)  │
│   - Upload video        │
│   - Click to select     │
│   - Download result     │
└───────────┬─────────────┘
            │
            │ HTTP/REST
            │ (Internet/LAN)
            │
┌───────────▼─────────────┐
│   Friend's RTX Laptop   │
│   (Backend - Server)    │
│   - Receive video       │
│   - AI Processing       │
│   - Return result       │
│                         │
│   FastAPI Server        │
│   YOLOv8 + ByteTrack    │
│   GPU: RTX 4060         │
└─────────────────────────┘
```

## Project Structure

```
khel hackathon backend/
├── backend/          # Python FastAPI backend with YOLOv8 AI
├── frontend/         # React + TypeScript frontend
```

## Prerequisites

### Backend Requirements
- Python 3.8+
- CUDA-capable GPU (recommended) or CPU
- pip

### Frontend Requirements
- Node.js 16+
- npm or yarn

## Setup Instructions

### 1. Backend Setup

```powershell
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install Python dependencies
pip install fastapi uvicorn python-multipart opencv-python numpy ultralytics

# Create required directories
mkdir runs\inputs
mkdir runs\outputs
mkdir runs\jobs
mkdir models

# Download YOLOv8 model (will auto-download on first run)
# The model will be downloaded automatically when the server starts
```

### 2. Frontend Setup

```powershell
# Navigate to frontend directory
cd ..\frontend

# Install dependencies
npm install

# Configure environment
# The .env file is already created with default settings
# Backend API URL: http://localhost:8000
```

## Running the Application

### Start Backend Server

```powershell
# In backend directory
cd backend

# Activate virtual environment if not already activated
.\venv\Scripts\Activate.ps1

# Start FastAPI server
uvicorn api_ml:app --host 0.0.0.0 --port 8000 --reload
```

The backend API will be available at: `http://localhost:8000`

### Start Frontend Development Server

```powershell
# In a new terminal, navigate to frontend directory
cd frontend

# Start Vite development server
npm run dev
```

The frontend will be available at: `http://localhost:8080`

## How to Use

1. **Upload Video**: 
   - Open the frontend at `http://localhost:8080`
   - Drag and drop a video file or click "BROWSE FILES"
   - Wait for the video to upload and process

2. **Select Subject**:
   - Click on any subject in the video frame
   - The AI will identify and lock onto the subject
   - You'll see "TARGET LOCKED" status

3. **Preview Tracking**:
   - Use play/pause buttons to preview the tracking
   - Step through frames with forward/backward buttons
   - The selected subject stays sharp while background blurs

4. **Render Full Video**:
   - Click "Render Video" button
   - Wait for processing to complete
   - The rendered video will automatically download

5. **Reset or Try Another Subject**:
   - Click the reset button to select a different subject
   - Or upload a new video

## API Endpoints

### Backend API Documentation

Once the backend is running, visit: `http://localhost:8000/docs` for interactive API documentation.

Key endpoints:
- `POST /upload` - Upload video file
- `GET /frame` - Get processed frame with blur effect
- `POST /select` - Select subject at coordinates
- `POST /reset` - Reset target selection
- `POST /render` - Render full video with effects
- `GET /download` - Download rendered video
- `GET /health` - Health check

## Features

- ✅ **Upload from Your Laptop** - Drag & drop video files from any device
- ✅ **Remote GPU Processing** - Process on friend's RTX 4060 laptop over network
- ✅ **Click-to-Select Person** - Click on any subject to track them
- ✅ **Blur Everything Else** - Background gets Gaussian blur, subject stays sharp
- ✅ **Download Processed Video** - Get the result back automatically
- ✅ **AI-Powered Subject Detection** - YOLOv8 instance segmentation
- ✅ **Real-time Tracking** - ByteTrack algorithm
- ✅ **Frame-by-Frame Preview** - Step through video before rendering
- ✅ **Full Video Rendering** - Export complete processed video

## Tech Stack

### Backend
- FastAPI - Web framework
- YOLOv8 - Object detection & segmentation
- ByteTrack - Multi-object tracking
- OpenCV - Video processing
- NumPy - Array operations

### Frontend
- React 18 - UI framework
- TypeScript - Type safety
- Vite - Build tool
- Tailwind CSS - Styling
- Framer Motion - Animations
- Radix UI - Component primitives

## Troubleshooting

### Backend Issues

**Model download fails:**
```powershell
# Manually download YOLOv8-seg model
pip install ultralytics
python -c "from ultralytics import YOLO; YOLO('yolov8n-seg.pt')"
```

**CUDA/GPU not detected:**
- Install CUDA toolkit and cuDNN if you have NVIDIA GPU
- Or set `device="cpu"` in `api_ml.py` for CPU-only mode

**Port 8000 already in use:**
```powershell
# Use a different port
uvicorn api_ml:app --host 0.0.0.0 --port 8001 --reload
# Update VITE_API_URL in frontend/.env accordingly
```

### Frontend Issues

**Port 8080 already in use:**
- Vite will automatically use the next available port
- Or configure port in `vite.config.ts`

**API connection refused:**
- Ensure backend is running at `http://localhost:8000`
- Check `VITE_API_URL` in `.env` file
- Verify CORS settings in backend

**Video upload fails:**
- Check video file format (MP4 recommended)
- Ensure video file size is reasonable (<500MB)
- Check backend logs for errors

## Performance Tips

1. **For faster preview**: Lower resolution is used automatically (640px)
2. **For faster rendering**: Set `downscale=720` in render options
3. **For best quality**: Remove downscale parameter (uses original resolution)
4. **GPU acceleration**: Ensure CUDA is properly installed for 10x+ speedup

## Development

### Backend Development
```powershell
# Run with auto-reload
uvicorn api_ml:app --reload

# Run tests (if available)
pytest
```

### Frontend Development
```powershell
# Development with HMR
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test
```

## License

This project was created for a hackathon. Please refer to individual licenses of the libraries used.

## Credits

- YOLOv8 by Ultralytics
- ByteTrack for multi-object tracking
- Radix UI for accessible components
- Tailwind CSS for styling
