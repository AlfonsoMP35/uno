//var sendgrid = require("sendgrid")("xxxxx","xxxxxx");

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey("xxxxxxx")


var url="http://127.0.0.1:5000/";
var urid="https://uno35.herokuapp.com/"


module.exports.enviarEmailConfirmacion=function(direccion,key,msg){

    const msg = {
    to: direccion, // Change to your recipient
    from: 'uno35@example.com', // Change to your verified sender
    subject: 'Uno35: confirmación de correo',
    text: 'Haga click en el siguiente enlace para confirmar cuenta',
    html: '<p><a href="'+url+'confirmarUsuario/'+direccion+'/'+key+'"> Haz clic en este enlace para confirmar tu cuenta</a></p>',
    }

    sgMail
    .send(msg)
    .then((response) => {
        console.log(response[0].statusCode)
        console.log(response[0].headers)
    })
    .catch((error) => {
        console.error(error)
    })

}


