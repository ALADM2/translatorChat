import mongoose from "mongoose";

import { MONGO_URI } from '../utils/envSetup.js';

const conn = async () => {
    try {
        mongoose.connect(MONGO_URI);
        console.log(`Connected to the ${process.env.NODE_ENV} database`);
    } catch (err) {
        console.log("Failed to connect to the database" + err)
        process.exit(9);
    }
};

export default conn