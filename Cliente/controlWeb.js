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
	//this.mostrarUnirAPartida
	//this.mostrarListaPartidas
}