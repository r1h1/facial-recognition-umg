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


//RANDOM NUMBER GENERATOR FUNCTION
const randomNumberGenerator = () => {

    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const charactersLength = characters.length;
    let result = "";

    for (let i = 0; i < 7; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


//ACCESS CODE GENERATOR
const accessNumberGenerated = () => {
    document.getElementById("accessCode").value = 'AV' + randomNumberGenerator();
}
accessNumberGenerated();


//GET DATE
const getDate = new Date();
const year = getDate.getFullYear();
const month = (getDate.getMonth() + 1) < 10 ? '0' + (getDate.getMonth() + 1) : (getDate.getMonth() + 1);
const day = getDate.getDate() < 10 ? '0' + getDate.getDate() : getDate.getDate();


//GET USER LOGGUED INFO
let userInformation = atob(sessionStorage.getItem('sessionInfo'));
userInformation = JSON.parse(userInformation);



//OBTAIN MENU FOR USER ROL ID
const getModulesPerRol = () => {

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
const getVisitors = () => {

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(apiRouteVisitors, requestOptions)
        .then(response => response.json())
        .then(dataObtained => showData(dataObtained))
        .catch(error => console.log('Error: ' + error))

    const showData = (dataObtained) => {
        try {
            addDataToVisitorTable(dataObtained);
        }
        catch (err) {
            console.log(err);
        }
    }
}
getVisitors();



//PRINT RESIDENTS
const addDataToVisitorTable = (dataObtained) => {

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
            dataSet.push([
                dataObtained.body[i].accesscode ?? 'Sin Datos',
                dataObtained.body[i].fullname ?? 'Sin Datos',
                dataObtained.body[i].addresstovisit ?? 'Sin Datos',
                dataObtained.body[i].cui ?? 'Sin Datos',
                dataObtained.body[i].gender === 1 ? 'Hombre' : 'Mujer' ?? 'Sin Datos',
                dataObtained.body[i].typeofvisit ?? 'Sin Datos',
                dataObtained.body[i].housenumber ?? 'Sin Datos',
                `<img src="${dataObtained.body[i].visitorphoto}" alt="visitor-photo-face" width="120"/>`,
                `<img src="${dataObtained.body[i].personalidentificationphoto}" alt="visitor-photo-identification" width="120"/>`,
                dataObtained.body[i].createddate ?? 'Sin Datos',
                dataObtained.body[i].expireddate ?? 'Sin Datos',
                dataObtained.body[i].usergeneratedinvitation ?? 'Sin Datos',
                dataObtained.body[i].authorization === 1 ? 'Acceso Concedido' : dataObtained.body[i].authorization === 2 ? 'Pendiente o Vencido' : 'Acceso Denegado' ?? 'Sin Datos',
                `<button class="btn btn-danger" onclick="deleteVisitor(${dataObtained.body[i].id})"><i class="bi bi-trash-fill"></i></button>`
            ]);
        }
    }

    new DataTable('#visitorsTable', {
        columns: [
            { title: 'Código Acceso' },
            { title: 'Nombre Completo' },
            { title: 'Dirección' },
            { title: 'CUI / NIT / Pasaporte' },
            { title: 'Genero' },
            { title: 'Tipo de Ingreso' },
            { title: 'No. de Casa' },
            { title: 'Foto Indetificacion' },
            { title: 'Foto Rostro' },
            { title: 'Fecha Creación' },
            { title: 'Fecha Expiración' },
            { title: 'Usuario Genera Autorización' },
            { title: 'Estado' },
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


//CONVERT PHOTO FACE TO BASE 64
const convertPhotoFaceToBase64 = () => {

    const photoFaceVisitor = document.getElementById('photoFaceVisitor');

    photoFaceVisitor.addEventListener("change", e => {
        const file = photoFaceVisitor.files[0];
        const reader = new FileReader();

        reader.addEventListener("load", () => {
            let imageRoute = reader.result;
            let sizeImage = file.size;

            if (sizeImage > 70000) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Advertencia',
                    text: 'La imagen supera el peso permitido, comprimala con la herramienta que se muestra abajo, intente de nuevo o seleccione otra imagen para continuar (MAX 70 KB)',
                    footer: '<a href="https://tinyjpg.com/" target="_blank">Presione acá para ser redirigido al compresor de imágenes</a>',
                    confirmButtonText: 'Entendido'
                });
                document.getElementById('photoFaceBase64').value = '';
                document.getElementById('photoFaceVisitor').value = '';
            }
            else {
                document.getElementById('photoFaceBase64').value = imageRoute;
            }
        });
        reader.readAsDataURL(file);
    });
}
convertPhotoFaceToBase64();


//CONVERT PHOTO ID TO BASE 64
const convertPhotoIdToBase64 = () => {

    const photoIdVisitor = document.getElementById('photoIdVisitor');

    photoIdVisitor.addEventListener("change", e => {
        const file = photoIdVisitor.files[0];
        const reader = new FileReader();

        reader.addEventListener("load", () => {
            let imageRoute = reader.result;
            let sizeImage = file.size;

            if (sizeImage > 70000) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Advertencia',
                    text: 'La imagen supera el peso permitido, comprimala con la herramienta que se muestra abajo, intente de nuevo o seleccione otra imagen para continuar (MAX 70 KB)',
                    footer: '<a href="https://tinyjpg.com/" target="_blank">Presione acá para ser redirigido al compresor de imágenes</a>',
                    confirmButtonText: 'Entendido'
                });
                document.getElementById('photoIdBase64').value = '';
                document.getElementById('photoIdVisitor').value = '';
            }
            else {
                document.getElementById('photoIdBase64').value = imageRoute;
            }
        });
        reader.readAsDataURL(file);
    });
}
convertPhotoIdToBase64();


