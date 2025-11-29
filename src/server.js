require('dotenv').config({ quiet: true });
const app = require('./app');
const connectDB = require('./configs/connectDB');

const PORT = process.env.PORT || 5000;

(async () => {
    console.log("--------------------------------------------------");
    console.log("🚀 Starting Server...");
    console.log("--------------------------------------------------");

    // Connect to Database
    await connectDB();

    // Start Server
    app.listen(PORT, () => {
        console.log("--------------------------------------------------");
        console.log(`🌐 Server running at: http://localhost:${PORT}`);
        console.log(`🛠  Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log("--------------------------------------------------");
    });
})();
