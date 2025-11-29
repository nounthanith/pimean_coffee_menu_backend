const mongoose = require("mongoose");

const connectDB = async () => {
    console.log("--------------------------------------------------");
    console.log("🔌 Connecting to MongoDB...");
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log("--------------------------------------------------");
        console.log(`✅ MongoDB Connected Successfully`);
        console.log("--------------------------------------------------");
    } catch (error) {
        console.log("--------------------------------------------------");
        console.error(`❌ MongoDB Connection Failed`);
        console.error(`🚫 Error: ${error.message}`);
        console.log("--------------------------------------------------");
        process.exit(1);
    }
};

module.exports = connectDB;
