loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    
    const formData = new FormData(loginForm);
    const data = Object.fromEntries(formData.entries());

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/login', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
                console.log('Успішна відправка!');
                console.log(xhr.responseText);
            } else {
                console.error('Помилка при відправці:', xhr.statusText);
            }
        }
    };

    xhr.send(JSON.stringify(data));
});