import { MongoClient,Db } from 'mongodb';

const url = 'mongodb+srv://TestUser:JTMap2FXp1NHotsU@main-project-data.fb81p.mongodb.net/?retryWrites=true&w=majority&appName=Main-Project-Data'
const dbName = 'calculatorDB'; 

let dbClient: MongoClient;
let database: Db;

export const connectToDatabase = async () => {
    try {
        if (!dbClient) {
            dbClient = new MongoClient(url);
            await dbClient.connect();
            database = dbClient.db(dbName);
            console.log('Connected to MongoDB Atlas');
        }
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
    }
};


export const getDatabase = () => {
    if (!database) {
        throw new Error("❌ Database not initialized. Call connectToDatabase() first.");
    }
    return database;
}
