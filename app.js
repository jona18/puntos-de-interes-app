const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get('/', function(req, res){
  res.render('index');
});

app.get('/getPuntos', function(req, res){
  fs.readFile('./puntos.json', 'utf8', function(err, jsonString){
    if (err) {
      console.log("File read failed:", err);
      return
    }

    var jsonObject = JSON.parse(jsonString);
    res.json(jsonObject);
  });
});

app.post('/createPuntos', function(req, res){
  var data = req.body;
  var coordenadas = data.coordenadas.split(',');
  var y = Number(coordenadas[0]);
  var x = Number(coordenadas[1]);


  fs.readFile('./puntos.json', 'utf8', function(err, jsonString){
    if (err) {
      console.log("File read failed:", err);
      return
    }

    var jsonObject = JSON.parse(jsonString);
    var dataObject = {
      "type": "Feature",
      "properties": {
        "nombre": data.nombre,
        "direccion": data.direccion,
        "telefono": data.telefono,
        "categoria": data.categoria,
        "popupContent": 
          "<b>Descripción: </b>" + data.nombre + "<br>" +
          "<b>Dirección: </b>" + data.direccion + "<br>" +
          "<b>Teléfono: </b>" + data.telefono + "<br>" +
          "<b>(Y, X): </b>" + data.coordenadas + "<br>" +
          "<b>Categoría: </b>" + data.categoria
      },
      "geometry": {
        "type": "Point",
        "coordinates": [x, y]
      }
    }
    jsonObject.features.push(dataObject);
    var myData = JSON.stringify(jsonObject, null, 2);

    fs.writeFile("./puntos.json", myData, function(err) {
      if(err) {
        console.log(err);
      }
      
      var geoJSON = JSON.parse(myData);
      res.json(geoJSON);
    });
  });
});

app.listen(3000, function(){
  console.log('Servidor iniciado.');
});