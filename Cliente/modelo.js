function Juego(){
    this.usuarios={}; //Array asociativo - Nick como campo único
    this.partidas={};

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

    function randomInt(low, high) {
        return Math.floor(Math.random() * (high - low) + low);
    }
    

}

function Jugador(nick,juego){
    this.nick=nick;
    this.juego=juego;
    this.crearPartida=function(numJug){
        this.juego.crearPartida(nick, numJug);
    }
    this.unirAPartida=function(codigo){
        this.juego.unirAPartida(codigo,nick);
    }
}

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

function Inicial(){
    this.unirAPartida=function(partida,jugador){
        //si numero jugadores < numJug
        partida.puedeUnirAPartida(jugador);
        if(partida.numeroJugadores>=partida.numJug){
            partida.fase=new Jugando();
        }

    }

}

function Jugando(){
    this.unirAPartida=function(partida,jugador){
        console.log("La partida ya ha comenzado");
    }

}

function Final(){
    this.unirAPartida=function(partida,jugador){
        console.log("La partida ya ha terminado");
    }

}

function Carta(color, tipo){
    this.color=color;
    this.tipo=tipo;
    this.numero;
}