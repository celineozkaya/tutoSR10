# Tutoriel application sans backend pour SR10
Techno : HTML, EJS, ExpressJS, NodeJS, Bootstrap

## Introduction
Ce tutoriel permet de créer une application affichant des informations sur des utilisateurs ainsi que leurs résultats académiques sous forme de tableaux et graphiques. Pour ce faire, nous utilisons les technologies du développement web suivantes : 
- [Node.js](https://nodejs.org/en/about) : Un environnement d’exécution JavaScript côté serveur, qui nous permet de créer des applications web performantes sans avoir besoin d’un serveur comme Apache ou Nginx.

- [Express.js](https://expressjs.com/en/starter/installing.html) : Un framework minimaliste pour Node.js, qui facilite la création d’applications web et la gestion des routes et requêtes HTTP.

- [EJS (Embedded JavaScript Templates)](https://ejs.co/#install) : Un moteur de template qui nous permet d’inclure du code JavaScript directement dans nos pages HTML et de générer dynamiquement du contenu.

- [Bootstrap(https://getbootstrap.com/docs/5.3/getting-started/introduction/)] : Une bibliothèque CSS et JavaScript qui offre des styles et des composants prêts à l’emploi pour rendre notre application plus esthétique et interactive.

## Sommaire
- [Initialisation du projet](#initialisation-du-projet)
- [Mise en place du serveur](#mise-en-place-du-serveur)
- [Main](#main)
- [Page d'accueil](#page-daccueil)
- [Mise en place des composants réutilisables](#mise-en-place-des-composants-réutilisables)
    - [Navbar](#navbar)
    - [Header](#header)
    - [Footer](#footer)
- [Données](#données)
- [Résultats sous forme de tableaux](#résultats-sous-forme-de-tableaux)
    - [Route](#route)
    - [Page](#page)
    - [Gestion de la modale](#gestion-de-la-modale)
- [Résultats sous forme de graphiques](#résultats-sous-forme-de-graphiques)
    - [Route](#route-1)
    - [Page](#page-1)

## Initialisation du projet
Suivre les instructions : https://nodejs.org/fr/download

### Création du projet
```shell
mkdir mon_projet
cd mon_projet
npm init -y
npm install express ejs
```
A ce stade, les fichiers package.json et package-lock.json et le dossier node_modules sont crées. 

Pour lancer l'application : 
```shell
node server.js
```
Ou bien, pour ne pas avoir à relancer l'application à chaque modification :
```shell
npm install -g nodemon
npx nodemon server.js
```

### Architecture

Voici l'architecture finale du projet :
```
/mon_projet
│-- /public
│   │-- data/
│   │   |-- user.json
│   │-- js/
│   │   |-- script.js
│   │-- images/
│   │   |-- logo.png
│-- /views
│   │-- pages/
│   |   │-- form.ejs
│   |   │-- results.ejs
│   |   │-- index.ejs
│   │-- partials/
│   │   |-- header.ejs
│   │   |-- navbar.ejs
│   │   |-- footer.ejs
│   │-- main.ejs
│-- package-lock.json
│-- package.json
│-- server.js
```
- **public** : contient les scripts Javascript, les données sous forme de fichiers JSON et les images

- **views** : contient les vues sous forme de fichiers EJS. Les composants réutilisés au sein du projet sont placés dans le dossier partials (ex : navbar) et les pages du site dans le dossier page (ex : la page d'accueil index.ejs). Le dossier contient aussi un fichier main.ejs qui sert de layout principal. Il intègre les partials (header, navbar, footer) et charge dynamiquement le contenu central.
- **server.js** : utilise EJS comme moteur de template et permet de mettre en place l'application (configurer Express, gérer les routes, servir les fichiers statiques, etc.)
- **package.json** et **package-lock.json** : contiennent des configurations et informations sur l'application

## Mise en place du serveur
Voici le squelette de base de **server.js** :

```javascript
const express = require('express'); // importer express
const path = require('path'); 

const app = express();
const PORT = 3000; 

// definir EJS comme moteur de template
app.set('view engine', 'ejs');

// definir le dossier des vues (indique à Express ou se trouvent les fichiers de templates)
app.set('views', path.join(__dirname, 'views'));

// servir (charger) les fichiers statiques (JS, JSON)
app.use(express.static(path.join(__dirname, 'public')));

// route Accueil
app.get('/', (req, res) => {
    res.render('main', {
        title: 'Accueil',
        page: 'pages/index'
    });
});
          
// demarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
```

Pour l'instant, il n'est possible de se rendre qu'à la page http://localhost:3000 puisque c'est la seule route qui a été définit au sein de l'application. Cf les lignes suivantes :

```javascript
// route Accueil
app.get('/', (req, res) => {
    res.render('main', {
        title: 'Accueil',
        page: 'pages/index'
    });
});
```
Cette page n'affiche rien puisque le fichier index.ejs (page d'accueil) n'a pas encore été créé.

## Main

Le fichier **main.ejs** est le layout principal. Il intègre les partials (header, navbar, footer) et charge dynamiquement le contenu central (```<%- include(page) %>```).

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <!-- header -->
    <%- include('partials/header') %>
    <title><%= title %></title>
</head>
<body>
    <!-- navbar -->
    <%- include('partials/navbar') %>

    <!-- contenu de la page chargé dynamiquement -->
    <main class="container mt-4">
        <%- include(page) %>
    </main>

    <!-- footer -->
    <%- include('partials/footer') %>
</body>
</html>
```

## Page d'accueil

Dans le dossier **views**, créez un fichier **index.ejs** :

```html
<h1 class="text-center">Accueil</h1>
<p class="text-center">Bienvenue sur la page d'accueil de mon site !</p>
```

## Mise en place des composants réutilisables
Certains éléments du site web sont à afficher sur chaque page. C'est le cas du menu par exemple. Pour éviter d'ajouter ces composants dans le code de chacune des pages, nous les créons une seule fois dans des fichiers dédiés puis y faisons appel aux endroits voulus. Ces éléments sont implémentés dans le dossier **views/partials**.

### Navbar
La Navbar est un menu de navigation. Pour générer un menu, on utilise la balise HTML ```<nav>``` dans laquelle on insert une liste non-ordonnée (```<ul>```) de liens cliquables (```<a>```). Voici le contenu de **navbar.ejs** :

```html
<nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container">

        <!-- logo du site -->
        <a class="navbar-brand" href="/">
            <img src="/image/logo.jpg" width="30" height="30">
        </a>

        <!-- gestion de la navbar pour mobiles -->
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
            <!-- liste des onglets du menu -->
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link" href="/">Accueil</a>
                </li>

                <!-- menu deroulant pour les sous-onglets de Résultats -->
                <li class="nav-item dropdown">
                    <!-- onglet -->
                    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" 
                       data-bs-toggle="dropdown" aria-expanded="false">
                        Résultats
                    </a>
                    <!-- sous onglets -->
                    <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                        <li><a class="dropdown-item" href="/">Tableaux</a></li>
                        <li><a class="dropdown-item" href="/">Graphiques</a></li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</nav>
```
#### Utilisation de bootstrap

Les différentes classes utilisées (class="...") proviennent de Bootstrap. Elles permettent d'ajouter du style et d'activer des fonctionnalités interactives sans avoir à écrire de CSS ou JavaScript personnalisé. Pour que ces fonctionnalités soient activées, il faut charger bootstrap dans le footer et le header (footer.ejs et header.ejs) que l'on développera dans la partie suivante. 

Bootstrap présente une multitude de styles et interactions permettant de se passer du développement de fichiers CSS. Il est intéressant de consulter [son catalogue](https://getbootstrap.com/docs/5.3/getting-started/introduction/).

Voici une description des différents composants html utilisés pour construire la navbar :

|                        Élément                        |                     Rôle                     |
|:-----------------------------------------------------:|:--------------------------------------------:|
| \<nav class="navbar ...">                              | Définit la barre de navigation               |
| \<div class="container">                               | Centre le contenu                            |
| \<a class="navbar-brand">                              | Affiche le logo                              |
| \<button class="navbar-toggler">                       | Ajoute un bouton burger en mobile            |
| \<div class="collapse navbar-collapse">                | Permet de masquer/ afficher le menu en mobile |
| \<ul class="navbar-nav">                               | Conteneur des éléments de la navbar          |
| \<li class="nav-item">                                 | Définit un élément du menu                   |
| \<a class="nav-link">                                  | Lien de navigation                           |
| \<li class="nav-item dropdown">                        | Ajoute un menu déroulant                     |
| \<a class="dropdown-toggle" data-bs-toggle="dropdown"> | Active le menu déroulant                     |
| \<ul class="dropdown-menu">                            | Conteneur des sous-onglets                   |
| \<a class="dropdown-item">                             | Élément du sous-menu                         |

Voici une description du rôle des différentes classes utilisées : 

| Classe | Rôle |
|:------:|:----:|
| navbar	| Active le style de barre de navigation
| navbar-expand-lg	| Fait en sorte que la navbar soit rétractable sur les écrans petits/moyens
| navbar-light bg-light |	Applique un thème clair (texte sombre, fond clair)
| container |	Centre le contenu et limite la largeur
| navbar-brand |	Définit le logo ou nom du site
| navbar-toggler |	Crée un bouton burger sur mobile
| navbar-toggler-icon |	Affiche l’icône du bouton burger
| collapse navbar-collapse |	Permet à la navbar de se replier sur mobile
| navbar-nav |	Définit une liste de liens de navigation
| nav-item |	Définit un élément du menu
| nav-link |	Applique un style spécifique aux liens du menu
| dropdown |	Active un menu déroulant
| dropdown-toggle |	Ajoute la flèche du menu déroulant
| dropdown-menu	| Définit le contenu du menu déroulant
| dropdown-item |	Style les liens du menu déroulant

**Gestion de l'affichage mobile**

Bootstrap permet également d'assurer un affichage cohérent du menu sur un mobile. Voici la version ordinateur et la version mobile, générées à partir du même code :

<img src="img/menu-ordi.png" alt="menu sur ordinateur" width="900"/> 

*Menu sur ordinateur*

<img src="img/sans-menu-mobile.png" alt="menu sur mobile" width="200"/>
<img src="img/menu-mobile.png" alt="menu sur mobile" width="200"/>

*Menu sur mobile avant et après affichage*

Vous pouvez visualiser le rendu sur ordinateur et mobile depuis l'inspecteur.

### Header

Le header (**views/partials/header.ejs**) contient les métadonnées de la page et l'intégration de Bootstrap. Il permet aussi d'ajouter une bannière affichant le titre du site sur chacune des pages. La variable "title" est mise à jour selon la page (route) sur laquelle on se trouve (cf routes dans server.js).

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- titre du site (que l'on lit sur l'onglet du navigateur) -->
<title><%= title %> - Site du tutoriel pour SR10</title>

<!-- bootstrap css -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- titre principal affiché en haut de chaque page -->
<header class="bg-secondary text-white text-center py-4">
    <h1>Site du tutoriel pour SR10</h1>
</header>
```

### Footer

Le footer (**footer.ejs**) contient la bannière de bas de page et les scripts JS Bootstrap.

```html
<!-- banniere de bas de page -->
<footer class="text-center mt-4">
    <p>&copy; 2025 - Mon Site</p>
</footer>

<!-- bootstrap bundle -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js"></script>
```


À ce stade, la page d'accueil du site affiche un header, un menu, le contenu souhaité et un footer. Lancez l'application (```node server.js```) et rendez-vous à l'adresse http://localhost:3000 pour la visualiser.

## Données

Cette application de présente pas de backend. On ne manipulera pas non plus de bases de données. Nous allons simuler les données dans un fichier JSON. Un exemple est donné ci-dessous.

```json
{
    "etudiants" : [ 
    {
        "id": 1,
        "nom": "Pattin",
        "prenom": "Startin",
        "email": "pstartin0@spotify.com",
        "UV": {
            "SR03": 10,
            "SR06": 8,
            "SR07": 10,
            "LO18": 9,
            "NF11": 13
        }
    },
    {
        "id": 2,
        "nom": "Zara",
        "prenom": "Jozwik",
        "email": "zjozwik1@reverbnation.com",
        "UV": {
            "SR03": 7,
            "SR06": 16,
            "SR07": 12,
            "LO18": 15,
            "NF11": 8
        }
    },
    {
        "id": 3,
        "nom": "Dougie",
        "prenom": "Carne",
        "email": "dcarne2@wisc.edu",
        "UV": {
            "SR03": 17,
            "SR06": 14,
            "SR07": 12,
            "LO18": 9,
            "NF11": 14
        }
    }
]}
```
## Formulaire d'ajout d'un utilisateur

## Résultats sous forme de tableaux

### Route

On ajoute une nouvelle route au fichier **server.js** afin de permettre la navigation vers celle-ci. La route /results/tables lit les données depuis le JSON **public/data/users.json** puis les convertit en objet javascript (variable "users"). Elle rend une page EJS (title : 'Tableaux', page : 'pages/tables') en envoyant les données (users : users) qui sera chargée dans la page principale **main.ejs**.

```js
// route Tableaux
app.get('/results/tables', (req, res) => {
    // lire les donnees
    const dataPath = path.join(__dirname, 'public/data/users.json');
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send("Erreur lors de la lecture des données");
        }
        const users = JSON.parse(data); 
        // rendre la vue ejs main.ejs en passant les donnees a pages/tables.ejs
        res.render('main', {
            // donnees envoyees a la vue
            title : 'Tableaux', // titre de la page
            page : 'pages/tables', // page rendue
            users : users // donnees utilisateurs
        });
    });
});
```

### Page

La page results/table affiche un bouton déroulant - un dropdown, comme dans le menu - qui liste les utilisateurs. Lorsque l'on clique sur un des utilisateurs, une modale s'ouvre et présente son profil ainsi qu'un tableau présentant les résultats à ses UVs. Le développement des modales s'appuie sur la [documentation de Bootstrap pour les modales](https://getbootstrap.com/docs/5.3/components/modal/).

<img src="img/dropdown-user.png" alt="Liste des utilisateurs" width="200"/> 
<img src="img/modale.png" alt="Modale utilisateur" width="220"/> 

*Liste des utilisateurs (dropdown) et Modale utilisateur* 

#### Le bouton dropdown "Sélectionnez un utilisateur"
Le ```<div class="container"></div>``` sert à générer la liste d'utilisateurs. Le contenu (nom, prénom) de chaque entrée de la liste est récupéré à partir de la variable **users** ([voir la route associée](#route)). On peut alors itérer sur chacun des éléments de **users** à l'aide de la méthode ```forEach()```. 

Les éléments de la liste d'utilisateurs sont des liens (```<a class="dropdown-item user-link"></a>```) auxquels on associe un identifiant unique (```data-id="<%= user.id %>"```) de sorte à les différencier et à afficher le contenu associé à l'utilisateur choisi au sein de la modale. 

#### La modale
La modale est implémentée juste en dessous, dans le ```<div class="modal fade" id="userModal" tabindex="-1" aria-labelledby="userModalLabel" aria-hidden="true">```. Au départ, elle est cachée (aria-hidden="true") puisqu'on ne souhaite l'afficher qu'à la selection d'un utilisateur de la liste.

L'entête de la modale (```<div class="modal-header">```) contient son titre et une croix pour fermer la modale.

Le corps de la modale (```<div class="modal-body">```) contient les informations de l'utilisateur (nom, prénom, email) et un tableau (```<table class="table">```). On notera que les informations des utilisateurs sont peuplées dynamiquement à partir des identifiants id="modalPrenom", id="modalNom", etc. par le script [modalUser.js](#gestion-de-la-modale) au moment du clic sur un utilisateur. C'est aussi le cas pour les données du tableau des résultats.

Le pied de la modale (```<div class="modal-footer">```) contient un bouton "Fermer" qui ferme la modale.

```html
<h1 class="text-center">Tableaux des résultats</h1>

<!-- dropdown pour lister les utilisateurs -->
<div class="container">
    <div class="dropdown">
        <button class="btn btn-primary dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
            Sélectionnez un utilisateur
        </button>
        <!-- affichage dynamique des utilisateurs -->
        <div class="dropdown-menu" aria-labelledby="userDropdown">
            <% users.etudiants.forEach(user => { %>
                <a class="dropdown-item user-link" href="#" data-id="<%= user.id %>"><%= user.prenom %> <%= user.nom %></a>
            <% }); %>
        </div>
    </div>
</div>

<!-- modale qui affiche le profil utilisateur choisi -->
<div class="modal fade" id="userModal" tabindex="-1" aria-labelledby="userModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">

            <!-- entete de la modale -->
            <div class="modal-header">
                <h5 class="modal-title" id="userModalLabel">Informations de l'utilisateur</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <!-- contenu de la modale chargé dynamiquement (public/js/modalUser.js) -->
            <div class="modal-body">
                <p><strong>Prénom :</strong> <span id="modalPrenom"></span></p>
                <p><strong>Nom :</strong> <span id="modalNom"></span></p>
                <p><strong>Email :</strong> <span id="modalEmail"></span></p>
                <h6>Notes par UV :</h6>

                <!-- tableau des résultats aux UVs -->
                <table class="table">
                    <thead>
                        <tr>
                            <th>UV</th>
                            <th>Note</th>
                        </tr>
                    </thead>
                    <tbody id="modalUVs">
                        <!-- les uv sont insérées dynamiquement (public/js/modalUser.js) -->
                    </tbody>
                </table>
            </div>

            <!-- pied de la modale -->
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
            </div>
        </div>
    </div>
</div>
```

### Gestion de la modale
Le script **public/js/modalUser.js** "écoute" chacun des liens du dropdown et récupère l'identifiant de celui sur lequel on a cliqué (link.addEventListener("click", ...)). On cherche ensuite l'utilisateur possèdant cette id dans le fichier users.json. S'il y a une correspondance, on remplit le contenu de la modale avec les informations de l'utilisateur.

La modale affiche également un tableau listant les notes de l'utilisateur pour chaque UV. On construit ce tableau dynamiquement depuis le script et on l'ajoute au contenu de la modale.

```javascript
document.addEventListener("DOMContentLoaded", function () {
    // recuperer tous les liens dans le dropdown
    const userLinks = document.querySelectorAll(".user-link");
    
    // si on clic sur un des lien
    userLinks.forEach(link => {
        // ajout d'un evenement "click" sur les liens utilisateurs
        link.addEventListener("click", function (event) {

            // recuperer l'id de l'utilisateur
            const userId = this.getAttribute("data-id");
            
            // charger les donnees liees a l'utilisateur
            fetch("/data/users.json")
                // transforme la reponse en un objet js
                .then(response => response.json()) 
                .then(users => {
                    // trouver l'utilisateur correspondant
                    const user = users.etudiants.find(u => u.id == userId); 
                    
                    // si l'utilisateur est valide
                    if (user) {
                        // maj le contenu de la modale avec les info de user
                        document.getElementById("modalPrenom").textContent = user.prenom;
                        document.getElementById("modalNom").textContent = user.nom;
                        document.getElementById("modalEmail").textContent = user.email;
                        
                        const modalUVs = document.getElementById("modalUVs");
                        modalUVs.innerHTML = ""; // vider le tableau avant d'ajouter du contenu
                        
                        // construire le tableau d'uv et note
                        for (const [uv, note] of Object.entries(user.UV)) {
                            let row = `<tr><td>${uv}</td><td>${note}</td></tr>`;
                            modalUVs.innerHTML += row;
                        }
                        
                        // afficher la modale
                        let userModal = new bootstrap.Modal(document.getElementById("userModal"));
                        userModal.show();
                    }
                })
                .catch(error => console.error("Erreur lors du chargement des données :", error));
        });
    });
});

```


## Résultats sous forme de graphiques

### Route


### Page