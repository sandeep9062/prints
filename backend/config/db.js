import mongoose from "mongoose";
import dotenv from "dotenv";

const connectDB = async () => {
  /*
   * The integration tests connect mongoose to an in-memory MongoDB themselves
   * before importing app.js. app.js then calls this from its listen callback,
   * which would try to open a SECOND connection with a different URI and then
   * call process.exit(1) — killing the test runner before a single assertion
   * ran. Skip entirely when a connection is already established.
   */
  if (mongoose.connection.readyState === 1) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_DB);
    console.log("✅ MONGODB Connected Successfully");
  } catch (error) {
    console.error("❌ MONGODB Failed to Connect:", error.message);
    process.exit(1);
  }
};

export default connectDB;
