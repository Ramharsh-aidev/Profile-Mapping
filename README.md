# 🌐 Profile Explorer

![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat-square&logo=react&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-4.x-646CFF?style=flat-square&logo=vite&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white) ![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=flat-square&logo=node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=flat-square&logo=express&logoColor=white) ![JSON](https://img.shields.io/badge/Data%20Storage-JSON-F7DF1E?style=flat-square&logo=json&logoColor=black)

Profile Explorer is a full-stack web application that allows users to create profiles, share information, and explore profiles created by others. It features secure user authentication, interactive maps, and an intuitive dashboard for managing profile information.

## 🚀 Key Features

- **🔐 User Authentication:** Secure signup and login functionality.
- **📝 Profile Creation & Management:** Create, edit, and manage profiles.
- **🌎 Public Profile Pages:** View profiles with interactive maps.
- **📂 Profile Listing & Filtering:** Search and filter profiles.
- **🗺️ Interactive Maps:** Integrated Leaflet maps for location visualization.
- **📊 User Dashboard:** Manage personal details, preferences, and security.
- **🛠️ Admin Dashboard:** Full control over all user profiles.
- **📱 Responsive Design:** Seamless experience across devices.
- **✨ Light Theme:** Clean, modern, and professional UI.

## 🛠️ Tech Stack

### **Frontend**
- React (with Vite)
- React Router DOM (for routing)
- Axios (for API calls)
- Tailwind CSS (for styling)
- React Leaflet (for maps)
- React Icons (for UI icons)
- React Hot Toast (for notifications)
- React Awesome Reveal (for animations)
- PropTypes (for prop validation)

### **Backend**
- Node.js
- Express.js
- CORS (for cross-origin resource sharing)
- Body-Parser (for request parsing)
- **Data Storage:** JSON files (`userAccounts.json`, `userInfoData.json`)

## 📁 Project Structure

```
profile-mapping/
├── backend/          # Contains all Node.js/Express backend code
│   ├── data/
│   │   ├── userAccounts.json
│   │   └── userInfoData.json
│   ├── server.js     # Main backend server file
│   ├── package-lock.json
│   └── package.json
├── frontend/         # Contains all React frontend code
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── layouts/
│   │   │   ├── userProfile/
│   │   │   └── ui/
│   │   ├── contexts/
│   │   ├── data/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## ⚙️ Setup and Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git (for cloning the repository)

### 1. Clone the Repository

```bash
git clone https://github.com/Ramharsh-aidev/Profile-Mapping.git
cd profile-mapping
```

### 2. Frontend Setup

```bash
cd frontend
npm install
# or
yarn install
```

Start the frontend development server:

```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:5173` to view the frontend.

### 3. Backend Setup

```bash
cd backend
npm install
# or
yarn install
```

Start the backend server:

```bash
npm start
# or (if using nodemon)
npm run dev
```

Visit `http://localhost:5000` for the backend server.

## 🗝️ Admin Access

Use the following credentials for the pre-configured admin account:

- **Email:** `ramharshdandekar@gmail.com`
- **Password:** `Ramharsh123@`

## 📚 Data Storage

- **`userAccounts.json`** - Basic user information (username, email, password, isAdmin status, etc.).
- **`userInfoData.json`** - Detailed user info (gender, nationality, t-shirt size, etc.).

## 🚀 Future Enhancements

- Secure password hashing (e.g., bcrypt)
- JWT or session-based authentication
- Enhanced admin controls
- API rate limiting for security
- Unit and integration tests
- Full database integration (PostgreSQL, MongoDB, etc.)

## 📄 License

Licensed under the MIT License. See `LICENSE` for more information.

**MIT License**

```text
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
