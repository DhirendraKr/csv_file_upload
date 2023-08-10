const {MongoClient} = require('mongodb');

const mongoURI = 'mongodb+srv://dhirendra_kr:YtvOfi1NapfislTU@cluster0.ixxciiu.mongodb.net/onhand?retryWrites=true&w=majority';
const collectionName = 'onhand';

const connectDB = async () => {
    try {
        const client = await MongoClient.connect(mongoURI, {useNewUrlParser: true, useUnifiedTopology: true});
        const db = client.db();
        const collection = db.collection(collectionName);
        return collection;
    } catch (error) {
        console.error('Error connecting to the database:', error);
        throw error;
    }
};

module.exports = connectDB;
