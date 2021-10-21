function ClienteWS(){
    this.socket;
    this.conectar=function(){
        this.socket=io(); 
        this.servidorWSCliente(); //Lanzamiento de la conexión local
    }

    //servidor WS del cliente
    this.servidorWSCliente=function(){
        var cli=this;
        this.socket.on("connect",function(){
            console.log("Conectador al servidor WS");
        })
    }

    this.conectar();

}