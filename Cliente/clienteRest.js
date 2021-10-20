function ClienteRest(){
    this.agregarJugador = function(nick){
        $.getJSON("/agregarJugador/" +nick, function(data){
            //se ejecuta cuando conteste el servidor
            console.log(data);


        });
        //sigue la ejecución sin esperar
        //mostrar una ruleta




    }

    this.crearPartida = function(njug, nick){
        $.getJSON("/crearPartida/" +njug+ "/" + nick, function(data){
            //se ejecuta cuando conteste el servidor
            console.log(data);


        });
        //sigue la ejecución sin esperar
        //mostrar una ruleta




    }

    //unir a partida
    this.unirAPartida = function(code,nick){
        $.getJSON("/unirAPartida/" +code+ "/" + nick, function(data){
            //se ejecuta cuando conteste el servidor
            console.log(data);


        });
        //sigue la ejecución sin esperar
        //mostrar una ruleta




    }

    //obtener lista de partidas
    





}