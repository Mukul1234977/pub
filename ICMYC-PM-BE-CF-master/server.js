require('dotenv').config({path: __dirname + '/.env'})
const express = require("express");
const connectDB = require("./config/db");
const fs = require('fs');
const cors = require("cors");
const path = require("path");
const http = require('http');
const https = require('https');
const app = express();

//Connect Database
connectDB();

// Certificate
const privateKey = fs.readFileSync(process.env.KEYFILE, 'utf8');
const certificate = fs.readFileSync(process.env.CERTIFICATEFILE, 'utf8');
//const ca = fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
    cert: certificate,
//	ca: ca
};

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

//Init Middleware
app.use(express.json({ extended: false }));
app.use(cors());
app.options("*", cors());

// Routes
app.use("/api/form", require("./routes/api/form_routes"));
app.use("/api/dashboard", require("./routes/api/dashboard_routes"));
app.use("/api/dashboard", require("./routes/api/web/web_dashboard_routes"));


const HTTP_PORT = process.env.HTTP_PORT || 80;
const HTTPS_PORT = process.env.HTTPS_PORT || 443;

httpServer.listen(HTTP_PORT, () => {
	console.log(`HTTP Server running on port ${HTTP_PORT}`);
});

httpsServer.listen(HTTPS_PORT, () => {
	console.log(`HTTPS Server running on port ${HTTPS_PORT}`);
});


//app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
