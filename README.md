# Profile Explorer

Profile Explorer is a full-stack web application that allows users to create profiles, share information, and explore profiles created by others. Users can sign up, log in, view a list of profiles, see individual profile details including their location on a map, and manage their own profile information through a dedicated dashboard. The application also features an admin dashboard for user management.

The project demonstrates a modern React+vite frontend with Tailwind CSS for styling, and a Node.js backend that uses simple JSON files for data storage, mimicking a database for demonstration purposes.

## Features

*   **User Authentication:** Secure signup and login functionality.
*   **Profile Creation & Management:** Users can create and edit their profiles with various details.
*   **Public Profile Pages:** Viewable profiles with user-provided information and location on an interactive map.
*   **Profile Listing & Filtering:** Browse all user profiles with search and filtering capabilities.
*   **Interactive Maps:** Leaflet maps to display user locations.
*   **User Dashboard:** A dedicated section for users to manage their personal details, preferences, and security settings.
*   **Admin Dashboard:** Administrators can manage all users (view, edit, delete, create).
*   **Responsive Design:** UI adapts to different screen sizes.
*   **Light Theme:** Clean and modern light-themed user interface.

## Tech Stack

*   **Frontend:**
    *   React (with Vite)
    *   React Router DOM (for routing)
    *   Axios (for API calls)
    *   Tailwind CSS (for styling)
    *   React Leaflet (for maps)
    *   React Icons (for UI icons)
    *   React Hot Toast (for notifications)
    *   React Awesome Reveal (for animations)
    *   PropTypes (for prop validation)
*   **Backend:**
    *   Node.js
    *   Express.js
    *   CORS
    *   Body-Parser
    *   **Data Storage:** JSON files (`userAccounts.json`, `userInfoData.json`) located in the `backend/data/` directory.

## Project Structure

```
profile-explorer/
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

## Setup and Installation

Follow these steps to set up and run the project locally.

### Prerequisites

*   Node.js (v16 or higher recommended)
*   npm or yarn

### 1. Frontend Setup

First, navigate to the frontend directory and install the necessary dependencies.

```bash
cd frontend
npm install
# or
# yarn install
```

After installation, you can start the frontend development server:

```bash
npm run dev
# or
# yarn dev
```

The frontend will typically be available at `http://localhost:5173` (or another port specified by Vite).

### 2. Backend Setup

Next, set up the backend server. Open a new terminal window/tab.

Navigate to the backend directory and install its dependencies:

```bash
cd backend
npm install
# or
# yarn install
```

The backend uses simple JSON files for data storage. These files (`userAccounts.json` and `userInfoData.json`) are located in the `backend/data/` directory. On the first run, the server will attempt to create these files if they don't exist and will add an initial admin user.

To start the backend server:

```bash
npm start
# or (if you have a dev script like nodemon)
# npm run dev
# or directly
# node server.js
```

The backend server will typically run on `http://localhost:5000` (as configured in `server.js`).

**Important:** Ensure both the frontend and backend servers are running simultaneously in separate terminal sessions for the application to function correctly.

## How to Use

### As a Regular User

1.  **Navigate to the application** in your browser (e.g., `http://localhost:5173`).
2.  **Sign Up:** Click on the "Sign Up" button. Fill in the required details (name, username, email, password, date of birth, location, etc.) and submit the form to create a new account.
3.  **Sign In:** Once registered, or if you already have an account, click "Sign In". Enter your email and password to log in.
4.  **Explore Profiles:** After logging in, you can navigate to the "Profiles" page to see a list of all users. You can search and filter these profiles.
5.  **View Profile Details:** Click on a profile card to view more details about that user, including their location on a map.
6.  **Edit Your Profile:**
    *   Click on your avatar/name in the header to open the user dropdown.
    *   Select "Edit Profile". This will take you to your user dashboard.
    *   In the dashboard, you can update your personal details, profile picture, and other information.
7.  **View Your Public Profile:**
    *   From the user dropdown in the header, select "My Public Profile".
8.  **Logout:** Click on your avatar/name and select "Sign out" from the dropdown.

### As an Admin User

The application includes a pre-configured admin user. Use the following credentials to log in as an administrator (Currently set admin):

*   **Email:** `ramharshdandekar@gmail.com`
*   **Password:** `Ramharsh123@`

Once logged in as an admin:

1.  **Access Admin Dashboard:**
    *   Click on your avatar/name in the header.
    *   Select "Admin Dashboard" from the dropdown menu.
2.  **Manage Users:**
    *   **View all users:** See a table listing all registered users.
    *   **Create new users:** Fill out the form to add new users, including setting their admin status.
    *   **Edit existing users:** Modify user details (name, username, email (read-only for edit in UI), location, description, admin status, etc.).
    *   **Delete users:** Remove user accounts from the system (admin cannot delete their own account).

## Data Storage Notes

*   The backend relies on local JSON files (`backend/data/userAccounts.json` and `backend/data/userInfoData.json`) for data persistence. This is for demonstration purposes and simplicity.
*   **`userAccounts.json`:** Stores core account information like username, email, (hashed) password, name, isAdmin status, location, description, etc.
*   **`userInfoData.json`:** Stores more detailed user information that might be considered more private or extensive, such as gender, nationality, category, t-shirt size, etc., linked by email.
*   **Passwords:** For this demo, passwords are stored in plain text. **In a real-world application, passwords MUST be securely hashed using a strong algorithm like bcrypt.**
*   **No Real Database:** This project does not use a traditional database (like PostgreSQL, MongoDB, etc.). All data operations read from and write to these JSON files. For production applications, a proper database system is highly recommended for scalability, data integrity, and performance.

## Future Enhancements (Potential)

*   Implement robust password hashing (e.g., bcrypt) on the backend.
*   Implement JWT (JSON Web Token) or session-based authentication for improved security.
*   Add more sections to the user dashboard (e.g., account security settings, notification preferences).
*   Develop more advanced admin features.
*   Write unit and integration tests.
*   Deploy the frontend and backend to hosting platforms.

## License

This project is licensed under the MIT License.

**MIT License**

Copyright (c) 2025 Ramharsh Dandekar

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
