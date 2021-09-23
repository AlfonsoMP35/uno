describe("El juego del Uno...", function() {
  var juego;
 

  beforeEach(function() {
    juego = new Juego();
    juego.agregarJugador("ana");
    juego.agregarJugador("pepe");
  });

  it("ana crea una partida para 2 jugadores", function() {
    var ju1=juego.usuarios["ana"];
    expect(juego.numeroPartidas()).toEqual(0);
    var partida=ju1.crearPartida(2);
    expect(juego.numeroPartidas()).toEqual(1);
    expect(partida.codigo).toBeDefined();
    expect(partida.numeroJugadores()).toEqual(1);
    expect(partida.fase.nombre).toBe(true);

  });

});


  describe("El juego del Uno...", function() {
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
  expect(partida.fase.esInicial()).toBe(true);

  var ju2=juego.usuarios["pepe"];
  ju2.unirAPartida(partida.codigo);
  expect(partida.numeroJugadores()).toEqual(2);
  


  });

});

describe("El juego del Uno...", function() {
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
expect(partida.fase.esInicial()).toBe(true);

var ju2=juego.usuarios["pepe"];
ju2.unirAPartida(partida.codigo);
expect(partida.numeroJugadores()).toEqual(2);

var ju3=juego.usuarios["luis"];
ju3.unirAPartida(partida.codigo);
expect(partida.numeroJugadores()).toEqual(2);


});

});