function ControlWeb(){
	this.mostrarAgregarJugador=function(){
		var cadena='<div id="mAJ"><label for="usr">Nick:</label>';
        cadena=cadena+'<input type="text" class="form-control" id="usr">';
        cadena=cadena+'<button type="button" id="btnAJ" class="btn btn-primary">Entrar</button>';
        cadena=cadena+'</div>';

		$("#agregarJugador").append(cadena);         

		$("#btnAJ").on("click",function(){
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

		$("#btnCP").on("click",function(){
			var num=$('#njug').val();
			var nick=$('#usr').val();
			$("#mCP").remove();
			rest.crearPartida(num,nick);
		})
		

	}


	//this.mostrarUnirAPartida
	this.mostrarUnirAPartida=function(){
	var cadena='<div id="mUP"><label for="code">Unir a partida</label>';

	$("#unirAPartida").append(cadena);

	}


	//this.mostrarListaPartidas
	this.mostrarListaPartidas=function(){
		$('#mLP').remove();


		var cadena='<div class=list-group>';
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
		var cadena='<div id="nM"class="card-columns">';

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

}