// server.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const USER_ACCOUNTS_FILE_PATH = path.join(DATA_DIR, 'userAccounts.json');
const USER_INFO_DATA_FILE_PATH = path.join(DATA_DIR, 'userInfoData.json');

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Simulated Authentication Middleware
const authenticateUser = (req, res, next) => {
    const userEmail = req.headers['x-user-email'];
    if (!userEmail) {
        // console.warn('[Auth Middleware] Unauthorized - Missing x-user-email header.'); // Optional: Keep for specific auth debug
        return res.status(401).json({ message: 'Unauthorized: Authentication required (simulated).' });
    }
    // console.log(`[Auth Middleware] Authenticated user (simulated): ${userEmail}`); // Optional
    req.user = { email: userEmail };
    next();
};

// Helper Functions
const readDataFromFile = async (filePath) => {
    try {
        await fs.access(filePath);
        const data = await fs.readFile(filePath, 'utf8');
        // console.log(`[Helper] Successfully read from ${path.basename(filePath)}`); // Optional
        return data.trim() === '' ? [] : JSON.parse(data);
    } catch (err) {
        if (err.code === 'ENOENT') {
            // console.warn(`[Helper] File not found ${path.basename(filePath)}, returning empty array.`); // Optional
            return [];
        }
        console.error(`[Helper] CRITICAL Error reading from ${path.basename(filePath)}:`, err.message);
        throw err;
    }
};

const writeDataToFile = async (filePath, data) => {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
        // console.log(`[Helper] Successfully wrote to ${path.basename(filePath)}`); // Optional
    } catch (err) {
        console.error(`[Helper] CRITICAL Error writing to ${path.basename(filePath)}:`, err.message);
        throw err;
    }
};

const initializeDataFile = async (filePath) => {
    try {
        await fs.writeFile(filePath, JSON.stringify([], null, 2), { flag: 'wx' });
        console.log(`[Setup] Initialized data file: ${path.basename(filePath)}`);
    } catch (err) {
        if (err.code === 'EEXIST') {
            // console.log(`[Setup] Data file already exists: ${path.basename(filePath)}`); // Optional
        } else {
            console.error(`[Setup] CRITICAL Error initializing ${path.basename(filePath)}:`, err.message);
            throw err;
        }
    }
};

// --- Authentication Route ---
app.post('/auth/login', async (req, res) => {
    const { email, password: submittedPassword } = req.body;
    console.log(`[API /auth/login] Attempt for email: ${email}`);
    if (!email || !submittedPassword) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const users = await readDataFromFile(USER_ACCOUNTS_FILE_PATH);
        const foundUser = users.find(u => u.email === email);

        if (!foundUser) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const isMatch = (foundUser.password === submittedPassword); // PLAIN TEXT - In real app use bcrypt.compare

        if (isMatch) {
            const userInfoList = await readDataFromFile(USER_INFO_DATA_FILE_PATH);
            const detailedInfo = userInfoList.find(info => info.email === foundUser.email) || {};
            
            const fullUser = { ...detailedInfo, ...foundUser }; 
            const { password, ...userToReturn } = fullUser;
            // console.log(`[API /auth/login] Success. User data for ${email}:`, JSON.stringify(userToReturn, null, 2)); // Keep if login data structure is complex
            res.json({
                message: 'Login successful',
                user: userToReturn,
            });
        } else {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }
    } catch (error) {
        console.error("[API /auth/login] CRITICAL Server error:", error.message, error.stack);
        res.status(500).json({ message: 'Server error during login.', details: error.message });
    }
});

// --- Public User Routes ---
app.get('/users', async (req, res) => { // Get all users (public info)
    console.log(`[API /users GET] Request to fetch all users.`);
    try {
        const users = await readDataFromFile(USER_ACCOUNTS_FILE_PATH);
        const publicUsers = users.map(({ password, ...user }) => user); // Strip passwords
        res.json(publicUsers);
    } catch (error) {
        console.error("[API /users GET] CRITICAL Error fetching users:", error.message, error.stack);
        res.status(500).json({ message: "Error fetching users.", details: error.message });
    }
});

