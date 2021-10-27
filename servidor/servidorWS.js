function ServidorWS(){
    //Zona cliente del servidor WS
    this.enviarAlRemitente=function(socket,mensaje,datos){
        socket.emit(mensaje,datos);
    }
    this.enviarATodos=function(io,codigo,mensaje,datos){
        io.sockets.in(codigo).emit(mensaje,datos);
    }



    //Zona servidor del servidor WS
    this.lanzarServidorWS=function(io,juego){
        var cli=this; //This usado para no perder el contexto con llamadas callback
        io.on("connection",function(socket){
            console.log("Usuario conectado");

            socket.on("crearPartida",function(num,nick){
                var ju1=juego.usuarios[nick];
                var res={codigo:-1};
                var partida=ju1.crearPartida(num);
                console.log("Nueva partida de "+nick +" codigo: "+ju1.codigoPartida);
                res.codigo=ju1.codigoPartida;
                socket.join(res.codigo);
                cli.enviarAlRemitente(socket,"partidaCreada",res);
            });

			socket.on("unirAPartida",function(codigo,nick){
				var ju1=juego.usuarios[nick];
				var res={codigo:-1};
				ju1.unirAPartida(codigo);
				console.log("Jugador "+nick +" se une a partida codigo: "+ju1.codigoPartida);
				res.codigo=ju1.codigoPartida;
				if (res.codigo!=-1){
					socket.join(res.codigo);
					var partida=juego.partidas[codigo];
					cli.enviarAlRemitente(socket,"unidoAPartida",res);
					if (partida.fase.nombre=="jugando"){
						cli.enviarATodos(io,codigo,"pedirCartas",{});
					}
				}
				else{
					cli.enviarAlRemitente(socket,"fallo",res);	
				}
			});

            socket.on("manoInicial",function(nick){
                var ju1=juego.usuarios[nick];
                ju1.manoInicial();
                cli.enviarAlRemitente(socket,"mano",ju1.mano);
                var codigo= ju1.codigoPartida;
                var partida = juego.partidas[codigo];
                var nickTurno=partida.turno.nick;
                cli.enviarAlRemitente(io,codigo,"turno",{turno:nickTurno, cartaActual:partida.cartaActual});
            })

            //Me toca
            socket.on("meToca",function(nick){
                var partida=this.obtenerPartida(this.codigoPartida);
                partida.pasarTurno(this.nick);
                this.robar(1); 
                cli.enviarAlRemitente(socket,"meToca")

            });

            //Jugar carta
            socket.on("jugarCarta", function(nick,num){
                var ju1=juego.usuarios[nick];
                ju1.jugarCarta(num);
                cli.enviarAlRemitente(socket,"mano",ju1.mano);
                var codigo= ju1.codigoPartida;
                var partida = juego.partidas[codigo];
                var nickTurno=partida.turno.nick;
                cli.enviarAlRemitente(io,codigo,"turno",{turno:nickTurno, cartaActual:partida.cartaActual});

                if (partida.fase.nombre=="jugando"){
                    cli.enviarATodos(io,codigo,"final",{ganador:nickTurno});
                }

            });

            //Robar carta
            socket.on("robarCarta",function(){
                var ju1=juego.usuarios[nick];
                var partida=this.obtenerPartida(this.codigoPartida);
                var robadas=partida.dameCartas(1);
                ju1.mano=this.mano.concat(robadas);
                cli.enviarAlRemitente(socket,"toma",{mano: robadas})
            })

        })
    }
}




module.exports.ServidorWS=ServidorWS; //Exportarlo a otros achivos con el mismo nombre