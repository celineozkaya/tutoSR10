document.addEventListener("DOMContentLoaded", function () {
    // recuperer les utilisateurs
    const usersDataElement = document.getElementById("usersData");
    const users = JSON.parse(usersDataElement.textContent);

    // categories de moyenne (pieChart)
    const categories = { "< 5": 0, "5-10": 0, "10-15": 0, "> 15": 0 };

    // notes des étudiants pour chaque uv (barChart)
    const notesParUv = {};

    // pour chaque etudiant
    users.etudiants.forEach(user => {
        

        // liste des uv de user
        const uvKeys = Object.keys(user.UV); // ex : ["SR03", "SR06", "SR07", "LO18", "NF11"]

        // liste des notes de user
        const uvValues = Object.values(user.UV); // ex : [10, 8, 10, 9, 13]

        // somme des notes de user
        const total = uvValues.reduce((sum, note) => sum + note, 0);

        // nombre d'UVs de user
        const nombreUVs = uvKeys.length;

        // moyenne
        const moyenne = total / nombreUVs;
        if (moyenne < 5){
            categories["< 5"]++;
        } 
        else if (moyenne < 10){
            categories["5-10"]++;
        }
        else if (moyenne < 15){
            categories["10-15"]++;
        } 
        else{
            categories["> 15"]++;
        }

        
        // ajouter les notes au tableau général notesParUv
        uvKeys.forEach((uv, index) => {
            if (!notesParUv[uv]) {
                notesParUv[uv] = [];
            }
            notesParUv[uv].push(uvValues[index]);
        });
    });

        
    // creation du camembert
    const ctx = document.getElementById("pieChart");
    new Chart(ctx, {
        type: "pie",
        data: {
            labels: Object.keys(categories),
            datasets: [{
                data: Object.values(categories),
                backgroundColor: ["#9cb0d8", "#d89cce", "#d8c49c", "#9cd8a6"]
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: "Part d'étudiants par catégorie de moyenne"
                }
            }
        }
    });

    // création des histogrammes par UV
    const barChartsContainer = document.getElementById("barChartsContainer"); // recuperer le conteneur barChartsContainer

    // pour chaque UV listée, 
    Object.keys(notesParUv).forEach(uv => {
        // créer un histogramme via un element html <canvas>
        const canvas = document.createElement("canvas");
        canvas.id = `chart-${uv}`; // id du canvas
        barChartsContainer.appendChild(canvas); // ajouter le canvas au conteneur des histogrammes

        // créer le canvas
        new Chart(canvas, {
            type: "bar",
            data: {
                // association de chaque note à un titre
                labels: notesParUv[uv].map(function(note, i){
                    return `Note ${i+1}`;
                }),
                datasets: [{
                    label: `Notes pour ${uv}`, // titre de l'histogrammes
                    data: notesParUv[uv], // notes de l'uv représenté sur l'histogramme
                    backgroundColor: "#9cb0d8" // couleur des batons
                }]
            },
            options: {
                plugins: {
                    // ajout d'un titre au diagrammme
                    title: {
                        display: true,
                        text: `Notes des étudiants pour l'UV ${uv}`
                    }
                },
            }
        });
    });
});
