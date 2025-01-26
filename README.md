# AI Agent ToDo Application

This repository contains a simple AI-powered ToDo application that supports CRUD operations. The application integrates with the OpenAI API to provide intelligent features and uses a database for persistent storage.

---
![image](https://github.com/user-attachments/assets/f8984bf9-63ac-4997-b057-c6ee48a5d3ed)
---

## Features
- Create, Read, Update, and Delete (CRUD) tasks.
- Leverages OpenAI's API for AI-powered task management.
- Visualize and manage your database using a built-in data studio.

---

## Getting Started

### Prerequisites
- **Docker**: Ensure Docker is installed on your system.
- **Node.js**: Install Node.js if not already available.

---

### Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/AI-Agent-ToDo-App.git
   cd AI-Agent---ToDo-App

### Steps to Set Up the Application

#### 1. Create an `.env` File
In the root folder of the project, create a file named `.env` and add the following environment variables:

<pre><code class="language-env">
DATABASE_URL=your_database_url
OPENAI_API_KEY=your_openai_api_key
</code></pre>

---

#### 2. Install Dependencies
Run the following command to install the required packages:

<pre><code class="language-bash">
npm install
</code></pre>

---

#### 3. Generate Drizzle Client
Use Drizzle to generate the database client by running:

<pre><code class="language-bash">
npm run generate
</code></pre>

---

#### 4. Run Database Migrations
Apply the database schema using the following command:

<pre><code class="language-bash">
npm run migrate
</code></pre>

---

#### 5. Visualize Database
To open the Drizzle Studio for database visualization, run this command:

<pre><code class="language-bash">
npm run studio
</code></pre>


