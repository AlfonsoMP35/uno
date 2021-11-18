function ControlWeb(){

	this.comprobarUsuario=function(){
		if($.cookie("nick")){
			ws.nick=$.cookie("nick");
			//iu.mostrarHome({nick:ws.nick});
			iu.mostrarLobby();
		}else{
			iu.mostrarAgregarJugador();
		}

	}

	this.mostrarAgregarJugador = function() {
        
        $("#btnAJ").on("click", function(){
            var nick = $("#usr").val()
            if(nick) {
                
                // $("#agregarJugador").remove()
                rest.agregarJugador(nick)
                // iu.mostrarControl()
                // iu.mostrarEleccion()
            }
        })
            
    }

	this.mostrarLobby = function() {
        var nick = $("#usr").val()
        $("#agregarJugador").remove()

        var nick = '<p id="nick" class="d-none">'+nick+'</p>'
        $("body").append(nick)

        var cad = `
			<div id="bienvenida">
			<h4> Bienvenido <h4>
			<p> Jugador`+nick+`</p>
			</div>
            <div id="elecciones" class="text-center row justify-content-center">
                <button id="crear" class="btn btn-primary">CREAR PARTIDA</button>
                <button id="unirse" class="btn btn-primary">UNIRSE A PARTIDA</button>
            </div>`
        
        $("#elegirAccion").append(cad)

        $("#crear").on("click", function() {
            $("#elegirAccion").remove()
            iu.mostrarCrearPartida()
        })

        $("#unirse").on("click", function() {
            $("#elegirAccion").remove()
            var div= `
            <h4 id="tituloLP" class="text-center mb-3 pb-3">Lista de partidas</h4>
            <div id="listaPartidas"></div>
            <div id="spinner" class="col p-5 text-center">
                <div class="spinner-border text-dark p-5" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
            </div>`
            $("#mostrarPartidas").append(div)
            rest.obtenerPartidasDisponibles()
        })


    }

	
	this.mostrarCrearPartida=function(){
		var cadena=`
		<div id="mCP">
			<label for="njug">Crear Partida:</label>
			<input type="number" class="form-control" id="num">
			<button type="button" id="btnCP" class="btn btn-primary">Crear</button>
		</div>`

		$("#crearPartida").append(cadena);

		$("#btnCP").on("click", function () {
            var numjug = $('#num').val();
			var nick = $("#nick").text();
            if (numjug == "") {
                alert('Introduzca el número de jugadores');
            }
            else if (numjug < 2 || numjug > 8) {
                $('#num').val("");
                alert('Introduzca un número entre 2-8 jugadores');
            }
            else {
                ws.crearPartida(numjug, nick);
                $("#mCP").remove();
                $("#mUAP").remove();
                $("#mLP").remove();
            }
        })
		

	}

	this.mostrarControl = function() {
		var nick = $("#nick").text()
        var cadena = `
        <div id="dnick">
            <label>Nick:</label>
            <p class="d-inline" id="nick">`+nick+`</p>
        </div>`

        $("#col-izq").append(cadena)
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
		var nick=$('#nick').text();

		if(code){
			$("#mUAP").remove();
			ws.unirAPartida(code,nick);
		}
	})

	}

	this.mostrarEspera = function(data) {
        console.log('JUGADORES: ' + data.jugadores)
        $("#crearPartida").remove()
        $("#mostrarPartidas").remove()
        $("#listaJugadores").remove()
        $("#tituloLP").remove()
        var lj = '<div id="listaJugadores" class="container scroll mb-5"></div>'
        $("#c1").append(lj)
        var div= `
        <h3 class="text-center mb-3 pb-3">Lista de jugadores</h3>`
        $("#listaJugadores").append(div)
        var div1= `<div id="lJ" class="container"></div>`
        $("#listaJugadores").append(div1) 
        var jugadores = data.jugadores
        var cadena = `
        <div id="cabecera" class="col p-5 text-center">
            <div class="spinner-border text-light p-5" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>`
        for (var i = 0; i < jugadores.length; i++) {
            console.log(jugadores[i])
            var cad = `
            <div class="d-flex flex-row justify-content-center" id="jugador_`+jugadores[i]+`">
                <h5>`+jugadores[i]+`</h5>
            </div>`
            $("#lJ").append(cad)
        }
        

        $("#bienvenido").append(cadena)  
        $("#cabecera").remove()
        $("#mCP").remove()
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