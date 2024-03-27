class Jugador {

    constructor(nombre) {
        this.nombre = nombre;
        this.cartasEscogidas = [];
        this.sumaCartasActual = 0;
        this.valido = true;
        this.victorias = 0;
        this.derrotas = 0;
        this.empate = 0;
        this.vencedor=false;
        this.display = 0;
    }

    resetJugador(){
        this.cartasEscogidas = [];
        this.sumaCartasActual = 0;
        this.valido = true;
        this.vencedor = false;
    }
    resetEstadisticas(){
        this.victorias = 0;
        this.derrotas = 0;
        this.empate = 0;
    }

    calcularValorMano() {
        let valorTotal = 0;
        let ases = 0;
    
        for (let carta of this.cartasEscogidas) {
            if (carta.numero === 10 || carta.numero === 11 || carta.numero === 12) {
                valorTotal += 0.5;
            } else if (carta.numero === 1) {
                valorTotal += 1;
                ases++;
            } else {
                valorTotal += parseInt(carta.numero);
            }
        }
        while (valorTotal > 7.5 && ases > 0) {
            valorTotal -= 0.5;
            ases--;
        }
        this.sumaCartasActual = valorTotal;
        return valorTotal;
    }

    esValido() {
        return this.valido;
    }
}

export { Jugador };
