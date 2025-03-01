# Tutoriel application sans backend pour SR10
Techno : HTML, EJS, ExpressJS, NodeJS, Bootstrap

## Sommaire
- [Initialisation du projet](#initialisation-du-projet)
- [Mise en place du serveur](#mise-en-place-du-serveur)
- [Main](#main)
- [Page d'accueil](#page-daccueil)
- [Mise en place des composants réutilisables](#mise-en-place-des-composants-réutilisables)
    - [Navbar](#navbar)
    - [Header](#header)
    - [Footer](#footer)

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
- **public** : contient les fichiers Javascript (), les données sous forme de fichiers JSON () et les images
- **views** : contient les vues sous forme de fichiers EJS. Les composants réutilisés au sein du projet sont placés dans le dossier partials (ex : navbar) et les pages du site dans le dossier page (ex : la page d'accueil index.ejs). Le dossier contient aussi un fichier main.ejs qui sert de layout principal : Ce fichier est le layout il intègre les partials (header, navbar, footer) et charge dynamiquement le contenu central.
- **server.js** : utilise EJS comme moteur de template et permet de mettre en place l'application (configurer Express, gérer les routes, servir les fichiers statiques, etc.)
- **package.json** et **package-lock.json** : contiennent des configurations et informations sur l'application

## Mise en place du serveur
Dans server.js :
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

Le fichier main.ejs est le layout principal. Il intègre les partials (header, navbar, footer) et charge dynamiquement le contenu central (<%- include(page) %>).

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
Certains éléments du site web sont à afficher sur chaque page. C'est le cas du menu par exemple. Pour éviter d'ajouter ces composants dans le code de chacune des pages, nous les créons une seule fois dans des fichiers dédiés puis y faisons appel aux endroits voulu. Ces éléments sont implémentés dans le dossier **views/partials**.

### Navbar
La Navbar est un menu de navigation. Pour générer un menu, on utilise la balise HTML ```<nav>``` dans laquelle on insert une liste non-ordonnée (```<ul>```) de liens cliquables (```<a>```). Voici le contenu de navbar.ejs :
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
                    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" 
                       data-bs-toggle="dropdown" aria-expanded="false">
                        Résultats
                    </a>
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
#### Explications

Les différentes classes utilisées proviennent de Bootstrap. Elles permettent d'ajouter du style et d'activer des fonctionnalités interactives sans avoir à écrire de CSS ou JavaScript personnalisé. Pour que ces fonctionnalités soient activées, il faut charger bootstrap dans le footer et le header (footer.ejs et header.ejs) que l'on développera dans la partie suivante. 

Voici une briève description des différents composants html utilisés pour construire la navbar :

|                        Élément                        |                     Rôle                     |
|:-----------------------------------------------------:|:--------------------------------------------:|
| \<nav class="navbar ...">                              | Définit la barre de navigation               |
| \<div class="container">                               | Centre le contenu                            |
| \<a class="navbar-brand">                              | Affiche le logo                              |
| \<button class="navbar-toggler">                       | Ajoute un bouton burger en mobile            |
| \<div class="collapse navbar-collapse">                | Permet de masquer/afficher le menu en mobile |
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

Bootstrap présente une multitude de styles et interactions permettant de se passer du développement de fichiers CSS. Il est intéressant de consulter [son catalogue](https://getbootstrap.com/docs/5.3/getting-started/introduction/).

**Gestion de l'affichage mobile**

Bootsrap permet d'assurer un affichage cohérent du menu sur un mobile. Voici la version ordinateur et la version mobile, générées à partir du même code :

<img src="img/menu-ordi.png" alt="menu sur ordinateur" width="900"/> 

*Menu sur ordinateur*

<img src="img/sans-menu-mobile.png" alt="menu sur mobile" width="200"/>
<img src="img/menu-mobile.png" alt="menu sur mobile" width="200"/>

*Menu sur mobile avant et après affichage*

Vous pouvez visualiser le rendu sur ordinateur et mobile depuis l'inspecteur.

### Header

Le header (views/partials/header.ejs) contient les métadonnées de la page et l'intégration de Bootstrap. Il permet aussi d'ajouter une bannière affichant le titre du site sur chacune des pages. La variable "title" est mise à jour selon la page (route) sur laquelle on se trouve (cf routes dans server.js).

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- titre du site -->
<title><%= title %> - Site du tutoriel pour SR10</title>

<!-- bootstrap css -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- titre principal affiché en haut de chaque page -->
<header class="bg-secondary text-white text-center py-4">
    <h1>Site du tutoriel pour SR10</h1>
</header>
```

### Footer

Le footer (footer.ejs) contient la bannière de bas de page et les scripts JS Bootstrap.

```html
<!-- banniere de bas de page -->
<footer class="text-center mt-4">
    <p>&copy; 2025 Mon Site</p>
</footer>

<!-- bootstrap bundle -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js"></script>
```


À ce stade, la page d'accueil du site affiche un header, un menu, le contenu souhaité et un footer. Lancez l'application (```node server.js```) et rendez-vous à l'adresse http://localhost:3000 pour la visualiser.


- faire les routes pour onglets de resultats