app.post('/users', async (req, res) => { // User Signup
    const { email, username, password, name, ...otherDetails } = req.body;
    console.log(`[API /users POST Signup] Attempt for username: ${username}, email: ${email}`);
    if (!email || !username || !password || !name) {
        return res.status(400).json({ message: 'Email, username, password, and name are required.' });
    }
    try {
        let users = await readDataFromFile(USER_ACCOUNTS_FILE_PATH);
        if (users.some(u => u.email === email)) {
            return res.status(400).json({ message: 'Email already registered.' });
        }
        if (users.some(u => u.username === username)) {
            return res.status(400).json({ message: 'Username already taken.' });
        }

        const hashedPassword = password; // PLAIN TEXT - In real app use bcrypt.hash

        const newUserAccount = {
            email, username, name, password: hashedPassword,
            isAdmin: otherDetails.isAdmin || false, photoURL: otherDetails.photoURL || '',
            location: otherDetails.location || 'Location Undisclosed',
            description: otherDetails.description || 'No description.',
            dateOfBirth: otherDetails.dateOfBirth || null, createdAt: new Date().toISOString()
        };
        users.push(newUserAccount);
        await writeDataToFile(USER_ACCOUNTS_FILE_PATH, users);

        let userInfoList = await readDataFromFile(USER_INFO_DATA_FILE_PATH);
        let newUserInfo = userInfoList.find(ui => ui.email === email); // Should not exist, but good practice
        if (!newUserInfo) {
            newUserInfo = { 
                email: email, // Ensure email is part of newUserInfo if created fresh
                gender: otherDetails.gender || '', 
                nationality: otherDetails.nationality || '',
                category: otherDetails.category || '',
                bloodGroup: otherDetails.bloodGroup || '', 
                tShirtSize: otherDetails.tShirtSize || ''
            };
            userInfoList.push(newUserInfo);
            await writeDataToFile(USER_INFO_DATA_FILE_PATH, userInfoList);
        }
        // If newUserInfo did exist, we are not merging otherDetails into it here for simplicity of signup.
        // Update would happen via profile edit.
        
        const fullCreatedUser = { ...newUserInfo, ...newUserAccount };
        const { password: _, ...userToReturn } = fullCreatedUser;
        // console.log(`[API /users POST Signup] Success. User data:`, JSON.stringify(userToReturn, null, 2)); // Optional
        res.status(201).json({ message: 'User created successfully.', user: userToReturn });
    } catch (error) {
        console.error("[API /users POST Signup] CRITICAL Error creating user:", error.message, error.stack);
        res.status(500).json({ message: "Error creating user.", details: error.message });
    }
});

app.get('/users/username/:username', async (req, res) => { // Public Profile View - THIS WAS WORKING
    const { username } = req.params;
    console.log(`[API /users/username/:username] Fetching profile for: ${username}`);
    try {
        const userAccounts = await readDataFromFile(USER_ACCOUNTS_FILE_PATH);
        const coreAccount = userAccounts.find(u => u.username === username);

        if (!coreAccount) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const userInfoList = await readDataFromFile(USER_INFO_DATA_FILE_PATH);
        const detailedInfo = userInfoList.find(info => info.email === coreAccount.email) || {};
        
        const { password: _, ...publicCoreAccountDetails } = coreAccount;
        const { bloodGroup: __, tShirtSize: ___, ...publicDetailedInfo } = detailedInfo; // Exclude sensitive from detailed

        const publicProfile = {
            ...publicDetailedInfo,
            ...publicCoreAccountDetails,
        };
        
        delete publicProfile.password;
        delete publicProfile.bloodGroup; // Ensure again
        delete publicProfile.tShirtSize; // Ensure again

        // console.log(`[API /users/username/:username] Sending profile for ${username}:`, JSON.stringify(publicProfile, null, 2)); // Optional

        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.json(publicProfile);
    } catch (error) {
        console.error(`[API /users/username/:username] CRITICAL Error for ${username}:`, error.message, error.stack);
        res.status(500).json({ message: "Error fetching public profile.", details: error.message });
    }
});


