(function()
{
	//automatically called as soon as the javascript is loaded
	window.addEventListener("load", main);
}());

function main(){
	var nome = sessionStorage.getItem("name");
	var id = sessionStorage.getItem("id_project");
	token = sessionStorage.getItem("private_token");
	addHtml();
	startTime();

	document.getElementById("um").innerHTML=nome;

	$.get("https://git.dei.uc.pt/api/v3/projects/"+id+"/users",{private_token: token},callbackU)
		.fail(function() {
			alert( "ERRO" );
		});
	function callbackU (evento){
		for (var i = 0; i < evento.length; i++) {
			if(evento[i].name == nome){
				document.getElementById("foto").src = evento[i].avatar_url;
				break;
			}
		};


		getMemberCommits(id, nome , token);
		window.addEventListener("Commits Membros", handler);
		function handler(ev){
			console.log(ev.data);

			var tabela = document.getElementById("serach-list");

			var list =[[]]; //commits
			var list2 = [[]]; // adds and del


			for (var i = 0; i < ev.data.length; i++) {
				var trimmedString = ev.data[i].message.length > 50 ? ev.data[i].message.substring(0, 50) + "..." :
					ev.data[i].message;

				var dt = getData(ev.data[i].created_at);


				tabela.insertRow(tabela.rows.length).insertCell(0).outerHTML ="<td>"+trimmedString+"</td> <td>"+ev.data[i].short_id+"</td> <td>"+dt+"</td>"

				if(i==0){

					list[0][0] = dt.split(" ")[0]; //data
					list[0][1]=1; //contador
					list2[0][0]=ev.data2[0][0]; //adds
					list2[0][1]=ev.data2[0][1]; //del

				}
				else
					addInfo(list,dt.split(" ")[0],list2,ev.data2[i]);

			};

			console.log(list);
			console.log(list2);

			var chart = doGrafic();
			var dataPoints = prepareDataPoints(list,list2);
			chart.options.data[0].dataPoints =  dataPoints[0];
			chart.options.data[1].dataPoints = dataPoints[1];
			chart.options.data[2].dataPoints = dataPoints[2];
			chart.render();
			document.getElementById("linkgraphs").innerHTML=tabela.rows.length-1+" commits: See Graphs";

		}





	}


}

function addInfo(list,data,list2,data2){
	for (var i = 0; i < list.length; i++) {
		if(list[i][0] == data){
			list[i][1]++;
			list2[i][0]+=data2[0];
			list2[i][1]+=data2[1];
			return;
		}
	}

	list.push([data,1]);
	list2.push([data2[0],data2[1]]);

}

function addHtml() {
	var nome = document.getElementById("projectname");
	nome.innerText = nome_projeto;
	var data = document.getElementById("projectinfo");
	data.innerHTML = data_projeto;
}

function getData(data){
	var st1;
	var aux = data.split("T");
	var aux1 = aux[1].split(".");
	st1 = aux[0]+" "+aux1[0];
	return st1;
}

function prepareDataPoints(lista,lista2){
	var dataP = [];
	var dataAdds = [];
	var dataDel = [];
	for (var i = 0; i < lista.length; i++) {
		dataP.push({x:(10*(i+1)), y:lista[i][1], label:lista[i][0]});
		dataAdds.push({x:10*(i+1),y:lista2[i][0]});
		dataDel.push({x:10*(i+1),y:lista2[i][1]});
	};

	return [dataP,dataAdds,dataDel];
}

function doGrafic(){
	var chart = new CanvasJS.Chart("chartContainer", {
		title: {
			text: "Commits"
		},
		animationEnabled: true,
		axisX: {
			interval: 10
		},
		data: [{
			id: "commits",
			type: "line",
			showInLegend: true,
			name: "Commits",
			color: "#20B2AA",
			lineThickness: 2,

			dataPoints:[]

		},{
			id: "adds",
			type: "line",
			showInLegend: true,
			name: "Addictions",
			color: "#00FF00",
			lineThickness: 2,

			dataPoints:[]
		},
			{
				id: "del",
				type: "line",
				showInLegend: true,
				name: "Deletions",
				color: "#FF0000",
				lineThickness: 2,

				dataPoints:[]
			}],
		legend: {
			cursor: "pointer",
			itemclick: function (e) {
				if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
					e.dataSeries.visible = false;
				}
				else {
					e.dataSeries.visible = true;
				}
				chart.render();
			}
		}

	});

	return chart;

}