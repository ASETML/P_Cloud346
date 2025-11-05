# Installation et exécution du backend et du frontend

try {
    # Backend 
    Write-Host "`n=== INSTALLATION DES DÉPENDANCES BACKEND ===" -ForegroundColor Cyan
    
    Set-Location -Path .\backend\code
    npm install
    
    Write-Host "`n=== DÉMARRAGE DU SERVEUR BACKEND ===" -ForegroundColor Cyan
    $backendJob = Start-Job -ScriptBlock {
        Set-Location -Path $using:PWD #$using transmet cette valeur à l'intérieur du Job      #Dossier actuel (PWD = Print Working Directory)
        npm start
    }
    
    Set-Location -Path ../..

    # Frontend 
    Write-Host "`n=== INSTALLATION DES DÉPENDANCES FRONTEND ===" -ForegroundColor Cyan
    
    Set-Location -Path .\frontend\PassionLecture
    npm install
    
    Write-Host "`n=== DÉMARRAGE DU SERVEUR FRONTEND ===" -ForegroundColor Cyan
    $frontendJob = Start-Job -ScriptBlock {
        Set-Location -Path $using:PWD #$using transmet cette valeur à l'intérieur du Job      #Dossier actuel (PWD = Print Working Directory)
        npm run dev
    }
    
    Set-Location -Path ../..

    Write-Host "`n=== L'APPLICATION A ÉTÉ LANCÉE AVEC SUCCÈS ! ===" -ForegroundColor Green
    Write-Host "Backend: http://localhost:9999" -ForegroundColor Yellow
    Write-Host "Frontend: http://localhost:5173" -ForegroundColor Yellow
    
    # Attendez la fin (ou Ctrl+C pour arrêter)
    Write-Host "`nAppuyez sur Ctrl+C pour arrêter les serveurs" -ForegroundColor DarkYellow
    try {
        while ($true) {
            Start-Sleep -Seconds 1
        }
    }
    finally {
        Stop-Job $backendJob
        Stop-Job $frontendJob
        Remove-Job $backendJob
        Remove-Job $frontendJob
    }
}
catch {
    Write-Host "`nERREUR: $_" -ForegroundColor Red
    exit 1
}