// --- Authenticated User ("Me") Routes ---
app.get('/me/profile-info', authenticateUser, async (req, res) => { // Logged-in user's own full profile
    const userEmail = req.user.email;
    console.log(`[API /me/profile-info GET] Request for user: ${userEmail}`);
    try {
        const userAccounts = await readDataFromFile(USER_ACCOUNTS_FILE_PATH);
        const coreAccount = userAccounts.find(u => u.email === userEmail);
        if (!coreAccount) {
            return res.status(404).json({ message: 'User account not found.' });
        }

        const userInfoList = await readDataFromFile(USER_INFO_DATA_FILE_PATH);
        const detailedInfo = userInfoList.find(info => info.email === userEmail) || { email: userEmail }; // ensure email is present

        const fullProfile = { ...detailedInfo, ...coreAccount }; // detailedInfo first, coreAccount overwrites common fields
        delete fullProfile.password;
        // console.log(`[API /me/profile-info GET] Sending full profile for ${userEmail}:`, JSON.stringify(fullProfile, null, 2)); // Optional
        res.json(fullProfile);
    } catch (error) {
        console.error(`[API /me/profile-info GET] CRITICAL Error for ${userEmail}:`, error.message, error.stack);
        res.status(500).json({ message: "Error fetching your profile information.", details: error.message });
    }
});

app.put('/me/profile-info', authenticateUser, async (req, res) => { // Logged-in user updates their own profile
    const userEmail = req.user.email;
    const updates = req.body;
    console.log(`[API /me/profile-info PUT] Request for user: ${userEmail} with updates: ${Object.keys(updates).join(', ')}`);
    try {
        let userAccounts = await readDataFromFile(USER_ACCOUNTS_FILE_PATH);
        const coreAccountIndex = userAccounts.findIndex(u => u.email === userEmail);

        if (coreAccountIndex === -1) {
            return res.status(404).json({ message: 'User account not found for update.' });
        }
        
        const coreAccount = userAccounts[coreAccountIndex];

        const coreFieldsToUpdate = ['name', 'photoURL', 'location', 'description', 'dateOfBirth', 'username'];
        let coreAccountChanged = false;
        coreFieldsToUpdate.forEach(field => {
            if (updates[field] !== undefined && coreAccount[field] !== updates[field]) {
                if (field === 'username' && users.some(u => u.username === updates.username && u.email !== userEmail)) {
                    console.warn(`[API /me/profile-info PUT] Username '${updates.username}' already taken. Update for ${userEmail} aborted for username field.`);
                    // Potentially return an error here or skip updating username
                    return res.status(400).json({ message: 'Username already taken.'}); // Or handle more gracefully
                }
                coreAccount[field] = updates[field];
                coreAccountChanged = true;
            }
        });

        let userInfoList = await readDataFromFile(USER_INFO_DATA_FILE_PATH);
        let userInfoIndex = userInfoList.findIndex(info => info.email === userEmail);
        let userInfo = userInfoIndex !== -1 ? { ...userInfoList[userInfoIndex] } : { email: userEmail }; // work with a copy
        
        const detailedInfoFieldsToUpdate = ['gender', 'nationality', 'bloodGroup', 'category', 'tShirtSize'];
        let detailedInfoChanged = false;
        detailedInfoFieldsToUpdate.forEach(field => {
            if (updates[field] !== undefined && userInfo[field] !== updates[field]) {
                userInfo[field] = updates[field];
                detailedInfoChanged = true;
            }
        });

        if (coreAccountChanged) {
            userAccounts[coreAccountIndex] = coreAccount; // Update the array
            await writeDataToFile(USER_ACCOUNTS_FILE_PATH, userAccounts);
        }
        if (detailedInfoChanged) {
            if (userInfoIndex !== -1) {
                userInfoList[userInfoIndex] = userInfo;
            } else {
                userInfoList.push(userInfo);
            }
            await writeDataToFile(USER_INFO_DATA_FILE_PATH, userInfoList);
        }

        const finalCoreAccount = userAccounts[coreAccountIndex];
        const finalDetailedInfo = userInfoList.find(info => info.email === userEmail) || { email: userEmail };

        const updatedFullProfile = { ...finalDetailedInfo, ...finalCoreAccount };
        delete updatedFullProfile.password;
        
        // console.log(`[API /me/profile-info PUT] Update processed for ${userEmail}. Response:`, JSON.stringify(updatedFullProfile, null, 2)); // Optional
        res.json({ message: 'Profile updated successfully.', user: updatedFullProfile });
    } catch (error) {
        console.error(`[API /me/profile-info PUT] CRITICAL ERROR for ${userEmail}:`, error.message, error.stack);
        res.status(500).json({ message: "Error updating profile.", details: error.message });
    }
});

