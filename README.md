# AI Text Editor

[Live Version](https://your-live-app-link.com)

## Overview

**AI Text Editor** is a full-stack application that allows users to transform text using advanced AI capabilities. Users can highlight text in the editor and choose to have it paraphrased, expanded, summarized, or translated. The application consists of:

- A **React/TypeScript** frontend built with Vite that provides a rich text editor experience.
- A **Rust/Actix Web** backend that integrates with the OpenAI API to perform the text transformations.
- Docker support for both local production deployment.

## Running the App in Production Mode (via Docker Compose)

1. **Configure Environment Variables for Docker:**

   Each service has its own `.env-docker` file:

   - **backend/.env-docker**
     ```env
     OPENAI_API_KEY=your_valid_openai_api_key_here
     OPENAI_API_BASE_URL=https://api.openai.com
     ```
   - **frontend/.env-docker**
     ```env
     VITE_BACKEND_URL=http://backend:8080
     ```

2. **Run Docker Compose (on your local machine):**

   From the project root (where the `docker-compose.yml` file is located), run:
   ```bash
   docker-compose -f docker-compose-local.yml up --build
   ```
   This command builds and starts both the backend and frontend containers.  
   - The **backend** will be accessible on [http://localhost:8080](http://localhost:8080).
   - The **frontend** will be served on [http://localhost:3000](http://localhost:3000) (or your configured port).

## Running Individual Apps in Development Mode

### Backend (Rust/Actix Web)

1. **Copy the Environment Sample File:**
   In the `backend` folder, copy the sample environment file:
   ```bash
   cp .env-sample .env
   ```
   Then edit `.env` to insert your OpenAI API key:
   ```env
   OPENAI_API_KEY=your_valid_openai_api_key_here
   OPENAI_API_BASE_URL=https://api.openai.com
   ```

2. **Run Locally:**
   In the `backend` folder, run:
   ```bash
   cargo run
   ```
   Your backend should now be running on [http://localhost:8080](http://localhost:8080).

### Frontend (React/Vite)

1. **Copy the Environment Sample File:**
   In the `frontend` folder, copy the sample environment file:
   ```bash
   cp .env-sample .env
   ```
   Then edit `.env` to set the backend URL (for local development):
   ```env
   VITE_BACKEND_URL=http://localhost:8080
   ```

2. **Run Locally:**
   In the `frontend` folder, run:
   ```bash
   npm install
   npm run dev
   ```
   Your frontend will be available at the port specified by Vite (usually [http://localhost:5173](http://localhost:5173)).

## Testing the Applications

### Backend Testing

In the `backend` folder, you can run your unit and integration tests using Cargo:
```bash
cargo test
```
This command runs all tests defined in your Rust code.

### Frontend Testing

In the `frontend` folder, you can run your tests using Vitest:
```bash
npm run test
```
This command runs all tests defined using Vitest and React Testing Library.

## Architectural Decisions

For a detailed writeup on our architectural decisions behind AI Text Editor, please refer to my [Google Docs writeup](https://docs.google.com/document/d/1Wm05Uppjdl4NmQXISJiOESk0RtqaRnI8QpdHGWTpD3M/edit?usp=sharing).

## Summary

- **Production Mode:**  
  Use `docker-compose up --build` from the project root after setting up the `.env-docker` files in the `backend` and `frontend` folders.

- **Development Mode:**  
  Copy `.env-sample` to `.env` in both the `backend` and `frontend` folders, update with your own OpenAI API key (and backend URL for frontend), then run:
  - For backend: `cargo run`
  - For frontend: `npm run dev`

- **Testing:**  
  - **Backend:** Run `cargo test` in the backend folder.
  - **Frontend:** Run `npm run test` in the frontend folder.
- **Documentation:**  
  Detailed architectural decisions are available via the provided Google Docs link.

Enjoy using AI Text Editor!
