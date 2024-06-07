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

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    const medicineCollection = client
      .db("PharmaConnect")
      .collection("medicines");
    const categoryCollection = client
      .db("PharmaConnect")
      .collection("category");
    const sellerAdCollection = client
      .db("PharmaConnect")
      .collection("sellerAd");

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
    app.get("/sellerAdds/:email", async (req, res) => {
      // console.log(req.params);
      const query = { email: req.params.email };
      const sellerAd = await sellerAdCollection.find(query).toArray();
      res.send(sellerAd);
    });
    // get ad data for admin
    app.get("/sellerAdds", async (req, res) => {
      const sellerAd = await sellerAdCollection.find().toArray();
      // console.log(sellerAd);
      res.send(sellerAd);
    });

    // get ad data for banner
    app.get("/bannerAdds/:status", async (req, res) => {
      const query = { status: req.params.status };
      const sellerAd = await sellerAdCollection.find(query).toArray();
      res.send(sellerAd);
    });

    app.post("/sellerAdds", async (req, res) => {
      const sellerAdd = req.body;
      const result = await sellerAdCollection.insertOne(sellerAdd);
      res.send(result);
    });

    // add category
    app.post("/category", async (req, res) => {
      const category = req.body;
      const result = await categoryCollection.insertOne(category);
      res.send(result);
    });
    // get category
    app.get("/category", async (req, res) => {
      const category = await categoryCollection.find().toArray();
      // console.log(category);
      res.send(category);
    });
    // update category
    app.put("/category/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const update = {
        $set: {
          name: req.body.name,
          image: req.body.image,
        },
      };
      const result = await categoryCollection.updateOne(query, update);
      res.send(result);
    });
    // delete category
    app.delete("/category/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await categoryCollection.deleteOne(query);
      res.send(result);
    });

    // post medicines
    app.post("/medicines", async (req, res) => {
      const medicine = req.body;
      const result = await medicineCollection.insertOne(medicine);
      res.send(result);
    });
     // get medicines by category
    app.get("/medicines/:category", async (req, res) => {
      // console.log(req.params);
      const query = { category: req.params.category };
      const medicine = await medicineCollection.find(query).toArray();
      res.send(medicine);
    });


   

    // admin confirmation for ad
    app.patch("/sellerAdds/admin/:id", async (req, res) => {
      // console.log(req.params.id);
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const update = {
        $set: {
          status: "confirmed",
        },
      };
      const result = await sellerAdCollection.updateOne(query, update);
      res.send(result);
      // console.log(result);
    });
    // admin remove for ad
    app.patch("/sellerAddsRemove/admin/:id", async (req, res) => {
      // console.log(req.params.id);
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const update = {
        $set: {
          status: "",
        },
      };
      const result = await sellerAdCollection.updateOne(query, update);
      res.send(result);
      // console.log(result);
    });

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