// --- Admin Routes ---
app.put('/admin/users/:email', authenticateUser, async (req, res) => {
    const targetUserEmail = req.params.email;
    const adminEmail = req.user.email;
    const updates = req.body;
    console.log(`[API /admin/users/:email PUT] Admin ${adminEmail} attempting to update user ${targetUserEmail}`);

    try {
        const allUsers = await readDataFromFile(USER_ACCOUNTS_FILE_PATH);
        const adminMakingRequest = allUsers.find(u => u.email === adminEmail);

        if (!adminMakingRequest || !adminMakingRequest.isAdmin) {
            return res.status(403).json({ message: 'Forbidden: Admin access required.' });
        }

        let userAccounts = allUsers; // Use the already read data
        const coreAccountIndex = userAccounts.findIndex(u => u.email === targetUserEmail);

        if (coreAccountIndex === -1) {
            return res.status(404).json({ message: `User account ${targetUserEmail} not found for admin update.` });
        }

        const coreAccount = userAccounts[coreAccountIndex];
        const adminUpdatableCoreFields = ['name', 'username', 'photoURL', 'location', 'description', 'dateOfBirth', 'isAdmin'];
        let coreAccountChanged = false;
        adminUpdatableCoreFields.forEach(field => {
            if (updates[field] !== undefined && coreAccount[field] !== updates[field]) {
                 if (field === 'username' && userAccounts.some(u => u.username === updates.username && u.email !== targetUserEmail)) {
                    console.warn(`[API /admin/users/:email PUT] Username '${updates.username}' already taken. Update for ${targetUserEmail} aborted for username field.`);
                    // Skip or return error
                    return; 
                }
                coreAccount[field] = updates[field];
                coreAccountChanged = true;
            }
        });
        
        let userInfoList = await readDataFromFile(USER_INFO_DATA_FILE_PATH);
        let userInfoIndex = userInfoList.findIndex(info => info.email === targetUserEmail);
        let userInfo = userInfoIndex !== -1 ? { ...userInfoList[userInfoIndex] } : { email: targetUserEmail };
        
        const adminUpdatableDetailedFields = ['gender', 'nationality', 'bloodGroup', 'category', 'tShirtSize'];
        let detailedInfoChanged = false;
        adminUpdatableDetailedFields.forEach(field => {
            if (updates[field] !== undefined && userInfo[field] !== updates[field]) {
                userInfo[field] = updates[field];
                detailedInfoChanged = true;
            }
        });

        if (coreAccountChanged) {
            userAccounts[coreAccountIndex] = coreAccount;
            await writeDataToFile(USER_ACCOUNTS_FILE_PATH, userAccounts);
        }
        if (detailedInfoChanged) {
            if (userInfoIndex !== -1) {
                userInfoList[userInfoIndex] = userInfo;
            } else if (Object.keys(userInfo).length > 1) { // Only push if more than just email
                userInfoList.push(userInfo);
            }
            await writeDataToFile(USER_INFO_DATA_FILE_PATH, userInfoList);
        }
        
        const finalCoreAccount = userAccounts[coreAccountIndex];
        const finalDetailedInfo = userInfoList.find(info => info.email === targetUserEmail) || {email: targetUserEmail};
        const updatedFullProfile = { ...finalDetailedInfo, ...finalCoreAccount };
        delete updatedFullProfile.password;

        res.json({ message: `User ${targetUserEmail} updated successfully by admin.`, user: updatedFullProfile });

    } catch (error) {
        console.error(`[API /admin/users/:email PUT] CRITICAL Admin error updating ${targetUserEmail}:`, error.message, error.stack);
        res.status(500).json({ message: `Error updating user ${targetUserEmail} by admin.`, details: error.message });
    }
});

