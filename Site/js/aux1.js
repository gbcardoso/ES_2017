/*
 Este ficheiro tem os metodos mais usados nos outros js

 */


/*
 Obter o Json
 Devolve a lista de objetos no ev.data

 arg: permite obter objetos diferentes com o get
 */

function httpGet(master,str,arg,option,branch){
    console.log("->"+master.url);
    x = $.get(master.url+str,{ref_name : branch,private_token: master.key},callback)
        .fail(function() {
            alert( "ERRO" );
        });

    function callback (evento){
        var ev = new Event("ready");
        ev.data = evento;
        ev.data1 = arg;
        ev.data2 = option;
        window.dispatchEvent(ev);
    }

}
/*
 Obtem os Projectos listados na pagina inicial, é usado na main.js para a primeira informacao
 e depois no projetos.js */
function getProject(aux,master){
    master.list.push(new Project(aux));
}


/*
 Faz-se um ciclo e nao se guarda diretamente para
 se poder guardar cada objeto do tipo que queremos
 ex: guardar do tipo Projeto na lista em Master
 guardar do tipo Branch na lista em Projetos
 */
function getObject(object,arg,option,key){
    /*	arg.list = ev.data;
     console.log(ev.data);
     */
    for (var i=0; i < object.length; i++) {
        //console.log(object[i]);
        switch (option){
            case "Files": getFile(object[i],arg,key);
                break;
            case "User": getProject(object[i],arg);
                break;
            case "Branch": getBranch(object[i],arg);
                break;
        }

    };
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
 <<<<<< Como são metodos recursivos à escuta à escuta de eventos convém remover o listener dos botoes que os chamam enquanto estao a correr >>>>>>
 */


/*
 -id do projeto
 -nome do membro
 -private_token
 */
function getMemberCommits(id,name,key){
    var obj={};
    obj["list"]=[];
    var list=[]; //commits a devolver
    var list2=[]; //additions and deletions
    cont=0;

    //obter branches
    $.get("https://git.dei.uc.pt/api/v3/projects/"+id+"/repository/branches",{private_token: key},callback)
        .fail(function() {
            alert( "ERRO" );
        });
    function callback (evento){

        window.addEventListener("gotCommits1",ch);
        function ch(){
            console.log(obj);
            for (var i = 0; i < obj.list.length; i++) {
                if((obj.list[i].author_email == (sessionStorage.getItem("username")+"@student.dei.uc.pt")) && list.indexOf(obj.list[i])==-1){                    list.push(obj.list[i]);
                }
            }


            cont++;
            if(cont< evento.length){
                getCommits1(evento[cont].name,id,obj,key,0,0);
            }
            else{
                window.removeEventListener("gotCommits1",ch);
                console.log("ACABOU");

                getAddsAndDel(list,id,key,0,list2);



            }
        }
        console.log("ai vai");
        getCommits1(evento[cont].name,id,obj,key,0,0);

    }
}

function getAddsAndDel(list,id,key,i,list2){
    console.log(list[i]);
    $.get("https://git.dei.uc.pt/api/v3/projects/"+id+"/repository/commits/"+list[i].id+"/diff",{private_token: key},callback)
        .fail(function() {
            alert( "ERRO" );
        });
    function callback(evento){
        console.log(evento);
        if(evento.length>0){
            for (var k = 0; k < evento.length; k++) {

                var countAdd = evento[k].diff.split("\n+").length-1; /*--- a/index.html↵+++ b/index.html↵@@*/
                var countDel = evento[k].diff.split("\n-").length-1;
                console.log(countAdd + " "+ countDel);
                list2.push([countAdd,countDel]);
            }
        }
        else
            list2.push([0,0]);

        if(i<list.length-1){
            getAddsAndDel(list,id,key,i+1,list2);
        }
        else{
            /*devolve a informacao*/
            var evv = new Event("Commits Membros");
            evv.data = list;
            evv.data2 = list2;
            window.dispatchEvent(evv);
        }



    }

}





/*
 Obter os commits
 Como por pagina só vêm 20 commits(max) tem de se fazer
 requests até devolver um array vazio e ir juntando os elementos ao array principal.

 Só obtem os commits do branch master


 Os argumentos são o id do projeto, o objeto onde se vai guardar os commits (tem que te um array chamado list),
 a private_token, 0, 0
 Quando termina faz dispatch do evento "gotCommits" e o objeto master ja tem no atributo list o todos os commits

 */
function getCommits1 (branch,id,master,key,i,cont) {

    $.get("https://git.dei.uc.pt/api/v3/projects/"+id+"/repository/commits",{ref_name: branch , page : cont, private_token: key},
        function callback(ev1){
            //console.log(ev1);
            var evento = new Event("gotCommits1");
            evento.data = i; //numero do projeto
            if(ev1.length>0){
                master.list = master.list.concat(removeDuplicate(master.list,ev1)); /*isto permite unir os dois arrays*/
                getCommits1(branch,id,master,key,i,cont+1);
            }
            else
                window.dispatchEvent(evento);


        });
}











/*
 -A pesquisa só se realiza num projeto
 -Recebe o id do projeto e a private token
 -Suponho que nao existam branches sem ficheiros visto que fica um branch inacessivel
 -Devolve um Array de objetos onde a informação foi encontrada
 */
function getRepository(id, key,find){
    var object=null;
    var cont = 0; //verificar em que branch esta
    //obter o projeto
    $.get("https://git.dei.uc.pt/api/v3/projects/"+id,{private_token: key},callback)
        .fail(function() {
            alert( "ERRO" );
        });
    function callback (evento){
        console.log(evento);
        object = evento;
        object["list"]=[]; // lista de commtis

        getBranches();
        window.addEventListener("gotAllFiles",getMembers);
        function getMembers(){
            console.log("lol");
            $.get("https://git.dei.uc.pt/api/v3/projects/"+id+"/users",{private_token: key},callbackU)
                .fail(function() {
                    alert( "ERRO" );
                });
            function callbackU (evento){
                object["members"] = evento;
                console.log(object);

                //procurar
                var list = search(object,0,find);
                for(var i=0; i < list.length; i++){
                    console.log(list[i]);
                }
                var evv = new Event("searchOver");
                evv.data = list;
                window.dispatchEvent(evv);
                console.log("OVER");

            }
        }
    }


    function getBranches(){
        var num = 0;
        //obter branches
        $.get("https://git.dei.uc.pt/api/v3/projects/"+id+"/repository/branches",{private_token: key},callback)
            .fail(function() {
                alert( "ERRO" );
            });
        function callback (evento){
            object["branches"] = evento;
            console.log(evento);

            getCommits1(evento[num].name,id,object,key,0,0);

            window.addEventListener("gotCommits1",gc)
            function gc(ev){
                num++;
                if(num<evento.length){
                    getCommits1(evento[num].name,id,object,key,0,0);
                }
                else{
                    window.removeEventListener("gotCommits1",gc);
                    console.log("ja tem os commits");

                    window.addEventListener("files",handler);
                    function handler(ev){
                        console.log("meke");
                        if(cont<object.branches.length){
                            getTree(object.branches[cont],object.branches[cont].name,"",0,0);

                        }
                        else{

                            console.log("Ja tem todos os ficheiros e pastas do projeto");

                            window.removeEventListener("files",handler);
                            window.dispatchEvent(new Event("gotAllFiles"));
                        }
                    }
                    console.log("ai vai");
                    window.dispatchEvent(new Event("files"));


                }

            }







        }

    }
    function getTree(obj,name,path,cont1,cont2){
        var init = cont2;
        //cont1 percorre a lista de elementos na tree
        //cont2 verifica se estamos na primeira vez que o metodo corre
        $.get("https://git.dei.uc.pt/api/v3/projects/"+id+"/repository/tree",{path: path,ref_name: name,private_token: key},callback)
            .fail(function() {
                alert( "ERRO" );
            });
        function callback (evento){

            obj["tree"] = evento;
            var check=false;
            window.addEventListener("gotSubtree",handler);
            function handler(ev){
                cont1++;
            }
            while(cont1<obj.tree.length){
                if(obj.tree[cont1].type=="tree"){
                    getTree(obj.tree[cont1],name,path+obj.tree[cont1].name+"/",0,cont2+1);
                    window.dispatchEvent(new Event("gotSubtree"));
                }
                else
                    cont1++;

            }
            window.removeEventListener("gotSubtree",handler);
            if(init==0){
                console.log(obj);
                cont++;
                window.dispatchEvent(new Event("files"));
            }

        }
    }

}





/*
 Procura todos os valores dos atributos de obj
 que é passado por parametro.
 Caso obj tenha um array tambem procura os atributos dos elementos
 desse array.
 Se obj tiver um atributo chamado members tambem procura nos objetos que aí estao.
 O argumento check apenas verifica se é a primeira vez que o metodo esta a correr (0)
 ou se ja foi usada a recursao (1)
 */
function search(obj, check,find){
    var list = [];
    //console.log("oi"+list.length);

    if(obj instanceof Array){
        for (var i = 0; i < obj.length; i++){
            var aux = search(obj[property][i],1);
            list = list.concat(removeDuplicate(list,aux));
        }
    }
    for(var property in obj){
        if(obj.hasOwnProperty(property)){
            if(property=="commit")
                console.log("LOLL");
            //console.log("->"+obj[property]);
            //console.log((obj[property] instanceof String));
            //console.log(typeof obj[property]);
            if((typeof obj[property] === "string"  && obj[property].toLowerCase().includes(find.toLowerCase())) || property=="id" && obj[property] == find ){
                /*console.log("OIOIOIOI"+property);
                 console.log(obj[property]);*/
                //console.log(obj);
                if(list.indexOf(obj)==-1){
                    console.log("ola");
                    list.push(obj);
                }
            }
            if(obj[property] instanceof Array){
                for (var i = 0; i < obj[property].length; i++){
                    var aux = search(obj[property][i],1,find);
                    list = list.concat(removeDuplicate(list,aux));
                }
            }
            //se se acrescentarem os commits à informaçao a procurar isto nao é preciso
            else if(property=="commit"){
                console.log("alô");
                list = list.concat(search(obj[property],1,find));
            }
        }
    }
    if(check==1){
        //console.log("size"+list.length);
        return list;
    }
    console.log("acabou");
    return list;

}

/*
 remover duplicados
 nao estava a funcionar o index of
 */
function removeDuplicate(array1,array2){
    for (var i=0; i<array2.length; i++) {
        for (var j = 0; j < array1.length; j++) {
            if(JSON.stringify(array1[j]) === JSON.stringify(array2[i]) || ( array1[j]!==undefined && array2[i]!==undefined && array1[j].id!==undefined && array2[i].id!=undefined && array1[j].id == array2[i].id))
                array2.splice(i,1);
        }
    }
    return array2;
}