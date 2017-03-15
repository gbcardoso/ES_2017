/**
 * Created by Asus on 20/10/2016.
 */
//var botao = document.getElementById("btn");
//botao.onclick = login();
var username;
var name;
var private_token;
var avatar_url;
var id_project;
var project_date;
var Json;

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
            }
            catch (e) {
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

function login() {
    document.getElementById("btn").removeAttribute("onclick");
    var user = document.getElementById("user").value;
    var password = document.getElementById("pass").value;
    Json = gitlabRequest("POST", "https://git.dei.uc.pt/api/v3/session?login=" + encodeURIComponent(user) + "&password=" + encodeURIComponent(password), false);
    if (Json == null) {
        alert("username ou password erradas");
    }
    else {
        console.log(Json);
        var Json = gitlabRequest("POST", "https://git.dei.uc.pt/api/v3/session?login=" + encodeURIComponent(user) + "&password=" + encodeURIComponent(password), false);
        if (Json == null) {
            alert("username ou password erradas");
        }
        else {
            console.log(Json);
            var Json = gitlabRequest("POST", "https://git.dei.uc.pt/api/v3/session?login=" + encodeURIComponent(user) + "&password=" + encodeURIComponent(password), false);
            if (Json == null) {
                alert("username ou password erradas");
            }
            else {
                username = Json.username;
                name = Json.name;
                avatar_url = Json.avatar_url;
                private_token = Json.private_token;
                //getoneproj();
                setStorage();
                window.location.href = "ProjetosUser.html";
            }
        }
    }
}

function getoneproj() {
    var i = 0;
    private_token = sessionStorage.getItem("private_token");
    username = sessionStorage.getItem("username", username);
    avatar_url = sessionStorage.getItem("avatar_url", avatar_url);
    name = sessionStorage.getItem("name", name);
    console.log(private_token);
    Json = gitlabRequest("GET", 'https://git.dei.uc.pt/api/v3/projects/?private_token=' + private_token, false);
    while (Json[i] != null) {
        getProjects(Json, i);
        i++;
    }
}
var nome_projeto;

function getProjects(Json, i) {
    var element = document.getElementById("projetos" + i);
    var button = document.createElement("button");
    var text;
    var ola = Json[i].id;
    text = document.createTextNode(Json[i].name_with_namespace);
    button.appendChild(text);
    button.addEventListener("click", function () {
        id_project = Json[i].id;
        project_date = Json[i].created_at;
        nome_projeto = Json[i].name_with_namespace;
        setStorage();
        window.location.href = "commitstabelas.html";
    }, false);
    //classe do butao
    document.getElementById("projetos").appendChild(button);
}

function logOut() {
    sessionStorage.clear();
    window.location.href = "login.html";
}
// envia
function setStorage() {
    //sessionStorage.setItem("user_url", user_url);
    sessionStorage.setItem("username", username);
    sessionStorage.setItem("name", name);
    sessionStorage.setItem("private_token", private_token);
    sessionStorage.setItem("avatar_url", avatar_url);
    sessionStorage.setItem("private_token", private_token);
    sessionStorage.setItem("id_project", id_project);
    sessionStorage.setItem("project_date", project_date);
    sessionStorage.setItem("nome_projeto", nome_projeto);
}