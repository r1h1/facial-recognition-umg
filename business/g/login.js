//ROUTES
const globalApiUrl = 'http://localhost:3001/api/v1/auth/login';
const userApiUrl = 'http://localhost:3001/api/v1/users';


//WHEN LOGIN LOAD, DROP ALL STORAGE
const dropAllSesionStorage = () => {
    sessionStorage.clear();
    localStorage.clear();
}
dropAllSesionStorage();


//GET AND SET TOKEN WITH POST DATA OBTAINED
const signIn = () => {

    let userObtained = document.getElementById('user').value.toString();
    let passwordObtained = document.getElementById('password').value.toString();
    let err = 'Error Interno';

    if (userObtained === '' || passwordObtained === '') {
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: 'Llena todos los datos que se te solicitan',
            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.'
        });
        sessionStorage.removeItem("signInToken");
        sessionStorage.removeItem("sessionInfo");
    }
    else {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        let raw = JSON.stringify({
            "user": userObtained,
            "password": passwordObtained
        });

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(globalApiUrl, requestOptions)
            .then(response => response.json())
            .then(dataObtained => showData(dataObtained))
            .catch(error => err = error);

        const showData = (dataObtained) => {
            if (dataObtained.body === 'Error de Servidor') {
                Swal.fire({
                    icon: 'error',
                    title: '¡Lo Sentimos!',
                    text: 'Datos incorrectos o sin autorización para acceder',
                    footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                    confirmButtonText: 'Entendido'
                });
                sessionStorage.removeItem("signInToken");
                sessionStorage.removeItem("sessionInfo");
            }
            else {
                try {
                    sessionStorage.setItem("signInToken", dataObtained.body);
                    //EXECUTE FUNCTION TO DECODED TOKEN DATA
                    let token = dataObtained.body;
                    parseJwt(token);
                }
                catch (err) {
                    Swal.fire({
                        icon: 'error',
                        title: '¡Lo Sentimos!',
                        text: 'Sa ha generado un error interno',
                        footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                        confirmButtonText: 'Entendido'
                    });
                    sessionStorage.removeItem("signInToken");
                    sessionStorage.removeItem("sessionInfo");
                    console.log(err);
                }
            }
        }
    }
}

//DECODED JWT TOKEN
const parseJwt = (token) => {
    let tokenObtained = token;
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    let dataDecrypt = JSON.parse(jsonPayload);
    let id = dataDecrypt.id;
    //SEND ID FOR OBTAINED ALL USER DATA, BEFORE ENCRYPT AGAIN
    getAllUserData(id, tokenObtained);
}


//GET ALL DATA FOR USER LOGED
const getAllUserData = (id, tokenObtained) => {

    let myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + tokenObtained);

    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(userApiUrl + '/' + id, requestOptions)
        .then(response => response.json())
        .then(dataObtained => showData(dataObtained))
        .catch(error => err = error);

    const showData = (dataObtained) => {
        if (dataObtained.body === 'Error de Servidor') {
            Swal.fire({
                icon: 'error',
                title: '¡Lo Sentimos!',
                text: 'Datos incorrectos o sin autorización para acceder',
                footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                confirmButtonText: 'Entendido'
            });
            sessionStorage.removeItem("signInToken");
            sessionStorage.removeItem("sessionInfo");
        }
        else {
            try {
                if (dataObtained.body[0].idrol === 5 && dataObtained.body[0].status === 0) {
                    Swal.fire({
                        icon: 'error',
                        title: '¡Lo Sentimos!',
                        text: 'Datos incorrectos o sin autorización para acceder',
                        footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                        confirmButtonText: 'Entendido'
                    });
                }
                else {
                    let userInformation = window.btoa(JSON.stringify(dataObtained.body));
                    sessionStorage.setItem("sessionInfo", userInformation);
                    window.location.href = '../../../views/a/dashboard';
                }
            }
            catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: '¡Lo Sentimos!',
                    text: 'Se ha generado un error interno',
                    footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                    confirmButtonText: 'Entendido'
                });
                sessionStorage.removeItem("signInToken");
                sessionStorage.removeItem("sessionInfo");
                console.log(err);
            }
        }
    }
}