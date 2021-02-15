import mongoose from 'mongoose';

// CONNECTION TO MONGO
let mongoUrl = process.env.DEV_MONGO_URL;
if (process.env.NODE_ENV === 'production') {
  mongoUrl = process.env.PROD_MONGO_URL;
}
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.Promise = global.Promise;

mongoose.connection
  .once('open', () => console.log('Connected to MongoLab instance.'))
  .on('error', (error) => console.log('Error connecting to MongoLab:', error));
