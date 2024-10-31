const express = require('express');
const { makeRequest } = require('./validator'); // Import fungsi makeRequest dari modul checkEmail.js

const app = express();
const port = 3000; // Anda dapat mengubah port sesuai kebutuhan

// Endpoint validator email
app.get('/validator', async (req, res) => {
    const email = req.query.email;
    if (!email) {
        return res.status(400).json({ error: "Harap masukkan email sebagai parameter." });
    }
    const result = await makeRequest(email);
    res.json(result);
});

// Menjalankan server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
