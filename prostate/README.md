# 🎗️ Application Flask - Détection Cancer de la Prostate
### Novembre Bleu 2025

Application web de prédiction du cancer de la prostate utilisant l'intelligence artificielle et la régression logistique.

## 📋 Prérequis

- Python 3.8 ou supérieur
- pip (gestionnaire de packages Python)
- Fichier `cancer.xlsx` avec les données

## 📁 Structure du Projet

```
cancer-prostate-app/
│
├── app.py                          # Application Flask principale
├── requirements.txt                # Dépendances Python
├── cancer.xlsx                     # Dataset (à ajouter)
├── model.pkl                       # Modèle entraîné (généré automatiquement)
│
├── templates/
│   └── index.html                  # Page principale
│
├── static/
│   ├── style.css                   # Feuille de style
│   └── script.js                   # JavaScript
│
└── data/                           # Dossier pour les données (créé automatiquement)
```

## 🚀 Installation

### 1. Créer un environnement virtuel (recommandé)

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### 2. Installer les dépendances

```bash
pip install -r requirements.txt
```

### 3. Placer le fichier cancer.xlsx

Assurez-vous que le fichier `cancer.xlsx` est dans le même répertoire que `app.py`.

**Format attendu du fichier Excel :**
- Colonnes 0-7 : Features (rayon, texture, périmètre, aire, lissage, compacité, symétrie, dimension fractale)
- Colonne 8 : Variable cible (0 = Bénin, 1 = Malin)

### 4. Lancer l'application

```bash
python app.py
```

L'application sera accessible à l'adresse : **http://localhost:5000**

## 🎯 Fonctionnalités

### 1. **Entraînement du Modèle**
- Validation croisée K-Fold (K=10)
- Régression logistique avec régularisation
- Métriques de performance :
  - Précision (Accuracy)
  - Sensibilité (Sensitivity/Recall)
  - Spécificité (Specificity)
  - AUC (Area Under Curve)

### 2. **Prédiction en Temps Réel**
- Saisie des 8 paramètres du tissu
- Prédiction instantanée (Bénin/Malin)
- Probabilités détaillées pour chaque classe
- Visualisation intuitive des résultats

### 3. **Statistiques OMS**
- Données mondiales sur le cancer de la prostate
- Chat informatif avec facteurs de risque
- Conseils de prévention et dépistage

## 📊 Utilisation

### Faire une Prédiction

1. Remplissez les 8 champs du formulaire :
   - **Rayon moyen** : Rayon moyen des cellules
   - **Texture** : Écart-type des valeurs en niveaux de gris
   - **Périmètre** : Périmètre moyen des cellules
   - **Aire** : Aire moyenne des cellules
   - **Lissage** : Variation locale des longueurs de rayon
   - **Compacité** : (périmètre² / aire - 1.0)
   - **Symétrie** : Mesure de symétrie
   - **Dimension fractale** : Approximation de la "complexité côtière"

2. Cliquez sur **🔍 Analyser**

3. Consultez le résultat avec les probabilités

### Réentraîner le Modèle

Cliquez sur **⚙️ Réentraîner le Modèle** pour :
- Réentraîner le modèle sur les données
- Mettre à jour les métriques de performance
- Sauvegarder le nouveau modèle

## 🎨 Design

L'application utilise un thème **Novembre Bleu** :
- Couleurs primaires : Bleu (#0066CC, #003D7A)
- Design moderne et responsive
- Animations et transitions fluides
- Chat informatif en bas à gauche

## 📈 Métriques du Modèle

L'application affiche :
- **Précision** : Pourcentage de prédictions correctes
- **Sensibilité** : Capacité à détecter les cas malins
- **Spécificité** : Capacité à identifier les cas bénins
- **AUC** : Score de performance globale

## ⚠️ Avertissement

Cette application est développée à des fins **éducatives et de sensibilisation** dans le cadre de Novembre Bleu.

**Elle ne remplace en aucun cas un diagnostic médical professionnel.**

Consultez toujours un médecin qualifié pour tout problème de santé.

## 📚 Sources

Statistiques basées sur les données de l'**Organisation Mondiale de la Santé (OMS)** :
- 1,4 million de nouveaux cas par an (2020)
- 375 000 décès annuels
- 2ème cancer le plus fréquent chez l'homme
- Taux de survie à 5 ans : 99% (détection précoce)

## 🛠️ Technologies Utilisées

- **Backend** : Flask (Python)
- **Machine Learning** : Scikit-learn
  - Régression Logistique
  - Validation croisée K-Fold
- **Data Processing** : Pandas, NumPy
- **Frontend** : HTML5, CSS3, JavaScript
- **Design** : CSS Grid, Flexbox, Animations

## 📝 Licence

Projet éducatif - Novembre Bleu 2025

## 🎗️ Novembre Bleu

Le mois de novembre est dédié à la sensibilisation au cancer de la prostate. Ce projet vise à :
- Informer sur les facteurs de risque
- Encourager le dépistage précoce
- Démontrer l'utilité de l'IA dans le diagnostic médical

---

**Développé avec ❤️ pour Novembre Bleu 2025**