//ROUTES
const apiRouteModulesPerRol = 'http://localhost:3001/api/v1/modules/rol/';
const apiRouteResidents = 'http://localhost:3001/api/v1/users';
const apiRouteVisitors = 'http://localhost:3001/api/v1/visitors';
const apiRouteSearchVisitors = 'http://localhost:3001/api/v1/visitors/searchVisitor/';
const apiRouteEntrysAndExits = 'http://localhost:3001/api/v1/entrysAndExits';


//GET DATE
const getDate = new Date();
const year = getDate.getFullYear();
const month = (getDate.getMonth() + 1) < 10 ? '0' + (getDate.getMonth() + 1) : (getDate.getMonth() + 1);
const day = getDate.getDate() < 10 ? '0' + getDate.getDate() : getDate.getDate();


//VALIDATE EXIST TOKEN IN SESSION STORAGE
const validateToken = () => {
    let token = sessionStorage.getItem('signInToken');
    let userInformation = sessionStorage.getItem('sessionInfo');
    if (token == null || token.length == 0 || token == '') {
        sessionStorage.removeItem('signInToken');
        window.location.href = '../../views/g/login/component';
    }
    else if (userInformation == null || userInformation.length == 0 || userInformation == '') {
        sessionStorage.removeItem('sessionInfo');
        window.location.href = '../../views/g/login/component';
    }
    else {
        //CORRECT ACCESS
    }
}
validateToken();


//CLOSE SESSION AND REMOVE SESSION STORAGE ITEMS
const closeSession = () => {
    sessionStorage.removeItem('signInToken');
    sessionStorage.removeItem('sessionInfo');
    window.location.href = '../../views/g/login/component';
}

//EXECUTE LOOP 1 MINUTE FUNCTION VALIDATE TOKEN
setInterval(validateToken, 60000);


//SET USER INFO IN ADMIN PANEL
const setUserInfo = () => {
    let userInformation = atob(sessionStorage.getItem('sessionInfo'));
    userInformation = JSON.parse(userInformation);
    document.getElementById('userNameDisplay').innerHTML = userInformation[0].fullname;
}
setUserInfo();


//OBTAIN MENU FOR USER ROL ID
const getModulesPerRol = () => {

    let userInformation = atob(sessionStorage.getItem('sessionInfo'));
    userInformation = JSON.parse(userInformation);
    let rol = userInformation[0].idrol;

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(apiRouteModulesPerRol + rol, requestOptions)
        .then(response => response.json())
        .then(dataObtained => showData(dataObtained))
        .catch(error => console.log('Error: ' + error))

    const showData = (dataObtained) => {
        try {
            let menuModules = '';
            for (let i = 0; i < dataObtained.body.length; i++) {
                menuModules += `
                    ${dataObtained.body[i].route}
                `;
            }
            document.getElementById('menu-list').innerHTML = menuModules;
        }
        catch (err) {
            console.log(err);
        }
    }
}
getModulesPerRol();


//GET RESIDENTS
const getAuthVisitorsForAccessCode = () => {

    let accessCode = document.getElementById('accessCode').value;

    if (accessCode === '') {
        document.getElementById('visitorShowDataDiv').style.display = 'none';
    }
    else {

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(apiRouteSearchVisitors + accessCode, requestOptions)
            .then(response => response.json())
            .then(dataObtained => showData(dataObtained))
            .catch(error => console.log('Error: ' + error))

        const showData = (dataObtained) => {
            try {
                if (dataObtained.body.length === 0) {
                    document.getElementById('visitorShowDataDiv').style.display = 'none';
                    document.getElementById('accessCode').value = '';
                    document.getElementById('accessCode').focus();
                    Swal.fire({
                        icon: 'info',
                        title: 'Sin Datos',
                        text: 'No se encontraron datos con este código de acceso',
                        footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                        confirmButtonText: 'Entendido'
                    });
                }
                else if (dataObtained.body[0].expireddate != year + '-' + month + '-' + day || dataObtained.body[0].authorization != 2) {
                    document.getElementById('visitorShowDataDiv').style.display = 'none';
                    document.getElementById('accessCode').value = '';
                    document.getElementById('accessCode').focus();
                    Swal.fire({
                        icon: 'warning',
                        title: 'Advertencia',
                        text: 'La invitación para este usuario ha caducado o ya fue utilizada, genere otra para autorizar',
                        footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                        confirmButtonText: 'Entendido'
                    });
                }
                else {
                    document.getElementById('visitorShowDataDiv').style.display = 'block';
                    document.getElementById('idVisitor').value = dataObtained.body[0].id;
                    document.getElementById('name').innerHTML = dataObtained.body[0].fullname;
                    document.getElementById('address').innerHTML = dataObtained.body[0].addresstovisit;
                    document.getElementById('type').innerHTML = dataObtained.body[0].typeofvisit;
                    document.getElementById('nit').innerHTML = dataObtained.body[0].cui;
                    document.getElementById('housenumber').innerHTML = dataObtained.body[0].housenumber;
                    document.getElementById('createddate').innerHTML = dataObtained.body[0].createddate;
                    document.getElementById('expireddate').innerHTML = dataObtained.body[0].expireddate;
                    document.getElementById('gender').innerHTML = dataObtained.body[0].gender === 1 ? 'Hombre' : 'Mujer';

                    let photos = '';
                    for (let i = 0; i < dataObtained.body.length; i++) {
                        photos += `<img src="${dataObtained.body[0].personalidentificationphoto}" alt="logo" width="80%">
                              <img src="${dataObtained.body[0].visitorphoto}" alt="logo" width="80%" class="mt-3 mb-3">`
                    }
                    document.getElementById('images-to-visitor').innerHTML = photos;

                    getResidentAuthVisitor(dataObtained.body[0].usergeneratedinvitation);
                }
            }
            catch (err) {
                console.log(err);
            }
        }
    }
}


