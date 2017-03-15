## Directory
1. Site/
    1. css/ 
    2. js/
    3. pictogramas/
    4. *.html 


### __UC15 [2] Visualizar timeline do esforço por categoria RUP das tarefas.__
__files of interest:__ rup.html, js/rup.js
        
        just need to have a div with the id "chartContainer" and the javascript imports to work fine.
        
        <script type="text/javascript" src="js/rup.js" defer="true"></script>
        <script type="text/javascript" src="js/moment.js"></script>
        <script src="http://code.jquery.com/jquery-1.7.1.min.js"></script>
        <script src="https://api.trello.com/1/client.js?key=TOKEN"></script>


### __UC24 [1] Visualizar EVM global/per team member__
__files of interest:__ login.html, js/login.js, members.html, js/membres.js
   
        you need the login because you gonna need the private token in almost every dashboard page. the private token and some more info
        is saved in a sessionStorage, like a browser's cookie.
        
        
        
#### Graphs api
        We use Google Developer charts to display the info.
        You just need to include on the html head 
        
            <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
        
        
#### ___Trello API___ : 
        Dont use process.html. We just tried to integrate another group Use Case and we cant assure a quality job.
        Basically, you just need Trello cardLists with tasks associated. This taks need to have 4 labels, 2 off them with the format
            "ESTIMATED TIME:"
            "RUP:"
            and a 
            Task description "Description: "
        Change the appKey and token on rup.js and on the script include and should work fine


contact: Gabriel Cardoso 