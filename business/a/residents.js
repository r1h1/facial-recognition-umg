//ROUTES
const apiRouteModulesPerRol = 'http://localhost:3001/api/v1/modules/rol/';
const apiRouteResidents = 'http://localhost:3001/api/v1/users';
const apiRouteVisitors = 'http://localhost:3001/api/v1/visitors';
const apiRouteEntrysAndExits = 'http://localhost:3001/api/v1/entrysAndExits';


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
const getResidents = () => {

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(apiRouteResidents, requestOptions)
        .then(response => response.json())
        .then(dataObtained => showData(dataObtained))
        .catch(error => console.log('Error: ' + error))

    const showData = (dataObtained) => {
        try {
            addDataToResidentTable(dataObtained);
        }
        catch (err) {
            console.log(err);
        }
    }
}
getResidents();



//PRINT RESIDENTS
const addDataToResidentTable = (dataObtained) => {
    let dataSet = [];

    if (dataObtained.body === 'invalid token') {
        //NO DATA OBTAINED
        Swal.fire({
            icon: 'error',
            title: '¡Lo Sentimos!',
            text: 'No tienes permisos para ver los datos, por favor cierra sesión e inicia sesión nuevamente',
            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.'
        });
    }
    else {
        for (let i = 0; i < dataObtained.body.length; i++) {
            if (dataObtained.body[i].fullname != 'Visitante') {
                dataSet.push([
                    dataObtained.body[i].fullname ?? 'Sin Datos',
                    dataObtained.body[i].address ?? 'Sin Datos',
                    dataObtained.body[i].phonenumber ?? 'Sin Datos',
                    dataObtained.body[i].email ?? 'Sin Datos',
                    dataObtained.body[i].cui ?? 'Sin Datos',
                    dataObtained.body[i].housenumber ?? 'Sin Datos',
                    dataObtained.body[i].idrol === 1 ? 'Super Administrador' : dataObtained.body[i].idrol === 2 ? 'Administrador' : dataObtained.body[i].idrol === 3 ? 'Residente' : dataObtained.body[i].idrol === 4 ? 'Seguridad' : 'Desconocido' ?? 'Sin Datos',
                    dataObtained.body[i].status === 1 ? 'Activo' : 'Inactivo' ?? 'Sin Datos',
                    dataObtained.body[i].gender === 1 ? 'Hombre' : 'Mujer',
                    `<button class="btn btn-warning" onclick="setInfoResident(${dataObtained.body[i].id}, '${dataObtained.body[i].fullname}', '${dataObtained.body[i].address}',
                     ${dataObtained.body[i].phonenumber},
                     '${dataObtained.body[i].email}', ${dataObtained.body[i].cui}, '${dataObtained.body[i].housenumber}', ${dataObtained.body[i].idrol},
                     ${dataObtained.body[i].status}, ${dataObtained.body[i].gender})"><i class="bi bi-pencil-square"></i></button>`,
                    `<button class="btn btn-danger" onclick="deleteResident(${dataObtained.body[i].id})"><i class="bi bi-trash-fill"></i></button>`
                ]);
            }
        }
    }

    new DataTable('#residentsTable', {
        columns: [
            { title: 'Nombre Completo' },
            { title: 'Dirección' },
            { title: 'No. Teléfono' },
            { title: 'Correo Electronico' },
            { title: 'CUI / NIT / Pasaporte' },
            { title: 'No. Casa' },
            { title: 'Rol' },
            { title: 'Estado' },
            { title: 'Genero' },
            { title: 'Edicion' },
            { title: 'Eliminación' }
        ],
        data: dataSet,
        language: {
            "decimal": "",
            "emptyTable": "No hay información",
            "info": "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
            "infoEmpty": "Mostrando 0 to 0 of 0 Entradas",
            "infoFiltered": "(Filtrado de _MAX_ total entradas)",
            "infoPostFix": "",
            "thousands": ",",
            "lengthMenu": "Mostrar _MENU_ Entradas",
            "loadingRecords": "Cargando...",
            "processing": "Procesando...",
            "search": "Buscar:",
            "zeroRecords": "Sin resultados encontrados",
            "paginate": {
                "first": "Primero",
                "last": "Ultimo",
                "next": "Siguiente",
                "previous": "Anterior"
            }
        },
        select: true
    });
}


