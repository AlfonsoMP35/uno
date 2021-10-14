var fs = require("fs");
var express = require("express");  //Middleware 
var app = express();
var server = require("http").Server(app);
var bodyParser = require("body-parser");
var modelo = require("servidor/modelo.js");

var juego = new modelo.Juego();

app.set('port',process.env.PORT || 5000); //Usa el puerto designado o creamos uno

app.use(express.static(__dirname + "/"));

app.get("/",function(request,response){
    var contenido = fs.readFileSync(__dirname + "/cliente/index.html");
    response.setHeader("Content-typ","text/html");   //El servidor recibe contenido html
    response.send(contenido);
});


//agregar usuario
app.get("/agregarJugador/:nombre",function(request,response){
    var nick = request.params.nombre;
    var res = juego.agregarJugador(nick);
    response.send(res);
});


//crear partida
app.get("/crearPartida/:njugadores, :nombre",function(request,response){
    var nick = request.params.nombre;
    var njug = request.params.njugadores;
    var res = juego.crearPartida(nick,njug);
    response.send(res);
});


//unir a partida





app.listen(app.get('port'),function(){
    console.log("La app NodeJS se está ejecutando en el puerto ",app.get("port"));
});





