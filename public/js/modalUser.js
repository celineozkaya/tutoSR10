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
                .then(response => response.json()) // transforme la reponse en un objet js
                .then(users => {
                    const user = users.etudiants.find(u => u.id == userId); // trouver l'utilisateur correspondant
                    
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
