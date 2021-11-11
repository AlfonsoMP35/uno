function ClienteRest(){
    this.agregarJugador = function(nick){
        $.getJSON("/agregarJugador/"+nick, function(data){
            //se ejecuta cuando conteste el servidor
            console.log(data);
            if(data.nick =-1){
                ws.nick=data.nick;
               // if(data.#btnAJC){
                    iu.mostrarCrearPartida();
                /*}else if (data.#btnAJU){
                    iu.mostrarListaPartidas();
                }*/
               // cli.obtenerTodasPartidas();
            }else{
                iu.mostrarModal("El nick "+nick+" esta en uso.");
                iu.mostrarUnirAPartida();
            }

        });

    }

	this.crearPartida=function(num,nick){
		$.getJSON("/crearPartida/"+num+"/"+nick,function(data){
			console.log(data);
		})


	}


    //unir a partida
    this.unirAPartida = function(code,nick){
        $.getJSON("/unirAPartida/"+code+"/"+nick, function(data){
            //se ejecuta cuando conteste el servidor
            console.log(data);


        });

    }

    //obtener lista de partidas
    this.obtenerTodasPartidas=function(){
		$.getJSON("/obtenerTodasPartidas",function(data){
			console.log(data);
		})

        
	}

    this.obtenerPartidasDisponibles = function () {
        $.getJSON("/obtenerPartidasDisponibles",function(data){
            console.log(data);
            iu.mostrarPartidas(data);
        });
    }

    this.robarCarta = function (nick,num) {
        $.getJSON("/robarCarta/"+nick+"/"+num,function(data){
            console.log(data);
        });

    }

    this.dameCartas = function (nick,num) {
        $.getJSON("/dameCartas/"+nick+"/"+num,function(data){
            console.log(data);
        });
    }

    this.mostrarJuego = function(){
        $.getJSON("/mostrarJuego",function(data){
            console.log(data);
        });
    }
}