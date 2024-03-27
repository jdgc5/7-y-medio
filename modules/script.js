import { Jugador } from "./jugador.js"
import { Juego } from "./juego.js"
import { drawChart } from "./chart.js";
import { drawer } from "./drawer.js";

var game = new Juego();
var juego;
var jugador1 = new Jugador('Jugador1');
var jugador2 = new Jugador('Banca');
jugador2.display=1;
var carta;
game.jugadores.push(jugador1);
game.jugadores.push(jugador2);
const MENSAJEINTERFAZ = document.getElementById('mensajesJuego');
const INICIAR = document.getElementById('iniciarJuego');
const SINGLE = document.getElementById('singlePlayer');
const VICTORIAJUG1 = document.getElementById('victoriasJugador');
const VICTORIABANCA = document.getElementById('victoriasBanca');
const DERROTAJUG1 = document.getElementById('derrotasJugador');
const DERROTABANCA = document.getElementById('derrotasBanca');
const PARTIDASSIMULADAS = 200;
const openModalBtn = document.getElementById("modal-chart");
const modal = document.getElementById("modal");
const closeBtn = document.getElementsByClassName("close")[0];

const tiposJuegos = {
    'simulacion': () => {
        borrarHistorial();
        drawer.clearGame(game.jugadores);
        for(let i = 0; i < PARTIDASSIMULADAS; i++){
            reset();
            simulacion();           
        }
    },
    'singlePlayer': () => {
        reset();
        drawer.clearGame(game.jugadores);
        MENSAJEINTERFAZ.textContent = 'Jugador vs Jugador Offline'
        singlePlayer();
        
    },
    
};

async function obtenerNombreJugador() {
    try {
        const response = await fetch('https://randomuser.me/api/');
        const data = await response.json();
        const nombre = `${data.results[0].name.first} ${data.results[0].name.last}`;
        return nombre;
    } catch (error) {
        console.error('Error al obtener el nombre del jugador:', error);
        return null;
    }
}

async function consultaNombre() {
    let nombrePromesa = obtenerNombreJugador(); 
    return nombrePromesa;

}

openModalBtn.addEventListener("click", function () {
    setTimeout(() => {
        modal.style.display = "block";
    }, 150);
    drawChart(game);
});

closeBtn.addEventListener("click", function () {
    modal.style.display = "none";
});

window.addEventListener("click", function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
});

SINGLE.addEventListener('click',async ()=>{
    jugador1.nombre = await consultaNombre();
    document.getElementById('nombreJugador').textContent = jugador1.nombre;
    await cuentaRegresiva();
    juego = tiposJuegos['singlePlayer'];
    juego();
    game.racha();
    VICTORIAJUG1.innerHTML=jugador1.victorias;
    VICTORIABANCA.innerHTML=jugador2.victorias;
    DERROTAJUG1.innerHTML=jugador1.derrotas;
    DERROTABANCA.innerHTML=jugador2.derrotas;
})


INICIAR.addEventListener('click', async () => {
    jugador1.nombre = await consultaNombre();
    document.getElementById('nombreJugador').textContent = jugador1.nombre;
    await cuentaRegresiva();
    juego = tiposJuegos['simulacion'];
    juego();
    game.racha();
    VICTORIAJUG1.innerHTML=jugador1.victorias;
    VICTORIABANCA.innerHTML=jugador2.victorias;
    DERROTAJUG1.innerHTML=jugador1.derrotas;
    DERROTABANCA.innerHTML=jugador2.derrotas;
});

function cuentaRegresiva() {
    let segundos = 5;
    return new Promise((resolve) => {
        function contar() {
            if (segundos > 0) {
                segundos--;
                MENSAJEINTERFAZ.textContent = 'inicio en...' + segundos + ' segundos';
                setTimeout(contar, 1000);
            } else {
                MENSAJEINTERFAZ.textContent = '';
                resolve(); 
            }
        }
        contar();
    });
}

function singlePlayer(){
    manoInicialSingle();
    turnoSiguiente();
}

function simulacion() {

    manoInicial();
    while (jugador1.valido && jugador1.sumaCartasActual < 5){
        carta = game.pedirCarta(jugador1)
        jugador1.cartasEscogidas.push(carta);
        jugador1.calcularValorMano();
    }
    jugador1.valido=false;
    if (jugador1.sumaCartasActual <= 7.5 && jugador2.valido) {
        while (jugador2.sumaCartasActual < 5.5) {
            carta = game.pedirCarta(jugador2);
            jugador2.cartasEscogidas.push(carta);
            jugador2.calcularValorMano();
        }
        jugador2.valido = false;
    } 
    game.comprobarGanadorSimulacion(jugador1,jugador2);
    game.guardarHistorial();   

    MENSAJEINTERFAZ.innerHTML = 'Simulacion finalizada';
}

function borrarHistorial(){
    game.borrarHistorial();
    jugador1.resetEstadisticas();
    jugador2.resetEstadisticas();
    VICTORIAJUG1.innerHTML=jugador1.victorias;
    VICTORIABANCA.innerHTML=jugador2.victorias;
    DERROTAJUG1.innerHTML=jugador1.derrotas;
    DERROTABANCA.innerHTML=jugador2.derrotas;
}

