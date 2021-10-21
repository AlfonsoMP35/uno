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

            socket.on("unirApartida",function(codigo,nick){
                var ju2 = juego.usuarios[nick];
                var res = {nick:-1};
                res=ju2.unirAPartida(code,nick);
                console.log("Jugador "+nick+ " se ha unido a la partida.");		
                res.codigo=ju2.codigoPartida;
                if(res.codigo != -1){
                    socket.join(res.codigo);
                    cli.enviarAlRemitente(socket,"unidoAPartida",res);
                    if(partida.fase.nombre="jugando"){
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
            })

        })
    }
}




module.exports.ServidorWS=ServidorWS; //Exportarlo a otros achivos con el mismo nombre