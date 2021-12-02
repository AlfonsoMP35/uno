const e = require("cors");
var modelo=require("./modelo.js");

describe("El juego del UNO...", function() {
  var juego;

  beforeEach(function() {
    juego=new modelo.Juego();
    juego.agregarJugador("ana");
    juego.agregarJugador("pepe");
    juego.agregarJugador("luis");
  });

  it("Condiciones iniciales",function(){
      expect(juego.numeroPartidas()).toEqual(0);
      expect(juego.obtenerTodasPartidas().length).toEqual(0);
  });

  describe("Ana crea una partida de 2 jugadores...", function() {
    var ju1;
    var partida;

    beforeEach(function(){
      ju1=juego.usuarios["ana"];
      partida=ju1.crearPartida(2);
    });

    it("Comprobar obtener partida",function(){
      var codigo=ju1.codigoPartida;
      expect(ju1.obtenerPartida(codigo)).toBeDefined();
    });

    it("Comprobar mazo",function(){
        expect(partida.mazo.length).toBe(32);
        // var rojo=partida.mazo.filter(function(each){
        //   return each.color=="rojo";
        // });
        // expect(rojo.length).toBe(25);
        // var verde=partida.mazo.filter(function(each){
        //   return each.color=="verde";
        // });
        // expect(verde.length).toBe(25);
        // var amarillo=partida.mazo.filter(function(each){
        //   return each.color=="amarillo";
        // });
        // expect(amarillo.length).toBe(25);
        // var azul=partida.mazo.filter(function(each){
        //   return each.color=="azul";
        // });
        // expect(azul.length).toBe(25);
        // var comodin=partida.mazo.filter(function(each){
        //   return each.tipo=="comodin";
        // });
        // expect(comodin.length).toBe(4);
        // var comodin4=partida.mazo.filter(function(each){
        //   return each.tipo=="comodin4";
        // });
        // expect(comodin4.length).toBe(4);
    });

    it("Comprobamos la partida para 2 jugadores", function() {
      //var ju1=juego.usuarios["ana"];
      //expect(juego.numeroPartidas()).toEqual(0);
      //expect(juego.obtenerTodasPartidas().length).toEqual(0);
      //var partida=ju1.crearPartida(2);
      expect(juego.numeroPartidas()).toEqual(1);
      expect(partida.codigo).toBeDefined();
      expect(partida.numeroJugadores()).toEqual(1);
      expect(juego.obtenerTodasPartidas().length).toEqual(1);
      expect(partida.fase.nombre).toBe("inicial");
    });

    it("Pepe se une",function(){
      // var ju1=juego.usuarios["ana"];
      // expect(juego.numeroPartidas()).toEqual(0);
      // var partida=ju1.crearPartida(2);
      // expect(juego.numeroPartidas()).toEqual(1);
      // expect(partida.codigo).toBeDefined();
      // expect(partida.numeroJugadores()).toEqual(1);
      // expect(partida.fase.nombre).toBe("inicial");
      var ju2=juego.usuarios["pepe"];
      ju2.unirAPartida(partida.codigo);
      expect(partida.numeroJugadores()).toEqual(2);
      expect(partida.fase.nombre).toBe("jugando");
    });

    it("Pepe se une, Luis intenta unirse y no puede",function(){
      // var ju1=juego.usuarios["ana"];
      // expect(juego.numeroPartidas()).toEqual(0);
      // var partida=ju1.crearPartida(2);
      // expect(juego.numeroPartidas()).toEqual(1);
      // expect(partida.codigo).toBeDefined();
      // expect(partida.numeroJugadores()).toEqual(1);
      // expect(partida.fase.nombre).toBe("inicial");
      var ju2=juego.usuarios["pepe"];
      ju2.unirAPartida(partida.codigo);
      expect(partida.numeroJugadores()).toEqual(2);
      expect(partida.fase.nombre).toBe("jugando");
      var ju3=juego.usuarios["luis"];
      ju3.unirAPartida(partida.codigo);
      expect(partida.numeroJugadores()).toEqual(2);
      expect(partida.fase.nombre).toBe("jugando");
    });

    it("Condiciones iniciales de la partida Jugando",function(){
      var ju2=juego.usuarios["pepe"];
      ju2.unirAPartida(partida.codigo);
      ju1.manoInicial();
      ju2.manoInicial();
      expect(ju1.mano.length).toEqual(3);
      expect(ju2.mano.length).toEqual(3);
      expect(partida.turno.nick).toEqual("ana");
      expect(partida.direccion.nombre).toEqual("derecha");
      expect(partida.cartaActual).toBeDefined();
    });

    describe("Ana crea una partida de 2 jugadores, Pepe se une, reparten cartas...", function() {
        var ju2;

        beforeEach(function(){
          ju2=juego.usuarios["pepe"];
          ju2.unirAPartida(partida.codigo);
          ju1.manoInicial();
          ju2.manoInicial();
        });

        it("Ana juega carta",function(){
          partida.cartaActual.color=ju1.mano[0].color;
          ju1.jugarCarta(0);
          expect(partida.turno.nick).toEqual("pepe");
          ju2.pasarTurno();
          expect(partida.turno.nick).toEqual("ana");
          partida.cartaActual.color=ju1.mano[0].color;
          ju1.jugarCarta(0);
          expect(partida.turno.nick).toEqual("pepe");
          ju2.pasarTurno();
          expect(partida.turno.nick).toEqual("ana");
          partida.cartaActual.color=ju1.mano[0].color;
          ju1.jugarCarta(0);
          ju2.pasarTurno();
          expect(partida.fase.nombre).toEqual("final");
        }); 

        it("Ana roba 1 carta",function(){
          expect(ju1.mano.length).toBe(3);
          ju1.robar(1);
          expect(ju1.mano.length).toBe(4);
        })

        it("Ana intenta robar 1 carta pero no quedan cartas en el mazo",function(){
          expect(partida.mazo.length).toBe(17);
          partida.mesa=partida.mesa.concat(partida.mazo);
          partida.mazo=[];
          expect(partida.mesa.length).toBe(17);
          expect(ju1.mano.length).toBe(3);
          ju1.robar(1);
          expect(ju1.mano.length).toBe(4);
          expect(partida.mazo.length).toBe(16);      
        });

        it("Ana roba todas las cartas del mazo y pierde el turno", function(){
          expect(partida.mazo.length).toBe(17);
          expect(ju1.mano.length).toBe(3);
          ju1.robar(17);
          expect(ju1.mano.length).toBe(20);
          expect(partida.turno.nick).toBe(ju1.nick);
          expect(partida.turno.nick).toBe(ju1.nick);



        })


        it("Ana abandona la partida", function(){
          expect(partida.fase.nombre).toBe("jugando");
          ju1.abandonarPartida();
          expect(partida.fase.nombre).toBe("final");


        });

        it("Ana cierra sesión", function(){
          expect(partida.fase.nombre).toBe("jugando");
          ju1.abandonarPartida();
          expect(partida.fase.nombre).toBe("final");


        });

        it("Ana juega una carta de bloqueo, pepe pierde el turno",function(){
          var carta=ju1.mano[0];

          while(!carta || carta.tipo!="bloqueo"){
            carta=ju1.mano.find(function(el){ return el.tipo=="bloqueo"});
            ju1.robar(1);
          }
          expect(carta.tipo).toEqual("bloqueo");

          var ind=ju1.mano.indexOf(carta);
          expect(ju1.mano[ind].tipo).toEqual("bloqueo");
          partida.cartaActual.color=carta.color;
          expect(partida.turno.nick).toEqual(ju1.nick);
          ju1.jugarCarta(ind);
          expect(partida.cartaActual.tipo).toEqual("bloqueo");
          expect(partida.turno.nick).toEqual(ju1.nick);
          expect(ju2.estado.nombre).toEqual("normal");


        })
     });
  });

  describe("Ana crea una partida de 2 jugadores...", function() {
    var ju1,ju2,ju3;
    var partida;

    beforeEach(function(){
      ju1=juego.usuarios["ana"];
      partida=ju1.crearPartida(3);
      ju2=juego.usuarios["pepe"];
      ju3=juego.usuarios["luis"];
      ju2.unirAPartida(partida.codigo);
      ju3.unirAPartida(partida.codigo);
      ju1.manoInicial();
      ju2.manoInicial();
      ju3.manoInicial();


    });

    it("codiciones iniciales", function(){
      expect(partida.mazo.length).toBe(22);
      var carta=ju1.mano[0];

          while(!carta || carta.tipo!="bloqueo"){
            carta=ju1.mano.find(function(el){ return el.tipo=="bloqueo"});
            ju1.robar(1);
          }
          expect(carta.tipo).toEqual("bloqueo");

          var ind=ju1.mano.indexOf(carta);
          expect(ju1.mano[ind].tipo).toEqual("bloqueo");
          partida.cartaActual.color=carta.color;
          expect(partida.turno.nick).toEqual(ju1.nick);
          ju1.jugarCarta(ind);
          expect(partida.cartaActual.tipo).toEqual("bloqueo");
          expect(ju1.mano.length).toEqual(num-1);
          expect(partida.turno.nick).toEqual(ju1.nick);
          expect(ju2.estado.nombre).toEqual("normal");

    })




  });

});