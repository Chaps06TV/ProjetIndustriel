var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    ent = require('ent'), // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)
    fs = require('fs');
	
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "bdd_industriel"
});

// Chargement de la page index.html
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

// Chargement de la page client.html
app.get('/clients', function (req, res) {
  res.sendfile(__dirname + '/clients.html');
});

// Chargement de la page commandes.html
app.get('/commandes', function (req, res) {
  res.sendfile(__dirname + '/commandes.html');
});

// Chargement de la page cuves.html
app.get('/cuves', function (req, res) {
  res.sendfile(__dirname + '/cuves.html');
});


io.sockets.on('connection', function(socket){
	// Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
	socket.on('load_Cb', function() {
		
		con.connect(function(err) {
		  console.log("Connected!");
		  var sql = "SELECT clientId, prenom, nom FROM tblclient";
		  con.query(sql, function (err, result) {
		  socket.emit('reponse_load_Cb',{result});
			});
		});
	});

	socket.on('load_client', function() {
		con.connect(function(err) {
		  console.log("Connected!");
		  var sql = "SELECT prenom, nom, adresse FROM tblclient WHERE clientID=" + data.id;
		  con.query(sql, function (err, result) {
		  socket.emit('reponse_load_client',{result});
			});
		});
	});

	// Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
	socket.on('nouveau_client', function(data) {
		var prenom = data.prenom;
		var nom = data.nom;
		var adresse = data.adresse;
		  con.connect(function(err) {
		  console.log("Connected!");
		  var sql = "INSERT INTO tblclient (prenom, nom, adresse) VALUES ('" + prenom + "','" + nom + "','" + adresse + "')";
		  con.query(sql, function (err, result) {
		  });
		});
	});

	// Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
	socket.on('message', function (message) {
		message = ent.encode(message);
		socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message});
	}); 

});

server.listen(8080);
