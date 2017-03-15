//<script src="http://code.jquery.com/jquery-1.7.1.min.js"></script>
//<script src="https://api.trello.com/1/client.js?key=[4f99f55ae5f328c17edd2f9b7d528bc9]"></script>
//AppKey = 4f99f55ae5f328c17edd2f9b7d528bc9

/*Precisamos de uma application key e uma Trello member token*/

/*var authenticationSuccess = function() { console.log(Successful authentication); };
var authenticationFailure = function() { console.log(Failed authentication); };*/
/*

function AuthenticateTrello() {
    var myList = '5821138285bbd4fec243d379';
    var creationSuccess = function(data) {
      console.log('Card created successfully. Data returned:' + JSON.stringify(data));
    };
    var newCard = {
      name: 'New Test Card', 
      desc: 'This is the description of our new card.',
      // Place this card at the top of our list 
      idList: myList,
      pos: 'top'
    };
    Trello.post('/cards/', newCard, creationSuccess);

    Trello.put('/cards/5828b06e463b60ec6279a410', {name: 'New Test Card'});


}*/







function keypressed( obj , e ) {
    var tecla = ( window.event ) ? e.keyCode : e.which;
    if ( tecla == 13 ) {
         document.getElementById("button").onclick = function(){
        
             
        var myList = '58292225e87608d0876fd35b';
        var creationSuccess = function(data) {
          console.log('Card created successfully. Data returned:' + JSON.stringify(data));
        };
        var newCard = {
          name: 'New Test Card 3', 
          desc: 'This is the description of our new card.',
          // Place this card at the top of our list 
          idList: myList,
          due: null,
          pos: 'top'
        };
        Trello.post('/cards/', newCard, creationSuccess);
             /*
        Trello.put('/cards/5828b06e463b60ec6279a410?fields=name,idList&member_fields=fullName&key=4f99f55ae5f328c17edd2f9b7d528bc9&token=5ce81baab6987aba1f0fe27c114a55036f036dcaaee76ab6d6ade86d9835a7a3', {name: 'New Test Card 2'});    
             */
        //Trello.put('/cards/[ID]', {name: 'New Test Card 3'});
        };
    }
}

//var myList = '58292225e87608d0876fd35b';

/*
function onAuthorizeSuccessful() {
  var token = Trello.token();
  window.location.replace("/auth?token=" + token);
}*/
/*
var myList = '5821138285bbd4fec243d379';
var creationSuccess = function(data) {
  console.log('Card created successfully. Data returned:' + JSON.stringify(data));
};
var newCard = {
  name: 'New Test Card', 
  desc: 'This is the description of our new card.',
  // Place this card at the top of our list 
  idList: myList,
  pos: 'top'
};
Trello.post('/cards/', newCard, creationSuccess);

Trello.put('/cards/5828b06e463b60ec6279a410', {name: 'New Test Card'});
*/

/*4f99f55ae5f328c17edd2f9b7d528bc9 ------> Application key*/
/*5ce81baab6987aba1f0fe27c114a55036f036dcaaee76ab6d6ade86d9835a7a3    --------> Authentication memeber token
idList: 5821138285bbd4fec243d379
idBoard: 5821136a9e6d3e6bb17410f0     
},"card":{"shortLink":"gtcU8tGl (para um caso)


id pra links:J5Ct10EK ->https://trello.com/b/J5Ct10EK/1-target-card.json*/

/*create a card
var myList = INSERT YOUR IDLIST HERE';
var creationSuccess = function(data) {
  console.log('Card created successfully. Data returned:' + JSON.stringify(data));
};
var newCard = {
  name: 'New Test Card', 
  desc: 'This is the description of our new card.',
  // Place this card at the top of our list 
  idList: myList,
  pos: 'top'
};
Trello.post('/cards/', newCard, creationSuccess);

Trello.put('/cards/[ID]', {name: 'New Test Card'});//Update data
*/