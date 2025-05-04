const socket = io({
    auth: {
        cookie: document.cookie
    }
});
