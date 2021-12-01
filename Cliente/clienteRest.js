function ClienteRest(){
    this.agregarJugador = function(nick){
        $.getJSON("/agregarJugador/"+nick, function(data){
            //se ejecuta cuando conteste el servidor
            console.log(data);
            if(data.nick =-1){
                ws.nick=data.nick;
                $.cookie("nick",data.nick);
                iu.mostrarControl(data);
               // if(data.#btnAJC){
                   // iu.mostrarCrearPartida();
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

    this.mostrarHome=function(data){
        //iu.mostrarControl(data,"1"); //Implementar
        iu.mostrarCrearPartida();
        rest.obtenerPartidasDisponibles();
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

    this.obtenerTodosResultados = function() {
        $.getJSON("/obtenerTodosResultados",function(data){
            console.log(data);
            //iu.mostrarListaResultados(data);
        });
    }

    this.obtenerResultados = function(nick) {
        $.getJSON("/obtenerResultados/"+nick,function(data){
            console.log(data);
            //iu.mostrarListaResultados(data);
        });
    }

    this.registrarUsuario=function(email,clave){
		$.ajax({
			type:'POST',
			url:'/registrarUsuario',
			data:{"email":email,"clave":clave},
			success:function(data){
				if (data.email){
					//mostrarLogin
					console.log(data.email);
				}
				else{
					console.log("No se ha podido registrar")
				}
			},
			//contentType:'application/json',
			dataType:'json'
		});
	}

    


}