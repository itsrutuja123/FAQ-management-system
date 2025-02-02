**FAQ Management System**
A full-stack FAQ Management System built using React.js (Frontend) and Node.js with Express.js and MongoDB (Backend). This application allows users to view, add, update, and delete FAQs while leveraging Redis for caching to optimize performance.

🚀 **Tech Stack**
**Frontend**
React.js – For building the user interface.
CSS – For styling and animations.
Fetch API – To interact with the backend.

**Backend (Node.js & Express.js)**
Node.js – JavaScript runtime for the server.
Express.js – Web framework for handling API requests.
MongoDB & Mongoose – NoSQL database for storing FAQs.
Redis – Used for caching to improve performance.

🔧 Installation Guide

1️⃣ Clone the Repository
git clone https://github.com/itsrutuja123/FAQ-management-system.git
cd faq-management

2️⃣ Setup the Backend
cd backend
npm install  # Install dependencies

3️⃣ Configure Environment Variables
Create a .env file in the backend/ folder and add the following:
MONGO_URI=mongodb+srv://yourusername:yourpassword@yourcluster.mongodb.net/faq

REDIS_HOST=your-redis-host

REDIS_PORT=your-redis-port

REDIS_PASSWORD=your-redis-password

PORT=8000

4️⃣ Start the Backend Server
npm start  # Runs the backend server
The API will be available at http://localhost:8000
