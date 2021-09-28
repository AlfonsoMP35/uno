//Constructor que crea el juego
//Contiene: Agregación de jugadores
//          Crearción de partidas
//          Unirse a partidas
//          Generar un código para la sala    
function Juego(){
    this.usuarios={}; //Array asociativo - Nick como campo único
    this.partidas={}; //Partidas como campo único

    this.agregarJugador=function(nick){
        if(!this.usuarios[nick]){
        var jugador = new Jugador(nick,this);
        this.usuarios[nick]=jugador;
        }
        else{
            console.log("El nick está en uso");
        }
    }

    this.crearPartida=function(nick,numJug){
        var codigo = "-1"; 
        var jugador = this.usuarios[nick];   
        codigo = this.obtenerCodigo();    
        while(this.partidas[codigo]){
            codigo = this.obtenerCodigo();
        };
        var partida = new Partida(codigo,jugador,numJug);
        this.partidas[codigo]=partida;

        return partida;
        
    }

    this.unirAPartida=function(codigo,nick){
        if(this.partidas[codigo]){
            var jugador=this.usuarios[nick];
            this.partidas[codigo].unirAPartida(jugador);
        }

    }
    
    this.obtenerCodigo=function(){
        let cadena="ABCDEFGHIJKLMNOPQRSTUVXYZ";
        let letras=cadena.split('');
        let maxCadena=cadena.length;
        let codigo=[];
         for(i=0;i<6;i++){
            codigo.push(letras[randomInt(1,maxCadena)-1]);
        }
        return codigo.join('');
     }   

     this.numeroPartidas=function(){
		return Object.keys(this.partidas).length;
	}

    function randomInt(low, high) {
        return Math.floor(Math.random() * (high - low) + low);
    }
    

}

//Constructor que identifica al jugador al crear una partida o al unirse a una
function Jugador(nick,juego){
    this.nick=nick;
    this.juego=juego;
    this.crearPartida=function(numJug){
       return this.juego.crearPartida(nick, numJug);
    }
    this.unirAPartida=function(codigo){
        this.juego.unirAPartida(codigo,nick);
    }
}

//Constructor que muestra el estado de partida creada
//Contiene: Número de jugadores
//          Función para unirse a la partida
//          Función que comprueba si se puede unir a la partida
function Partida(codigo,jugador,numJug){
    this.codigo=codigo;
    this.propietario=jugador.nick;
    this.numJug=numJug;
    this.jugadores={};
    this.fase=new Inicial();
    
    this.unirAPartida=function(jugador){
        this.fase.unirAPartida(this,jugador);
    }
    this.puedeUnirAPartida=function(jugador){
        this.jugadores[jugador.nick]=jugador;
    }

    this.numeroJugadores=function(){
		return Object.keys(this.jugadores).length;
	}


    this.unirAPartida(jugador);
}

//Constructor que indica el estado previo al comienzo de la partida (sala de espera)
function Inicial(){
    this.nombre="iniciar";
    this.unirAPartida=function(partida,jugador){
        //si numero jugadores < numJug
        partida.puedeUnirAPartida(jugador);
        if(partida.numeroJugadores()>=partida.numJug){
            partida.fase=new Jugando();
        }

    }
    this.esInicial=function(){
        return true;
    }

}

//Constructor que indica que los jugadores están jugando la partida (partida en curso)
function Jugando(){
    this.nombre="jugando";
    this.unirAPartida=function(partida,jugador){
        console.log("La partida ya ha comenzado");
    }

}

//Constructor que indica que la partida ha finalizado
function Final(){
    this.nombre="final";
    this.unirAPartida=function(partida,jugador){
        console.log("La partida ya ha terminado");
    }

}

//Constructor de la carta
function Carta(color, tipo){
    this.color=color;
    this.tipo=tipo;
    this.numero;







    
}