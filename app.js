"use strict"; // Active le mode strict pour une meilleure gestion des erreurs et des bonnes pratiques

// Récupération des éléments HTML utilisés dans le script
const formulaire = document.getElementById("formulaire");
const prenom = document.getElementById("prenom");
const nom = document.getElementById("nom");
const email = document.getElementById("email");
const domaine = document.getElementById("domaine");
const bio = document.getElementById("bio");
const reste = document.getElementById("reste");
const resultat = document.getElementById("resultat");
const carte = document.getElementById("carte");

// Affiche un message d'erreur sous le champ concerné
function afficherErreur(idErreur, message) {
  document.getElementById(idErreur).textContent = message;
}

// Efface le message d'erreur quand le champ devient correct
function viderErreur(idErreur) {
  document.getElementById(idErreur).textContent = "";
}

// Met à jour l'état visuel du champ en fonction de sa validité
function mettreEtat(champ, estValide) {
  champ.classList.remove("valide", "invalide"); 

  if (estValide) {
    champ.classList.add("valide");
  } else {
    champ.classList.add("invalide");
  }
}

// Réinitialise les états de tous les champs et messages d'erreur du formulaire
function reinitialiserEtats() {
  formulaire.querySelectorAll(".valide, .invalide").forEach(function(champ) {
    champ.classList.remove("valide", "invalide");
  });

  formulaire.querySelectorAll(".erreur").forEach(function(message) {
    message.textContent = "";
  });
}
// Validation commune pour le prénom et le nom
function verifierTexte(champ, idErreur, nomChamp) {
  const valeur = champ.value.trim();

 
  if (valeur === "") {
    afficherErreur(idErreur, `${nomChamp} est obligatoire.`);
    mettreEtat(champ, false);
    return false;
  }

  if (valeur.length < 3) {
    afficherErreur(idErreur, `${nomChamp} doit contenir au moins 3 caractères.`);
    mettreEtat(champ, false);
    return false;
  }

  viderErreur(idErreur);
  mettreEtat(champ, true);
  return true;
}

// Vérifie que l'email est rempli et respecte un format correct
function verifierEmail() {
  const valeur = email.value.trim();
  const emailValide = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valeur);

  if (valeur === "") {
    afficherErreur("erreur-email", "L'email est obligatoire.");
    mettreEtat(email, false);
    return false;
  }

  if (!emailValide) {
    afficherErreur("erreur-email", "Entre un email valide.");
    mettreEtat(email, false);
    return false;
  }

  viderErreur("erreur-email");
  mettreEtat(email, true);
  return true;
}

// Vérifie qu'un domaine a été sélectionné dans la liste
function verifierDomaine() {
  if (domaine.value === "") {
    afficherErreur("erreur-domaine", "Choisis un domaine.");
    mettreEtat(domaine, false);
    return false;
  }

  viderErreur("erreur-domaine");
  mettreEtat(domaine, true);
  return true;
}

// Vérifie qu'un seul rythme de travail a été choisi et que le choix s'affiche
function verifierRythme() {
  const rythmeChoisi = document.querySelector('input[name="rythme"]:checked'); // :checked permet de recuperer la valeur du radio
  const groupeRythme = document.getElementById("erreur-rythme").closest("fieldset"); // Permet de recuperer le fieldset parent du message d'erreur
  
  if (!rythmeChoisi) {
    afficherErreur("erreur-rythme", "Choisis ton rythme de travail");
    mettreEtat(groupeRythme, false);
    return false;
  }

  viderErreur("erreur-rythme");
  mettreEtat(groupeRythme, true);
  return true;
}

// Vérifie qu'au moins deux centres d'intérêt sont cochés
function verifierInterets() {
  const casesCochees = document.querySelectorAll('input[name="interets"]:checked');
  const groupeInterets = document.getElementById("erreur-interets").closest("fieldset");

  if (casesCochees.length < 2) {
    afficherErreur("erreur-interets", "Choisis au moins 2 centres d'intérêt.");
    mettreEtat(groupeInterets, false);
    return false;
  }

  viderErreur("erreur-interets");
  mettreEtat(groupeInterets, true);
  return true;
}

