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

    
    this.obtenerTodasPartidas=function(){
        var lista=[];

        for(each in this.partidas){
            var partida=this.partidas[each];
            lista.push({propietario:partida.propietario,codigo:each})
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

}

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

//Objeto que identifica al jugador al crear una partida o al unirse a una
function Jugador(nick,juego){
    this.nick=nick;
    this.juego=juego;
    this.mano=[];
    this.codigoPartida;
    this.puntos=0;
    this.crearPartida=function(numJug){
       return this.juego.crearPartida(nick, numJug);
    }
    this.unirAPartida=function(codigo){
        this.juego.unirAPartida(codigo,nick);
    }

    this.robar=function(num){
        var partida=this.obtenerPartida(this.codigoPartida);
        var robadas=partida.dameCartas(num);
       // var tmp = this.mano;
        this.mano=tmp.concat(robadas);
    }
    this.manoInicial=function(){
        var partida=this.obtenerPartida(this.codigoPartida);
        this.mano=partida.dameCartas(7);
    }
    this.obtenerPartida=function(codigo){
        return this.juego.partidas[codigo];
    }

    this.pasarTurno=function(){
        var partida=this.obtenerPartida(this.codigoPartida);
        partida.pasarTurno(this.nick);
        this.robar(1);
    }
    this.jugarCarta=function(num){
        var carta=this.mano[num];
        var partida=this.obtenerPartida(this.codigoPartida);
        partida.jugarCarta(carta,this.nick);
    }
    this.quitarCarta=function(carta){
        var partida=this.obtenerPartida(this.codigoPartida);
        var indice=this.mano.indexOf(carta);
        this.mano.splice(indice,1);
        if (this.mano.length<=0){
            partida.finPartida();
        }
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
    this.direccion=new Derecha(); //Sentido agujas reloj

    this.ordenTurno=[];
    this.mazo=[];
    this.mesa=[];
    this.cartaActual;
    
    this.unirAPartida=function(jugador){
        this.fase.unirAPartida(this,jugador);
    }
    this.puedeUnirAPartida=function(jugador){
        this.jugadores[jugador.nick]=jugador;
        jugador.codigoPartida=this.codigo;
        this.ordenTurno.push(jugador.nick);
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
                 this.mazo.push(new Mas2(20,colores[i]));
            }           
        }

        //Cartas bloqueo
            for(x=0;x<2;x++){
                for(i=0; i<colores.length;i++){
                     this.mazo.push(new Bloqueo(20,colores[i]));
                }           
            }

        //Cartas Reversa/Cambio de sentido
        for(x=0;x<2;x++){
            for(i=0; i<colores.length;i++){
                 this.mazo.push(new Cambio(20,colores[i]));
            }           
        }

        //Cartas Comodin y Comodin +4
        for(i=0;i<4;i++){
            this.mazo.push(new Comodin(50));   
            this.mazo.push(new Comodin4(50));        
        }

    }

    this.asignarUnaCarta=function(){
        var maxCartas = this.mazo.length;
        var indice = randomInt(1,maxCartas)-1;
        var carta=this.mazo.splice(indice,1);
        return carta[0];
    }

    
    this.dameCartas=function(num){
        var cartas=[];
        for(i=0;i<num;i++){
            var carta=this.asignarUnaCarta();
            if (carta){
                cartas.push(carta);
            }
        }
        return cartas;
    }


     //Carta inicial para comenzar a jugar
     this.cartaInicial=function(){                   
        this.mesa.push(this.asignarUnaCarta());
    }

    this.puedePasarTurno=function(nick){
        if (nick==this.turno.nick){
            this.direccion.pasarTurno(this)
        }
    }

   /* this.pasarTurno = function(nickJugador){
        var nick = this.turno.nick;
        if(nick=nickJugador){
            if(sentido == false){
            var indice=this.ordenTurno.indexOf(nick);
            var siguiente=(indice+1)%(Object.keys(this.jugadores).length);
            this.turno=this.jugadores[this.ordenTurno[siguiente]];
            } else{
                var indice=this.ordenTurno.indexOf(nick);
                var siguiente=(indice-1)%(Object.keys(this.jugadores).length);
                this.turno=this.jugadores[this.ordenTurno[siguiente]]; 
            }
        }
    }*/

      /*  //Función para jugar una carta del mazo del jugador
        this.usarCarta=function(carta){                  
            var jugada = this.jugador.mano.splice(carta,1);
            this.mesa.push(jugada);
        }
    
        //Comprobación de si se puede usar la carta
        this.jugarCarta=function(carta){                    
            var cartasig = this.mesa[this.mesa.length-1];       
            if (cartasig == Numero){
                if ((cartasig.color == carta.color) || (cartasig.valor == carta.valor)) {
                    this.ponerEnJuego(carta);
                }
            }
            else if (cartasig == Mas2){
                if ((cartasig.color == carta.color) || (carta == Mas2)) {
                    this.ponerEnJuego(carta);
                }
            }
            else if (cartasig == Bloqueo){
                if ((cartasig.color == carta.color) || (carta == Bloqueo)) {
                    this.ponerEnJuego(carta);
                }
            }
            else if (cartasig == Cambio){
                if ((cartasig.color == carta.color) || (carta == Cambio)) {
                    this.ponerEnJuego(carta);
                    this.listaJugadores.reverse();              
                }
            }
            else if ((carta == Comodin) || (carta == Comodin4)){
                this.ponerEnJuego(carta);
             }
            else {
                console.log("Jugada no valida.");  //cambiar a que se muestre en pantalla más adelante
            }
        }*/

        this.asignarUnaCarta=function(){
            var maxCartas=this.mazo.length;
            var res;
            if (maxCartas>0){
                var indice=randomInt(1,maxCartas)-1;
                var carta=this.mazo.splice(indice,1);
                res=carta[0];
            }
            return res;
        }
        this.dameCartas=function(num){
            var cartas=[];
            for(i=0;i<num;i++){
                var carta=this.asignarUnaCarta();
                if (carta){
                    cartas.push(carta);
                }
            }
            return cartas;
        }
        this.pasarTurno=function(nick){
            this.fase.pasarTurno(nick,this);
        }
        this.puedePasarTurno=function(nick){
            if (nick==this.turno.nick){
                this.direccion.pasarTurno(this)
            }
        }
        this.asignarTurno=function(){
            var nick=this.ordenTurno[0];
            this.turno=this.jugadores[nick];
        }
        this.jugarCarta=function(carta,nick){
            this.fase.jugarCarta(carta,nick,this);
        }
        this.puedeJugarCarta=function(carta,nick){
            if (nick==this.turno.nick){
                if (this.comprobarCarta(carta)){
                    carta.comprobarEfecto(this);
                    this.cambiarCartaActual(carta);
                    this.turno.quitarCarta(carta);
                    this.pasarTurno(nick);                
                }
            }
        }
        this.cambiarCartaActual=function(carta){
            this.mesa.push(this.cartaActual);
            this.cartaActual=carta;  
        }
        this.comprobarCarta=function(carta){
            //comprobar que la carta que se puede jugar la carta, según la que hay en la mesa
            return (this.cartaActual.tipo=="numero" && (this.cartaActual.color==carta.color || this.cartaActual.valor==carta.valor)
                || this.cartaActual.tipo=="cambio" && (this.cartaActual.color==carta.color || this.cartaActual.tipo == carta.tipo))
        }
        this.cartaInicial=function(){
            this.cartaActual=this.asignarUnaCarta();
        }
        this.cambiarDireccion=function(){
            if (this.direccion.nombre=="derecha"){
                this.direccion=new Izquierda();
            }
            else{
                this.direccion=new Derecha();
            }
        }
        this.finPartida=function(){
            this.fase=new Final();
            this.calcularPuntos()
        }
        this.calcularPuntos=function(){
            var suma=0;
            for(var jug in this.jugadores){
                for(i=0;i<this.jugadores[jug].mano.length;i++){
                    suma=suma+this.jugadores[jug].mano[i].valor;
                }
            }
            this.turno.puntos=suma;
        }
    
        this.crearMazo();
        this.unirAPartida(jugador);

    this.crearMazo();
    this.unirAPartida(jugador);

}//fin objeto Partida

