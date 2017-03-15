var username = sessionStorage.getItem("username");
var Aptoken = sessionStorage.getItem("private_token");
var projectDate = sessionStorage.getItem("project_date");
var branchURL = ptoken = '?private_token=' + Aptoken;
var ptokenComi = '&private_token=' + Aptoken;
var id = sessionStorage.getItem("id_project");
var finalURL = requestURL + ptoken;
var finalURL = requestURL + ptoken;
var URL = 'https://git.dei.uc.pt/api/v3/projects'
var requestURL = 'https://git.dei.uc.pt/api/v3/projects';
var ListCommitMembers = [];
var ListCommits = GetCommits(ptokenComi);
google.charts.load('current', {
    'packages': ['corechart']
});
google.charts.setOnLoadCallback(do_general_commits);
google.charts.setOnLoadCallback(function () {
    list(ptoken)
});

//window.onload = list(ptoken);
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
/*create the cards for each member*/
function list(ptoken) {
    var result = gitlabRequest("GET", "https://git.dei.uc.pt/api/v3/projects/" + id + "/users" + ptoken, false);
    var i = 0;
    var miniTable = document.getElementById("table2");
    while (result[i] != null) {
        //listaMenbres(result,i,miniTable);
        listaMenbres2(result, i);
        i++;
    }
}

function listaMenbres(result, i, miniTable) {
    /*small  card on the left*/
    var div_name = document.createElement("div");
    div_name.className = "col-xs-12 username";
    div_name.id = ((i + 1) * 100); /*para proteger */
    var name_user = document.createTextNode(result[i].username);
    div_name.appendChild(name_user);
    div_name.addEventListener("click", function () {
        namePro = result[i].name;
        avata_url = result[i].avatar_url;
        enviaUser();
        window.location.href = "user.html";
    }, false);
    /*texto to do fodido da data*/
    var div_user_info = document.createElement("div");
    div_user_info.className = "col-xs-hidden userinfo";
    var data = document.createTextNode(last_commit_from_user(result[i].username));
    /*procura data*/
    div_user_info.appendChild(data);
    var div_row = document.createElement("row");
    div_row.appendChild(div_name);
    div_row.appendChild(div_user_info);
    miniTable.appendChild(div_row);
}

function enviaUser() {
    sessionStorage.setItem("namePro", namePro);
    sessionStorage.setItem("avata_url", avata_url);
}

function listaMenbres2(result, i) {
    /*big card*/
    var div_main = document.createElement("div");
    div_main.className = "col-sm-6 col-md-6 col-xs-12 cool";
    var div_card = document.createElement("div");
    div_card.className = "card-pf";
    var div_card_user = document.createElement("div");
    div_card_user.className = "card-pf-username row";
    var div_user_pic = document.createElement("div");
    div_card_user.className = "col-xs-3 userpic-container";
    /*inserir imagem*/
    var pic_to_div = document.createElement("img");
    pic_to_div.setAttribute("src", gitlabRequest("GET", result[i].avatar_url, false));
    pic_to_div.setAttribute("src", result[i].avatar_url);
    pic_to_div.setAttribute("height", "40");
    pic_to_div.setAttribute("width", "40");
    pic_to_div.setAttribute("alt", "userpic");
    pic_to_div.className = "userpic";
    div_card_user.appendChild(pic_to_div);
    var p_member_name = document.createElement("p");
    p_member_name.className = "col-xs-6";
    p_member_name.id = i + 1;
    var text_username = document.createTextNode(result[i].username);
    p_member_name.appendChild(text_username);
    var div_card_body = document.createElement("div");
    div_card_body.className = "col-xs-6";
    // div_card_body.id = (i+1)+".";
    var chart_div = document.createElement("div");
    chart_div.style.alignItems = "left";
    chart_div.style.height = "100px";
    chart_div.style.width = "250px";
    chart_div.id = (i + 1) + ".";
    div_card_body.appendChild(chart_div);
    div_card_user.appendChild(div_user_pic);
    div_card_user.appendChild(p_member_name);
    div_card.appendChild(div_card_user);
    div_card.appendChild(div_card_body);
    div_main.appendChild(div_card);
    document.getElementById("cards").appendChild(div_main);
    list_commit_from_user(result[i].username + "@student.dei.uc.pt", (i + 1) + ".");
}