function reset(){
    game.resetGame();
    jugador1.resetJugador();
    jugador2.resetJugador();
}
function manoInicial(){
    game.jugadores.forEach(jugador=>{
        carta = game.pedirCarta(jugador)
        jugador.cartasEscogidas.push(carta);
        jugador.calcularValorMano();
    });
}

function manoInicialSingle(){
    game.jugadores.forEach(jugador=>{
        carta = game.pedirCarta(jugador)
        jugador.cartasEscogidas.push(carta);
        jugador.calcularValorMano();
        drawer.drawCard(jugador.cartasEscogidas[0],jugador);
        disableInterface();
    });
}

const pickOrStand = (validPlayer) => {
    return new Promise((resolve, reject) => {
        let pickACardID = `pickCard${validPlayer.display}`;
        let PICKACARD = document.getElementById(pickACardID);

        let standID = `stand${validPlayer.display}`;
        let STAND = document.getElementById(standID);

        let timeoutExpired = false; 

        const handleTimeout = () => {
            timeoutExpired = true; 
            validPlayer.valido = false; 
            resolve('timeout'); 
        };

        
        const timeout = setTimeout(handleTimeout, 5000);


        PICKACARD.addEventListener('click', function handleClick() {
            if (!timeoutExpired) { 
                clearTimeout(timeout); 
                PICKACARD.removeEventListener('click', handleClick); 
                try {
                    let carta = game.pedirCarta(validPlayer);
                    validPlayer.cartasEscogidas.push(carta);
                    validPlayer.calcularValorMano();
                    drawer.drawCard(carta, validPlayer);
                    MENSAJEINTERFAZ.innerHTML = `${validPlayer.nombre} ha cogido carta`;
                    resolve('pick'); 
                } catch (e) {
                    MENSAJEINTERFAZ.innerHTML = `Algo salió mal: ${e}`;
                    reject(e); 
                }
            }
        });

        STAND.addEventListener('click', function handleStandClick() {
            if (!timeoutExpired) { 
                clearTimeout(timeout); 
                STAND.removeEventListener('click', handleStandClick); 
                validPlayer.valido = false;
                resolve('stand'); 
            }
        });
    });
};

async function turnoSiguiente() {
    let validPlayers = game.jugadores.filter(jugador => jugador.valido === true);

    for (let validPlayer of validPlayers) {
        enableInterfacePlayer(validPlayer);
        drawer.playerTurn(validPlayer);
        let result = await pickOrStand(validPlayer);
        drawer.playerOffTurn(validPlayer);
        disableInterfacePlayer(validPlayer);

        if (result === 'timeout') {
            ganadorInstantaneo(); 
            return; 
        }
    }

    afterTurn(validPlayers);
    checkWinner(); 
}



function ganadorInstantaneo(){
    let ganador;
    game.jugadores.forEach(jugador=>{
        if (jugador.valido){
            jugador.victorias++;
            jugador.vencedor=true;
            ganador = jugador.nombre;
        }else{
            jugador.derrotas++;
        }
    })
    winnerInstant(ganador);
    disableInterface();
    game.guardarHistorial();  
}

function afterTurn(validPlayers){
    game.comprobarJugadores();
    drawer.resetPlayerTurn(validPlayers);
}

function checkWinner(){
    let playerWon = game.comprobarGanadorSingle();
    if (playerWon == null){
        turnoSiguiente();
    } else {
        game.comprobarGanadorSimulacion(jugador1,jugador2);
        winner(playerWon); 
        console.log(playerWon);
        disableInterface();
        game.guardarHistorial();  
    }
}

function winnerInstant(playerWon){
    try {
        MENSAJEINTERFAZ.innerHTML = playerWon +' ganó la partida' ;
    } catch (e) {console.log('something went wrong'+ e)}
}

function winner(playerWon){
    try {
        MENSAJEINTERFAZ.innerHTML = playerWon.nombre; ;
    } catch (e) {console.log('something went wrong'+ e)}
}

function disableInterfacePlayer(jugador){
    let divID = `pickCard${jugador.display}`;
    let divPICK = document.getElementById(divID);
    divPICK.style.pointerEvents = 'none';
    let divID2 = `stand${jugador.display}`;
    let divPICK2 = document.getElementById(divID2);
    divPICK2.style.pointerEvents = 'none';
}

function enableInterfacePlayer(jugador){
    let divID = `pickCard${jugador.display}`;
    let divPICK = document.getElementById(divID);
    divPICK.style.pointerEvents = 'auto';
    let divID2 = `stand${jugador.display}`;
    let divPICK2 = document.getElementById(divID2);
    divPICK2.style.pointerEvents = 'auto';
}

function disableInterface(){
    game.jugadores.forEach(jugador=>{
        let divID = `pickCard${jugador.display}`;
        let divPICK = document.getElementById(divID);
        divPICK.style.pointerEvents = 'none';
        let divID2 = `stand${jugador.display}`;
        let divPICK2 = document.getElementById(divID2);
        divPICK2.style.pointerEvents = 'none';
    })
}

function enableInterface(){
    game.jugadores.forEach(jugador=>{
        let divID = `pickCard${jugador.display}`;
        let divPICK = document.getElementById(divID);
        divPICK.style.pointerEvents = 'auto';
        let divID2 = `stand${jugador.display}`;
        let divPICK2 = document.getElementById(divID2);
        divPICK2.style.pointerEvents = 'auto';
    })
}