import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017");

let conn;

try {
    console.log("Connecting to Local MongoDB");
    conn = await client.connect();

} catch (e) {
    console.log(e);
}

let db = conn.db("bandcca");

export default db