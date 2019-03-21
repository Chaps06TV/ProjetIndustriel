# ProjetIndustriel
Projet Industriel - Techniques de Développement et Modélisation

## Messages Socket.IO
### Requêtes
load_Cb Charger tous les clients
load_client Charger un client spécifique
load_commande Charger toutes les commandes d'un client
load_commande_client Charger une commande spécifique
load_tab Charger les détails des commandes d'un client
nouveau_client Créer un nouveau client
nouvelle_commande Créer une nouvelle commande
modifier_client Modifier un client
modifier_commande Modifier une commande
synchroniser Synchroniser les données du système embarqué avec la base de données

### Réponses
reponse_load_Cb Recevoir tous les clients
reponse_load_client Recevoir un client spécifique
reponse_load_commande Recevoir toutes les commandes d'un client
reponse_load_commande_client Recevoir une commande spécifique
reponse_load_tab Recevoir les détails des commandes d'un client
synchroniserSysEmb Demande de synchronisation avec le système embarqué
synchroDone Synchronisation terminée

## Contenu Base de Données:
DB Serveur:
```
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
```
		
DB Locale:
```
tblProduction:
	clientId, int;
	quantite, float;
	echeance, date, NULL;
	temperature, char(10);
	niveau, float;
	dateProduction, date;
```
