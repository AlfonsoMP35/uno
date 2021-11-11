function ControlWeb(){
	this.comprobarUsuario=function(){
		if($.cookie("nick")){
			ws.nick=$.cookie("nick");
			iu.mostrarHome({nick:ws.nick});
		}else{
			iu.mostrarAgregarJugador();
		}
	}

	this.mostrarAgregarJugador=function(){
		var cadena = '<div id="mAJ"><h1>Registro<h1><br>'
		cadena=cadena+'<label for="usr">Nombre jugador:</label>';
        cadena=cadena+'<input type="text" class="form-control" id="usr">';
        cadena=cadena+'<button type="button" id="btnAJC" class="btn btn-primary">Crear partida</button>';
        cadena=cadena+'<button type="button" id="btnAJU" class="btn btn-primary">Unirse a partida</button>';
		cadena=cadena+'</div>';

		$("#agregarJugador").append(cadena);         

		$("#btnAJC").on("click",function(){
			var nick=$('#usr').val();
			if(nick==""){
				iu.mostrarModal("Introudce tu nick: ");
			}
			$("#mAJ").remove();
			rest.agregarJugador(nick);
		})

		$("#btnAJU").on("click",function(){
			var nick=$('#usr').val();
			if(nick==""){
				iu.mostrarModal("Introudce tu nick: ");
			}
			$("#mAJ").remove();
			rest.agregarJugador(nick);
		})
	}

	//this.mostrarCrearPartida
	this.mostrarCrearPartida=function(){
		var cadena='<div id="mCP"><label for="njug">Crear Partida:</label>';
		cadena=cadena+'<input type="text" class="form-control" id="num">';
		cadena=cadena+'<button type="button" id="btnCP" class="btn btn-primary">Crear</button>';
		cadena=cadena+'</div>';

		$("#crearPartida").append(cadena);

		$("#btnCP").on("click", function () {
            var nj = $('#num').val();
			var nick = $('#usr').val();
            if (nj == "") {
                alert('Introduzca el número de jugadores');
            }
            else if (nj < 2 || nj > 8) {
                $('#num').val("");
                alert('Introduzca un número entre 2-8 jugadores');
            }
            else {
                ws.crearPartida(nj, nick);
                $("#mCP").remove();
                $("#mUAP").remove();
                $("#mLP").remove();
            }
        })
		

	}


	//this.mostrarUnirAPartida
	this.mostrarUnirAPartida=function(){
	var cadena='<div id="mUAP"><label for="cod">Unir a partida</label>';
	cadena=cadena+'<input type="text" class="form-control" id="codigo">';
	cadena=cadena+'<button type="button" id="btnUAP" class="btn btn-primary">Unirse</button>';
	cadena=cadena+'</div>';


	$("#unirAPartida").append(cadena);

	$("#btnUAP").on("click",function(){
		var code=$('#codigo').val();
		var nick=$('#usr').val();
		$("#mUAP").remove();
		rest.unirAPartida(code,nick);
	})

	}


	//this.mostrarListaPartidas
	this.mostrarListaPartidas=function(){
		$('#mLP').remove();


		var cadena='<div id="mLP" class=list-group>';
		for(i=0;i<lista.lenght;i++){
			cadena=cadena+'<a href="#"class="list-group-item list-group-item-action">'+
			lista[i].codigo+'</a>';
		}

		cadena=cadena+'</div>'

		$("#listaPartidas").append(cadena);

		$(".list-group a").click(function(){
			codigo=$(this).attr("value");
			var nick=ws.nick;
			console.log(codigo+" "+nick);
			if(codigo && nick){
				$('#mLP').remove();
				$('#mCP').remove();
				ws.unirAPartida(codigo,nick);	
			}
		})

	}


	this.mostrarModal=function(msg){
		//meter el msg en el modal
		$('#cM').remove();
		var cadena= "<p id='cM'"+msg+"</p>";
		$("#contenidoModal").append(cadena);
		$('#miModal').modal('show');
	}

	this.mostrarMano=function(lista){
		$('#mM').remove();
		var cadena='<div id="mM"class="card-columns">';

		for(i=0;i<lista.lenght;i++){
		cadena=cadena+'<div class="card bg-light">';
		cadena=cadena+'<div class="card-body text-center">';
		cadena=cadena+'<div class="card-img-top" src="cliente/img/'+lista[i].nombre+ '"alt="Card image">'
		cadena=cadena+'<p class="card-text">'+lista[i]+'</p>';
		cadena=cadena+'</div> </div>';

		}

	  cadena=cadena+'</div>'
	  $('#mano').append(cadena);


	}

	this.mostrarCartaActual=function(carta){
		$('#mCA').remove();

		var cadena='<div id="nM"class="card-columns">';
		cadena=cadena+'<div class="card bg-light">';
		cadena=cadena+'<div class="card-body text-center">';
		cadena=cadena+'<div class="card-img-top" src="cliente/img/'+carta+ '"alt="Card image">'
		cadena=cadena+'<p class="card-text">'+carta.tipo+'</p>';
		cadena=cadena+'</div> </div>';

	  cadena=cadena+'</div>'
	  $('#actual').append(cadena);
	}


	this.limpiar=function(){
		$("#mAJ").remove();
		$("#mCP").remove();
        $("#mUAP").remove();
		$('#mLP').remove();
		$('#cM').remove();
		$('#mM').remove();
		$('#mCA').remove();
	}

	

}