//CREATE RESIDENTS
const createResidents = () => {

    let nameResident = document.getElementById('nameResident').value;
    let addressResident = document.getElementById('addressResident').value;
    let phoneResident = document.getElementById('phoneResident').value;
    let emailResident = document.getElementById('emailResident').value;
    let cuiResident = document.getElementById('cuiResident').value;
    let houseNumberResident = document.getElementById('houseNumberResident').value;
    let genderResident = document.getElementById('genderResident').value;
    let rolResident = document.getElementById('rolResident').value;
    let passwordResident = document.getElementById('passwordResident').value;

    if (nameResident === '' || addressResident === '' || phoneResident === '' || emailResident === '' ||
        cuiResident === '' || houseNumberResident === '' || photoResident === '' || genderResident === '' ||
        rolResident === '' || passwordResident === '') {
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: 'Debes llenar todos los datos obligatorios y presiona los términos y condiciones',
            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
            confirmButtonText: 'Entendido'
        });
    }
    else {

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

        var raw = JSON.stringify({
            "id": 0,
            "fullname": nameResident,
            "address": addressResident,
            "phonenumber": phoneResident,
            "email": emailResident,
            "cui": cuiResident,
            "housenumber": houseNumberResident,
            "idrol": rolResident,
            "status": 1,
            "gender": genderResident,
            "photo": '',
            "user": emailResident,
            "password": passwordResident
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(apiRouteResidents, requestOptions)
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
                            text: 'La operación se completó con éxito',
                            footer: '',
                            showDenyButton: false,
                            showCancelButton: false,
                            confirmButtonText: 'Entendido',
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.location.href = '../../views/a/residents'
                            } else if (result.isDenied) {
                                window.location.href = '../../views/a/residents'
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
}


//SET DATA TO EDIT
const setInfoResident = (id, fullname, address, phonenumber, email, cui, housenumber, idrol, status, gender) => {

    $('#editModal').modal('show');

    document.getElementById('idToEdit').value = id;
    document.getElementById('nameResidentEdit').value = fullname;
    document.getElementById('addressResidentEdit').value = address;
    document.getElementById('phoneResidentEdit').value = phonenumber;
    document.getElementById('emailResidentEdit').value = email;
    document.getElementById('cuiResidentEdit').value = cui;
    document.getElementById('houseNumberResidentEdit').value = housenumber;
    document.getElementById('genderResidentEdit').selectedIndex = gender;
    document.getElementById('rolResidentEdit').selectedIndex = idrol - 1;
    document.getElementById('statusResidentEdit').selectedIndex = status;
}


//EDIT RESIDENTS
const updateResident = () => {

    let idToEdit = document.getElementById('idToEdit').value;
    let nameResident = document.getElementById('nameResidentEdit').value;
    let addressResident = document.getElementById('addressResidentEdit').value;
    let phoneResident = document.getElementById('phoneResidentEdit').value;
    let emailResident = document.getElementById('emailResidentEdit').value;
    let cuiResident = document.getElementById('cuiResidentEdit').value;
    let houseNumberResident = document.getElementById('houseNumberResidentEdit').value;
    let genderResident = document.getElementById('genderResidentEdit').value;
    let rolResident = document.getElementById('rolResidentEdit').value;

    if (idToEdit === '' || nameResident === '' || addressResident === '' || phoneResident === '' || emailResident === '' ||
        cuiResident === '' || houseNumberResident === '' || photoResident === '' || genderResident === '' ||
        rolResident === '' || passwordResident === '') {
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: 'Debes llenar todos los datos obligatorios y presiona los términos y condiciones',
            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
            confirmButtonText: 'Entendido'
        });
    }
    else {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

        var raw = JSON.stringify({
            "id": idToEdit,
            "fullname": nameResident,
            "address": addressResident,
            "phonenumber": phoneResident,
            "email": emailResident,
            "cui": cuiResident,
            "housenumber": houseNumberResident,
            "idrol": rolResident,
            "status": 1,
            "gender": genderResident
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(apiRouteResidents, requestOptions)
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
                            text: 'La operación se completó con éxito',
                            footer: '',
                            showDenyButton: false,
                            showCancelButton: false,
                            confirmButtonText: 'Entendido',
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.location.href = '../../views/a/residents'
                            } else if (result.isDenied) {
                                window.location.href = '../../views/a/residents'
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
}


//DELETE RESIDENTS
const deleteResident = (idUserToEliminate) => {
    Swal.fire({
        icon: 'info',
        title: '¿Seguro?',
        text: 'Los cambios no se podrán recuperar',
        showDenyButton: true,
        confirmButtonText: 'Continuar',
        denyButtonText: `Cancelar`,
    }).then((result) => {
        if (result.isConfirmed) {

            let myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

            let raw = JSON.stringify({
                "id": idUserToEliminate
            });

            let requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch(apiRouteResidents, requestOptions)
                .then(response => response.json())
                .then(dataObtained => showData(dataObtained))
                .catch(error => console.log('Error: ' + error))

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
                                text: 'La operación se completó con éxito',
                                footer: '',
                                showDenyButton: false,
                                showCancelButton: false,
                                confirmButtonText: 'Entendido',
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    window.location.href = '../../views/a/residents';
                                } else if (result.isDenied) {
                                    window.location.href = '../../views/a/residents';
                                }
                            })
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
        } else if (result.isDenied) {
            Swal.fire({
                position: 'top-center',
                icon: 'info',
                title: '¡No te preocupes!',
                text: 'No se modificó nada',
                showConfirmButton: false,
                timer: 2000
            });
        }
    });
}