app.delete('/admin/users/:email', authenticateUser, async (req, res) => {
    const userEmailToDelete = req.params.email;
    const adminEmail = req.user.email;
    console.log(`[API /admin/users/:email DELETE] Admin ${adminEmail} attempting to delete user ${userEmailToDelete}`);
    
    try {
        const allUsers = await readDataFromFile(USER_ACCOUNTS_FILE_PATH);
        const adminMakingRequest = allUsers.find(u => u.email === adminEmail);

        if (!adminMakingRequest || !adminMakingRequest.isAdmin) {
            return res.status(403).json({ message: 'Forbidden: Admin access required.' });
        }

        if (adminEmail === userEmailToDelete) {
            return res.status(400).json({ message: "Admin cannot delete their own account through this endpoint." });
        }

        let users = allUsers;
        const initialLength = users.length;
        users = users.filter(user => user.email !== userEmailToDelete);

        if (users.length === initialLength) {
            return res.status(404).json({ message: `User ${userEmailToDelete} not found for deletion.` });
        }
        await writeDataToFile(USER_ACCOUNTS_FILE_PATH, users);

        let userInfoList = await readDataFromFile(USER_INFO_DATA_FILE_PATH);
        userInfoList = userInfoList.filter(info => info.email !== userEmailToDelete);
        await writeDataToFile(USER_INFO_DATA_FILE_PATH, userInfoList);

        res.json({ message: `User ${userEmailToDelete} deleted successfully by admin.` });
    } catch (error) {
        console.error(`[API /admin/users/:email DELETE] CRITICAL Error deleting ${userEmailToDelete} by admin:`, error.message, error.stack);
        res.status(500).json({ message: "Error deleting user by admin.", details: error.message });
    }
});

// Initial Data Setup
const addInitialAdminUser = async () => {
    console.log("[Setup] Checking for initial admin user...");
    try {
        // Ensure data directory and files exist
        await fs.mkdir(DATA_DIR, { recursive: true });
        await initializeDataFile(USER_ACCOUNTS_FILE_PATH);
        await initializeDataFile(USER_INFO_DATA_FILE_PATH);
        
        let users = await readDataFromFile(USER_ACCOUNTS_FILE_PATH);
        const adminEmail = "ramharshdandekar@gmail.com";

        if (users.some(u => u.email === adminEmail)) {
             console.log(`[Setup] Initial admin user (${adminEmail}) already exists.`);
             return;
        }
        // Only add admin if NO users exist at all, to prevent issues if db was populated differently.
        if (users.length > 0) {
            console.log("[Setup] Users file is not empty. Skipping automatic admin creation.");
            return;
        }

        console.log("[Setup] No users found, creating initial admin user...");
        const adminAccount = {
            name: "Ramharsh Sanjay Dandekar", email: adminEmail,
            username: "ramdandekar", password: "h123@", // TODO: HASH THIS!
            isAdmin: true, location: "Mountain View, CA", description: "Default Admin.",
            photoURL: "", dateOfBirth: "2005-09-01", createdAt: new Date().toISOString()
        };
        users.push(adminAccount);
        await writeDataToFile(USER_ACCOUNTS_FILE_PATH, users);

        let userInfoList = await readDataFromFile(USER_INFO_DATA_FILE_PATH);
        // Ensure it doesn't exist before pushing (though it shouldn't if users was empty)
        if (!userInfoList.find(ui => ui.email === adminAccount.email)) {
            const adminInfoData = { 
                email: adminAccount.email, 
                gender: "male", nationality: "Indian", category: "Technology", // Example values
                bloodGroup: "O+", tShirtSize: "L" // Example values
            };
            userInfoList.push(adminInfoData);
            await writeDataToFile(USER_INFO_DATA_FILE_PATH, userInfoList);
        }
        console.log("[Setup] Initial admin user created successfully.");
    } catch (error) {
        console.error("[Setup] CRITICAL Error during initial admin user setup:", error.message, error.stack);
    }
};

// Server Startup
const startServer = async () => {
    try {
        console.log("🚀 Server initialization started...");
        await addInitialAdminUser();
        app.listen(port, () => {
            console.log(`✅ Server is running on http://localhost:${port}`);
        });
    } catch (error) {
        console.error("🚨 CRITICAL Failed to start server:", error.message, error.stack);
        process.exit(1);
    }
};

startServer();