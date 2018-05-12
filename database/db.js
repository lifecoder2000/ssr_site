const mongoose = require('mongoose');

const db = mongoose.connection;

db.on('error', err => {
    console.error(err);
    console.log('✗ DB connection error. Please make sure DB is running.');
    process.exit();
});

db.once('open', () => {
    console.log('✓ DB connection success.');
});

mongoose.set('debug', true)

mongoose.connect('mongodb://localhost:27017/application', { useMongoClient: true });
mongoose.Promise = global.Promise;