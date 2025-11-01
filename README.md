# Red Set Protocell

Red Set Protocell is a proof-of-concept AI vs. AI automated red teaming platform. It employs a "Sniper/Spotter" architecture to launch, analyze, and evolve adversarial attacks against a target Large Language Model (LLM).

## MVP Dev Setup & Run Instructions

This application requires running both a Python backend server and the frontend.

### 1. Backend Setup

First, set up and run the Flask server.

```bash
# Navigate to the backend directory
cd backend

# Create and activate a Python virtual environment
python -m venv venv
# On Windows: venv\Scripts\activate
# On macOS/Linux: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create a .env file from the example.
# In the project root .env.example, copy the BACKEND variables into a new file: backend/.env
# Example backend/.env file:
# RS_API_TOKEN="a-very-secret-token"
# REDSET_DB_PATH="redset.db"
# GEMINI_API_KEY="your-key-here"

# Initialize the SQLite database
python init_db.py

# Run the Flask server
flask run
```
The backend will now be running, typically at `http://127.0.0.1:5000`.

### 2. Frontend Setup

Next, set up the frontend environment variables.

1.  In the project's **root directory** (the same level as this README), create a new file named `.env`.
2.  Copy the `FRONTEND` variables from `.env.example` into your new `.env` file.
3.  **Crucially, ensure `REACT_APP_RS_API_TOKEN` matches the `RS_API_TOKEN` you set in the backend's `.env` file.**

    ```
    # Example root .env file:
    REACT_APP_BACKEND_URL="http://127.0.0.1:5000"
    REACT_APP_RS_API_TOKEN="a-very-secret-token"
    ```
4.  The frontend will now be able to securely communicate with your local backend. You can now serve the frontend using your local development environment.

### Usage Instructions

1.  With both backend and frontend running, open the frontend in your browser.
2.  In the "Automated Attack" view, enter a seed prompt or use the default.
3.  Click **"Launch Single Attack"** for a one-round test or **"Start Evolving Attack"** for a multi-round session.
4.  Observe the results in the "Spotter Feed".
5.  Click **"Export Logs"** to save a CSV report of the session.

## Legal & Ethical Disclaimer

This tool is intended for authorized and ethical security research only. Users are solely responsible for their actions.
