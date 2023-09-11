const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://user:12345@farmacia.xoypicz.mongodb.net/";
const client = new MongoClient(uri, { useNewUrlParser: true });

client.connect(err => {
  const collection = client.db("farmaciaCampus").collection("pacientes");

  // Realizar una consulta
  collection.find({ name: "John Doe" }).toArray((err, docs) => {
    if (err) throw err;

    console.log("Resultados de la consulta:");
    console.log(docs);

    // Cerrar la conexión
    client.close();
  });
});
