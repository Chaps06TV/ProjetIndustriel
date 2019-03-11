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
		  var sql = "SELECT clientId, prenom, nom FROM tblclient ORDER BY nom";
  		  console.log("load_Cb: " + sql);
		  con.query(sql, function (err, result) {
		  socket.emit('reponse_load_Cb',{result});
			});
		});
	});

	socket.on('load_client', function(data) {
		con.connect(function(err) {
		  var sql = "SELECT prenom, nom, adresse FROM tblclient WHERE clientID=" + data.idClient;
		  console.log("load_client: " + sql);
		  con.query(sql, function (err, result) {
		  socket.emit('reponse_load_client',{result});
			});
		});
	});

	socket.on('load_commande', function(data) {
		con.connect(function(err) {
		  var sql = "SELECT nom, quantite, echeance FROM tblProduction WHERE productId=" + data.idCommande;
		  console.log("load_commande: " + sql);
		  con.query(sql, function (err, result) {
		  socket.emit('reponse_load_commande',{result});
			});
		});
	});

	socket.on('load_commande_client', function(data) {
		con.connect(function(err) {
		  var sql = "SELECT productID, nom FROM tblproduction WHERE clientID=" + data.idClient + " ORDER BY echeance";
		  console.log("load_commande_client: " + sql);
		  con.query(sql, function (err, result) {
		  socket.emit('reponse_load_commande_client',{result});
			});
		});
	});

	// Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
	socket.on('nouveau_client', function(data) {
		var prenom = data.prenom;
		var nom = data.nom;
		var adresse = data.adresse;
		  con.connect(function(err) {
		  var sql = "INSERT INTO tblclient (prenom, nom, adresse) VALUES ('" + prenom + "','" + nom + "','" + adresse + "')";
		  console.log("nouveau_client: " + sql);
		  con.query(sql, function (err, result) {
		  });
		});
	});

	// Fonction qui insere une nouvelle commande dans la base de donnee
	socket.on('nouvelle_commande', function(data) {
		var clientId = data.clientId;
		var nomProd = data.nomProd;
		var qte = data.qte;
		var date = data.date;
		  con.connect(function(err) {
		  var sql = "INSERT INTO tblproduction (clientId, nom, quantite, echeance) VALUES ('" + clientId + "','" + nomProd + "','" + qte + "','" + date + "')";
		  console.log("nouvelle_commande: " + sql);
		  con.query(sql, function (err, result) {
		  });
		});
	});

});

server.listen(8080);
