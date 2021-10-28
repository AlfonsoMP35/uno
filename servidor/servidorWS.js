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
                if (ju1){
                    var res={codigo:-1};
                    var partida=ju1.crearPartida(num);
                    if(partida){
                        console.log("Nueva partida de "+nick +" codigo: "+ju1.codigoPartida);
                        res.codigo=ju1.codigoPartida;
                        socket.join(res.codigo);
                        cli.enviarAlRemitente(socket,"partidaCreada",res);
                    }else{
                        cli.enviarAlRemitente(socket,"fallo","La partida no existe.")
                    }
                }else{
                    cli.enviarAlRemitente(socket,"fallo","El usuario no existe.")
                }
            });

			socket.on("unirAPartida",function(codigo,nick){
				var ju1=juego.usuarios[nick];
				var res={codigo:-1};
                var partida= juego.partidas[codigo];
                if(ju1 && partida){
                    ju1.unirAPartida(codigo);   
                    res.codigo=ju1.codigoPartida;
                    if (res.codigo!=-1){
                        socket.join(res.codigo);
                        var partida=juego.partidas[codigo];
                        cli.enviarAlRemitente(socket,"unidoAPartida",res);
                        if (partida.fase.nombre=="jugando"){
                            cli.enviarATodos(io,codigo,"pedirCartas",{});
                        }
                        }else{
                            cli.enviarAlRemitente(socket,"fallo",res);	
                        }
                }else{
                    cli.enviarAlRemitente(socket,"fallo","El usuario o la partida no existen.")
                }
			});

            socket.on("manoInicial",function(nick){
				var ju1=juego.usuarios[nick];
				ju1.manoInicial();
				cli.enviarAlRemitente(socket,"mano",ju1.mano);
				var codigo=ju1.codigoPartida;
				var partida=juego.partidas[codigo];
				var nickTurno=partida.turno.nick;
				cli.enviarAlRemitente(socket,"turno",{"turno":nickTurno,"cartaActual":partida.cartaActual});
			});


            //Jugar carta
			socket.on("jugarCarta",function(nick,num){
				var ju1=juego.usuarios[nick];
				ju1.jugarCarta(num);
				cli.enviarAlRemitente(socket,"mano",ju1.mano);
				var codigo=ju1.codigoPartida;
				var partida=juego.partidas[codigo];
				var nickTurno=partida.turno.nick;
				cli.enviarAlRemitente(socket,"turno",{"turno":nickTurno,"cartaActual":partida.cartaActual});
				if (partida.fase.nombre=="final"){
						cli.enviarATodos(io,codigo,"final",{"ganador":nickTurno});
				}				
			});

            //Robar carta
            socket.on("robarCarta",function(nick,num){
                var ju1 = juego.usuarios[nick];
                if(ju1){
                    var robada =ju1.robar(num);
                    var codigo=ju1.codigoPartida;
				    var partida=juego.partidas[codigo];
				    var nickTurno=partida.turno.nick;
                    cli.enviarATodos(io,codigo,"turno",{carta:robada})
                }else{
                    cli.enviarAlRemitente(socket,"turno",{turno:partida.turno.nick});
                }
            })

            socket.on("pasarTurno",function(nick){
                var ju1 = juego.usuarios[nick];
                if(ju1){
                    ju1.pasarTurno();
                    var codigo=ju1.codigoPartida;
				    var partida=juego.partidas[codigo];
				    var nickTurno=partida.turno.nick;
                    cli.enviarATodos(io,codigo,"turno",{turno:nickTurno})
                }else{
                    cli.enviarAlRemitente(socket,"turno",{turno:nickTurno});
                }
            });

        })
    }
}




module.exports.ServidorWS=ServidorWS; //Exportarlo a otros achivos con el mismo nombre