const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const { response } = require('express');


const uri = "mongodb+srv://mx:KPwxsi5inoQcRqMG@cluster0.yqdvo.mongodb.net/asrafuls?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  // res.send("That is working")
  res.sendFile(__dirname + "/app.html")
})

client.connect(err => {
  const userCollection = client.db("asrafuls").collection("user_details");

  app.get("/users", (req, res) => {
    userCollection.find({})
      .toArray((err, docx) => {
        res.send(docx)
      })
  })

  app.get("/users/:id", (req, res) => {
    userCollection.find({ _id: ObjectId(req.params.id) })
      .toArray((err, docx) => {
        res.send(docx[0])
      })
  })

  app.post("/sendData", (req, res) => {
    const pd = req.body
    userCollection.insertOne(pd)
      .then(
        res.redirect('/')
      )
  })

  app.patch("/update/:id", (req, res) => {
    userCollection.updateOne({ _id: ObjectId(req.params.id) },
      {
        $set: {name: req.body.name, email: req.body.email, number: req.body.phone, address: req.body.address }
      }
    )
    .then(response => {
      res.send(response.modifiedCount > 0)
    })
  })

  app.delete("/delete/:id", (req, res) => {
    userCollection.deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => {
          res.send(result.deletedCount > 0)
      })
  })

});


app.listen(3000)