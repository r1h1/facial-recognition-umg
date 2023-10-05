//ROUTES
const apiRouteModulesPerRol = 'http://localhost:3001/api/v1/modules/rol/';
const apiRouteResidents = 'http://localhost:3001/api/v1/users';
const apiRouteVisitors = 'http://localhost:3001/api/v1/visitors';
const apiRouteEntrysAndExits = 'http://localhost:3001/api/v1/entrysAndExits';
const apiRouteReportEntrysAndExitsResident = 'http://localhost:3001/api/v1/entrysAndExits/reportResident/';
const apiRouteReportEntrysAndExitsVisitor = 'http://localhost:3001/api/v1/entrysAndExits/reportVisitors/';


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


//FILTER TYPE REPORT
const typeReportFilter = () => {

    let typeReport = document.getElementById('typeReport').value;

    if (typeReport === '') {
        document.getElementById('reportVisitorTable').style.display = 'none';
        document.getElementById('reportResidentTable').style.display = 'none';
    }
    else if (typeReport === '1') {
        getResidentEntryAndExit();
    }
    else {
        getVisitorEntryAndExit();
    }
}



//OBTAIN RESIDENT ENTRY AND EXIT
const getResidentEntryAndExit = () => {

    let dateEntry = document.getElementById('dateEntry').value;
    let dateExit = document.getElementById('dateExit').value;

    if (dateEntry === '' || dateExit === '') {
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: 'Debes llenar una fecha de inicio, fecha fin y el tipo de reporte que quieres visualizar',
            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
            confirmButtonText: 'Entendido'
        });
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

        fetch(apiRouteReportEntrysAndExitsResident + dateEntry + '/' + dateExit, requestOptions)
            .then(response => response.json())
            .then(dataObtained => showData(dataObtained))
            .catch(error => console.log('Error: ' + error))

        const showData = (dataObtained) => {
            try {
                if (dataObtained.body.length === 0) {
                    document.getElementById('reportVisitorTable').style.display = 'none';
                    document.getElementById('reportResidentTable').style.display = 'none';
                    Swal.fire({
                        icon: 'info',
                        title: 'Sin Datos',
                        text: 'No se encontraron datos con los parámetros especificados, intenta con otros',
                        footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                        confirmButtonText: 'Entendido'
                    });
                }
                else {
                    document.getElementById('reportVisitorTable').style.display = 'none';
                    document.getElementById('reportResidentTable').style.display = 'block';
                    let residentData = '';
                    for (let i = 0; i < dataObtained.body.length; i++) {
                        residentData += `<tr>
                                                <td>${dataObtained.body[i].fullname}</td>
                                                <td>${dataObtained.body[i].address}</td>
                                                <td>${dataObtained.body[i].housenumber}</td>
                                                <td>${dataObtained.body[i].dateandhourentry}</td>
                                                <td>${dataObtained.body[i].dateandhourexit === '' ? 'Sin Registro' : dataObtained.body[i].dateandhourexit}</td>
                                            </tr>
                                            `;
                    }
                    document.getElementById('reportResidentTableBody').innerHTML = residentData;
                }
            }
            catch (err) {
                console.log(err);
            }
        }
    }
}



//OBTAIN VISITOR ENTRY AND EXIT
const getVisitorEntryAndExit = () => {

    let dateEntry = document.getElementById('dateEntry').value;
    let dateExit = document.getElementById('dateExit').value;

    if (dateEntry === '' || dateExit === '') {
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: 'Debes llenar una fecha de inicio, fecha fin y el tipo de reporte que quieres visualizar',
            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
            confirmButtonText: 'Entendido'
        });
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

        fetch(apiRouteReportEntrysAndExitsVisitor + dateEntry + '/' + dateExit, requestOptions)
            .then(response => response.json())
            .then(dataObtained => showData(dataObtained))
            .catch(error => console.log('Error: ' + error))

        const showData = (dataObtained) => {
            try {
                if (dataObtained.body.length === 0) {
                    document.getElementById('reportVisitorTable').style.display = 'none';
                    document.getElementById('reportResidentTable').style.display = 'none';
                    Swal.fire({
                        icon: 'info',
                        title: 'Sin Datos',
                        text: 'No se encontraron datos con los parámetros especificados, intenta con otros',
                        footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                        confirmButtonText: 'Entendido'
                    });
                }
                else {
                    document.getElementById('reportVisitorTable').style.display = 'block';
                    document.getElementById('reportResidentTable').style.display = 'none';
                    let visitorData = '';
                    for (let i = 0; i < dataObtained.body.length; i++) {
                        visitorData += `<tr>
                                                <td>${dataObtained.body[i].fullname}</td>
                                                <td>${dataObtained.body[i].addresstovisit}</td>
                                                <td>${dataObtained.body[i].cui}</td>
                                                <td>${dataObtained.body[i].housenumber}</td>
                                                <td>${dataObtained.body[i].typeofvisit}</td>
                                                <td>${dataObtained.body[i].dateandhourentry}</td>
                                                <td>${dataObtained.body[i].dateandhourexit === '' ? 'Sin Registro' : dataObtained.body[i].dateandhourexit}</td>
                                            </tr>
                                            `;
                    }
                    document.getElementById('reportVisitorTableBody').innerHTML = visitorData;
                }
            }
            catch (err) {
                console.log(err);
            }
        }
    }
}


//EXPORT ENTRY RESIDENT TO EXCEL
const exportEntryResident = () => {
    var wb = XLSX.utils.table_to_book(document.getElementById("tableResidentData"));
    XLSX.writeFile(wb, "REPORTE_ES_RESIDENTES.xlsx");
}


//EXPORT ENTRY VISITOR TO EXCEL
const exportEntryVisitor = () => {
    var wb = XLSX.utils.table_to_book(document.getElementById("tableVisitorData"));
    XLSX.writeFile(wb, "REPORTE_ES_VISITANTES.xlsx");
}