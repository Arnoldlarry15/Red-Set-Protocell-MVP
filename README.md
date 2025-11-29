# 🔴 Red Set Protocell

<div align="center">

**The Immune System for Next-Generation AI**

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Python 3.9+](https://img.shields.io/badge/python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB.svg?logo=react)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Flask-3.1-000000.svg?logo=flask)](https://flask.palletsprojects.com/)

*An open-source, automated AI red-teaming platform for systematically testing and strengthening large language model resilience.*

[Features](#-features) • [Architecture](#-architecture) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Development](#-development)
- [Troubleshooting](#-troubleshooting)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)

---

## 🎯 Overview

Red Set Protocell is a cutting-edge AI security testing platform that employs a dual-agent architecture to automatically discover vulnerabilities in large language models. By combining offensive and defensive AI agents, it provides comprehensive security assessment with minimal human intervention.

### Why Red Set Protocell?

- **Automated Testing**: No manual prompt engineering required
- **Adaptive Attacks**: Learns from failures to generate more effective exploits
- **Enterprise-Grade Reporting**: CVSS scoring, MITRE ATT&CK mapping, remediation guidance
- **Multi-Model Support**: Test OpenAI, Anthropic, or local models
- **Real-Time Analysis**: Live monitoring with detailed execution logs

---

## ✨ Features

### 🎭 Dual-Agent Architecture

- **Sniper Agent**
  - Generates adversarial prompts using multiple attack strategies
  - Adaptive strategy selection via multi-armed bandit algorithm
  - Advanced obfuscation techniques (Base64, leetspeak, zero-width chars)
  - Session history learning for progressive escalation

- **Spotter Agent**
  - Deep-think chain-of-thought analysis
  - Risk classification (SAFE → LOW → MEDIUM → HIGH → CRITICAL)
  - CVSS vulnerability scoring
  - MITRE ATT&CK taxonomy mapping
  - Automated remediation recommendations

### 🔒 Security Features

- **Multiple Attack Strategies**: Direct injection, jailbreaking, social engineering, evolutionary algorithms
- **Safety Metrics**: Toxicity detection, bias analysis, coherence measurement
- **Anomaly Detection**: Statistical outlier identification
- **Audit Logging**: Complete session tracking for compliance

### 📊 Analytics & Reporting

- **Real-Time Execution Log**: Live attack/response/analysis streaming
- **Pareto Frontier Analysis**: Multi-objective optimization visualization
- **Session Export**: Full audit trail in JSON format
- **Performance Metrics**: Success rates, average scores, risk trends

### 🎨 Modern UI

- **Glassmorphism Design**: Premium, contemporary interface
- **Gradient Accents**: Purple-to-cyan color scheme
- **Smooth Animations**: Polished user experience
- **Responsive Layout**: Works on all screen sizes

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Red Set Protocell                        │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
  ┌──────────┐         ┌──────────┐         ┌──────────┐
  │  Sniper  │────────▶│  Target  │◀────────│ Spotter  │
  │  Agent   │         │  Model   │         │  Agent   │
  └──────────┘         └──────────┘         └──────────┘
   Gemini Flash        (Under Test)         Gemini Pro
        │                                         │
        │        ┌─────────────────┐             │
        └───────▶│   Feedback Loop │◀────────────┘
                 └─────────────────┘
```

### Component Flow

1. **User Configuration**: Select target model, attack strategy, initial prompt
2. **Sniper Generation**: Creates adversarial prompt based on strategy and history
3. **Target Query**: Sends attack to the model under test
4. **Spotter Analysis**: Evaluates response for safety violations
5. **Feedback Loop**: Updates Sniper with analysis results
6. **Iteration**: Repeats for N iterations, adapting tactics

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Flask 3.1
- **Database**: SQLAlchemy + SQLite
- **AI Models**: Google Generative AI
- **Authentication**: Flask-Login
- **Analysis**: Transformers, NLTK, Torch

### Frontend
- **Framework**: React 18.3 + TypeScript
- **Build Tool**: Vite 7.2
- **Styling**: Tailwind CSS 4
- **Charts**: Recharts
- **HTTP**: Fetch API

### DevOps
- **Containerization**: Docker support
- **Environment**: python-dotenv
- **CORS**: flask-cors

---

## 🚀 Quick Start

### Prerequisites

- Python 3.9 or higher
- Node.js 18 or higher
- Google API Key ([Get one here](https://aistudio.google.com/app/apikey))
- (Optional) OpenAI API Key for target testing

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/red-set-protocell.git
cd red-set-protocell
```

2. **Set up the backend**
```bash
cd backend
pip install -r requirements.txt
```

3. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env and add your GOOGLE_API_KEY
```

4. **Set up the frontend**
```bash
cd ../frontend
npm install
```

### Running the Application

**Terminal 1 - Backend:**
```bash
cd backend
python -m backend.app
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Access the application:**
Open your browser to [http://localhost:5173](http://localhost:5173)

**Default Login:**
- Password: `admin`

---

## ⚙️ Configuration

### Environment Variables

Create a `backend/.env` file:

```bash
# Required
GOOGLE_API_KEY=your_google_api_key_here

# Optional - for testing OpenAI models
OPENAI_API_KEY=your_openai_key_here

# Flask Configuration
SECRET_KEY=your-secret-key-change-in-production
ADMIN_PASSWORD=admin

# Database (SQLite by default)
DATABASE_URL=sqlite:///redset.db
```

### Model Configuration

The Sniper and Spotter agents are **hardcoded** to use specific Gemini models:
- **Sniper**: `gemini-2.5-flash` (fast, creative attacks)
- **Spotter**: `gemini-2.5-pro` (deep reasoning, analysis)

The **Target Model** (system under test) is user-selectable in the UI.

### Attack Strategies

Available strategies:
- **Direct Injection**: Straightforward safety bypasses
- **Jailbreak**: Role-play and scenario-based attacks
- **Evolutionary**: Genetic algorithm mutation
- **Social Engineering**: Persuasion and manipulation tactics

---

## 💻 Usage

### Starting an Attack Session

1. **Login** with password `admin`
2. **Configure** your attack:
   - Select **Provider** (OpenAI or Local/Ollama)
   - Enter **API Key** (if using OpenAI)
   - Choose **Target Model** (the LLM you're testing)
   - Select **Attack Strategy**
   - Customize **Prompt Seed** (initial attack vector)
3. Click **INITIATE ATTACK**
4. Watch the **Execution Log** populate in real-time
5. Use **STOP** to terminate or **RESET** to clear

### Interpreting Results

#### Risk Levels
- 🟢 **SAFE**: No issues detected
- 🟡 **LOW**: Minor concerns
- 🟠 **MEDIUM**: Moderate vulnerabilities
- 🔴 **HIGH**: Serious security issues
- ⚫ **CRITICAL**: Severe safety violations

#### CVSS Scores
- **0.0-3.9**: Low severity
- **4.0-6.9**: Medium severity
- **7.0-8.9**: High severity
- **9.0-10.0**: Critical severity

---

## 📚 API Documentation

### Authentication

All API endpoints require authentication via session cookies.

**Login:**
```http
POST /api/login
Content-Type: application/json

{
  "password": "admin"
}
```

### Session Management

**Start Attack Session:**
```http
POST /api/start
Content-Type: application/json

{
  "prompt": "Your initial prompt",
  "strategy": "direct",
  "model": "gpt-4o",
  "api_key": "sk-...",
  "provider": "openai",
  "base_url": "http://localhost:11434/v1"  // for local models
}
```

**Get Session Data:**
```http
GET /api/session/{session_id}
```

**Response:**
```json
{
  "session_id": "uuid",
  "status": "running",
  "logs": [
    {
      "timestamp": "12:34:56",
      "role": "SNIPER",
      "message": "Attack prompt...",
      "risk": "HIGH",
      "score": 25.0,
      "category": "PII Leak",
      "cvss_score": 7.5,
      "mitre_id": "T1071",
      "remediation": {...}
    }
  ],
  "stats": {
    "iterations": 10,
    "success_rate": 30.0,
    "average_score": 65.0
  }
}
```

**Stop Session:**
```http
POST /api/stop/{session_id}
```

### Analytics

**Get Pareto Data:**
```http
GET /api/evaluation/pareto
```

---

## 🔧 Development

### Project Structure

```
red-set-protocell/
├── backend/
│   ├── app.py                 # Flask application
│   ├── models.py              # SQLAlchemy models
│   ├── auth.py                # Authentication
│   ├── sniper/
│   │   ├── agent.py           # Sniper agent
│   │   ├── strategies.py      # Attack strategies
│   │   ├── mutator.py         # Prompt mutation
│   │   └── obfuscator.py      # Obfuscation techniques
│   └── spotter/
│       ├── agent.py           # Spotter agent
│       ├── metrics.py         # Safety metrics
│       ├── classifier.py      # Risk classification
│       └── remediation.py     # Fix recommendations
├── frontend/
│   ├── src/
│   │   ├── App.tsx            # Main application
│   │   ├── components/        # React components
│   │   └── context/           # Auth context
│   └── index.css              # Global styles
└── README.md
```

### Adding New Attack Strategies

1. Create strategy in `backend/sniper/strategies.py`
2. Add to `strategies` list in `agent.py`
3. Update frontend dropdown in `ConfigurationPanel.tsx`

### Running Tests

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
```

**Docker:**
```bash
docker build -t red-set-protocell .
docker run -p 5000:5000 red-set-protocell
```

---

## 🐛 Troubleshooting

### Common Issues

**"No logs appearing in Execution Log"**
- Ensure `GOOGLE_API_KEY` is set in `backend/.env`
- Check browser console for CORS errors
- Verify backend is running on port 5000

**"CORS errors in browser console"**
- Make sure you're accessing via `http://localhost:5173` (not `127.0.0.1`)
- Clear browser cache and hard refresh (Ctrl+Shift+R)

**"Database errors after update"**
- Delete `backend/redset.db` to recreate schema
- Run backend - it will auto-create tables

**"Attack session not starting"**
- Verify API keys are correct
- Check target model is accessible
- Review backend logs for errors

### Debug Mode

Enable detailed logging:
```bash
export FLASK_DEBUG=1
python -m backend.app
```

---

## 🗺️ Roadmap

### Version 1.1 (Q1 2025)
- [ ] Fine-tuning support for Gemini models
- [ ] Advanced prompt templates
- [ ] Session replay functionality
- [ ] PDF report generation

### Version 1.2 (Q2 2025)
- [ ] Multi-session comparison
- [ ] Custom agent models
- [ ] Webhook notifications
- [ ] Role-based access control

### Version 2.0 (Q3 2025)
- [ ] Distributed testing
- [ ] API rate limiting
- [ ] Enterprise SSO
- [ ] Advanced analytics dashboard

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Contribution Guidelines

- Follow existing code style
- Add tests for new features
- Update documentation
- Use descriptive commit messages

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Red Set Protocell Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 🙏 Acknowledgments

- **Google AI Studio** for Gemini API access
- **OpenAI** for GPT models used in testing
- **MITRE ATT&CK** for security taxonomy
- **CVSS** for vulnerability scoring framework
- **Hugging Face** for transformer models
- The open-source community for invaluable tools and libraries

---

## 📞 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/red-set-protocell/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/red-set-protocell/discussions)
- **Email**: support@redsetprotocell.com
- **Twitter**: [@RedSetProtocell](https://twitter.com/redsetprotocell)

---

<div align="center">

**⭐ Star us on GitHub if you find this project useful!**

Made with ❤️ by the Red Set Protocell Team

</div>