//CREATE VISITOR
const createVisitors = () => {

    let accessCode = document.getElementById('accessCode').value;
    let nameVisitor = document.getElementById('nameVisitor').value;
    let addressVisitor = document.getElementById('addressVisitor').value;
    let cuiVisitor = document.getElementById('cuiVisitor').value;
    let houseNumberVisitor = document.getElementById('houseNumberVisitor').value;
    let genderVisitor = document.getElementById('genderVisitor').value;
    let photoFaceVisitor = document.getElementById('photoFaceBase64').value;
    let photoIdVisitor = document.getElementById('photoIdBase64').value;
    let entryTypeVisitor = document.getElementById('entryTypeVisitor').value;

    if (nameVisitor === '' || addressVisitor === '' || cuiVisitor === '' || houseNumberVisitor === ''
        || photoFaceVisitor === '' || photoIdVisitor === '' || genderVisitor === '' ||
        entryTypeVisitor === '') {
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

        console.log(photoFaceVisitor);

        var raw = JSON.stringify({
            "id": 0,
            "accesscode": accessCode,
            "fullname": nameVisitor,
            "addresstovisit": addressVisitor,
            "cui": cuiVisitor,
            "gender": genderVisitor,
            "typeofvisit": entryTypeVisitor,
            "housenumber": houseNumberVisitor,
            "createddate": year + '-' + month + '-' + day,
            "expireddate": year + '-' + month + '-' + day,
            "usergeneratedinvitation": userInformation[0].id,
            "authorization": 2
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
                            text: 'Se guardó con éxito la información del visitante',
                            footer: '',
                            showDenyButton: false,
                            showCancelButton: false,
                            confirmButtonText: 'Entendido',
                        }).then((result) => {
                            if (result.isConfirmed) {
                                saveFacePhoto(dataObtained.body.insertId);
                                saveIdPhoto(dataObtained.body.insertId);
                            } else if (result.isDenied) {
                                saveFacePhoto(dataObtained.body.insertId);
                                saveIdPhoto(dataObtained.body.insertId);
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


//SAVE FACE PHOTO FROM VISITOR
const saveFacePhoto = (insertId) => {

    let photoFaceVisitor = document.getElementById('photoFaceBase64').value;
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

    var raw = JSON.stringify({
        "id": insertId,
        "personalidentificationphoto": photoFaceVisitor
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
                        text: 'Se guardó con éxito la fotografía del rostro del visitante',
                        footer: '',
                        confirmButtonText: 'Entendido'
                    });
                }
                catch (err) {
                    Swal.fire({
                        icon: 'error',
                        title: '¡Lo Sentimos!',
                        text: 'No se pudo guardar la fotografía del rostro, intenta de nuevo',
                        footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                        confirmButtonText: 'Entendido'
                    });
                }
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: '¡Lo Sentimos!',
                    text: 'No se pudo guardar la fotografía del rostro, intenta de nuevo',
                    footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                    confirmButtonText: 'Entendido'
                });
            }
        }
    }
}


//SAVE ID PHOTO FROM VISITOR
const saveIdPhoto = (insertId) => {

    let photoIdVisitor = document.getElementById('photoIdBase64').value;

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

    var raw = JSON.stringify({
        "id": insertId,
        "visitorphoto": photoIdVisitor
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
                        text: 'Se guardó con éxito la fotografía de la identificación del visitante, las operaciones fueron exitosas',
                        footer: '',
                        showDenyButton: false,
                        showCancelButton: false,
                        confirmButtonText: 'Entendido',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.href = '../../views/a/visitors'
                        } else if (result.isDenied) {
                            window.location.href = '../../views/a/visitors'
                        }
                    });
                }
                catch (err) {
                    Swal.fire({
                        icon: 'error',
                        title: '¡Lo Sentimos!',
                        text: 'No se pudo guardar la fotografía del rostro, intenta de nuevo',
                        footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                        confirmButtonText: 'Entendido'
                    });
                }
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: '¡Lo Sentimos!',
                    text: 'No se pudo guardar la fotografía del rostro, intenta de nuevo',
                    footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                    confirmButtonText: 'Entendido'
                });
            }
        }
    }
}


//DELETE RESIDENTS
const deleteVisitor = (idUserToEliminate) => {
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

            fetch(apiRouteVisitors, requestOptions)
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
                                    window.location.href = '../../views/a/visitors';
                                } else if (result.isDenied) {
                                    window.location.href = '../../views/a/visitors';
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