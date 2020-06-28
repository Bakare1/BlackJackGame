// Black Jack by Biggy Azeez Folawiyo
// Gbagada Lagos.,

// Dictionary Or Objects scoreSpan = My-blackjack-result; Div = My-Box and Score.
let blackJackGame = {
    'you' : {'scoreSpan' : '#my-blackjack-result', 'div' : '#my-box', 'score':0},
    'dealer' : {'scoreSpan' : '#dealer-blackjack-result', 'div' : '#dealer-box', 'score':0},
    'cards' : ['2','3','4','5','6','7','8','9','10','K','J','Q','A'],
    'cardsMap' : {'2': 2,'3': 3,'4': 4,'5': 5,'6': 6,'7': 7,'8': 8,'9': 9,'10': 10,'K': 10,'J': 10,'Q': 10,'A':[1,11]},
    'wins' : 0,
    'losses' : 0,
    'draws' : 0,
    'isStand' : false,
    'turnOver' : false,
}

const You = blackJackGame['you'];
const Dealer = blackJackGame['dealer'];

const hitSound =new Audio('static/sounds/swish.m4a');
const winSound =new Audio('static/sounds/cash.mp3');
const lostSound =new Audio('static/sounds/aww.mp3');

document.querySelector('#blackjack-hit-button').addEventListener('click', blackJackHit);
document.querySelector('#blackjack-deal-button').addEventListener('click', buttonDeal);
document.querySelector('#blackjack-stand-button').addEventListener('click',buttonStand);

function blackJackHit(){
    if(blackJackGame['isStand'] === false) // if blackjackGame isStand is false, run the hit button.
    {
    let card= randomCard();
    console.log(card);
    showCard(card,You);
    updateScore(card,You);
    console.log(You['score']);
    showScore(You);
    }
};

//Randomly chnging the cards images
    function randomCard(){
        let randomIndex = Math.floor(Math.random() * 13);
        return blackJackGame['cards'][randomIndex];
    }

    function showCard(card,activePlayer){
    if(activePlayer['score'] <= 21){
        let cardImage = document.createElement('img');
        cardImage.src = `static/images/${card}.png`;// Concatinating all Images.
        document.querySelector(activePlayer['div']).appendChild(cardImage);
        hitSound.play();
      }  
    }

function buttonDeal(){
        if(blackJackGame['turnOver'] === true){ // if the stand button is clicked then the dealbutton can do its work.

            blackJackGame['isStand'] = false; // the hitbutton should not be able to be pressed.

            let myImages = document.querySelector('#my-box').querySelectorAll('img');
            let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');

        for(i = 0; i < myImages.length; i++){
            myImages[i].remove();
        }

        for(i = 0; i < dealerImages.length; i++){
            dealerImages[i].remove();
        }

        //changing the span to 0
        You['score'] = 0;
        Dealer['score'] = 0;

        document.querySelector('#my-blackjack-result').textContent = 0;
        document.querySelector('#dealer-blackjack-result').textContent = 0;

        //changing the color span to white
        document.querySelector('#my-blackjack-result').style.color = 'white';
        document.querySelector('#dealer-blackjack-result').style.color = 'white';

        //changing the span back to let's Play
        document.querySelector('#blackjack-result').textContent = "Let's Play";
        document.querySelector('#blackjack-result').style.color = 'black';

        blackJackGame['turnOver'] = false;
   }
}

function updateScore(card, activePlayer){
    // if card is eqaulTo A add 11 else add 1
    if(card === 'A'){
        if(activePlayer['score'] + blackJackGame['cardsMap'][card][1] <= 21){
            activePlayer['score'] += blackJackGame['cardsMap'][card][1];
        }else{
            activePlayer['score'] += blackJackGame['cardsMap'][card][0];
        }
    }else{
        //adding score and cardsMap + card
    activePlayer['score'] += blackJackGame['cardsMap'][card];
    }
}

function showScore(activePlayer){
    //if score of the player is greater than 21 then you are busted.
    if(activePlayer['score'] > 21){
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST!';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
    }else{
        //shows result on scoreSpan...
    document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms)) // Time at which the Dealer Place its card slowly
}

async function buttonStand(){ //async to synchronise with the sleep Function
    blackJackGame['isStand'] = true; //if the stand  button is pressed the dealer(Bot) should play;

    while(Dealer['score'] < 16 && blackJackGame['isStand'] === true){

     let card = randomCard();
     showCard(card,Dealer);
     console.log(card);
     updateScore(card,Dealer);
     showScore(Dealer);
     console.log(Dealer['score'])
     await sleep(1000);// pasing the time from the Time set for the dealer
    }
    
   // if(Dealer['score'] > 15){
        blackJackGame['turnOver'] = true; // when the dealer(Bot) plays finish then the Deal button can be clicked
        let winner = computeWinner();
        showResult(winner);
        
    //}
}

//Compute winner and return who just won.
//Update the wins, draws and loses
function computeWinner(){
    let winner;

    if(You['score'] <= 21){
        if(You['score'] > Dealer['score'] || Dealer['score'] > 21){
            console.log('You Won');
            blackJackGame['wins']++;
            winner = You;

        }else if(You['score'] < Dealer['score']){
            console.log('You Lost');
            blackJackGame['losses']++
            winner = Dealer;

        }else if(You['score'] === Dealer['score']){
            console.log('You Tied');
            blackJackGame['draws']++;
        }

    }else if(You['score'] > 21 && Dealer['score'] <= 21){
        console.log('You Lost');
        blackJackGame['losses']++;
        winner = Dealer;

    }else if(You['score'] > 21 && Dealer['score'] > 21){
        console.log('You Tied');
        blackJackGame['draws']++;
    }
    console.log('Winner is', winner);
    return winner;
}

function showResult(winner){
    if(blackJackGame['turnOver'] === true){

    let message,messageColor;
    if(winner === You){
        document.querySelector('#wins').textContent = blackJackGame['wins'];
        message = 'You Win';
        messageColor = 'green'
        winSound.play();
    }else if(winner === Dealer){
        document.querySelector('#losses').textContent = blackJackGame['losses'];
        message = 'You Lost';
        messageColor = 'red';
        lostSound.play();
    }else{
        document.querySelector('#draws').textContent = blackJackGame['draws'];
        message = 'You Drew!'
        messageColor = 'black'
    }

    document.querySelector('#blackjack-result').textContent = message;
    document.querySelector('#blackjack-result').style.color = messageColor;
 }
}