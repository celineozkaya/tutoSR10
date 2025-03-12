document.addEventListener("DOMContentLoaded", function () {
    // recuperer les utilisateurs
    const usersDataElement = document.getElementById("usersData");
    const users = JSON.parse(usersDataElement.textContent);

    // categories de moyenne
    const categories = { "< 5": 0, "5-10": 0, "10-15": 0, "> 15": 0 };

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
                    text: 'Part d\'étudiants par catégorie de moyenne'
                }
            }
        }
    });
});
