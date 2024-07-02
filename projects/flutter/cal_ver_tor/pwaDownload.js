let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {  
e.preventDefault();  
deferredPrompt = e;
});
function showInstallPrompt() {
deferredPrompt.prompt();
}