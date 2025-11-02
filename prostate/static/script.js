// Gestion du formulaire de prédiction
document.getElementById('predictionForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Récupérer les valeurs du formulaire
    const formData = {
        rayon: document.getElementById('rayon').value,
        texture: document.getElementById('texture').value,
        perimetre: document.getElementById('perimetre').value,
        aire: document.getElementById('aire').value,
        lissage: document.getElementById('lissage').value,
        compacite: document.getElementById('compacite').value,
        symetrie: document.getElementById('symetrie').value,
        dimfrac: document.getElementById('dimfrac').value
    };
    
    // Afficher le loader
    const btnText = document.querySelector('.btn-text');
    const loader = document.querySelector('.loader');
    btnText.style.display = 'none';
    loader.style.display = 'inline';
    
    try {
        // Envoyer la requête
        const response = await fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            displayResult(result);
        } else {
            alert('Erreur: ' + result.message);
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la prédiction. Veuillez réessayer.');
    } finally {
        // Cacher le loader
        btnText.style.display = 'inline';
        loader.style.display = 'none';
    }
});

// Afficher le résultat de la prédiction
function displayResult(result) {
    const resultContainer = document.getElementById('resultContainer');
    const resultBox = document.getElementById('resultBox');
    const resultTitle = document.getElementById('resultTitle');
    const resultContent = document.getElementById('resultContent');
    
    // Déterminer la classe CSS selon le diagnostic
    const isBenin = result.diagnosis === 'Bénin';
    resultBox.className = 'result-box ' + (isBenin ? 'benin' : 'malin');
    
    // Titre
    resultTitle.textContent = `Diagnostic: ${result.diagnosis}`;
    resultTitle.style.color = isBenin ? '#28A745' : '#DC3545';
    
    // Contenu
    resultContent.innerHTML = `
        <p style="font-size: 1.1em; margin-bottom: 20px;">
            ${isBenin ? '✅ Le tissu analysé présente des caractéristiques bénignes.' : '⚠️ Le tissu analysé présente des caractéristiques malignes.'}
        </p>
        
        <div class="probability-bars">
            <div class="probability-item">
                <div class="probability-label">
                    <span>Probabilité Bénin</span>
                    <span>${result.probability_benin}%</span>
                </div>
                <div class="probability-bar">
                    <div class="probability-fill benin" style="width: ${result.probability_benin}%">
                        ${result.probability_benin}%
                    </div>
                </div>
            </div>
            
            <div class="probability-item">
                <div class="probability-label">
                    <span>Probabilité Malin</span>
                    <span>${result.probability_malin}%</span>
                </div>
                <div class="probability-bar">
                    <div class="probability-fill malin" style="width: ${result.probability_malin}%">
                        ${result.probability_malin}%
                    </div>
                </div>
            </div>
        </div>
        
        <div style="margin-top: 25px; padding: 15px; background: rgba(0,0,0,0.05); border-radius: 10px;">
            <strong>⚕️ Important:</strong> 
            <p style="margin-top: 10px;">Ce résultat est fourni par un modèle d'intelligence artificielle à des fins éducatives. 
            Il ne remplace en aucun cas un diagnostic médical professionnel. Consultez toujours un médecin qualifié.</p>
        </div>
    `;
    
    // Afficher le container
    resultContainer.style.display = 'block';
    
    // Scroll vers le résultat
    resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Gestion du bouton d'entraînement
document.getElementById('trainBtn').addEventListener('click', async () => {
    if (!confirm('Voulez-vous réentraîner le modèle? Cela peut prendre quelques secondes.')) {
        return;
    }
    
    const btn = document.getElementById('trainBtn');
    const originalText = btn.textContent;
    btn.textContent = '⏳ Entraînement en cours...';
    btn.disabled = true;
    
    try {
        const response = await fetch('/train', {
            method: 'POST'
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('✅ Modèle entraîné avec succès!\n\n' +
                  `Précision: ${result.metrics.accuracy}%\n` +
                  `Sensibilité: ${result.metrics.sensitivity}%\n` +
                  `Spécificité: ${result.metrics.specificity}%\n` +
                  `AUC: ${result.metrics.auc}`);
            
            // Recharger la page pour afficher les nouvelles métriques
            location.reload();
        } else {
            alert('❌ Erreur: ' + result.message);
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('❌ Erreur lors de l\'entraînement du modèle.');
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
    }
});

// Animation du chat au chargement
window.addEventListener('load', () => {
    const statsChat = document.querySelector('.stats-chat');
    statsChat.style.animation = 'slideInLeft 0.5s ease';
});

// Fonction pour ouvrir/fermer le chat
function toggleChat() {
    const statsChat = document.getElementById('statsChat');
    const toggleText = document.getElementById('toggleText');
    const toggleBtn = document.getElementById('chatToggleBtn');
    
    statsChat.classList.toggle('minimized');
    
    if (statsChat.classList.contains('minimized')) {
        toggleText.textContent = 'Agrandir';
        toggleBtn.style.background = 'rgba(0, 230, 118, 0.3)';
    } else {
        toggleText.textContent = 'Réduire';
        toggleBtn.style.background = 'rgba(255, 255, 255, 0.2)';
    }
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', function() {
    // S'assurer que le chat est ouvert par défaut
    const statsChat = document.getElementById('statsChat');
    const toggleText = document.getElementById('toggleText');
    
    if (!statsChat.classList.contains('minimized')) {
        toggleText.textContent = 'Réduire';
    }
});

// Définir l'animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInLeft {
        from {
            transform: translateX(-100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Exemples de données pré-remplies (optionnel)
function fillExampleData(type) {
    if (type === 'benin') {
        document.getElementById('rayon').value = '13.54';
        document.getElementById('texture').value = '14.36';
        document.getElementById('perimetre').value = '87.46';
        document.getElementById('aire').value = '566.3';
        document.getElementById('lissage').value = '0.09779';
        document.getElementById('compacite').value = '0.08129';
        document.getElementById('symetrie').value = '0.1660';
        document.getElementById('dimfrac').value = '0.05835';
    } else if (type === 'malin') {
        document.getElementById('rayon').value = '17.99';
        document.getElementById('texture').value = '10.38';
        document.getElementById('perimetre').value = '122.80';
        document.getElementById('aire').value = '1001';
        document.getElementById('lissage').value = '0.1184';
        document.getElementById('compacite').value = '0.2776';
        document.getElementById('symetrie').value = '0.2419';
        document.getElementById('dimfrac').value = '0.07871';
    }
}

// Validation des champs en temps réel
document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('input', (e) => {
        if (e.target.value < 0) {
            e.target.value = 0;
        }
    });
});