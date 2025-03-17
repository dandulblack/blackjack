let deck = [
    { card: '2♥', value: 2 },
    { card: '3♥', value: 3 },
    { card: '4♥', value: 4 },
    { card: '5♥', value: 5 },
    { card: '6♥', value: 6 },
    { card: '7♥', value: 7 },
    { card: '8♥', value: 8 },
    { card: '9♥', value: 9 },
    { card: '10♥', value: 10 },
    { card: 'J♥', value: 10 },
    { card: 'Q♥', value: 10 },
    { card: 'K♥', value: 10 },
    { card: 'A♥', value: 11 },
    
    { card: '2♦', value: 2 },
    { card: '3♦', value: 3 },
    { card: '4♦', value: 4 },
    { card: '5♦', value: 5 },
    { card: '6♦', value: 6 },
    { card: '7♦', value: 7 },
    { card: '8♦', value: 8 },
    { card: '9♦', value: 9 },
    { card: '10♦', value: 10 },
    { card: 'J♦', value: 10 },
    { card: 'Q♦', value: 10 },
    { card: 'K♦', value: 10 },
    { card: 'A♦', value: 11 },
    
    { card: '2♠', value: 2 },
    { card: '3♠', value: 3 },
    { card: '4♠', value: 4 },
    { card: '5♠', value: 5 },
    { card: '6♠', value: 6 },
    { card: '7♠', value: 7 },
    { card: '8♠', value: 8 },
    { card: '9♠', value: 9 },
    { card: '10♠', value: 10 },
    { card: 'J♠', value: 10 },
    { card: 'Q♠', value: 10 },
    { card: 'K♠', value: 10 },
    { card: 'A♠', value: 11 },
    
    { card: '2♣', value: 2 },
    { card: '3♣', value: 3 },
    { card: '4♣', value: 4 },
    { card: '5♣', value: 5 },
    { card: '6♣', value: 6 },
    { card: '7♣', value: 7 },
    { card: '8♣', value: 8 },
    { card: '9♣', value: 9 },
    { card: '10♣', value: 10 },
    { card: 'J♣', value: 10 },
    { card: 'Q♣', value: 10 },
    { card: 'K♣', value: 10 },
    { card: 'A♣', value: 11 }
];

let drawnCards = [];
let DealerDrawnCards = [];
let hasDrawn = false;
const player = document.getElementById('player');
const dealer = document.getElementById('dealer');
const dealerState = document.getElementById('dealerState');
const playerState = document.getElementById('playerState');
const cardCounter = document.getElementById("cardCounter");
let dealerScore = 0;
let dealerIsStanding = false;
let playerScore = 0;
const gameState = document.getElementById("gameState");
let gameEnded = false
let standing = false

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function hit() {
    if (!gameEnded){    
        if (deck.length === 0) {
            console.log('No more cards');
            return;
        } else {
            // PLAYER DRAW
            let index = Math.floor(Math.random() * deck.length);
            let card = deck[index];
            deck.splice(index, 1); 
            console.log(card);
            drawnCards.push(card);
            player.textContent = drawnCards.map(card => card.card).join(', ');
            playerScore = drawnCards.reduce((score, card) => score + card.value, 0);
            if (playerScore > 21 && drawnCards.some(card => card.value === 11)){
                playerScore -= 10
            }
            playerState.textContent = `score: ${playerScore}`;
            cardCounter.textContent = `${deck.length}/52 cards`;
            await sleep(1500);
            dealerHit();
        }
    }else{
        dealerState.innerText = "reset to play again !"
    }
}

async function dealerHit() {
    if (deck.length === 0) {
        dealerState.textContent = "No more cards, shuffle the deck"
        return;
    } else {
        if (dealerScore < 17){
            // DEALER DRAW
            let index = Math.floor(Math.random() * deck.length);
            let card = deck[index];
            deck.splice(index, 1); 
            console.log(card.card + " " + card.value + "(dealers)");
            dealerScore += card.value
            DealerDrawnCards.push(card);
            dealerState.textContent = "Dealer is drawing"
            dealerScore = DealerDrawnCards.reduce((score, card) => score + card.value, 0)
            if (dealerScore > 21 && DealerDrawnCards.some(card => card.value === 11)){
                dealerScore -= 10
            }
            if (hasDrawn === false) {
                dealer.textContent = DealerDrawnCards.map(card => card.card).join(', ');
                hasDrawn = true;
            } else {
                dealer.textContent = DealerDrawnCards[0].card + ', ???';
            } 
            cardCounter.textContent = `${deck.length}/52 cards`   
        } else {
            dealerState.textContent = "Dealer is standing"
            dealerIsStanding = true
        }
    }
}

async function stand(){
    if (!standing){
        standing = true;
        while(!dealerIsStanding){
            dealerHit()
        }
        await sleep(1000)
        dealerState.textContent = "3"
        await sleep(1000)
        dealerState.textContent = "2"
        await sleep(1000)
        dealerState.textContent = "1"
        await sleep(1000)
        dealerState.textContent = `dealers score: ${dealerScore}`
        dealer.textContent = DealerDrawnCards.map(card => card.card).join(', ');
        if (dealerScore <= playerScore && playerScore < 21){
            if(dealerScore < playerScore){
                gameState.innerText = "You won !!!, click reset to play again"
            } else if (dealerScore == playerScore){
                gameState.innerText = "Push, dealer takes it!"
            }
        } else if (playerScore === 21){
            gameState.innerText = "BLACK JACK!!!"
        }
        else {
            if (dealerScore > 21 && playerScore < dealerScore){
                gameState.innerText = "You won !!!, click reset to play again"
            } else if (dealerScore > 21 && playerScore === dealerScore){
                gameState.innerText = "Push, dealer takes it all!"
            } else {
                gameState.innerText = "You lost, reset to try again"
            }

        } 
        gameEnded = true
    } else if (gameEnded){
        gameState.innerText = "reset to play again!"
    }
}

