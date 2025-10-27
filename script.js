// PWA Installation
let deferredPrompt;
const installButton = document.getElementById('installButton');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installButton.style.display = 'block';
});

function installPWA() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('Пользователь установил PWA');
            }
            deferredPrompt = null;
            installButton.style.display = 'none';
        });
    }
}

// Проверка PWA критериев
function checkPWAReadiness() {
    const isHTTPS = window.location.protocol === 'https:';
    const hasSW = 'serviceWorker' in navigator;
    const hasManifest = document.querySelector('link[rel="manifest"]') !== null;
    
    console.log('PWA проверка:');
    console.log('- HTTPS:', isHTTPS);
    console.log('- Service Worker:', hasSW);
    console.log('- Manifest:', hasManifest);
    
    if (!isHTTPS) {
        console.warn('⚠️ PWA требует HTTPS для установки');
    }
}

// Проверяем при загрузке
setTimeout(checkPWAReadiness, 1000);