const express = require('express');
const swig = require('swig');
const app = express();
const pg = require('pg');
const parse = require('./parse');
let theClient;

module.exports = app;

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
// app.use('/', require('./routes'));
app.use(require('body-parser').json());

app.get('/', (req, res, next) => {
  res.render('index');
});

app.post('/RetrieveCadastre', function(req, res) {
  RetrieveCadastre(req.body, res);
});

function RetrieveCadastre(bounds, res) {
  console.log(bounds);

  const connString = 'postgres://localhost/park_test';

  if (!theClient){
    pg.connect(connString, function(err, client) {
      theClient = client; //ensures there is only 1 client connection.
      queryDatabase(bounds, res);
      return;
    });
  }

  queryDatabase(bounds, res);

}

// GeoJSON Feature Collection
function FeatureCollection() {
  this.type = 'FeatureCollection';
  this.features = new Array();
}

function queryDatabase(bounds, res) {
  if (theClient) {
    const sql = `SELECT signdesc1, ST_AsGeoJSON(geom) as geom FROM signs WHERE geom && ST_MakeEnvelope(${ bounds._southWest.lng }, ${ bounds._southWest.lat }, ${ bounds._northEast.lng }, ${ bounds._northEast.lat }, 4326) limit 100;`;

    theClient.query(sql, function(err, result) {
      if (err) return console.log(err);

      const featureCollection = new FeatureCollection();

      for (let i = 0; i < result.rows.length; i++) {
        featureCollection.features[i] = JSON.parse(result.rows[i].geom);
        featureCollection.features[i].signdesc = result.rows[i].signdesc1;
      }
      res.send(featureCollection);
    });
  }
}


