function Juego(){
    this.usuarios={};
    this.partidas={};

    this.agregarJugador=function(nick){
       var res = {nick:-1};
        if (!this.usuarios[nick]){
            var jugador= new Jugador(nick,this);
            this.usuarios[nick]=jugador;
            res = {nick:nick};
        }
        else{
            console.log("El nick está en uso");
        }
        return res;
    }

    this.crearPartida=function(nick,numJug){
        var codigo="patata";
        var jugador=this.usuarios[nick];
        codigo=this.obtenerCodigo();
        while (this.partidas[codigo]){
            codigo=this.obtenerCodigo();
        };
        var partida=new Partida(codigo,jugador,numJug);
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
        var res = -1;
        if (this.partidas[codigo]){
            var jugador=this.usuarios[nick];
            this.partidas[codigo].unirAPartida(jugador);
            res = {codigo:codigo}
        }
        return res;
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


function Jugador(nick,juego){
    this.nick=nick;
    this.juego=juego;
    this.mano=[];
    this.codigoPartida;
    this.puntos=0;
    this.crearPartida=function(numJug){
        return this.juego.crearPartida(nick,numJug);
    }
    this.unirAPartida=function(codigo){
        return this.juego.unirAPartida(codigo,nick);    
    }
    this.robar=function(num){
        var numRobadas=0;
        var partida=this.obtenerPartida(this.codigoPartida);
        if(partida.turno.nick == this.nick && partida.fase.nombre=="jugando"){
            var robadas=partida.dameCartas(num);
            if(robadas.length<=0){
                this.pasarTurno(this.nick);
            }else{
                this.mano=this.mano.concat(robadas);
                numRobadas=robadas.length;
            }
        }
        return numRobadas;
    }

    this.manoInicial=function(){
        var partida=this.obtenerPartida(this.codigoPartida);
        this.mano=partida.dameCartas(3);
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

function Partida(codigo,jugador,numJug){
    this.codigo=codigo;
    this.mazo=[];
    this.propietario=jugador.nick;
    this.numJug=numJug;
    this.jugadores={};
    this.fase=new Inicial();
    this.ordenTurno=[];
    this.direccion=new Derecha();
    this.turno;
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
        var colores=["azul","amarillo","verde","rojo"];
        for (i=0;i<colores.length;i++){
            this.mazo.push(new Numero(0,colores[i]));
        }
        for(j=0;j<colores.length;j++){
            for (i=1;i<5;i++){
                this.mazo.push(new Numero(i,colores[j]));
                //this.mazo.push(new Numero(i,colores[j]));
            }
        }
        for(j=0;j<colores.length;j++){
            this.mazo.push(new Cambio(20,colores[j]));
            //this.mazo.push(new Cambio(20,colores[j]));
        }
        // for(j=0;j<colores.length;j++){
        //     this.mazo.push(new Bloqueo(20,colores[j]));
        //     this.mazo.push(new Bloqueo(20,colores[j]));
        // }
        // for(j=0;j<colores.length;j++){
        //     this.mazo.push(new Mas2(20,colores[j]));
        //     this.mazo.push(new Mas2(20,colores[j]));
        // }
        // for (i=1;i<5;i++){
        //     this.mazo.push(new Comodin(20));
        //     this.mazo.push(new Comodin4(20));
        // }
    };

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
        if(this.mazo.length<num){
            this.mazo=this.mazo.concat(this.mesa);
           // this.mazo.push(this.cartaActual);
            this.mesa=[];
        }
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
} //fin objeto Partida


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
function Jugando(){
    this.nombre="jugando";
    this.unirAPartida=function(partida,jugador){
        console.log("La partida ya ha comenzado");
        jugador.codigoPartida=-1;
    }
    this.jugarCarta=function(carta,nick,partida){
        partida.puedeJugarCarta(carta,nick);
    }
    this.pasarTurno=function(nick,partida){
        partida.puedePasarTurno(nick);
    }
}
function Final(){
    this.nombre="final";
    this.unirAPartida=function(partida,jugador){
        console.log("La partida ha terminado");
        jugador.codigoPartida=-1;
    }
    this.jugarCarta=function(carta,nick,partida){
        console.log("La partida ya ha terminado");
    }
    this.pasarTurno=function(nick,partida){
        console.log("La partida ha terminado");
    }
}

function Numero(valor,color){
    this.tipo="numero";
    this.color=color;
    this.valor=valor;
    this.nombre="numero"+valor;
    this.comprobarEfecto=function(partida){
        console.log("No hay efectos");
    }
}

function Cambio(valor,color){
    this.tipo="cambio";
    this.nombre="cambio"+color;
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


/*var juego,partida,ju1,ju2,ju3;

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
}*/

module.exports.Juego=Juego;