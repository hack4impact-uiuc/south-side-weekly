const mongoose = require('mongoose');

// CONNECTION TO MONGO
const devUrl =
  'mongodb+srv://alicesf2:Q9p0y$*hN15I@cluster0.xsaeb.mongodb.net/development?retryWrites=true&w=majority';
let mongoUrl = process.env.MONGO_URL || devUrl;
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.Promise = global.Promise;

mongoose.connection
  .once('open', () => console.log('Connected to MongoLab instance.'))
  .on('error', (error) => console.log('Error connecting to MongoLab:', error));
