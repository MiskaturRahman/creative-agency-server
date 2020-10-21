const express = require('express');
const bodyParser = require('body-parser');

const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.grz5f.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json());
app.use(cors());

const port = 5000

app.get('/', (req, res) => {
    res.send("its working")
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const AllServiceCollection = client.db("CreativeAgent").collection("Services");
    const AllRegistrationCollection = client.db("CreativeAgent").collection("registration");

    app.post('/services', (req, res) => {
        const service = req.body;
        AllServiceCollection.insertMany(service)
            .then(result => {
                console.log(result.insertedCount);
                res.send(result.insertedCount);
            })
    })

    app.get('/allServices', (req, res) => {
        AllServiceCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.post('/serviceRegistration', (req, res) => {
        const registration = req.body;
        AllRegistrationCollection.insertOne(registration)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })


    app.get('/orderHistory', (req, res) => {
        AllRegistrationCollection.find({ email: req.query.email })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

})

app.listen(process.env.PORT || port)