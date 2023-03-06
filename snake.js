const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");


class SnakePart {  //classe che serve a locare nella posizione in cui si trova la testa del serpente il corpo che verrà aggiunto
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

let speed = 7;

let tileCount = 20; //variabile dove definiamo il conteggio dello schermo diviso in quadratini (es pixel) in cui diciamo che è di 20 sia in altezza che in lunghezza LO UTILIZIAMO PER FARE SPOSTARE NELLO SCHERMO SIA IL SERPENTE CHE LA POSIZIONE DELLE MELE
let titleSize = canvas.width / tileCount - 2; // variabile dimensioni ovvero diciamo che la mela o quando il serpente cresce non occueprà tutto lo schermo ma solo 2 spazi uno per la mela e l'altro per il serpente
let headX = 10; // posizione su asse X in cui appare la posizione della testa ad inizio partita (ovvero al centro dello schermo) 
let headY = 10; // posizione su asse Y in cui appare la posizione della testa ad inizio partita (ovvero al centro dello schermo)

const snakePart = [];// constante contenente un array vuoto in cui verranno pushate le pati del serpente 
let tailLengt = 2; // corpo del serpente di partenza

let appleX = 5;
let appleY = 5;

let xVelocity = 0; //variabile di velocità su asseX
let yVelocity = 0; //variabile di velocità su assey

let score = 0;

const gulpSound = new Audio("Cartoon Gulp Sound Effect.mp3");
const gOSound = new Audio("SUPER MARIO - game over - sound effect.mp3");


function drawGame() { //funzione chiamata disegnare gioco poichè al suo interno avrà le funzionalità del intero gioco

    changeSnakePosition();
    let result = isGameOver();
    if (result) {
        return;
    }

    clearScreen();


    checkAppleCollision();
    drawApple();
    drawSnake();
    drawScore();

    if (score > 5) {
        speed = 10;
    }
    if (score > 10) {
        speed = 15;
    }

    setTimeout(drawGame, 1000 / speed); // questa è la funzione di loop ovvero con questa stringa diciamo che lo schermo si aggiorna 7 volte al secondo poichè speed è uguale  a 7 creando una velocità esponenziale 
}

function isGameOver() {
    let gameOver = false; // di defult gameOver è falsa, si attiva quando si verificano le funzioni che scriviamo di sotto

    if (yVelocity === 0 && xVelocity === 0) {
        return false;
    }

    if (headX < 0) { // muro di sinistra
        gameOver = true
    }
    else if (headX === tileCount) {// muro di destra
        gameOver = true
    }
    else if (headY < 0) { // muro di su
        gameOver = true
    }
    else if (headY === tileCount) { // muro di giù
        gameOver = true
    }

    for (let i = 0; i < snakePart.length; i++) { // ciclo che conta le parti del corpo
        let part = snakePart[i];
        if (part.x === headX && part.y === headY) { //condizione che dice che il gioco finisce se la testa del serpente colpisce il corpo
            gameOver = true;
            break;
        }
    }


    if (gameOver) {
        ctx.fillStyle = "white";
        ctx.font = "50px Verdana";

        ctx.fillText("Game Over", canvas.width / 6.5, canvas.height / 2)
        gOSound.play();
    }
    return gameOver;



}

function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "15px Verdana";
    ctx.fillText("Score" + score, canvas.width - 55, 16); // Posizione dello score su schermo
}


function clearScreen() { // ci disegnamo la tela su cui il serpente si muove
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height); // larghezza e altezza dello schermo nero
}

function drawSnake() { // ci disegnamo il serpente

    ctx.fillStyle = "green"; // colore del corpo
    for (let i = 0; i < snakePart.length; i++) { // ciclo for che serve per allungare il corpo
        let part = snakePart[i];
        ctx.fillRect(part.x * tileCount, part.y * tileCount, titleSize, titleSize) // aggiunge solo una mattonella delle stesse dimensioni della testa
    }

    snakePart.push(new SnakePart(headX, headY)); //questa funzione permette di far muovere il corpo insieme alla testa eliminando la mattonella più vicina alla testa e aggiungendo una in coda
    if (snakePart.length > tailLengt) { //puschare un elemneto dietro alla testa del serpente
        snakePart.shift(); //elimina gli elementi più lontani
    }

    ctx.fillStyle = "orange";
    ctx.fillRect(headX * tileCount, headY * tileCount, titleSize, titleSize) // grandezza della testa del serpente
}

function changeSnakePosition() { // questa è la funzione che cambia posizione al serpente
    headX = headX + xVelocity;
    headY = headY + yVelocity;
}

function drawApple() { // questa è la funzione che crea e sposta la mela
    ctx.fillStyle = "red";
    ctx.fillRect(appleX * tileCount, appleY * tileCount, titleSize, titleSize)
}

function checkAppleCollision() { // questa è la funzione che sposta la mela ogni volta che la mangiamo
    if (appleX === headX && appleY === headY) {
        appleX = Math.floor(Math.random() * tileCount);
        appleY = Math.floor(Math.random() * tileCount);
        tailLengt++; // corpo del serpente ++ (ogni volta che verrà mangiata una mela)
        score++;
        gulpSound.play();
    }
}

document.body.addEventListener("keydown", keyDown);// richiamiamo al funzione della tastiera ovvero al premere del tasto nella tastiera


function keyDown(event) { // funzione che controlla i movimenti del serpente

    //questo if indica il movimento SU
    if (event.keyCode == 38) { //il numero 38 è il numero corrispondente alla freccia in alto della tastiera
        if (yVelocity == 1) // questo if sta a dire che se la direzione è GIù allora non potrà andare in su
            return;
        yVelocity = -1; //valore negativo e positivo serve a indicare su-giù, destra-sinistra.
        xVelocity = 0;
    }

    //questo if indica il movimento GIù
    if (event.keyCode == 40) {
        if (yVelocity == -1)
            return;
        yVelocity = 1;
        xVelocity = 0;
    }

    //questo if indica il movimento SINISTRA
    if (event.keyCode == 37) {
        if (xVelocity == 1)
            return
        yVelocity = 0;
        xVelocity = -1;
    }

    //questo if indica il movimento DESTRA
    if (event.keyCode == 39) {
        if (xVelocity == -1)
            return;
        yVelocity = 0;
        xVelocity = 1;
    }
}


drawGame();