const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB Connected Successfully');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        // Try local MongoDB as fallback
        try {
            await mongoose.connect('mongodb://127.0.0.1:27017/leave-management', {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log('✅ Connected to local MongoDB');
        } catch (localError) {
            console.error('❌ Local MongoDB also failed:', localError.message);
            process.exit(1);
        }
    }
};

module.exports = connectDB;