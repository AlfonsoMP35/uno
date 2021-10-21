var fs = require("fs");
var express = require("express");  //Middleware 
var app = express();
var server = require("http").Server(app);
var bodyParser = require("body-parser");
var modelo = require("./servidor/modelo.js");

var juego = new modelo.Juego();

app.set('port',process.env.PORT || 5000); //Usa el puerto designado o creamos uno

app.use(express.static(__dirname + "/"));

app.get("/",function(request,response){
    var contenido = fs.readFileSync(__dirname + "/cliente/index.html");
    response.setHeader("content-type","text/html");   //El servidor recibe contenido html
    response.send(contenido);
});


//agregar usuario
app.get("/agregarJugador/:nombre",function(request,response){
    var nick = request.params.nombre;
    var res = juego.agregarJugador(nick);
    response.send(res);
});


//crear partida
app.get("/crearPartida/:num/:nick",function(request,response){
	var nick=request.params.nick;
	var num=request.params.num;
	var ju1=juego.usuarios[nick];
	var res={codigo:-1};
	if (ju1){
		var partida=ju1.crearPartida(num);
		console.log("Nueva partida de "+nick +" codigo: "+ju1.codigoPartida);
		res.codigo=ju1.codigoPartida;
	}
	response.send(res);
})


//unir a partida
app.get("/unirAPartida/:code/:nick",function(request,response){
    var nick=request.params.nick;
	var code=request.params.code;
	var ju2 = juego.usuarios[nick];
	var res = {codigo:-1};
	if(ju2){
		res=ju2.unirAPartida(code,nick);
		console.log("Jugador "+nick+ " se ha unido a la partida de codigo " +code);		
	}
	
	response.send(res);
});

//obtener lista de partidas
app.get("/obtenerTodasPartidas",function(request,response){
	var lista=juego.obtenerTodasPartidas();
	response.send(lista);
});


app.listen(app.get('port'),function(){
    console.log("La app NodeJS se está ejecutando en el puerto ",app.get("port"));
});





