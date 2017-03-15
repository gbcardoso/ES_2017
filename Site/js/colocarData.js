
window.onload = startContent();





function startTime() {
    var today = new Date();
    var weekday = new Array(7);
    weekday[0] = "Domingo";
    weekday[1] = "Segunda-Feira";
    weekday[2] = "Terça-Feira";
    weekday[3] = "Quarta-Feira";
    weekday[4] = "Quinta-Feira";
    weekday[5] = "Sexta-Feira";
    weekday[6] = "Sábado";
    var monthN = new Array(12);
    monthN[0] = "Jan";
    monthN[1] = "Fev";
    monthN[2] = "Mar";
    monthN[3] = "Abr";
    monthN[4] = "Mai";
    monthN[5] = "Jun";
    monthN[6] = "Jul";
    monthN[7] = "Ago";
    monthN[8] = "Set";
    monthN[9] = "Out";
    monthN[10] = "Nov";
    monthN[11] = "Dez";
    var dayW = weekday[today.getDay()];
    var day = today.getDate();
    var month = monthN[today.getMonth()];
    var year = today.getFullYear();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    //juntar
    if (dayW == weekday[4] && h>=13 && m>=0){
        weekN+=1;
        //criar lista da nova semana!!
        var appKey="4f99f55ae5f328c17edd2f9b7d528bc9";//alterar!!!!!!!!!!!!!!!!
        var tok="5ce81baab6987aba1f0fe27c114a55036f036dcaaee76ab6d6ade86d9835a7a3";//alterar!!!!!!!!!!!!!!!
        var idBoard = "5821136a9e6d3e6bb17410f0"; //id Projeto

        console.log("create list");
        var suces = function(successMsg){
            console.log("criou");
        }
        var err = function(errorMsg){
            console.log(".....");
        }

        Trello.post('/lists?name='+idBoard+'-WEEK'+weekN+'&idBoard='+idBoard+'&key='+appKey+'&token='+tok,suces,err);
    }


    var projectinfo = document.getElementById("projectinfo");
    projectinfo.innerHTML = dayW + ", " + day + " " + month + " " + year + " | " + h + ":" + m + ":" + s;
    var t = setTimeout(startTime, 500);
}

function checkTime(i) {
    if (i < 10) {
        i = "0" + i
    }; // add zero in front of numbers < 10
    return i;
}

function Project_week2(data_project_created){
    var data_project = new Date(data_project_created);
    var data_c = new Date();
    //diference in miliseconds, converted to days
    var data_dif = (data_c - data_project)/86400000;
    return Math.round(data_dif/7);
}
function addHtml() {
    var nome = document.getElementById("projectname");
    nome.innerText = sessionStorage.getItem("nome_projeto")+" Week:"+Project_week2(sessionStorage.getItem("project_date"));
}

function startContent() {
    console.log("TMIE");
    addHtml();
    startTime();
}


function logOut() {
    sessionStorage.clear();
    window.location.href = "login.html";
}