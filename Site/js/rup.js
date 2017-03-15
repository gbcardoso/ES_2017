
/*ativar pop ups para aceitar ligaçao com trello*/

google.charts.load("current", {packages:["corechart"]});
google.charts.setOnLoadCallback(function(){ taskstochart()});

/*
(function() {
    window.addEventListener("load", main);
}());*/



/*call all the functions needed to draw the chart*/
function taskstochart(){
    /*alterar data tasks*/
    /*NECESSARIO boardId*/
    Trello.get(
        '/boards/5821136a9e6d3e6bb17410f0/lists?key='+appKey+'&token='+tok,
        loadedLists,
        function() { console.log("Failed to load lists"); }
    );
    /*careful about the div*/
}


/*group all tasks in a array of objects {RUPcategory,timespent}*/
function commit_per_cat(array_tasks){
    var array_timepertask = [];
    var i=0,j;
    while(array_tasks[i]!= null){
        j=0;
        while(array_timepertask[j]!=null) {
            if (array_tasks[i].cat == array_timepertask[j].RUPcat){
                array_timepertask[j].timespent +=array_tasks[i].t;
                break;
            }
            j++;
        }
        if(j>=array_timepertask.length){
            array_timepertask.push({
                RUPcat : array_tasks[i].cat,
                timespent : array_tasks[i].t
            });
        }
        i++;
    }
    return array_timepertask;
}

/*
    y - timetotalspent
    legendText - info next to the colours that appear on the legend
    indexLabel - what appears when next to the pie chart
 * {y,legendText,indexLabel},{x,y},{x,y}
 * */
function array_to_array_object_YLI(array_timepertaks){
    var i= 0,j, time_counter= 0;
    var array_object = [['Category','TimeSpent']];
    /*check total time spent to get percentage*/
    /*for(j=0;j<array_timepertaks.length;j++){
        time_counter+=array_timepertaks[j].timespent;
    }
    console.log(time_counter);*/
    while(array_timepertaks[i]!=null){
        /*??case some task doesnt have time associated
        if(array_timepertaks[i] ==null)
            array_timepertaks[i]=0;*/
        array_object.push([
            array_timepertaks[i].RUPcat,
            array_timepertaks[i].timespent
        ]);
        i++
    }
    return array_object;
}

function DoPieChart(data_tasks,div_id,title) {
    console.log(data_tasks);
        var data = google.visualization.arrayToDataTable(data_tasks,false);

        var options = {
            title: title,
            titextStyle: {fontName: 'Roboto'},
            pieHole: 0.50,
           // pieSliceTextStyle: { fontName: 'Roboto'},
            slices: {textStyle: 'Roboto'},
            legend: {textStyle:{fontName: 'Roboto',
                    fontsize:20}}
        };

        var chart = new google.visualization.PieChart(document.getElementById(div_id));
        chart.draw(data, options);
    }


var appKey="4f99f55ae5f328c17edd2f9b7d528bc9";//alterar!!!!!!!!!!!!!!!!
var tok="5ce81baab6987aba1f0fe27c114a55036f036dcaaee76ab6d6ade86d9835a7a3";//alterar!!!!!!!!!!!!!!!

var loadedLists = function(lists) {
    var cardList = [];
    var j = 0;
    $.each(lists, function(index, value) {
        Trello.get(
            '/lists/' + value.id + '/cards?key='+appKey+'&token='+tok,
            function(cards){
                var i=0;

                while(cards[i]){
                    //create Card
                    var temp = createCard(cards[i]);
                    if(temp)
                        cardList.push(temp);
                    i++;
                }

                j++;
                if(j == lists.length) {
                    console.log(cardList);
                    DoPieChart(array_to_array_object_YLI(commit_per_cat(cardList)),"chartContainer","RUP CATEGORY");
                }
            },
            function() { console.log("Failed to load cards"); }
        );

    });
};

function createCard(card){
    /*if you are not retarded this should work
    * like there are none protections by the creation of the tasks
    * someone has to protect it */

    var rup,desc,time=0,i=0;

    if(card.labels.length == 4) {
        // PROTECTION ANTI RETARD PEOPLE
        while(card.labels[i]){
            if(card.labels[i].name.includes("RUP:")){
                var aux = card.labels[i].name.toUpperCase().split("RUP:")[1];
                if(aux.includes("PM") && !aux.includes("IMP")){
                    rup = "PM";
                }
                else if(aux.includes("IMP")){
                    rup = "IMP";
                }
                else if(aux.includes("REQ")){
                    rup = "REQ";
                }
                else if(aux.includes("BM")){
                    rup = "BM";
                }
                else if(aux.includes("ENV")){
                    rup = "ENV";
                }
                else if(aux.includes("TEST")){
                    rup = "TEST";
                }
                else if(aux.includes("CCM")){
                    rup = "CCM";
                }
                else if(aux.includes("AD")){
                    rup = "AD";
                }
                else if(aux.includes("DEP")){
                    rup = "DEP";
                }
            }
            else if(card.labels[i].name.includes("ESTIMATED TIME:")){
                var aux = card.labels[i].name.toUpperCase().split("ESTIMATED TIME:")[1];
                /*locate h*/
                console.log(aux);
                var pos = aux.indexOf("H");
                if(pos != -1) {/*format h*/
                    if(!isNaN(aux.split("H")[0])) {
                        time += parseInt(aux.split("H")[0]) * 60;
                    }
                    if(aux.split("H")[1].includes("M")) { /*format h m*/
                        if (!isNaN(aux.split("H")[1].split("M")[0]))
                            time += parseInt(aux.split("H")[1].split("M")[0] );
                        console.log("TEMPO HM:" + time);
                    }else if(aux.split("H")[1] && !isNaN(aux.split("H")[1])){/*format h (min)*/
                        time += parseInt(aux.split("H")[1]);
                        console.log("TEMPO: H " + time);
                    }
                }
                pos = aux.indexOf("M");
                if(pos !=-1){
                    if(!isNaN(aux.split("M")[0]))
                        time += parseInt(aux.split("M")[0]);
                }
                if(!isNaN(aux)){
                    time = parseInt(aux); /*caso nao tenha unidade de tempo é predefinido como hora*/
                }
            }


            i++;
        }

    }
    if(rup && time != 0){
        /*caso o cartao seja valido*/

        task = {
            desc: card.desc.split("Description:")[1].split("Details:")[0].trim(),
            cat: rup,
            t: time
        };
        console.log(task);
        return task;
    }
    else{
        return null;
    }
}
