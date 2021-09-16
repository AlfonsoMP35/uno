function Juego(){
    this.jugadores={};

    this.agregarJugador=function(nick){
        if(!this.jugadores[nick]){
        var jugador = new Jugador(nick);
        this.jugadores[nick]=jugador;
        }
    }
}

function Jugador(nick){
    this.nick=nick;
}

function Partida(nombre){
    this.nombre=nombre;
}

function Carta(color, tipo){
    this.color=color;
    this.tipo=tipo;
    this.numero;
}