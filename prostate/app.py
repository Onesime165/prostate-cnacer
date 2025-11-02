from flask import Flask, render_template, request, jsonify
import pandas as pd
import numpy as np
from sklearn.model_selection import KFold, cross_val_score
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score, accuracy_score, confusion_matrix
import pickle
import os

app = Flask(__name__)

# Configuration
UPLOAD_FOLDER = 'data'
MODEL_PATH = 'model.pkl'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Variables globales pour stocker le modèle et les métriques
model = None
metrics = {}
df_results = None

def train_model():
    """Entraîne le modèle de régression logistique"""
    global model, metrics, df_results
    
    # Charger les données
    df = pd.read_excel("cancer.xlsx")
    
    # Construire la matrice des prédicteurs et le vecteur cible
    array = df.values
    X = array[:, 0:8]
    Y = array[:, 8]
    
    # Validation croisée K-fold (K=10)
    kf = KFold(n_splits=10, shuffle=True, random_state=7)
    
    # Construire et évaluer le modèle
    model = LogisticRegression(max_iter=1000)
    results = cross_val_score(model, X, Y, cv=kf, scoring='accuracy')
    
    # Entraîner le modèle sur l'ensemble complet
    model.fit(X, Y)
    
    # Faire des prédictions
    predictions = model.predict(X)
    
    # Ajouter les prédictions au DataFrame
    df['predictions'] = predictions
    df['prediction_errors'] = Y - predictions
    df_results = df
    
    # Calculer les métriques
    auc = roc_auc_score(Y, predictions)
    accuracy = accuracy_score(Y, predictions)
    tn, fp, fn, tp = confusion_matrix(Y, predictions).ravel()
    specificity = tn / (tn + fp)
    sensitivity = tp / (tp + fn)
    
    metrics = {
        'accuracy': round(accuracy * 100, 2),
        'auc': round(auc, 4),
        'specificity': round(specificity * 100, 2),
        'sensitivity': round(sensitivity * 100, 2),
        'cv_mean': round(results.mean() * 100, 2),
        'cv_std': round(results.std() * 100, 2)
    }
    
    # Sauvegarder le modèle
    with open(MODEL_PATH, 'wb') as file:
        pickle.dump(model, file)
    
    return metrics

def load_model():
    """Charge le modèle depuis le disque"""
    global model
    if os.path.exists(MODEL_PATH):
        with open(MODEL_PATH, 'rb') as file:
            model = pickle.load(file)
        return True
    return False

@app.route('/')
def index():
    """Page d'accueil"""
    return render_template('index.html', metrics=metrics)

@app.route('/train', methods=['POST'])
def train():
    """Endpoint pour entraîner le modèle"""
    try:
        metrics_result = train_model()
        return jsonify({
            'success': True,
            'metrics': metrics_result,
            'message': 'Modèle entraîné avec succès!'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erreur lors de l\'entraînement: {str(e)}'
        }), 500

@app.route('/predict', methods=['POST'])
def predict():
    """Endpoint pour faire une prédiction"""
    try:
        if model is None:
            return jsonify({
                'success': False,
                'message': 'Modèle non chargé. Veuillez d\'abord entraîner le modèle.'
            }), 400
        
        # Récupérer les données du formulaire
        data = request.get_json()
        
        # Créer un tableau numpy avec les features
        features = np.array([[
            float(data['rayon']),
            float(data['texture']),
            float(data['perimetre']),
            float(data['aire']),
            float(data['lissage']),
            float(data['compacite']),
            float(data['symetrie']),
            float(data['dimfrac'])
        ]])
        
        # Faire la prédiction
        prediction = model.predict(features)[0]
        probability = model.predict_proba(features)[0]
        
        result = {
            'success': True,
            'prediction': int(prediction),
            'diagnosis': 'Malin' if prediction == 1 else 'Bénin',
            'probability_benin': round(probability[0] * 100, 2),
            'probability_malin': round(probability[1] * 100, 2)
        }
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erreur lors de la prédiction: {str(e)}'
        }), 500

@app.route('/results')
def results():
    """Page des résultats détaillés"""
    if df_results is not None:
        results_data = df_results.to_dict('records')
        return render_template('results.html', results=results_data, metrics=metrics)
    return render_template('results.html', results=None, metrics=metrics)

# Initialisation: charger ou entraîner le modèle au démarrage
if not load_model():
    if os.path.exists('cancer.xlsx'):
        print("Entraînement du modèle au démarrage...")
        train_model()
    else:
        print("⚠️ Fichier cancer.xlsx non trouvé. Veuillez l'ajouter pour entraîner le modèle.")

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)