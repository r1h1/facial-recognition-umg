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
    document.getElementById('userNameDisplayDashboard').innerHTML = userInformation[0].fullname;
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



//OBTAIN TOTAL OF RESIDENTS
const getTotalsOfResidents = () => {

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
            let quantity = 0;
            for (let i = 0; i < dataObtained.body.length; i++) {
                if (dataObtained.body[i].fullname != 'Visitante') {
                    quantity = quantity + 1;
                }
                else {
                    // NOTHING
                }
            }
            document.getElementById('totalResidents').innerHTML = quantity;
        }
        catch (err) {
            console.log(err);
        }
    }
}
getTotalsOfResidents();


//ARRAY FOR SET TOTALS VISITORS AND RESIDENTS IN CANVAS GRAPHIC
let totalsResidentsEntrys = [];
let totalsVisitorsEntrys = [];

//OBTAIN TOTAL OF VISITORS
const getTotalsOfVisitors = () => {

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
            document.getElementById('totalVisitors').innerHTML = dataObtained.body.length;
        }
        catch (err) {
            console.log(err);
        }
    }
}
getTotalsOfVisitors();



//OBTAIN TOTAL OF RESIDENTS ENTRYS
const getTotalsOfResidentsEntrys = () => {

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(apiRouteEntrysAndExits, requestOptions)
        .then(response => response.json())
        .then(dataObtained => showData(dataObtained))
        .catch(error => console.log('Error: ' + error))

    const showData = (dataObtained) => {
        try {
            let quantity = 0;
            for (let i = 0; i < dataObtained.body.length; i++) {
                if (dataObtained.body[i].typeuser === 1) {
                    quantity = quantity + 1;
                }
                else {
                    // NOTHING
                }
            }
            document.getElementById('totalResidentsEntry').innerHTML = quantity;
            totalsResidentsEntrys.push(quantity);
        }
        catch (err) {
            console.log(err);
        }
    }
}
getTotalsOfResidentsEntrys();



//OBTAIN TOTAL OF VISITORS ENTRYS
const getTotalsOfVisitorsEntrys = () => {

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(apiRouteEntrysAndExits, requestOptions)
        .then(response => response.json())
        .then(dataObtained => showData(dataObtained))
        .catch(error => console.log('Error: ' + error))

    const showData = (dataObtained) => {
        try {
            let quantity = 0;
            for (let i = 0; i < dataObtained.body.length; i++) {
                if (dataObtained.body[i].typeuser === 0) {
                    quantity = quantity + 1;
                }
                else {
                    // NOTHING
                }
            }
            document.getElementById('totalVisitorsEntry').innerHTML = quantity;
            totalsVisitorsEntrys.push(quantity);
            setResidentsAndVisitorsQuantityInCanvas();
        }
        catch (err) {
            console.log(err);
        }
    }
}
getTotalsOfVisitorsEntrys();




//PRINT VISITORS AND RESIDENTS QUANTITY IN CANVAS
const setResidentsAndVisitorsQuantityInCanvas = () => {

    const charts = document.querySelectorAll(".chart");

    charts.forEach(function (chart) {
        var ctx = chart.getContext("2d");
        var myChart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: ["Visitantes", "Residentes"],
                datasets: [
                    {
                        label: "# De Ingresos",
                        data: [totalsVisitorsEntrys[0] ?? 0, totalsResidentsEntrys[0] ?? 0],
                        backgroundColor: [
                            "rgba(255, 99, 132, 0.2)",
                            "rgba(54, 162, 235, 0.2)"
                        ],
                        borderColor: [
                            "rgba(255, 99, 132, 1)",
                            "rgba(54, 162, 235, 1)"
                        ],
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });
    });

    $(document).ready(function () {
        $(".data-table").each(function (_, table) {
            $(table).DataTable();
        });
    });
}