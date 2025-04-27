xhr.onload = () => {
    if(xhr.status === 200){
        const token = xhr.responce;
        document.cookie = `token=${token}`;
        window.location.assign('/');
    }
    else {
        return alert(xhr.responce)
    }
}