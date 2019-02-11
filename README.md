# ProjetIndustriel
Projet Industriel - Techniques de Développement et Modélisation

# Contenu Base de Données:
DBServeur:
	tblProduction:
	 PK productId, int;
	 FK clientId, int;	
		quantite, float, NULL;
		echeance, date, NULL;

	tblDetail:
	 FK productId, int;
		temperature, int;
		dateProduction, date;
		niveau, float;
	
	tblClient:
	 PK clientId, int;
		prenom, char(50);
		nom, char(50);
		adresse, char(100), NULL;
		
DBlocal:
	tblProduction:
		clientId, int;
		quantite, float;
		echeance, date, NULL;
		temperature, char(10);
		niveau, float;
		dateProduction, date;