function GetCommits(ptokenComi) {
    Json = gitlabRequest("GET", 'https://git.dei.uc.pt/api/v3/projects/' + id + "/repository/commits?per_page=100" + ptokenComi, false);
    var h = 0
        , j = 0;
    while (Json[h] != null) {
        j = 0;
        while (ListCommitMembers[j] != null) {
            if (Json[h].author_email == ListCommitMembers[j].email) {
                ListCommitMembers[j].n_commits++;
                break;
            }
            j++;
        }
        if (j >= ListCommitMembers.length) {
            ListCommitMembers.push({
                email: Json[h].author_email
                , n_commits: 1
            });
        }
        h++;
    }
    return Json;
}

function last_commit_from_user(user) {
    var i = 0;
    while (ListCommits[i] != null) {
        if (ListCommits[i].author_email == user + "@student.dei.uc.pt") {
            var data = ListCommits[i].created_at.split('T')[1].split('.')[0] + " " + ListCommits[i].created_at.split('T')[0];
            return data;
        }
        i++;
    }
    return "Never commited";
}
/*compare to days, and get the difference in weeks*/
function Project_week(data_project_created, data_to_compare) {
    var data_project = new Date(data_project_created);
    var data_c = new Date(data_to_compare);
    //diference in miliseconds, converted to days
    var data_dif = (data_c - data_project) / 86400000;
    return Math.round(data_dif / 7);
}

function list_commit_from_user(email, identifier) {
    var Commit_user = []
        , i = 0;
    while (ListCommits[i] != null) {
        /*selecionar os commits com o mesmo email que o mail*/
        if (ListCommits[i].author_email == email) Commit_user.push(ListCommits[i]);
        i++;
    }
    Commits_Chart(array_to_array_object_XY(commit_per_weeK(Commit_user)), identifier, " ");
}
/*do big graph with commits on each week*/
function do_general_commits() {
    Commits_Chart(array_to_array_object_XY(commit_per_weeK(ListCommits)), "bar", "Week " + Project_week(projectDate, new Date()));
}

function commit_per_weeK(array_commits) {
    var commits = array_commits;
    var i = 0;
    /*a semana 0 tb conta, dai +1*/
    var array_commits_per_week = new Array(Project_week(projectDate, new Date()) + 1).fill(0);
    while (commits[i] != null) {
        /*talvez falte 1 y apos o ]*/
        array_commits_per_week[Project_week(projectDate, commits[i].created_at)] += 1;
        i++;
    }
    return array_commits_per_week;
}
/*array with i = position array
 * array[i] = amount
 * {x,y},{x,y},{x,y}
 * */
function array_to_array_object_XY(array_commits) {
    var i = 0;
    var array_object = [['semana', 'commits']];
    while (array_commits[i] != null) {
        if (array_commits[i] == null) array_commits[i] = 0;
        array_object.push([
            i
            , array_commits[i]
        ]);
        i++;
    }
    return array_object;
}
/*Funçao para graficos*/
function Commits_Chart(data_info, id_, title) {
    var data = google.visualization.arrayToDataTable(data_info, false);
    var options = {
        title: title
        , titleTextStyle: {
            fontName: 'Roboto'
            , fontSize: 20
        }
        , curveType: 'function'
        , legend: {
            position: 'bottom'
            , textStyle: {
                fontName: 'Roboto'
                , fontsize: 20
            }
        }
    };
    var chart = new google.visualization.LineChart(document.getElementById(id_));
    chart.draw(data, options);
}