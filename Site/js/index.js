
var URL='https://git.dei.uc.pt/api/v3/projects'
var requestURL = 'https://git.dei.uc.pt/api/v3/projects';
//var branchURL = ptoken='?private_token=CmRtChEKq2nx95WrFcna';
var username = sessionStorage.getItem("username");
var Aptoken = sessionStorage.getItem("private_token");
var id = sessionStorage.getItem("id_project");
var branchURL = ptoken = '?private_token='+Aptoken;
var ptokenComi = '&private_token='+Aptoken;
var finalURL = requestURL + ptoken;
var URL='https://git.dei.uc.pt/api/v3/projects'
var requestURL = 'https://git.dei.uc.pt/api/v3/projects';
window.onload =  listRepFiles(ptoken);
window.onload = listRepBranch(ptoken);
window.onload = NumeroCommits(ptokenComi);

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


//Json = gitlabRequest("POST",'https://git.dei.uc.pt/api/v3/projects/747'  + "?private_token=WbqYHo6SG4AKSB4ydJq9", false);
function getProjectID(ptoken){
    Json  = gitlabRequest("GET",'https://git.dei.uc.pt/api/v3/projects/' + ptoken,false );
    id = Json[0].id;
    return id;
}

function listRepFiles(ptoken){
    //id = getProjectID(ptoken);
    var result=gitlabRequest("GET","https://git.dei.uc.pt/api/v3/projects/"+id+"/repository/tree"+ptoken,false);
    console.log(result[1]);
    printFilenames(result);
    return result;

}

function printFilenames(array){
    var i=0
    while(array[i]!= null){
        doDiv(array[i].name , array[i].last_commit_id);
        i++;
    }
}
function fileAccess(ptoken,filepath){
    //id = getProjectID(ptoken);
    var result=gitlabRequest("GET","https://git.dei.uc.pt/api/v3/projects/"+id+"/repository/files?file_path="+filepath+"&ref=master&private_token=WbqYHo6SG4AKSB4ydJq9",false);
    console.log(result.blob_id);
    var teste=gitlabRequest("GET","https://git.dei.uc.pt/api/v3/projects/"+id+"/repository/raw_blobs/"+result.blob_id+"?ref=master&private_token=WbqYHo6SG4AKSB4ydJq9",false);
    console.log(teste);
}

//funcao que da print ao nome de todos os ficheiros
function getFilenames(array){
    var i = 0;
    while(array[i] != null){
        console.log(array[i].name + " já tá perfeito!");
        $("#lista0 a").append( "<li>"+array[i].name+"</li>");
        i++;
    }
}
function doDiv(text, commit) {

    var row = document.createElement("div");
    var node = document.createElement("div");
    var t = document.createTextNode(text);
    node.className = "col-xs-4 center-xs";
    node.appendChild(t);

    var c_node = document.createElement("div");
    var c_text = document.createTextNode(commit);
    c_node.className = "col-xs-4 center-xs";
    c_node.appendChild(c_text);


//    node.appendChild(c_node);
//node.append(commit,c_node);
    row.appendChild(node);
    document.getElementById("table").appendChild(row);
}

//document.getElementById("files").innerHTML = listRepFiles(ptoken);

/*function imprimi(array) {
    var i=0;
    var element = document.getElementById("table");
    while (array[i] !=null) {
        element.innerHTML = array[i].name+"\n";
        i++;
    }
}*/

function listRepBranch(ptoken){
    //id =getProjectID(ptoken);
    Json=gitlabRequest("GET",'https://git.dei.uc.pt/api/v3/projects/'+id+"/repository/branches"  + ptoken, false);
    var i = 0;
    while (Json[i]!=null) {
        i++
    }
    var element = document.getElementById("Branches");
    element.innerHTML = i+"\nBranches";
}
function NumeroCommits(ptokenComi) {
    //id =getProjectID(ptoken);
    Json=gitlabRequest("GET",'https://git.dei.uc.pt/api/v3/projects/'+id+"/repository/commits?per_page=100"  + ptokenComi, false);
    var i = 0;
    while (Json[i]!=null) {
        i++
    }
    var element = document.getElementById("Commits");
    element.innerHTML = i+"\nCommits";
}



