//Arranco todo desde cero!!! 
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
//*Fin contacto.js***************************************************