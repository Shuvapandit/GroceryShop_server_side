const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gelzt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try{
        await client.connect();
        const groceryCollection = client.db('GO_Grocery').collection('inventory');
        
        app.get('/item', async (req, res) => {
            const query = {};
           const cursor = groceryCollection.find(query);
          const items = await cursor.toArray();
          res.send(items);
          
        });
        app.get('/item/:id', async(req, res) =>{
            const id = req.params.id;
            const query={_id: ObjectId(id)};
            const items = await groceryCollection.findOne(query);
            res.send(items);
        });
           // POST
           app.post('/item', async(req, res) =>{
            const newItem = req.body;
            const result = await  groceryCollection.insertOne(newItem);
            res.send(result);
        });
           //update quantity
           app.put('/item/:id', async (req, res) => {
            const id = req.params.id;
            const updatedQuantity = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: updatedQuantity
            }
            const result = await groceryCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })
         // DELETE
         app.delete('/item/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await groceryCollection.deleteOne(query);
            res.send(result);
        });
    }
    finally{

    }

}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running  Server');
});

app.listen(port, () => {
    console.log('Listening to port', port);
})