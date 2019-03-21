var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    ent = require('ent'), // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)
    fs = require('fs');
	
var mysql = require('mysql');

//var boot = require('bootstrap');

var con = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "bdd_industriel"
});

// Chargement de la page index.html
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/clients.html');
});

// Chargement de la page client.html
app.get('/commandes', function (req, res) {
  res.sendfile(__dirname + '/commandes.html');
});

// Chargement de la page client.html
app.get('/cuves', function (req, res) {
  res.sendfile(__dirname + '/cuves.html');
});

// Chargement de la page client.html
app.get('/clients', function (req, res) {
  res.sendfile(__dirname + '/clients.html');
});

io.sockets.on('connection', function(socket){
	
	// Fonction qui appele la base de donnee pour remplir
	// le combobox avec tous les clients 
	socket.on('load_Cb', function() {
		con.connect(function(err) {
		  console.log("Connected!");
		  var sql = "SELECT clientId, prenom, nom FROM tblclient";
		  con.query(sql, function (err, result) {
		  socket.emit('reponse_load_Cb',{result});
			});
		});
				
	});
	
	// Fonction qui appele le systeme embarque pour 
	// synchroniser nos base de donnees
	socket.on('synchroniser', function() {
		socket.emit('synchroniserSysEmb');		
	});
	
	// Fonction qui appele le systeme embarque pour 
	// synchroniser nos base de donnees
	socket.on('reponseSysEmb', function(data) {
		var json = JSON.parse(data);
		/*
		var json = {
		"productId":["1", "1"],
		"temperature":["420", "69"],
		"dateProduction":["2018-05-24","2018-06-18"],
		"niveau":["17","23"]
		};
		*/
		con.connect(function(err) {
			console.log("Connected!");
			for(i in json.temperature){
				var sql = "INSERT INTO tbldetail (productId, temperature, dateProduction, niveau) VALUES ('" + json.productId[i] + "','" + json.temperature[i] + "','" + json.dateProduction[i] + "','" + json.niveau[i] + "')";
				con.query(sql, function (err, result) {
				});
			}
		});
		socket.emit('synchroDone');		
	});
	
	// Fonction qui appele une procedure stockee 
	// dans la base de donnee pour remplir le tableau 
	// de la page cuves
	socket.on('load_tab', function(data) {
		con.connect(function(err) {
		  console.log("ConnectedTab!");
		  var id = data.id;
		  var sql = "CALL production_detail(?)";
		  con.query(sql,[id], function (err, result) {
		  console.log(result);
		  socket.emit('reponse_load_tab',{result});
			});
		});
				
	});

	// Fonction qui insere un nouveau client dans la base de donnee
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
	
	// Fonction qui insere une nouvelle commande dans la base de donnee
	socket.on('nouvelle_commande', function(data) {
		var clientId = data.clientId;
		var nomProd = data.nomProd;
		var qte = data.qte;
		var date = data.date;
		  con.connect(function(err) {
		  console.log("Connected!");
		  var sql = "INSERT INTO tblproduction (clientId, nom, quantite, echeance) VALUES ('" + clientId + "','" + nomProd + "','" + qte + "','" + date + "')";
		  con.query(sql, function (err, result) {
		  });
		});
	});
	
	// Code qui modifie un client aupres de la base de donnee
	socket.on('modifier_client', function(data) {
		var clientId = data.clientId;
		var prenom = data.prenom;
		var nom = data.nom;
		var adresse = data.adresse;
		  con.connect(function(err) {
		  console.log("Connected!");
		  var sql = "UPDATE tblclient SET prenom = '" + prenom + "',nom = '" + nom + "', adresse='" + adresse + "' WHERE clientId = " + clientId + ";";
		  con.query(sql, function (err, result) {
		  });
		});
	});
	
	// Code qui modifie une commande aupres de la base de donnee
	socket.on('modifier_commande', function(data) {
		var productionId = data.productionId;
		var nomProd = data.nomProd;
		var qte = data.qte;
		var date = data.date;
		  con.connect(function(err) {
		  console.log("Connected!");
		  var sql = "UPDATE tblproduction SET nom = '" + nomProd + "',quantite = '" + qte + "', echeance='" + date + "' WHERE productId = " + productionId + ";";
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
