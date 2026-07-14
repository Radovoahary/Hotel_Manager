#  Hotel Manager - Système de Gestion Hôtelière

Une application web moderne, fluide et performante conçue pour centraliser et simplifier la gestion quotidienne d'un établissement hôtelier (chambres, clients, réservations et statistiques).

Le projet utilise une architecture moderne combinant la puissance backend de **Laravel 12**, la réactivité frontend de **React** (avec **TypeScript** et **Tailwind CSS**), le tout orchestré sans API complexe grâce à **Inertia.js**.

---

##  Fonctionnalités Principales

###  1. Tableau de Bord (Dashboard)
* **Indicateurs clés en temps réel :** Affichage dynamique du nombre total de chambres, du volume de clients enregistrés, du cumul des réservations et des revenus totaux générés par l'établissement.
* **Architecture réactive :** Calcul automatique et synchronisation directe des indicateurs dès qu'une action (création/suppression) survient sur l'application.

###  2. Gestion des Chambres (CRUD Complet)
* **Création & Édition via Modal Dynamique :** Un formulaire intelligent unique gère à la fois l'ajout de nouvelles chambres et la modification des chambres existantes.
* **Gestion complète des données :** Configuration du numéro de chambre, du type (ex: Suite, Double Deluxe), du tarif par nuit, ainsi que du statut.
* **Cycle de statut :** Prise en charge des états de disponibilité (`Disponible`, `Occupée`, `Maintenance`).
* **Suppression sécurisée :** Suppression d'une chambre avec boîte de dialogue de confirmation pour éviter les erreurs de manipulation.

###  3. Fichier des Clients (CRUD Complet)
* **Registre centralisé :** Suivi rigoureux de l'identité des clients (Prénom, Nom, Email unique, Téléphone optionnel).
* **Contrôles de doublons intelligents :** Validation backend stricte interdisant l'usage d'une même adresse email pour deux clients distincts, tout en autorisant intelligemment un client à conserver son email lors de la modification de sa propre fiche.
* **Gestion unifiée :** Ajout, modification fluide et suppression définitive à partir d'une interface de tableau épurée.

###  4. Planning & Réservations
* **Formulaire d'affectation direct :** Prise en compte de la liaison logique stricte entre un client existant et une chambre disponible.
* **Calculateur de séjour :** Enregistrement des dates d'arrivée (`check_in_date`) et de départ (`check_out_date`) avec gestion automatique des prix globaux.
* **Automatisation des statuts :** Dès qu'une réservation est validée et confirmée, l'application bascule automatiquement le statut de la chambre associée en mode `Occupée`.

---

##  Guide d'Installation et Lancement (Pas à Pas)

Suivez scrupuleusement ces étapes pour installer et faire tourner l'application sur votre machine locale.

### Prérequis
Assurez vous d'avoir installé sur votre système :
* **PHP 8.2+**
* **Composer** (Gestionnaire de paquets PHP)
* **Node.js** (Version 18 ou supérieure) & **npm**
* Un serveur de base de données (ex: **XAMPP**, **WampServer**, **Laragon**) avec **MySQL**.

---

### Étape 1 : Clonage et installation des dépendances
Ouvrir terminal dans le dossier où se trouve le projet :

```bash
# 1. Installe les dépendances PHP du Backend
composer install

# 2. Installe les paquets JavaScript du Frontend
npm install