function Derecha(){
    this.nombre="derecha";
    this.pasarTurno=function(partida){
        //ver el nick del que tiene el turno
        //calcular el indice en el array ordenTurno
        //sumarle 1 al indice MOD longitud del array
        //asignarle el turno al nuevo jugador
        var nick=partida.turno.nick;            
        var indice=partida.ordenTurno.indexOf(nick);            
        var siguiente=(indice+1)%(Object.keys(partida.jugadores).length);
        partida.turno=partida.jugadores[partida.ordenTurno[siguiente]];
    }
}

function Izquierda(){
    this.nombre="izquierda";
    this.pasarTurno=function(partida){
        var nick=partida.turno.nick;            
        var indice=partida.ordenTurno.indexOf(nick);            
        var siguiente=(indice-1)%(Object.keys(partida.jugadores).length);
        if (siguiente<0) {siguiente=Object.keys(partida.jugadores).length-1}
        partida.turno=partida.jugadores[partida.ordenTurno[siguiente]];
    }
}

//Objeto que indica el estado previo al comienzo de la partida (sala de espera)
function Inicial(){
    this.nombre="inicial";
    this.unirAPartida=function(partida,jugador){
        partida.puedeUnirAPartida(jugador);
        if (partida.numeroJugadores()==partida.numJug){
            partida.fase=new Jugando();
            partida.asignarTurno();
            partida.cartaInicial();
        }
    }
    this.jugarCarta=function(carta,nick,partida){
        console.log("La partida no ha comenzado");
    }
    this.pasarTurno=function(nick,partida){
        console.log("La partida no ha comenzado");
    }
}

