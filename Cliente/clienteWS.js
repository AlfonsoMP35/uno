function ClienteWS(){
    this.socket;
    this.nick;
    this.codigo;
    this.conectar=function(){
        this.socket=io(); 
        this.servidorWSCliente(); //Lanzamiento de la conexión local
    }

    this.crearPartida=function(num,nick){
        this.nick=nick;
        this.socket.emit("crearPartida",num,nick);

    }

    this.unirAPartida=function(codigo,nick){
        this.nick=nick;
        this.socket.emit("unirAPartida",codigo,nick);

    }

    this.manoInicial=function(){
        this.socket.emit("manoInicial",this.nick);
    }

    //Jugar carta
    this.jugarCarta=function(num){
        this.socket.emit("jugarCarta",this.nick,num)
    }

    //Robar carta
    this.robarCarta=function(num){
        this.socket.emit("robarCarta",this.nick,num)
    }

    //Pasar Turno
    this.pasarTurno=function(){
        this.socket.emit("pasarTurno",this.nick)
    }

    this.abandonarPartida=function(){
        this.socket.emit("abandonarPartida",this.nick);
    }

    this.cerrarSesion=function(){
        this.socket.emit("cerrarSesion",this.nick);
    }


    //servidor WS del cliente
    this.servidorWSCliente=function(){
        var cli=this;
        this.socket.on("connect",function(){
            console.log("Conectador al servidor WS");
        });

        //entrada para la respuesta del WS 
        this.socket.on("partidaCreada",function(data){
            console.log(data);
            cli.codigo=data.codigo;
            iu.mostrarCargando(data);
        });

        this.socket.on("unidoAPartida",function(data){
            console.log(data);
            cli.codigo=data.codigo;
            iu.mostrarCargando(data);
        });

        this.socket.on("pedirCartas",function(data){
            cli.manoInicial();
        });

        this.socket.on("mano",function(data){
            console.log(data);
            iu.mostrarMano();
        });

        this.socket.on("turno",function(data){
            console.log(data);
            iu.mostrarCartaActual(data.cartaActual);
        })

        this.socket.on("partidaEmpezada", function(data) {
            console.log(data)
            iu.mostrarTablero(data)
            iu.mostrarCartaActual(data)
        })

        this.socket.on("cartaJugada", function(data) {
            console.log(data)
            iu.mostrarCartaActual(data)
        })

        //Ganador
        this.socket.on("final",function(data){
            console.log(data);
            if (data.nick == this.nick){
                console.log("El jugador " +this.nick+ "ha ganado.")
            }
            
        });

        //Error
        this.socket.on("fallo",function(data){
            console.log(data);
        });

        this.socket.on("nuevaPartida",function(lista){
            if(!cli.codigo && cli.nick){
                iu.mostrarListadoPartidas(lista);
                }
        })
       
        this.socket.on("jugadorAbandona",function(){
            iu.mostrarModal("Un jugador abandona la partida.");

        })

        this.socket.on("usuarioEliminado",function(){
            cli.nick="";
            $.removeCookie("nick");
            iu.limpiar();
            iu.mostrarAgergarJugador();
        })

    }
    

    this.conectar();

}