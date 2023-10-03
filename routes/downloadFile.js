const express = require("express");
const router = express.Router();
const path = require("path");

router.post('/file/download', (req, res) => {
    const filename = req.body.fileName;

    // Ensure the filename is safe by allowing only specific characters and restricting directory traversal
    if (!/^[a-zA-Z0-9_-]+$/.test(filename)) {
        return res.status(400).json({ error: 'Invalid filename' });
    }

    const filePath = path.join(__dirname, 'uploads', filename);

    // Check if the file exists before attempting to send it
    const fs = require('fs');
    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).json({ error: 'File not found' });
    }
});

module.exports = router;
