# Tutoriel application sans backend pour SR10
Techno : HTML, EJS, ExpressJS, NodeJS, Bootstrap

## Sommaire
mettre liens vers les parties 
- [Initialisation du projet](#initialisation-du-projet)
- [Mise en place du serveur](#mise-en-place-du-serveur)
- [Page principale (index.ejs)](#page-principale-indexejs)
- [Mise en place des composants réutilisables](#mise-en-place-des-composants-réutilisables)

## Initialisation du projet
Suivre les instructions : https://nodejs.org/fr/download

### Création du projet
```
mkdir mon_projet
cd mon_projet
npm init -y
npm install express ejs
```
A ce stade, les fichiers package.json et package-lock.json et le dossier node_modules sont crées. 

Pour lancer l'application : 
```
node index.js
```
Ou bien, pour ne pas avoir à relancer l'application à chaque modification :
```
npm install -g nodemon
npx nodemon server.js
```

### Architecture (maj avec nv archi)
```
/mon_projet
│-- /public
│   │-- css/
│   │   |-- styles.css
│   │-- data/
│   │   |-- user.json
│   │-- js/
│   │   |-- script.js
│   │-- images/
│   │   |-- logo.png
│-- /views
│   │-- pages/
│       │-- form.ejs
│       │-- results.ejs
│       │-- index.ejs
│   │-- partials/
│   │   |-- header.ejs
│   │   |-- navbar.ejs
│   │   |-- footer.ejs
│   │-- main.ejs
│-- package-lock.json
│-- package.json
│-- server.js
```
- **public** : contient le CSS, les fichiers Javascript (), les données sous forme de fichiers JSON () et les images (logo)
- **views** : contient les vues sous forme de fichiers EJS (formulaires, résultats, etc.) ainsi que les composants *partials* (header, navbar, etc.) qui apparaîtront sur chaque page. 
- **server.js** : permet de mettre en place l'application (routes, démarrer le serveur, etc.)
- **package.json** et **package-lock.json** : contiennent des configurations et informations sur l'application (ils peuvent être ignoré pour le moment)

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

// servir (charger) les fichiers statiques (CSS, JS, JSON)
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
Cette page n'affiche rien puisque le fichier index.ejs (page d'accueil) n'a pas encore été crée.

## Page d'accueil (index.ejs)

Dans le dossier **views**, créez un fichier **index.ejs** :
```html
<h1 class="text-center">Accueil</h1>
<p class="text-center">Bienvenue sur la page d'accueil de mon site !</p>
```

Relancez l'application et rendez vous à l'adresse http://localhost:3000. La page s'affiche. Nous allons l'étoffer.

## Mise en place des composants réutilisables
Certains éléments du site web sont à afficher sur chaque page. C'est le cas du menu par exemple. Pour éviter d'ajouter ces composants dans le code de chacune des pages, nous les créons une seule fois dans des fichiers dédiés puis y faisons appel au moment voulu. Ces éléments sont implémenté dans le dossier **views/partials**.

### Navbar
La Navbar est un menu de navigation. Pour générer un menu, on utilise la balise HTML ```<nav>``` dans laquelle on insert une liste non-ordonnée (```<ul>```) de liens cliquables (```<a>```). Voici le contenu de navbar.ejs :
```html
<nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container">
        <!-- logo du site -->
        <a class="navbar-brand" href="/">
            <img src="/image/logo.jpg" width="30" height="30">
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <!-- liste des onglets du menu -->
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link" href="/">Accueil</a>
                </li>

                <!-- sous-onglets de Résultats -->
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

### Header
```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- titre du site -->
<title><%= title %> - Site du tutoriel pour SR10</title>

<!-- bootstrap CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- titre principal affiché en haut de la page -->
<header class="bg-secondary text-white text-center py-4">
    <h1>Site du tutoriel pour SR10</h1>
</header>
```

### Footer
```html
<footer class="text-center mt-4">
    <p>&copy; 2025 Mon Site</p>
</footer>

<!-- bootstrap bundle -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js"></script>
```



- detailler les explications pour navbar, footer, header
- expliquer un peu boostrap 
- maj sommaire + archi
- faire les routes pour onglets de resultats