//GET RESIDENT INFO
const getResidentAuthVisitor = (id) => {

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(apiRouteResidents + '/' + id, requestOptions)
        .then(response => response.json())
        .then(dataObtained => showData(dataObtained))
        .catch(error => console.log('Error: ' + error))

    const showData = (dataObtained) => {
        try {
            document.getElementById('usergenerated').innerHTML = dataObtained.body[0].fullname;
            document.getElementById('number').innerHTML = dataObtained.body[0].phonenumber;
        }
        catch (err) {
            console.log(err);
        }
    }
}


//AUTHORIZE VISITOR
const autorizeVisitor = () => {

    let idVisitor = document.getElementById('idVisitor').value;

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

    var raw = JSON.stringify({
        "id": idVisitor,
        "authorization": 1
    });

    console.log(raw);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch(apiRouteVisitors, requestOptions)
        .then(response => response.json())
        .then(dataObtained => showData(dataObtained))
        .catch(error => err = error);

    const showData = (dataObtained) => {
        if (dataObtained.body === 'Error de Servidor') {
            Swal.fire({
                icon: 'error',
                title: '¡Lo Sentimos!',
                text: 'No se pudo guardar la fotografía del rostro, intenta de nuevo',
                footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                confirmButtonText: 'Entendido'
            });
        }
        else {
            if (dataObtained.status === 200 || dataObtained.status === 201 || dataObtained.status === 304) {
                try {
                    createVisitorEntry(idVisitor);
                }
                catch (err) {
                    Swal.fire({
                        icon: 'error',
                        title: '¡Lo Sentimos!',
                        text: 'No se pudo concretar la operación, intente de nuevo',
                        footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                        confirmButtonText: 'Entendido'
                    });
                }
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: '¡Lo Sentimos!',
                    text: 'No se pudo concretar la operación, intente de nuevo',
                    footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                    confirmButtonText: 'Entendido'
                });
            }
        }
    }
}



//DENY VISITOR
const denyVisitor = () => {

    let idVisitor = document.getElementById('idVisitor').value;

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

    var raw = JSON.stringify({
        "id": idVisitor,
        "authorization": 0
    });

    console.log(raw);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch(apiRouteVisitors, requestOptions)
        .then(response => response.json())
        .then(dataObtained => showData(dataObtained))
        .catch(error => err = error);

    const showData = (dataObtained) => {
        if (dataObtained.body === 'Error de Servidor') {
            Swal.fire({
                icon: 'error',
                title: '¡Lo Sentimos!',
                text: 'No se pudo guardar la fotografía del rostro, intenta de nuevo',
                footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                confirmButtonText: 'Entendido'
            });
        }
        else {
            if (dataObtained.status === 200 || dataObtained.status === 201 || dataObtained.status === 304) {
                try {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Correcto!',
                        text: 'La autorización fue denegada, informar al visitante que no tiene permitido el acceso',
                        footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                        showDenyButton: false,
                        showCancelButton: false,
                        confirmButtonText: 'Entendido',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.href = '../../views/a/auth_visitors'
                        } else if (result.isDenied) {
                            window.location.href = '../../views/a/auth_visitors'
                        }
                    });
                }
                catch (err) {
                    Swal.fire({
                        icon: 'error',
                        title: '¡Lo Sentimos!',
                        text: 'No se pudo concretar la operación, intente de nuevo',
                        footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                        confirmButtonText: 'Entendido'
                    });
                }
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: '¡Lo Sentimos!',
                    text: 'No se pudo concretar la operación, intente de nuevo',
                    footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                    confirmButtonText: 'Entendido'
                });
            }
        }
    }
}


const createVisitorEntry = (idVisitor) => {

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

    var raw = JSON.stringify({
        "id": 0,
        "iduserentryandexit": idVisitor,
        "dateandhourentry": year + '-' + month + '-' + day,
        "dateandhourexit": '',
        "typeuser": 0
    });

    console.log(raw);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch(apiRouteEntrysAndExits, requestOptions)
        .then(response => response.json())
        .then(dataObtained => showData(dataObtained))
        .catch(error => err = error);

    const showData = (dataObtained) => {
        if (dataObtained.body === 'Error de Servidor') {
            Swal.fire({
                icon: 'error',
                title: '¡Lo Sentimos!',
                text: 'No se pudo concretar la operación, intenta de nuevo',
                footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                confirmButtonText: 'Entendido'
            });
        }
        else {
            if (dataObtained.status === 200 || dataObtained.status === 201 || dataObtained.status === 304) {
                try {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Correcto!',
                        text: 'Se registra con éxito la entrada del visitante, se completan las operaciones, ingreso permitido',
                        footer: '',
                        showDenyButton: false,
                        showCancelButton: false,
                        confirmButtonText: 'Entendido',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.href = '../../views/a/auth_visitors';
                        } else if (result.isDenied) {
                            window.location.href = '../../views/a/auth_visitors';
                        }
                    });

                }
                catch (err) {
                    Swal.fire({
                        icon: 'error',
                        title: '¡Lo Sentimos!',
                        text: 'Sa ha generado un error interno',
                        footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                        confirmButtonText: 'Entendido'
                    });
                }
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: '¡Lo Sentimos!',
                    text: 'Sa ha generado un error interno',
                    footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                    confirmButtonText: 'Entendido'
                });
            }
        }
    }
}