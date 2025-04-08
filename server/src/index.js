import app from "./app.js";
import { connectDB } from "./database/database.js";



connectDB().then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
}).catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
});