//Objeto que crea el juego
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

    //ERROR DETECTADO
    this.obtenerTodasPartidas=function(){
        var lista=[];

        for(each in this.partidas){
            var partida=this.partidas[each];
            lista.push({propietario:partida.propietario,codigo:each});
        }

        return lista;
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
        //return Date.now().toString();
     }   

     this.numeroPartidas=function(){
		return Object.keys(this.partidas).length;
	}

    function randomInt(low, high) {
        return Math.floor(Math.random() * (high - low) + low);
    }
    

}

//Objeto que identifica al jugador al crear una partida o al unirse a una
function Jugador(nick,juego){
    this.nick=nick;
    this.juego=juego;
    this.mano=[];
    this.codigoPartida;
    this.crearPartida=function(numJug){
       return this.juego.crearPartida(nick, numJug);
    }
    this.unirAPartida=function(codigo){
        this.juego.unirAPartida(codigo,nick);
    }

    this.robar=function(num){
        var partida=this.obtenerPartida(this.codigoPartida);
        var robadas=partida.dameCartas(num);
        var tmp = this.mano;
        this.mano=tmp.concat(robadas);
    }
    this.manoInicial=function(){
        var partida=this.obtenerPartida(this.codigoPartida);
        this.mano=partida.dameCartas(7);
    }
    this.obtenerPartida=function(codigo){
        return this.juego.partidas[codigo];
    }


}

//Objeto que muestra el estado de partida creada
//Contiene: Número de jugadores
//          Función para unirse a la partida
//          Función que comprueba si se puede unir a la partida
function Partida(codigo,jugador,numJug){

    this.codigo=codigo;
    this.propietario=jugador.nick;
    this.numJug=numJug;
    this.jugadores={};
    this.fase=new Inicial();


    this.mazo=[];
    this.rojo=[];
    this.amarillo=[];
    this.azul=[];
    this.verde=[];
    this.comodin=[];
    this.comodin4=[];
    
    this.unirAPartida=function(jugador){
        this.fase.unirAPartida(this,jugador);
    }
    this.puedeUnirAPartida=function(jugador){
        this.jugadores[jugador.nick]=jugador;
        jugador.codigoPartida=this.codigo;
    }

    this.numeroJugadores=function(){
		return Object.keys(this.jugadores).length;
	}

    this.crearMazo=function(){
        var colores=["azul","amarillo","rojo","verde"];

        //Cartas 0
        for(i=0; i<colores.length;i++){
            this.mazo.push(new Numero(0,colores[i]));
        }

        //Cartas numericas 1-9
        for(j=1;j<10;j++){
            for(i=0; i<colores.length;i++){
                this.mazo.push(new Numero(j,colores[i]));
                this.mazo.push(new Numero(j,colores[i]));
            }
        }

        //Cartas +2
        for(x=0;x<2;x++){
            for(i=0; i<colores.length;i++){
                 this.mazo.push(new Numero(20,colores[i]));
            }           
        }

        //Cartas bloqueo
            for(x=0;x<2;x++){
                for(i=0; i<colores.length;i++){
                     this.mazo.push(new Numero(20,colores[i]));
                }           
            }

        //Cartas Reversa/Cambio de sentido
        for(x=0;x<2;x++){
            for(i=0; i<colores.length;i++){
                 this.mazo.push(new Numero(20,colores[i]));
            }           
        }

        //Cartas Comodin
        for(i=0;i<4;i++){
            this.mazo.push(new Numero(50,"comodin"));         
        }

         //Cartas Comodin+4
         for(i=0;i<4;i++){
            this.mazo.push(new Numero(50,"comodin4"));         
        }

    }


    this.asignarUnaCarta=function(){
        var maxCartas = this.mazo.length;
        var indice = randomInt(1,maxCartas);
        var carta=this.mazo.slice(indice,1);
    }

    
    this.dameCartas=function(num){
        var cartas=[];
        for(i=0; i<num; i++){
            cartas.push(this.asignarUnaCarta());
        }
        return cartas;
    }

     
    this.crearMazo();
    //this.dameCartas();
    this.unirAPartida(jugador);


   
    


}

//Objeto que indica el estado previo al comienzo de la partida (sala de espera)
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

//Objeto que indica que los jugadores están jugando la partida (partida en curso)
function Jugando(){
    this.nombre="jugando";
    this.unirAPartida=function(partida,jugador){
        console.log("La partida ya ha comenzado");
    }

}

//Objeto que indica que la partida ha finalizado
function Final(){
    this.nombre="final";
    this.unirAPartida=function(partida,jugador){
        console.log("La partida ya ha terminado");
    }

}

//Objeto de la carta
function Numero(valor, color){
    this.color=color;
    this.valor=valor;
    
}