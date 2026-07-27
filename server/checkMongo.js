const { MongoClient } = require('mongodb');

const uri = "mongodb://mongo:gfXqXmHDRUlHgcWhjxnRykfonWdelXMJ@ballast.proxy.rlwy.net:37579";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB server");
    const db = client.db('test'); // Usually 'test' is default, or maybe the DB name is in the URI, let's list databases first.
    
    const adminDb = client.db().admin();
    const result = await adminDb.listDatabases();
    console.log("Databases:");
    result.databases.forEach(db => console.log(` - ${db.name}`));
    
    // Check 'test'
    const collections = await client.db('test').listCollections().toArray();
    console.log("\nCollections in 'test':");
    for (const coll of collections) {
      const count = await client.db('test').collection(coll.name).countDocuments();
      console.log(` - ${coll.name} (${count} documents)`);
    }

  } finally {
    await client.close();
  }
}

run().catch(console.dir);
