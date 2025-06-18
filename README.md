# 🧠 rags-to-riches-ai

> From sparse knowledge to smart action — an agentic AI chatbot that thinks, retrieves, and acts.

## 🚀 Overview

**rags-to-riches-ai** is a modern, fullstack AI chatbot built using:

- 🧠 **Agentic AI** — gives the bot reasoning and decision-making ability
- 🔍 **RAG (Retrieval-Augmented Generation)** — fetches contextual data on demand
- ⚛️ **React** — for a sleek and responsive frontend
- ☁️ **AWS Amplify Gen 2** — deploys infrastructure, auth, and hosting as code

This project is ideal for building intelligent assistants, customer support bots, research agents, or productivity tools powered by next-gen LLMs.

---

## 🧱 Tech Stack

| Layer        | Tech                                |
|--------------|-------------------------------------|
| Frontend     | React                               |
| Hosting      | AWS Amplify Gen 2                   |
| Auth         | Amplify Auth (Cognito)              |
| Backend      | Amplify Built-in Features           |
| AI Core      | LLMs (Bedrock, ..., ...)            |
| Retrieval    | Vector DB (...)                     |
| Orchestration| Strands SDK                         |
| Storage      | S3, DynamoDB                        |

---

## 💡 Key Features

- 🗣 Conversational AI with multi-turn memory
- 🔎 Retrieval-Augmented Generation (RAG) for fact-based answers
- 🧭 Agentic reasoning to plan and execute tasks
- 🧰 Tool-use: call APIs, search docs, trigger workflows
- 🔐 Secure Auth with Amplify + Cognito
- ⚡ Fast, responsive React-based UI

---

## 🛠️ Getting Started

### Prerequisites

- Node.js v22+
- AWS CLI  
- Amplify Gen 2 CLI (`npx ampx`)  
- AWS Bedrock API key or ...
- Vector DB (...)

### 1. Clone the Repo

```bash
gh repo clone ityou-tech/rags-to-riches-ai
cd rags-to-riches-ai
npm install
````

### 2. Set Up Amplify

```bash
npx ampx init
npx ampx pull
```

### 3. Start Local Dev

```bash
npm run dev
```

---

## 🤖 Agent Flow Example

```text
User: "<question...?>"

Agent Steps:
1. Use RAG to find the latest report in S3
2. Extract and summarize content
3. Use API tool to send the summary
```

All handled autonomously by the agent.

---

## 🔌 Pluggable Tools

Agents can be extended with:

* Web search
* File analysis (PDF, CSV, DOCX)
* Internal APIs

Define tools as simple functions with schema and purpose. Agent chooses them when needed.

---

## 📦 Deployment

Deploy locally or connect GitHub to Amplify Console:

```bash
npx ampx deploy
```

Amplify Gen 2 handles:

* Hosting
* Auth
* Function deployment
* Environment management

---

## 📚 Architecture

```
[User UI] --> [Amplify API] --> [Agentic Lambda]
                            --> [Vector DB]
                            --> [LLM provider]
                            --> [Tools / APIs]
```

---

## 📄 License

MIT License

---

Made with ⚡ logic, 📚 context, and 🧠 ambition.
