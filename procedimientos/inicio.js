//Arranco todo desde cero!!! al
//La idea es:
//  1.- Presentar pantalla de LOGIN si no hay nada en localstorage de cuit y nombre...
//  2.- Ojo! siempre y cuando no esté ingresado... (Una variable cargada con la CUIT y el nombre)
//  3.- Dentro del proceso LOGIN valido que la CUIT ingresada exista en archivo cuites.
//  4.- Para validarla levanto archivo "cuites" y verifico la existencia de la CUIT, si sí, tomo el nombre,
//      y lo muestro en pantalla index.html.
//  5.- Busco la ubicación, y también la muestro en index.html.
//  6.- Si no existe le aviso del error y que puede usar la CUIT comodín (11111111111) (son once 1s),
//      y repito la validación, exposición, ubicación y sigo con proceso normal.
//---------------------------------------------------------------------*.
//Arranco todo desde cero!!!  OTRA VEZ!!!
let elCUIT  = []
let elIP    = []
if(localStorage.getItem("ctrlCUIT")) {
    algoRecuperado = localStorage.getItem("ctrlCUIT");
    elCUIT = JSON.parse(algoRecuperado)
    let {cuit, nombre} = elCUIT  
    const divCUIT = document.getElementById("divCUIT");
                divCUIT.innerHTML = `
                La CUIT ingresada es <strong> ${cuit}</strong>. Corresponde a <strong> ${nombre} </strong>`; 
}
if(localStorage.getItem("ctrlIP")) {
    algoRecuperado = localStorage.getItem("ctrlIP");
    elIP = JSON.parse(algoRecuperado)
    let {ip, country, city} = elIP
    const divIP = document.getElementById("divIP");
                        divIP.innerHTML = `
                        Su IP es: <strong> ${ip} </strong> y está ingresando desde la ciudad de <strong> ${city} (${country}) </strong>`
}
const botonInicio = document.getElementById("botonInicio");
botonInicio.addEventListener("click", () => {
    Swal.fire( {
        title: "Ingrese una CUIT válida de 11 dígitos sin guiones",
        html: ` <input type ="text" id="fcuit" class="swal2-input" placeholder ="CUIT">
                <div> Para probar selecione alguna de las siguientes CUITs</div>
                <div> 12345678901 </div>
                <div> 23108948949 </div>
                <div> 20368469565 </div>
                <div> 23134676884 </div>
                `,
        showCancelButton:   true, 
        confirmButtonText:  "Verificar",
        cancelButtonText:   "Cancelar",
    }).then((result) => {
        if(result.isConfirmed) {
            const cuitInput = document.getElementById("fcuit").value;
            let cuitesLevantados = []
            const listadoCuites  = "informacion/cuites.json";   
            fetch(listadoCuites)
                .then(respuesta => respuesta.json())
                .then(async cuitesLevantados => {
            console.log(cuitesLevantados)
            index = cuitesLevantados.findIndex(elCUIT => elCUIT.cuit == cuitInput);
            if (index > 0) {
                let elCUIT = cuitesLevantados[index] 
                let {cuit, nombre} = elCUIT  
                guardoAlgo(elCUIT, "ctrlCUIT")
                const divCUIT = document.getElementById("divCUIT");
                divCUIT.innerHTML = `
                La CUIT ingresada es <strong> ${cuit}</strong>. Corresponde a <strong>${nombre}</strong>`; 
                await Swal.fire({
                    title: "("+cuit+") " + nombre,
                    text: "BienVenido!!!",
                    icon: "success",
                    timer: 50000,
                    confirmButtonText: "Aceptar"
                    });
                const apiIP = "https://ipwho.is/";
                fetch(apiIP)
                    .then(response => response.json())
                    .then(( {ip, country, city}) => {
                        const divIP = document.getElementById("divIP");
                        divIP.innerHTML = `
                        Su IP es: <strong> ${ip} </strong> y está ingresando desde la ciudad de <strong> ${city}, (${country}) </strong>
                                            `
                        guardoAlgo({ip, country, city},"ctrlIP")
                        Swal.fire({
                            title: "Su IP es "+ ip + " y está ingresando desde la ciudad de " + city + ", ("+country+")",
                            icon: "success",
                            confirmButtonText: "Aceptar"
                            })
                    })
                    .catch(error => console.error(error));
                cuitesLevantados = []
            }else{
                Swal.fire({
                    title: "CUIT ingresada es Incorrecta o No Existe en Registros",
                    text: "Ingrese COMODÍN: 12345678901",
                    icon: "error",
                    confirmButtonText: "Aceptar"
                    })
                }
                });
        }
    })
})
//*--------------------------------------------------------------------*
function muestroErrorCarga () {
    Swal.fire({
        icon: 'error',
        title: 'Error Desconocido ...',
        text: "No se pudo leer el archivo de cuites JSON",
    })
}
//*--------------------------------------------------------------------*
function guardoAlgo(paraGuardar, clave){
    paraGuardar = JSON.stringify(paraGuardar);
    localStorage.setItem(clave, paraGuardar);
}
//*Fin inicio.js***************************************************