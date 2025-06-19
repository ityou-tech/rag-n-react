# 🧠 rag-n-react

> From sparse knowledge to smart action — an agentic AI chatbot that thinks, retrieves, and acts.

## 🚀 Overview

**rag-n-react** is a modern, fullstack AI chatbot built using:

- 🧠 **Agentic AI** — gives the bot reasoning and decision-making ability
- 🔍 **RAG (Retrieval-Augmented Generation)** — fetches contextual data on demand
- ⚛️ **React + TypeScript** — for a sleek and responsive frontend
- ☁️ **AWS Amplify Gen 2** — deploys infrastructure, auth, and hosting as code

This project is ideal for building intelligent assistants, customer support bots, research agents, or productivity tools powered by next-gen LLMs.

---

## 🧱 Tech stack

| Layer        | Tech                                |
|--------------|-------------------------------------|
| Frontend     | React + TypeScript + Vite          |
| Hosting      | AWS Amplify Gen 2                   |
| Auth         | Amplify Auth (Cognito)              |
| Backend      | Amplify Built-in Features           |
| AI Core      | AWS Bedrock LLMs                    |
| Database     | DynamoDB                            |
| Storage      | S3                                  |
| Build Tool   | Vite                                |

---

## 💡 Key features

- 🗣 **Conversational AI** with multi-turn memory
- 🔎 **Retrieval-Augmented Generation (RAG)** for fact-based answers
- 🧭 **Agentic reasoning** to plan and execute tasks
- 🧰 **Tool-use** — call APIs, search docs, trigger workflows
- 🔐 **Secure Auth** with Amplify + Cognito
- ⚡ **Fast, responsive** React + TypeScript UI
- 🛠️ **Development Tools** — automated data seeding and testing utilities

---

## 🛠️ Getting started

### Prerequisites

- Node.js v22+
- AWS CLI  
- Amplify Gen 2 CLI (`npx ampx`)  
- AWS Bedrock API key or ...
- Vector DB (...)

### 1. Clone the repo

```bash
git clone <repository-url>
cd rag-n-react
npm install
# optional: npm audit fix
````

### 2. Setup Amplify sandbox environment

```bash
npx ampx sandbox \
    --outputs-format json \

rm -rf ./src/models && \
    npx ampx generate graphql-client-code \
    --format modelgen \
    --model-target javascript \
    --out ./src/models
```

Amplify Gen 2 handles end-to-end fullstack development.

### 3. Start local development

```bash
npm run dev
```

---

## 🏗️ Project Structure

```
rag-n-react/
├── amplify/                 # AWS Amplify backend configuration
│   ├── auth/               # Authentication resources
│   ├── data/               # Data schema and resolvers
│   └── backend.ts          # Backend configuration
├── src/                    # React frontend source
│   ├── models/             # Generated GraphQL models
│   ├── App.tsx             # Main application component
│   └── main.tsx            # Application entry point
├── dev_scripts/            # Development and seeding scripts
│   └── populateCustomerTeams.js
└── public/                 # Static assets
```

## 🧰 Development Scripts

The [`dev_scripts/`](dev_scripts/) folder contains utilities for development and testing:

- **populateCustomerTeams.js** — Seeds DynamoDB with fake customer team data for testing

See the [dev_scripts README](dev_scripts/README.md) for detailed usage instructions.

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
