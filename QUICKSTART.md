# Quick Start Guide

## Installation & Setup (5 minutes)

### Step 1: Install Backend Dependencies

```powershell
cd backend
pip install -r requirements.txt
```

### Step 2: Install Frontend Dependencies

```powershell
cd ..\frontend
npm install
```

### Step 3: Create Required Directories

```powershell
cd ..\backend
mkdir runs\inputs, runs\outputs, runs\jobs, models -Force
```

## Running the Application

### Option 1: Automated Startup (Recommended)

Run the startup script from the project root:

```powershell
.\start-services.ps1
```

This will open two terminal windows:
- Backend server at `http://localhost:8000`
- Frontend app at `http://localhost:8080`

### Option 2: Manual Startup

**Terminal 1 - Backend:**
```powershell
cd backend
uvicorn api_ml:app --host 0.0.0.0 --port 8000 --reload
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

## Using the Application

1. Open browser to `http://localhost:8080`

2. Upload a video file (MP4 recommended)

3. Click on any subject in the video to track it

4. Use controls to preview:
   - Play/Pause
   - Step forward/backward
   - Reset target selection

5. Click "Render Video" to process the full video

6. Download will start automatically when complete

## System Requirements

### Minimum:
- CPU: 4 cores
- RAM: 8GB
- Python 3.8+
- Node.js 16+

### Recommended:
- CPU: 8+ cores
- RAM: 16GB
- GPU: NVIDIA GPU with CUDA support
- Python 3.10+
- Node.js 18+

## Tips

- Use MP4 format for best compatibility
- Keep videos under 5 minutes for faster processing
- GPU acceleration provides 10x+ speedup
- Lower resolution videos process faster

## Troubleshooting

**Backend won't start:**
```powershell
# Check if port 8000 is in use
netstat -ano | findstr :8000

# Use different port
uvicorn api_ml:app --port 8001
# Then update frontend/.env: VITE_API_URL=http://localhost:8001
```

**Frontend won't start:**
```powershell
# Clear cache and reinstall
rm -r node_modules
npm install
```

**Video upload fails:**
- Check video format (use MP4)
- Ensure backend is running
- Check console for errors

**Slow processing:**
- Install CUDA for GPU acceleration
- Use lower resolution videos
- Close other applications

## Next Steps

- Read [README.md](README.md) for detailed documentation
- Check API docs at `http://localhost:8000/docs`
- Customize blur/feather settings in the code
- Experiment with different video types

## Support

For issues or questions, check:
1. Console logs (F12 in browser)
2. Backend terminal output
3. API documentation at `/docs`
