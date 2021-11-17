var mongo=require("mongodb").MongoClient;
var ObjectID=require("mongodb").ObjectID;

function CAD(){
    this.resultadosCol=undefined;

    this.conectar=function(callback){
        var pers=this;

        mongo.connect("mongodb+srv://patata:patata@drake0.l3lbv.mongodb.net/resultados?retryWrites=true&w=majority",function(err,db){
            if(err){
                console.log("No se puede conectar")
            }
            else{
                console.log("Conectando a Atlas MongoDB")
            }
        })
    }

}

module.exports.CAD=CAD;