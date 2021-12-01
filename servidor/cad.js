var mongo=require("mongodb").MongoClient;
var ObjectID=require("mongodb").ObjectID;

function CAD(){
    this.resultadosCol=undefined;

    this.encontrarTodosResultados=function(callback){
        encontrarTodos(this.resultadosCol,callback);

    }

    this.encontrarResultadoCriterio=function(criterio,callback){
        encontrarCriterio(this.resultadosCol,criterio,callback);
    }
    
    function encontrarCriterio(coleccion,criterio,callback){
        coleccion.find(criterio).toArray(function(err,col){
            callback(col);
        })
    }

    function encontrarTodos(coleccion, callback){
        coleccion.find().toArray(function(err,datos){
            if(err){
                callback([]);
            }else{
                callback(datos);
            }
        })
    }

    this.insertarResultado=function(resultado,callback){
        insertar(this.resultadosCol,resultado,callback);
    }

    function insertar(coleccion,datos,callback){
        coleccion.insertOne(objeto,function(err,result){
            if (err){
                console.log("No se han podido insertar elementos")
            }else{
                console.log("Nuevo elemento");
                callback(result);
            }
        })
    }



    this.conectar=function(callback){
        var cad=this;

        mongo.connect("mongodb+srv://patata:patata@drake0.l3lbv.mongodb.net/resultados?retryWrites=true&w=majority",function(err,db){
            if(err){
                console.log("No se puede conectar")
            }
            else{
                console.log("Conectando a Atlas MongoDB")
                cad.resultadosCol= db.db("uno35").collection("resultados");
            }
        })
    }

    function encontrarCriterio(coleccion, criterio,callback){
		coleccion.find(criterio).toArray(function(err,usr){
			if (usr.length==0){
                callback(undefined);
            }
            else{
                callback(usr[0]);
            }
		})
	}

    //this.conectar(function(){})

}

module.exports.CAD=CAD;