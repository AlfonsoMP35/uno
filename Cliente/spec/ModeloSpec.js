describe("Crear partida", function() {
  var juego;
 

  beforeEach(function() {
    juego = new Juego();
    juego.agregarJugador("ana");
    juego.agregarJugador("pepe");
  });

  it("ana crea una partida para 2 jugadores", function() {
    var ju1=juego.usuarios["ana"];
    expect(juego.numeroPartidas()).toEqual(0);
   // expect(partida.obtenerTodasPartidas().length).toEqual(0);
    var partida=ju1.crearPartida(2);
    expect(juego.numeroPartidas()).toEqual(1);
    expect(partida.codigo).toBeDefined();
    expect(partida.numeroJugadores()).toEqual(1);
    expect(partida.fase.nombre).toBe("iniciar");
    //expect(partida.obtenerTodasPartidas().length).toEqual(1);

  });

});


  describe("Crear partida", function() {
    var juego;
   
  
    beforeEach(function() {
      juego = new Juego();
      juego.agregarJugador("ana");
      juego.agregarJugador("pepe");
    });
  
  //Ana crea la partida para dos jugadores y pepe se une
  it("Ana crea la partida para 2 jugadores y pepe se une", function(){
    var ju1=juego.usuarios["ana"];
    expect(juego.numeroPartidas()).toEqual(0);
    var partida=ju1.crearPartida(2);
    expect(juego.numeroPartidas()).toEqual(1);
    expect(partida.codigo).toBeDefined();
    expect(partida.numeroJugadores()).toEqual(1);
    expect(partida.fase.nombre).toBe("iniciar");


  var ju2=juego.usuarios["pepe"];
  ju2.unirAPartida(partida.codigo);
  expect(partida.numeroJugadores()).toEqual(2);
  


  });

});

describe("El juego del uno...", function() {
  var juego;
 

  beforeEach(function() {
    juego = new Juego();
    juego.agregarJugador("ana");
    juego.agregarJugador("pepe");
    juego.agregarJugador("luis");
  });





//Ana crea la partida para dos jugadores y pepe se une, pero luis intenta unirse y no puede acceder
it("Ana crea la partida para 2 jugadores y pepe se une,pero luis intenta unirse y no puede acceder", function(){
  var ju1=juego.usuarios["ana"];
  expect(juego.numeroPartidas()).toEqual(0);
  var partida=ju1.crearPartida(2);
  expect(juego.numeroPartidas()).toEqual(1);
  expect(partida.codigo).toBeDefined();
  expect(partida.numeroJugadores()).toEqual(1);
  expect(partida.fase.nombre).toBe("iniciar");


var ju2=juego.usuarios["pepe"];
ju2.unirAPartida(partida.codigo);
expect(partida.numeroJugadores()).toEqual(2);

var ju3=juego.usuarios["luis"];
ju3.unirAPartida(partida.codigo);
expect(partida.numeroJugadores()).toEqual(2);


});

});

describe("El juego del uno...", function() {
  var juego;
 

 beforeEach(function() {
    juego = new Juego();
    juego.agregarJugador("ana");
    juego.agregarJugador("pepe");
    juego.agregarJugador("luis");
  });

  it("Condiciones iniciales", function(){
    expect(juego.numeroPartidas()).toEqual(0);
    //expect(juego.obtenerTodasPartidas().lenght).toEqual(0);


  });

  describe("ana crea una partida de 2....", function() {
    var ju1;
    var partida
   
  
    beforeEach(function() {
     ju1=juego.usuarios["ana"];
     partida=ju1.crearPartida(2);
    });

    it("Comprobar obtener partida", function(){
      var codigo=ju1.codigoPartida;
      expect(ju1.obtenerPartida(codigo)).toBeDefined();
  
    });


it("Comprobar mazo",function(){
 
  //codigo para crear partida
  expect(partida.mazo.length).toBe(108);
      var rojo=partida.mazo.filter(function(each){
        return each.color=="rojo";
      });
      expect(rojo.length).toBe(25);
      var verde=partida.mazo.filter(function(each){
        return each.color=="verde";
      });
      expect(verde.length).toBe(25);
      var amarillo=partida.mazo.filter(function(each){
        return each.color=="amarillo";
      });
      expect(amarillo.length).toBe(25);
      var azul=partida.mazo.filter(function(each){
        return each.color=="azul";
      });
      expect(azul.length).toBe(25);
      var comodin=partida.mazo.filter(function(each){
        return each.tipo=="comodin";
      });
      expect(comodin.length).toBe(4);
      var comodin4=partida.mazo.filter(function(each){
        return each.tipo=="comodin4";
      });
      expect(comodin4.length).toBe(4);
    });


  it("Ana crea la partida para 2 jugadores y pepe se une,pero luis intenta unirse y no puede acceder", function(){
  var ju2=juego.usuarios["pepe"];
  ju2.unirAPartida(partida.codigo);
  expect(partida.numeroJugadores()).toEqual(2);
  
  var ju3=juego.usuarios["luis"];
  ju3.unirAPartida(partida.codigo);
  expect(partida.numeroJugadores()).toEqual(2);


  });

 /* it("Mano inicial", function(){
    var mano = ju1.manoinicial();
    expect(ju1.mano.length).toEqual(7);
  });*/
  


});

});