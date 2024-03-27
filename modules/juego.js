class Juego{
    
    constructor(){
        this.historial = [];  
        this.id = this.crearId();
        this.jugadores = [];
        this.rachas;
        this.baraja = new Array(48).fill(0).map((carta,index)=>{
            return {
                "numero" : (index % 12) +1 ,
                "palo" : ['espadas','bastos','copas','oros'][Math.floor(index/12)],
                "activo" : true,
            }
        }).filter((item)=>{
            return item.numero !== 8 && item.numero !== 9
        });
    }

    crearId(){
        if (this.historial.length === 0) {
            return 1;
        } else {
            let ultimaPartida = this.historial[this.historial.length - 1];
            return ultimaPartida.id + 1; 
        }
    }
    pedirCarta(jugador) {
        if (jugador.valido) {
            let selectedBaraja = this.baraja.filter((carta) => carta.activo);
            let randomCarta = Math.floor(Math.random() * selectedBaraja.length);
            let cartaElegida = selectedBaraja[randomCarta];
            this.desactivarCarta(cartaElegida);
            return cartaElegida;
        }   
    }

    comprobarJugadores() {
        this.jugadores.filter(jugador => jugador.valido === true).forEach(jugador => {
            if (jugador.sumaCartasActual >= 7.5) jugador.valido = false;
        });
    }
    desactivarCarta(cartaElegida){
        let index = this.baraja.findIndex((carta) => 
        carta.numero === cartaElegida.numero && carta.palo === cartaElegida.palo);
        this.baraja[index].activo = false;
    }

    comprobarGanadorSimulacion(jugador1,jugador2) {
    
        if (jugador1.sumaCartasActual > jugador2.sumaCartasActual && jugador1.sumaCartasActual <= 7.5 || jugador2.sumaCartasActual > 7.5) {
            jugador1.victorias++;
            jugador2.derrotas++;
            jugador1.vencedor = true;
        }
        else if (jugador2.sumaCartasActual >jugador1.sumaCartasActual && jugador2.sumaCartasActual <= 7.5 || jugador1.sumaCartasActual >7.5) {
            jugador2.victorias++;
            jugador1.derrotas++;
            jugador2.vencedor = true;
        } else if (jugador1.sumaCartasActual === jugador2.sumaCartasActual){
            jugador1.empate++;
            jugador2.empate++;
        }        
    }

    comprobarGanadorSingle() {
        console.log(this.jugadores);
        if (!this.jugadores.find(jugador => jugador.valido == true)){
            let validjugadores = this.jugadores.filter(jugador => jugador.sumaCartasActual <= 7.5);
    
            if (validjugadores.length > 0) {
                let maxScoreJugador = validjugadores.reduce((maxjugador, currentjugador) => {
                    if (currentjugador.sumaCartasActual > maxjugador.sumaCartasActual) {
                        return currentjugador;
                    } else if (currentjugador.sumaCartasActual === maxjugador.sumaCartasActual && currentjugador !== maxjugador) {
                        return { nombre: 'Nadie' };
                    }
                    return maxjugador;
                }, validjugadores[0]);
                let currentNombre = maxScoreJugador.nombre;
                let newNombre = currentNombre + ' gano la partida';
                Reflect.set(maxScoreJugador,'name', newNombre);
                console.log(maxScoreJugador);
                return maxScoreJugador;
            } else {
                return { nombre : 'Todos los jugadores perdieron'};
            }
        }
        return null;
    }

    resetGame(){
        this.baraja.forEach(carta => {
            carta.activo = true;
        });
        this.jugadores.forEach(jugador=>{
            jugador.resetJugador();
        }) 
        this.id = this.crearId();
        this.rachas=null;
    }
    
    borrarHistorial(){
        this.historial = [];
        this.rachas = null;
    }
    guardarHistorial(){
        let partida = {
            'id': this.id,
            jugadores: [
                { ...this.jugadores[0] }, 
                { ...this.jugadores[1] }  
            ]
        };
        this.historial.push(partida);
    }
    racha() {
        let mejorRachaJugador1 = 0;
        let mejorRachaJugador2 = 0;
        let rachaActualJugador1 = 0;
        let rachaActualJugador2 = 0;
        let mejorRachaDerrotaJugador1 = 0;
        let mejorRachaDerrotaJugador2 = 0;
        let rachaActualDerrotaJugador1 = 0;
        let rachaActualDerrotaJugador2 = 0;
    
        this.historial.forEach(ronda => {
            let jugador1 = ronda.jugadores[0];
            let jugador2 = ronda.jugadores[1];
    
            if (jugador1.vencedor) {
                rachaActualJugador1++;
                rachaActualJugador2 = 0;
            } else if (jugador2.vencedor) {
                rachaActualJugador2++;
                rachaActualJugador1 = 0;
            } else {
                rachaActualJugador1 = 0;
                rachaActualJugador2 = 0;
            }
    
            if (rachaActualJugador1 > mejorRachaJugador1) {
                mejorRachaJugador1 = rachaActualJugador1;
            }
    
            if (rachaActualJugador2 > mejorRachaJugador2) {
                mejorRachaJugador2 = rachaActualJugador2;
            }
    
            if (!jugador1.vencedor) {
                rachaActualDerrotaJugador1++;
                rachaActualDerrotaJugador2 = 0;
            } else if (!jugador2.vencedor) {
                rachaActualDerrotaJugador2++;
                rachaActualDerrotaJugador1 = 0;
            } else {
                rachaActualDerrotaJugador1 = 0;
                rachaActualDerrotaJugador2 = 0;
            }
    
            if (rachaActualDerrotaJugador1 > mejorRachaDerrotaJugador1) {
                mejorRachaDerrotaJugador1 = rachaActualDerrotaJugador1;
            }
    
            if (rachaActualDerrotaJugador2 > mejorRachaDerrotaJugador2) {
                mejorRachaDerrotaJugador2 = rachaActualDerrotaJugador2;
            }
        }); 
    
        this.rachas = {
            victorias: {
                jugador1: mejorRachaJugador1,
                jugador2: mejorRachaJugador2
            },
            derrotas: {
                jugador1: mejorRachaDerrotaJugador1,
                jugador2: mejorRachaDerrotaJugador2
            }
        };
    }   
}

export {Juego};