//Objeto que indica que los jugadores están jugando la partida (partida en curso)
function Jugando(){
    this.nombre="jugando";
    this.unirAPartida=function(partida,jugador){
        console.log("La partida ya ha comenzado");
    }
    this.jugarCarta=function(carta,nick,partida){
        partida.puedeJugarCarta(carta,nick);
    }
    this.pasarTurno=function(nick,partida){
        partida.puedePasarTurno(nick);
    }
}

//Objeto que indica que la partida ha finalizado
function Final(){
    this.nombre="final";
    this.unirAPartida=function(partida,jugador){
        console.log("La partida ha terminado");
    }
    this.jugarCarta=function(carta,nick,partida){
        console.log("La partida ya ha terminado");
    }
    this.pasarTurno=function(nick,partida){
        console.log("La partida ha terminado");
    }
}

//Constructores de los tipos de cartas
function Numero(valor,color){
    this.tipo="numero";
    this.color=color;
    this.valor=valor;
    this.comprobarEfecto=function(partida){
        console.log("No hay efectos");
    }
}

function Cambio(valor,color){
    this.tipo="cambio";
    this.color=color;
    this.valor=valor;   
    this.comprobarEfecto=function(partida){
        partida.cambiarDireccion();
    }
}

function Bloqueo(valor,color){
    this.tipo="bloqueo";
    this.color=color;
    this.valor=valor;
    this.comprobarEfecto=function(partida){
        
    }    
}

function Mas2(valor,color){
    this.tipo="mas2";
    this.color=color;
    this.valor=valor;    
    this.comprobarEfecto=function(partida){
        
    }
}

function Comodin(valor){
    this.tipo="comodin";
    this.valor=valor;
    this.comprobarEfecto=function(partida){
        
    }
}

function Comodin4(valor){
    this.tipo="comodin4";
    this.valor=valor;
    this.comprobarEfecto=function(partida){
        
    }
}
function Prueba(){
    juego =new Juego();
    juego.agregarJugador("ana");
    ju1=juego.usuarios["ana"];
    ju1.crearPartida(3);
    juego.agregarJugador("pepe");
    ju2=juego.usuarios["pepe"];
    ju2.unirAPartida(ju1.codigoPartida);
    juego.agregarJugador("luis");
    ju3=juego.usuarios["luis"];
    ju3.unirAPartida(ju1.codigoPartida);
    partida=juego.partidas[ju1.codigoPartida];
    ju1.manoInicial();
    ju2.manoInicial();
    ju3.manoInicial();
    //partida.cartaInicial();
}


