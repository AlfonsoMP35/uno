var fs = require("fs");
var express = require("express");  //Middleware 
var app = express();
var http = require("http").Server(app);

//Gestion de sockets
var { Server } = require("socket.io"); //Libreria de socket.io
var io = new Server(http); //Conexión con el servidor HTTP

var bodyParser = require("body-parser");
var passport=require("passport");
var cookieSession = require("cookie-session");

//Importaciones
require("./servidor/passport-setup.js");
var modelo = require("./servidor/modelo.js");
var ssrv = require("./servidor/servidorWS.js"); //Importación del objeto servidorWS

var juego = new modelo.Juego();
var servidorWS = new ssrv.ServidorWS(); //NOTA: Objetos definidos por el usuario en mayusculas

app.set('port',process.env.PORT || 5000); //Usa el puerto designado o creamos uno

app.use(express.static(__dirname + "/"));

app.use(cookieSession({
	name:'unocartas', //nombre de la cookie
	keys:["key1","key2"]
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


const haIniciado=function(request,response,next){
	if(request.user){
		next();
	}
	else{
		response.redirect("/");
	}
}

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
app.get("/crearPartida/:num/:nick",haIniciado,function(request,response){
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

//Rutas a definir para validar a usuarios con OAuth2
// /auth/gooogle -> redireccionamos al usuario a Google para validar
// /auth/instagram --> redireccionamos ...
//...

app.get("/auth/google",passport.authenticate("google",{scope:["profile", "email"]}));

// /google/callback --> aqui llega la respuesta de Google
// /good --> en caso de usuario de google valido
// /fail --> en caso de usuario no valido	

app.get("/good",function(request,response){
	//definir el nick como el email del usuario de Google
	//agregarJugador(nick);
	console.log(request.user.emails[0].value);
	juego.agregarJugador(nick);
	response.cookie('nick',nick);
	response.send("/");

})

app.get("/fallo",function(request,response){
	response.send("No se pudo iniciar sesión");

});

app.get("/google/callback",passport.authenticate("google",{failureRedirect:'/fallo'}),function(request,response){
	response.redirect("/good");
});

app.post('/registrarUsuario',function(request,response){
	var email=request.body.email;
	var clave=request.body.clave;

	juego.registrarUsuario(email,clave,function(data){
		response.send(data);
	});
})

app.post('/loginUsuario',function(request,response){
	var email=request.body.email;
	var clave=request.body.clave;

	juego.loginUsuario(email,clave,function(data){
		response.send(data);
	});
})


//unir a partida
app.get("/unirAPartida/:code/:nick",haIniciado,function(request,response){
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
app.get("/obtenerTodasPartidas",haIniciado,function(request,response){
	var lista=juego.obtenerTodasPartidas();
	response.send(lista);
});

app.get("/obtenerTodosResultados",haIniciado,function(request,response){
	if(juego){
		juego.obtenerTodosResultados(function(lista){
			response.send(lista);
		})
	}
})

app.get("/obtenerResultados/:nick",haIniciado,function(request,response){
	var nick=request.params.nick;
	if(juego){
		juego.obtenerResultados({ganador:nick},function(lista){
			response.send(lista);
		})
	}

})

app.get("/cerrarSesion/:nick",haIniciado,function(request,response){
	var nick=request.params.nick;
	var ju1=juego.usuarios[nick];
	if (ju1){
		ju1.cerrarSesion();
		response.send({res:"ok"});
	}
})

http.listen(app.get('port'),function(){ //Camibado de app a http (app) para que el socket funcione
    console.log("La app NodeJS se está ejecutando en el puerto ",app.get("port"));
});

// lanzar el servidorWS
servidorWS.lanzarServidorWS(io,juego);



