window.addEventListener("DOMContentLoaded", async event => {
    if(!await checkRegistration())
        register();
});

// Check a service worker registration status
async function checkRegistration() {
    if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration)
            return true;
        return false;
    }
    return undefined;
}

async function register() {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register("/player/sw.js");
            console.log("Service worker registered");

        } catch (error) {
            console.log("Error while registering: " + error.message);
        }
    } else {
        console.log("Service workers API not available");
    }
};

// Unregister a currently registered service worker
async function unregister() {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.getRegistration();
            if (registration) {
                const result = await registration.unregister();
                console.log(result ? "Service worker unregistered" : "Service worker couldn't be unregistered");
            } else {
                console.log("There is no service worker to unregister");
            }

        } catch (error) {
            console.log("Error while unregistering: " + error.message);
        }
    } else {
        console.log("Service workers API not available");
    }
};