// Vérifie la longueur minimale de la présentation
function verifierBio() {
  const longueur = bio.value.trim().length;

  if (longueur < 25) {
    afficherErreur("erreur-bio", `La présentation doit contenir au moins 25 caractères (${longueur}/25).`);
    mettreEtat(bio, false);
    return false;
  }

  viderErreur("erreur-bio");
  mettreEtat(bio, true);
  return true;
}

// Met à jour le nombre de caractères restants dans la présentation
function mettreAJourCompteur() {
  reste.textContent = 255 - bio.value.length;
}

function creerLigneCarte(titre, valeur) {
  const paragraphe = document.createElement("p");
  const libelle = document.createElement("strong");

  libelle.textContent = `${titre} :`;
  paragraphe.append(libelle, ` ${valeur}`);

  return paragraphe;
}

// Affichage de la carte avec les informations du formulaire deja validé
function afficherCarte() {
  const prenomValeur = prenom.value.trim();
  const nomValeur = nom.value.trim();
  const emailValeur = email.value.trim();
  const domaineValeur = domaine.options[domaine.selectedIndex].text;
  const rythmeValeur = document.querySelector('input[name="rythme"]:checked').value;
  const interetsValeur = Array.from(document.querySelectorAll('input[name="interets"]:checked')).map(function(checkbox) {
    return checkbox.value;
  }).join(", ");
      
  const bioValeur = bio.value.trim();
  const titre = document.createElement("h2");

  titre.textContent = "Ton profil en résumé";
  carte.replaceChildren(
    titre,
    creerLigneCarte("Prénom", prenomValeur),
    creerLigneCarte("Nom", nomValeur),
    creerLigneCarte("Email", emailValeur),
    creerLigneCarte("Domaine d'expertise", domaineValeur),
    creerLigneCarte("Rythme de travail préféré", rythmeValeur),
    creerLigneCarte("Centres d'intérêt", interetsValeur),
    creerLigneCarte("Présentation personnelle", bioValeur)
  );
}


// Lance toutes les validations avant l'envoi du formulaire
function verifierTout() {
  const prenomOk = verifierTexte(prenom, "erreur-prenom", "Le prénom");
  const nomOk = verifierTexte(nom, "erreur-nom", "Le nom");
  const emailOk = verifierEmail();
  const domaineOk = verifierDomaine();
  const rythmeOk = verifierRythme();
  const interetsOk = verifierInterets();
  const bioOk = verifierBio();

  return prenomOk && nomOk && emailOk && domaineOk && rythmeOk && interetsOk && bioOk;
}

// Validation en direct pendant que l'utilisateur remplit le formulaire
prenom.addEventListener("input", function() {
  verifierTexte(prenom, "erreur-prenom", "Le prénom");
});

prenom.addEventListener("blur", function() {
  verifierTexte(prenom, "erreur-prenom", "Le prénom");
});

nom.addEventListener("input", function() {
  verifierTexte(nom, "erreur-nom", "Le nom");
});

nom.addEventListener("blur", function() {
  verifierTexte(nom, "erreur-nom", "Le nom");
});

email.addEventListener("input", verifierEmail);
email.addEventListener("blur", verifierEmail);
domaine.addEventListener("change", verifierDomaine);

document.querySelectorAll('input[name="rythme"]').forEach(function(radio) {
  radio.addEventListener("change", verifierRythme);
});

document.querySelectorAll('input[name="interets"]').forEach(function(checkbox) {
  checkbox.addEventListener("change", verifierInterets);
});

bio.addEventListener("input", function() {
  mettreAJourCompteur();
  verifierBio();
});

bio.addEventListener("blur", verifierBio);

// Au clic sur le bouton, on bloque l'envoi classique et on affiche la carte si tout est valide
formulaire.addEventListener("submit", function(event) {
  event.preventDefault();

  if (verifierTout()) {
    afficherCarte();
    resultat.hidden = false;
    formulaire.reset();
    reinitialiserEtats();
    mettreAJourCompteur();
  } else {
    resultat.hidden = true;
  }
});

// Initialise le compteur au chargement de la page
mettreAJourCompteur();
