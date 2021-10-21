function ServidorWS(){
    this.lanzarServidorWS=function(io,juego){
        var cli=this; //This usado para no perder el contexto con llamadas callback
        io.on("connection",function(socket){
            console.log("Usuario conectado");
        })


    }
}



module.exports.ServidorWS=ServidorWS; //Exportarlo a otros achivos con el mismo nombre