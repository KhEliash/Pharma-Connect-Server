const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xzzvi9v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const userCollection = client.db("PharmaConnect").collection("users");
    const sellerAdCollection = client.db("PharmaConnect").collection("sellerAd");

    // User data post
    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.send("User already exists");
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    // seller advertise data 
    app.get('/sellerAdds/:email', async(req,res)=>{
      // console.log(req.params);
      const query = {email: req.params.email}
      const sellerAd = await sellerAdCollection.find(query).toArray();
      res.send(sellerAd);
    })
    // get ad data for admin
    app.get('/sellerAdds', async(req,res)=>{
      const sellerAd = await sellerAdCollection.find().toArray();
      // console.log(sellerAd);
      res.send(sellerAd);
    })
   
    app.post('/sellerAdds',async (req,res)=>{
      const sellerAdd = req.body;
      // console.log(sellerAdd);
      const result = await sellerAdCollection.insertOne(sellerAdd);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World! how");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
