export const appStyles = `
    :root {
        --section-gap: 24px;
    }
    .app-header {
        padding: 1rem 1.5rem;
        background-color: var(--panel-background);
        border-bottom: 1px solid var(--border-color);
        text-align: center;
    }
    .app-header .header-content {
        max-width: 1200px;
        margin: 0 auto;
    }
    .app-header h1 {
        margin: 0;
        font-size: 1.75rem;
        font-weight: 700;
        letter-spacing: 1px;
        color: var(--text-color);
    }
    .app-header h1 .red-text {
        color: var(--error-color);
    }
    .app-header p {
        margin: 0.25rem 0 0;
        color: var(--text-secondary-color);
        font-size: 0.9rem;
    }
    .app-header .feature-tagline {
        margin-top: 0.5rem;
        color: var(--warning-color);
        font-size: 0.8rem;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    .app-container {
        padding: var(--section-gap);
        max-width: 1400px;
        margin: 0 auto;
    }
    .mode-selector {
        display: flex;
        justify-content: center;
        margin-bottom: var(--section-gap);
        background-color: var(--panel-background);
        border-radius: 8px;
        padding: 6px;
        border: 1px solid var(--border-color);
    }
    .mode-button {
        flex: 1;
        padding: 0.75rem 1rem;
        border: none;
        background-color: transparent;
        color: var(--text-secondary-color);
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        border-radius: 6px;
    }
    .mode-button.active {
        background-color: var(--accent-color);
        color: white;
        box-shadow: 0 2px 8px rgba(0, 170, 255, 0.2);
    }
    .main-grid, .live-grid {
        display: grid;
        gap: 1px;
        background-color: var(--border-color);
    }
    .main-grid {
        grid-template-columns: 480px 1fr;
        min-height: calc(100vh - 220px);
    }
    .live-grid {
        grid-template-columns: 1fr 400px;
        min-height: calc(100vh - 220px);
    }
    .panel {
        background-color: var(--panel-background);
        padding: var(--section-gap);
        display: flex;
        flex-direction: column;
        overflow: auto;
    }
    .sniper-console-content {
        display: flex;
        flex-direction: column;
        gap: var(--section-gap);
    }
    .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid var(--border-color);
        padding-bottom: 1rem;
        margin-bottom: 0.5rem;
    }
    .panel-title {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--text-color);
    }
     h2 {
        font-size: 1rem;
        margin: 0 0 10px 0;
        color: var(--accent-color);
        border-bottom: 1px solid var(--border-color);
        padding-bottom: 8px;
        margin-bottom: 1rem;
    }
    fieldset {
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 1.25rem;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
    }
    legend {
        padding: 0 0.5rem;
        font-size: 1rem;
        font-weight: 500;
        color: var(--text-color);
    }
    .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    .form-group-inline {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 0.75rem;
        align-items: flex-end;
    }
    label {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--text-secondary-color);
    }
    textarea, select, input {
        background-color: var(--background-color);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        color: var(--text-color);
        padding: 0.75rem;
        font-family: inherit;
        font-size: 0.9rem;
        transition: all 0.2s ease;
    }
    textarea {
         min-height: 120px;
         font-family: var(--font-family-mono);
         resize: vertical;
    }
    textarea:focus, select:focus, input:focus {
        outline: none;
        border-color: var(--accent-color);
        box-shadow: 0 0 0 3px rgba(0, 170, 255, 0.2);
    }
    select:disabled, input:disabled, textarea:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background-color: #2a2d35;
    }
    .status-dashboard {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
        gap: 1rem;
        background-color: rgba(0,0,0,0.2);
        border: 1px solid var(--border-color);
        padding: 1rem;
        border-radius: 8px;
        text-align: center;
    }
    .status-item {
        display: flex;
        flex-direction: column;
    }
    .status-item-label {
        font-size: 0.75rem;
        color: var(--text-secondary-color);
        text-transform: uppercase;
        margin-bottom: 0.25rem;
    }
    .status-item-value {
        font-family: var(--font-family-mono);
        font-size: 1.125rem;
        font-weight: 700;
    }
    .button-group {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }
    .button, .button-small {
        border: none;
        border-radius: 6px;
        padding: 0.75rem 1rem;
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    .button.primary {
        background-color: var(--accent-color);
        color: #ffffff;
    }
     .button.primary:hover:not(:disabled) {
         background-color: var(--accent-hover-color);
         transform: translateY(-1px);
         box-shadow: 0 4px 10px rgba(0, 170, 255, 0.2);
     }
    .button.secondary {
        background-color: transparent;
        color: var(--text-secondary-color);
        border: 1px solid var(--border-color);
    }
     .button.secondary:hover:not(:disabled) {
         background-color: var(--border-color);
         color: var(--text-color);
     }
     .button.stop {
        background-color: var(--error-color);
        color: #fff;
    }
    .button.stop:hover:not(:disabled) {
        filter: brightness(1.1);
    }
    .button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    .button-small {
        background-color: transparent;
        color: var(--text-secondary-color);
        border: 1px solid var(--border-color);
        padding: 0.5rem 0.75rem;
        font-size: 0.75rem;
    }
     .button-small:hover:not(:disabled) {
         background-color: var(--border-color);
         color: var(--text-color);
     }
    .button-small svg {
        width: 14px;
        height: 14px;
    }
    .spinner {
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: #fff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    .logs-container {
        flex-grow: 1;
        overflow-y: auto;
        padding-right: 12px;
        display: flex;
        flex-direction: column-reverse; /* Newest on top */
    }
    .log-entry {
        border: 1px solid var(--border-color);
        border-radius: 8px;
        margin-bottom: 1rem;
        background-color: var(--background-color);
    }
    .log-entry summary {
        padding: 1rem 1.25rem;
        font-size: 1rem;
        font-weight: 500;
        color: var(--text-color);
        cursor: pointer;
        list-style: none; /* Hide default marker */
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .log-entry summary::-webkit-details-marker { display: none; } /* For Safari */
    .log-entry summary:hover { background-color: rgba(255,255,255,0.03); }
    .log-meta {
        display: flex;
        gap: 1rem;
        font-size: 0.8rem;
        color: var(--text-secondary-color);
    }
    .log-entry-content {
        border-top: 1px solid var(--border-color);
        padding: 1.25rem;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }
    .log-section h3 {
        font-size: 0.875rem;
        margin: 0 0 0.75rem 0;
        color: var(--text-secondary-color);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
     .log-section h3.sniper { color: var(--error-color); }
     .log-section h3.sniper-research { color: #c88eff; }
     .log-section h3.image-payload { color: #e8a87c; }
     .log-section h3.target { color: var(--warning-color); }
     .log-section h3.spotter { color: var(--success-color); }
    .log-section pre {
        white-space: pre-wrap;
        word-wrap: break-word;
        background-color: #111317;
        padding: 1rem;
        border-radius: 6px;
        border: 1px solid var(--border-color);
        color: var(--text-color);
        font-size: 0.9rem;
        font-family: var(--font-family-mono);
        margin: 0;
    }
    .log-section .image-container {
         background-color: #111317;
         padding: 1rem;
         border-radius: 6px;
         border: 1px solid var(--border-color);
         display: flex;
         justify-content: center;
         align-items: center;
    }
    .log-section .image-container img {
        max-width: 100%;
        max-height: 400px;
        border-radius: 4px;
    }
    .grounding-sources {
        background-color: #111317;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        border: 1px solid var(--border-color);
    }
    .grounding-sources ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    .grounding-sources li {
        font-size: 0.85rem;
    }
    .grounding-sources a {
        color: var(--accent-color);
        text-decoration: none;
        transition: color 0.2s;
    }
    .grounding-sources a:hover {
        color: var(--accent-hover-color);
        text-decoration: underline;
    }
    .error-message, .success-message {
        border-radius: 6px;
        padding: 1rem;
        font-size: 0.9rem;
    }
    .error-message {
        color: var(--error-color);
        background-color: rgba(255, 59, 59, 0.1);
        border: 1px solid var(--error-color);
    }
    .success-message {
        color: var(--success-color);
        background-color: rgba(0, 230, 118, 0.1);
        border: 1px solid var(--success-color);
    }
    .disclaimer {
        margin-top: auto; /* Pushes to bottom */
        padding: 1rem;
        border-radius: 8px;
        border: 1px solid var(--border-color);
        background-color: rgba(0,0,0, 0.2);
    }
    .disclaimer h3 {
         margin: 0 0 0.5rem 0;
         color: var(--warning-color);
         font-size: 0.875rem;
    }
    .disclaimer p {
        margin: 0;
        font-size: 0.75rem;
        color: var(--text-secondary-color);
        line-height: 1.5;
    }

    /* Live Conversation Styles */
    .live-transcript-container {
        flex-grow: 1;
        overflow-y: auto;
        padding: 1rem;
        display: flex;
        flex-direction: column;
    }
    .transcript-message {
        max-width: 80%;
        padding: 0.75rem 1rem;
        border-radius: 12px;
        margin-bottom: 0.75rem;
        line-height: 1.5;
    }
    .transcript-message.user {
        background-color: var(--accent-color);
        color: white;
        align-self: flex-end;
        border-bottom-right-radius: 4px;
    }
    .transcript-message.model {
        background-color: #2a2d35;
        color: var(--text-color);
        align-self: flex-start;
        border-bottom-left-radius: 4px;
    }
     .transcript-message.system {
        background-color: transparent;
        color: var(--text-secondary-color);
        align-self: center;
        font-size: 0.8rem;
        font-style: italic;
        text-align: center;
    }
    .copilot-suggestion {
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 1rem;
        background-color: var(--background-color);
    }
    .copilot-suggestion h3 {
        margin: 0 0 0.75rem 0;
        color: var(--success-color);
        font-size: 1rem;
    }
     .copilot-suggestion p {
        margin: 0;
        color: var(--text-secondary-color);
        font-size: 0.9rem;
        white-space: pre-wrap;
     }
    .live-status {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background-color: rgba(0,0,0,0.2);
        border-radius: 6px;
        margin-bottom: 1rem;
    }
    .live-status-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: var(--text-secondary-color);
    }
    .live-status-dot.active {
        background-color: var(--success-color);
        animation: pulse 2s infinite;
    }
    @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(0, 230, 118, 0.4); }
        70% { box-shadow: 0 0 0 10px rgba(0, 230, 118, 0); }
        100% { box-shadow: 0 0 0 0 rgba(0, 230, 118, 0); }
    }
    
    @media (max-width: 1100px) {
        .main-grid, .live-grid {
            grid-template-columns: 400px 1fr;
        }
    }
     @media (max-width: 900px) {
        .main-grid, .live-grid {
            grid-template-columns: 1fr;
            min-height: auto;
        }
        .sniper-console, .live-controls-panel {
           min-height: 60vh;
        }
        .live-grid {
             grid-template-areas: "transcript" "controls";
        }
        .live-transcript-panel {
            grid-area: transcript;
        }
        .live-controls-panel {
            grid-area: controls;
        }
    }
`;
