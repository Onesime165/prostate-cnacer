@echo off
echo ========================================
echo   Application Cancer de la Prostate
echo   Novembre Bleu 2025
echo ========================================
echo.

REM Vérifier si l'environnement virtuel existe
if not exist "venv\" (
    echo Creation de l'environnement virtuel...
    python -m venv venv
    echo.
)

REM Activer l'environnement virtuel
echo Activation de l'environnement virtuel...
call venv\Scripts\activate.bat
echo.

REM Installer les dépendances
echo Installation des dependances...
pip install -r requirements.txt
echo.

REM Vérifier si cancer.xlsx existe
if not exist "cancer.xlsx" (
    echo ATTENTION: Le fichier cancer.xlsx est introuvable!
    echo Veuillez placer le fichier cancer.xlsx dans ce dossier.
    echo.
    pause
    exit /b 1
)

REM Lancer l'application
echo ========================================
echo Lancement de l'application...
echo L'application sera accessible sur:
echo http://localhost:5000
echo ========================================
echo.
echo Appuyez sur Ctrl+C pour arreter le serveur
echo.

python app.py

pause