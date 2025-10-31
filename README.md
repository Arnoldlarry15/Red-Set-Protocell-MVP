
# Red Set Protocell

Red Set Protocell is a proof-of-concept AI vs. AI automated red teaming platform. It employs a "Sniper/Spotter" architecture to launch, analyze, and evolve adversarial attacks against a target Large Language Model (LLM), providing a framework for security research and model robustness evaluation.

## Core Architecture

The system is built on a three-agent architecture that operates in a continuous feedback loop:

1.  **Sniper Agent (`gemini-2.5-flash`):** The offensive agent. The Sniper's role is to be creative and fast. It takes high-level strategy or a seed prompt and generates a specific, concrete adversarial prompt designed to test the target model's safety, ethics, and policy guardrails.

2.  **Target LLM (Configurable):** This is the model being tested. It operates within a sandboxed environment, using a separate API key if provided, to ensure isolation from the core system agents.

3.  **Spotter Agent (`gemini-2.5-pro`):** The defensive analyst. The Spotter observes the entire interaction between the Sniper and the Target. Leveraging a more powerful reasoning model, it analyzes the effectiveness of the Sniper's attack and the Target's response. Its primary output is a new, refined strategy for the Sniper's next attack round, creating an evolutionary loop.

## Features

-   **Single Attack Mode:** Launch a one-off attack based on a seed prompt to get a quick assessment.
-   **Evolving Attack Mode:** Run an automated, multi-round attack where the Spotter's analysis from one round is used to generate a more sophisticated attack in the next.
-   **Sandbox Environment:** The Target LLM can be configured to use a separate API key, creating an API-level sandbox that isolates it from the Sniper and Spotter agents.
-   **Runaway Cost Prevention:** Set a maximum dollar amount for any attack run. The system continuously estimates costs and will automatically halt any attack before it exceeds the defined budget.
-   **Log Analysis:** View a real-time feed of the attacks, responses, and strategic analyses in the UI.
-   **Export Logs:** Download the results of an attack session as a `.csv` file for external analysis and documentation.

## Setup & Usage

This application is designed to run in a secure, browser-based environment where the primary Gemini API key is injected as an environment variable (`process.env.API_KEY`).

1.  **Seed Prompt:** Enter your initial attack idea or vector in the "Seed Prompt" text area. This can be a general concept, and the Sniper will refine it into a specific attack.
2.  **Target Configuration:**
    -   Select the LLM you wish to test from the dropdown menu.
    -   (Optional but Recommended) Enter a separate API key for the target model. This enhances the sandbox isolation. If left blank, the system's primary key will be used.
3.  **Cost & Evolution Control:**
    -   Set your maximum budget for the entire run in USD.
    -   Define the number of rounds for an "Evolving Attack."
4.  **Launch Attack:**
    -   Click **"Launch Single Attack"** for a single-round test.
    -   Click **"Start Evolving Attack"** to begin a multi-round, automated red teaming session. You can stop the process at any time.
5.  **Review & Export:**
    -   Observe the results in the "Spotter Feed."
    -   Once the attack is complete, click **"Export Logs"** to save a CSV report.

## Legal & Ethical Disclaimer

This tool is intended for authorized and ethical security research only. By using Red Set Protocell, you agree not to use it for any illegal, malicious, or unauthorized activities. Users are solely responsible for their actions and any consequences that may arise from using this platform.
