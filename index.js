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
app.get("/crearPartida/:njugad /:nick",function(request,response){
    var nick = request.params.nick;
    var njug = request.params.njugad;
    var ju1=juego.usuarios[nick];
    var res = {codigo:-1};
    if(ju1){
        var partida=ju1.crearPartida(num);
        console.log("Nueva partida de" +nick+ "codigo:"+res)
        res.codigo=ju1.codigoPartida;
    }
    response.send(res);
});


//unir a partida





app.listen(app.get('port'),function(){
    console.log("La app NodeJS se está ejecutando en el puerto ",app.get("port"));
});





