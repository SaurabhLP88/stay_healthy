const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
//const mongoURI =  "mongodb://127.0.0.1:27017/stayhealthybeta1"; //"mongodb://root:medical123@127.0.0.1:27017";

const mongoURI = process.env.MONGO_URI;

/* connectToMongo = async (retryCount) => {
    const MAX_RETRIES = 3;
    const count = retryCount ?? 0;
    try {
        //await mongoose.connect(mongoURI, { dbName: 'stayhealthybeta1'});
        await mongoose.connect(mongoURI);
        console.info('Connected to Mongo Successfully')
        return;
    } catch (error) {
        console.error(error);
        const nextRetryCount = count + 1;
        if (nextRetryCount >= MAX_RETRIES) {
            throw new Error('Unable to connect to Mongo!');
        }
        console.info(`Retrying, retry count: ${nextRetryCount}`)
        return await connectToMongo(nextRetryCount);
    }
};

module.exports = connectToMongo;*/

const connectToMongo = async (retryCount = 0) => {
  const MAX_RETRIES = 3;

  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI not defined in environment variables");
    }

    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "stayhealthy"
    });
    console.info("✅ Connected to MongoDB Atlas successfully");
    return;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);

    const nextRetryCount = retryCount + 1;
    if (nextRetryCount >= MAX_RETRIES) {
      throw new Error("Unable to connect to Mongo!");
    }

    console.info(`🔁 Retrying Mongo connection (${nextRetryCount}/${MAX_RETRIES})`);
    return connectToMongo(nextRetryCount);
  }
};

module.exports = connectToMongo;
