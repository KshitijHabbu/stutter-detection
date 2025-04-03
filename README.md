```markdown
# Stutter Detection Project

## Table of Contents

-   [Project Overview](#project-overview)
-   [Features](#features)
-   [File Structure](#file-structure)
-   [Installation](#installation)
-   [How to Run](#how-to-run)

## Project Overview

This project is an AI-powered tool designed to analyze audio files and detect speech patterns related to stuttering. It combines a Python Flask backend for audio processing, stutter detection, and analysis with a React-based frontend for a user-friendly interface. Users can upload audio files, view analysis results including visualizations, and manage analysis tasks. The system uses audio processing and potentially transcription techniques to provide insights into speech patterns.

## Features

-   **AI-Powered Analysis**: Utilizes backend logic to process audio and detect stuttering patterns.
-   **Stutter Type Detection**: Identifies various types of disfluencies such as repetitions, prolongations, and blocks.
-   **Audio Processing**: Extracts relevant features from audio files for detailed analysis.
-   **Transcription Analysis**: Analyzes transcribed text for patterns like word/syllable repetitions and prolongations.
-   **Web Interface**: Clean and responsive UI built with React (using Vite and Tailwind CSS) for uploading audio, managing tasks, and viewing results.
-   **Result Visualization**: Displays analysis results intuitively, including waveforms with highlighted events, spectrograms, and event distribution charts.
-   **API Integration**: Frontend communicates with the backend via a RESTful API for processing requests.
-   **Task Management**: Backend handles analysis tasks asynchronously, allowing users to check the status and retrieve results later.
-   **Authentication**: Includes user login and signup functionality.
-   **Detailed Reporting**: Generates reports summarizing detected events, severity, confidence, and stutter rate.

## File Structure

```
Stutter Detection/
├── Frontend/             # React Frontend Code
│   ├── public/
│   ├── src/              # Source files (Components, Pages, Contexts, etc.)
│   ├── package.json      # Frontend dependencies and scripts
│   ├── vite.config.js    # Vite configuration
│   └── README.md         # Frontend specific README
│   └── ... (other config files)
├── Backend/              # Flask Backend Code
│   ├── src/              # Source files (Audio, Utils, Visualization)
│   │   ├── audio/        # Audio processing, feature extraction, stutter detection
│   │   ├── utils/        # Utility scripts
│   │   └── visualization/ # Result visualization generation
│   ├── venv/             # Virtual environment (typically excluded from git)
│   ├── app.py            # Flask application entry point and API definitions
│   ├── requirements.txt  # Backend Python dependencies
│   └── README.md         # Backend specific README
│   └── ... (other scripts, test files)
└── README.md             # Main Project README (This file)
```

## Installation

1.  **Clone the repository:**
    ```bash
    # Replace with your actual repository URL if applicable
    git clone <your-repository-url>
    cd Stutter Detection
    ```

2.  **Backend Setup:**
    * Navigate to the backend directory:
        ```bash
        cd Backend
        ```
    * Create and activate a Python virtual environment:
        ```bash
        python -m venv venv
        # On Windows
        venv\Scripts\activate
        # On macOS/Linux
        source venv/bin/activate
        ```
    * Install dependencies:
        ```bash
        pip install -r requirements.txt
        ```

3.  **Frontend Setup:**
    * Navigate to the frontend directory (from the root `Stutter Detection` folder):
        ```bash
        cd ../Frontend
        ```
        *(If you are already in `Backend`, use `cd ../Frontend`)*
    * Install dependencies:
        ```bash
        npm install
        ```

## How to Run

You likely need to run both the backend and frontend servers.

1.  **Run the Backend Server:**
    * Navigate to the `Backend` directory.
    * Activate the virtual environment (if not already active):
        ```bash
        # On Windows
        venv\Scripts\activate
        # On macOS/Linux
        source venv/bin/activate
        ```
    * Start the Flask server:
        ```bash
        python app.py
        ```
        The server should start, typically listening on `http://0.0.0.0:5000`.

2.  **Run the Frontend Development Server:**
    * Navigate to the `Frontend` directory.
    * Start the Vite development server:
        ```bash
        npm run dev
        ```
        The application should be accessible at `http://localhost:5173`.

3.  **Run Both (Combined Script):**
    * The `Frontend/package.json` contains a script designed to run both servers concurrently (along with a potential Node.js server indicated by dependencies). Navigate to the `Frontend` directory and try:
        ```bash
        npm run start
        ```
        This script attempts to run the frontend (`npm run dev`), the backend (`python app.py` in the `Backend` directory), and a Node.js server (`node server/server.cjs`) simultaneously. Ensure the paths and commands within the `package.json` script are correct for your setup.

You can now access the application through the frontend URL (usually `http://localhost:5173`).
```