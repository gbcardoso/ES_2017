
var username = sessionStorage.getItem("username");
var Aptoken = sessionStorage.getItem("private_token");
var avatar = sessionStorage.getItem("avater_url");
// mudar isto, isto é só para teste em quando a pagina dos membres não esta concluida
var namePro = sessionStorage.getItem("namePro");
console.log(namePro);
//-----------------------------------------------------------------------------------
var branchURL = ptoken = '?private_token='+Aptoken;
var id = sessionStorage.getItem("id_project");
var finalURL = requestURL + ptoken;
var finalURL = requestURL + ptoken;
var URL='https://git.dei.uc.pt/api/v3/projects'
var requestURL = 'https://git.dei.uc.pt/api/v3/projects';

window.onload = getCommits(ptoken);
window.onload = Carateristicas();

function gitlabRequest(message, url, callback) { /*working*/
    /*
     message = type of request
     url = url that u want to request
     callback = false -> if u want the code to wait for http response | true -> if u want the code to continue even if http is delayed.
     */

    var blob_bollean = false;
    var Json = undefined;
    var raw_blob_getter = undefined;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && (this.status == 200 || this.status == 201)) {
            try {
                Json = JSON.parse(xhttp.responseText);
            } catch (e) {
                raw_blob_getter = xhttp.responseText;
                blob_bollean = true;
            }
            // Action to be performed when the document is read;
        }

    };
    xhttp.open(message, url, callback);
    xhttp.send();
    if (blob_bollean == true) {
        return raw_blob_getter;
    }
    else {
        return Json;
    }
}

function getCommits(ptoken) {
    Json = gitlabRequest("Get",'https://git.dei.uc.pt/api/v3/projects/'+id+'/repository/commits' +ptoken, false);
    var i=0;
    var commit;
    var text;
    while (Json[i]!= null){
        commit = Json[i];
        if (namePro == commit.author_name){
            text = commit.title+" at "+commit.created_at.split('T')[0] +" " +commit.created_at.split('T')[1].split('.')[0];
            colocaHTML(text);
            console.log(text);
        }
        i++;
    }

}
function colocaHTML(text) {

    var row = document.createElement("div");
    var node = document.createElement("div");
    var t = document.createTextNode(text);
    node.appendChild(t);

    row.appendChild(node);
    row.appendChild(document.createElement("br"));
    document.getElementById("commits").appendChild(row);

}

function NCommits(){
    Json=gitlabRequest("GET",'https://git.dei.uc.pt/api/v3/projects/'+id+"/repository/commits"  + ptoken, false);
    var i = 0;
    while (Json[i]!=null) {
        console.log(commitsToString(Json[i]));
        i++;
    }
}

function getavatar() {
    return avatar;
}
function Carateristicas (){
    var element = document.getElementById("NomePessoa");
    element.innerHTML = namePro;
}
