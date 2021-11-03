function ControlWeb(){
	this.mostrarAgregarJugador=function(){
		var cadena='<div id="mAJ"><label for="usr">Nick:</label>';
        cadena=cadena+'<input type="text" class="form-control" id="usr">';
        cadena=cadena+'<button type="button" id="btnAJ" class="btn btn-primary">Entrar</button>';
        cadena=cadena+'</div>';

		$("#agregarJugador").append(cadena);         

		$("#btnAJ").on("click",function(){
			var nick=$('#usr').val();
			$("#mAJ").remove();
			rest.agregarJugador(nick);
		})
	}

	//this.mostrarCrearPartida
	this.mostrarCrearPartida=function(){
		var cadenas='<div id="mCP"><label for="njug">Crear Partida:</label>';
		cadenas=cadenas+'<input type="text" class="form-control" id="num">';
		cadenas=cadenas+'<button type="button" id="btnCP" class="btn btn-primary">Crear</button>';
		cadenas=cadenas+'</div>';

		$("#crearPartida").append(cadenas);

		$("#btnCP").on("click",function(){
			var num=$('#njug').val();
			var nick=$('#usr').val();
			$("#mCP").remove();
			rest.crearPartida(num,nick);
		})
		

	}


	//this.mostrarUnirAPartida
	this.mostrarUnirAPartida=function(){


	}


	//this.mostrarListaPartidas
	this.mostrarListaPartidas=function(){



	}




}