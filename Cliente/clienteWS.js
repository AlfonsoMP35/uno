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

   /* this.meToca=function(){
        this.socket.emit("meToca",this.nick);
    } */

    //Jugar carta
    this.jugarCarta=function(num){
        this.socket.emit("jugarCarta",this.nick,num)
    }

    //Robar carta
    this.roba=function(){
        this.socket.emit("roba",this.nick)
    }



    //servidor WS del cliente
    this.servidorWSCliente=function(){
        var cli=this;
        this.socket.on("connect",function(){
            console.log("Conectador al servidor WS");
        });

        //entrada para la respuesta del WS              //BUSCAR EL ERROR GENERADO
        this.socket.on("partidaCreada",function(data){
            console.log(data);
            cli.codigo=data.codigo;
        });

        this.socket.on("unidoAPartida",function(data){
            console.log(data);
            cli.codigo=data.codigo;
        });

        this.socket.on("pedirCartas",function(data){
            cli.manoInicial();
        });

        this.socket.on("mano",function(data){
            console.log(data);
            //cli.meToca();
        });
        this.socket.on("turno",function(data){
            console.log(data);
            //cli.meToca();
        })

        //Jugar carta
        this.socket.on("jugar",function(data){
            console.log(data);
            cli.jugarCarta();
            
        });

        //Robar carta
        this.socket.on("robarCarta",function(data){
            console.log(data);
            cli.toma();
        });


    }
    

    this.conectar();

}