function reset() {
    drawnCards = [];
    DealerDrawnCards = [];
    player.textContent = 'draw card'; 
    dealer.textContent = 'draw card'; 
    hasDrawn = false;
    dealerScore = 0;
    dealerIsStanding = false
    playerScore = 0;
    dealerState.innerText = "";
    gameEnded =false;
    gameState.innerText = "";
    standing = false;
    deck = [
        { card: '2♥', value: 2 },
        { card: '3♥', value: 3 },
        { card: '4♥', value: 4 },
        { card: '5♥', value: 5 },
        { card: '6♥', value: 6 },
        { card: '7♥', value: 7 },
        { card: '8♥', value: 8 },
        { card: '9♥', value: 9 },
        { card: '10♥', value: 10 },
        { card: 'J♥', value: 10 },
        { card: 'Q♥', value: 10 },
        { card: 'K♥', value: 10 },
        { card: 'A♥', value: 11 },
        
        { card: '2♦', value: 2 },
        { card: '3♦', value: 3 },
        { card: '4♦', value: 4 },
        { card: '5♦', value: 5 },
        { card: '6♦', value: 6 },
        { card: '7♦', value: 7 },
        { card: '8♦', value: 8 },
        { card: '9♦', value: 9 },
        { card: '10♦', value: 10 },
        { card: 'J♦', value: 10 },
        { card: 'Q♦', value: 10 },
        { card: 'K♦', value: 10 },
        { card: 'A♦', value: 11 },
        
        { card: '2♠', value: 2 },
        { card: '3♠', value: 3 },
        { card: '4♠', value: 4 },
        { card: '5♠', value: 5 },
        { card: '6♠', value: 6 },
        { card: '7♠', value: 7 },
        { card: '8♠', value: 8 },
        { card: '9♠', value: 9 },
        { card: '10♠', value: 10 },
        { card: 'J♠', value: 10 },
        { card: 'Q♠', value: 10 },
        { card: 'K♠', value: 10 },
        { card: 'A♠', value: 11 },
        
        { card: '2♣', value: 2 },
        { card: '3♣', value: 3 },
        { card: '4♣', value: 4 },
        { card: '5♣', value: 5 },
        { card: '6♣', value: 6 },
        { card: '7♣', value: 7 },
        { card: '8♣', value: 8 },
        { card: '9♣', value: 9 },
        { card: '10♣', value: 10 },
        { card: 'J♣', value: 10 },
        { card: 'Q♣', value: 10 },
        { card: 'K♣', value: 10 },
        { card: 'A♣', value: 11 }
    ];    
    cardCounter.textContent = `${deck.length}/52 cards`  
    playerState.textContent = `0`
}

function shuffle(){
    deck = [
        { card: '2♥', value: 2 },
        { card: '3♥', value: 3 },
        { card: '4♥', value: 4 },
        { card: '5♥', value: 5 },
        { card: '6♥', value: 6 },
        { card: '7♥', value: 7 },
        { card: '8♥', value: 8 },
        { card: '9♥', value: 9 },
        { card: '10♥', value: 10 },
        { card: 'J♥', value: 10 },
        { card: 'Q♥', value: 10 },
        { card: 'K♥', value: 10 },
        { card: 'A♥', value: 11 },
        
        { card: '2♦', value: 2 },
        { card: '3♦', value: 3 },
        { card: '4♦', value: 4 },
        { card: '5♦', value: 5 },
        { card: '6♦', value: 6 },
        { card: '7♦', value: 7 },
        { card: '8♦', value: 8 },
        { card: '9♦', value: 9 },
        { card: '10♦', value: 10 },
        { card: 'J♦', value: 10 },
        { card: 'Q♦', value: 10 },
        { card: 'K♦', value: 10 },
        { card: 'A♦', value: 11 },
        
        { card: '2♠', value: 2 },
        { card: '3♠', value: 3 },
        { card: '4♠', value: 4 },
        { card: '5♠', value: 5 },
        { card: '6♠', value: 6 },
        { card: '7♠', value: 7 },
        { card: '8♠', value: 8 },
        { card: '9♠', value: 9 },
        { card: '10♠', value: 10 },
        { card: 'J♠', value: 10 },
        { card: 'Q♠', value: 10 },
        { card: 'K♠', value: 10 },
        { card: 'A♠', value: 11 },
        
        { card: '2♣', value: 2 },
        { card: '3♣', value: 3 },
        { card: '4♣', value: 4 },
        { card: '5♣', value: 5 },
        { card: '6♣', value: 6 },
        { card: '7♣', value: 7 },
        { card: '8♣', value: 8 },
        { card: '9♣', value: 9 },
        { card: '10♣', value: 10 },
        { card: 'J♣', value: 10 },
        { card: 'Q♣', value: 10 },
        { card: 'K♣', value: 10 },
        { card: 'A♣', value: 11 }
    ];    
    cardCounter.textContent = `${deck.length}/52 cards`  
}