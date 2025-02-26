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

// // route Tableaux
// app.get('/results/tables', (req, res) => {
//     const dataPath = path.join(__dirname, 'public/data/data.json');
//     const jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
//     res.render('main', {
//         title: 'Tableaux',
//         page: 'pages/tables',
//         results: jsonData.results
//     });
// });
        
// // route Graphiques
// app.get('/results/charts', (req, res) => {
//     res.render('main', {
//         title: 'Graphiques',
//         page: 'pages/charts'
//     });
// });
                
                
// demarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

