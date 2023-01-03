//Procedimiento para simulación de Control de BibliotecaBIBLIOTECA
//Genero una plantilla para construir una OBRA en BIBLIOTECA
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

class obra{
    constructor(apellido, nombre, titulo, panel, subpanel, nivel, id){
        this.apellido  = apellido;
        this.nombre    = nombre;
        this.titulo    = titulo;
        this.panel     = panel;
        this.subpanel  = subpanel;
        this.nivel     = nivel;
        this.id        = id;
    }
}
class kobra{
    constructor(kapellido, knombre, ktitulo, kpanel, ksubpanel, knivel, kid){
        this.kapellido  = kapellido;
        this.knombre    = knombre;
        this.ktitulo    = ktitulo;
        this.kpanel     = kpanel;
        this.ksubpanel  = ksubpanel;
        this.knivel     = knivel;
        this.kid        = kid;
    }
}
const objObra = {
    apellido  : "",
    nombre    : "",
    titulo    : "",
    panel     : "",
    subpanel  : "",
    nivel     : "",
    id        : ""
}
//Defino elarray que va a contener a cada una de las Obras
let biblioteca              = [];
let bibliotecaFiltrada      = [];
let tablaGral               = [];
let bibliotecaLevantada     = [];
//Defino un código de identificación para cada obra ...
//  lo inicializo con el máximo ID y almaceno. Cuando lo necesite, lo recupero, lo incremento y lo vuelvo a guardar.
//  es en la función código. Siempre se guarda el último n° utilizado.

//Si hay algo guardado de procesos anteriores los borro.
let ctrlCodigo = 0
if(localStorage.getItem("cargaLote")) {
    localStorage.removeItem("cargaLote")
}
if(localStorage.getItem("ctrlContadorId")) {
    localStorage.removeItem("ctrlContadorId")
}

//Variable para control de edición -cuándo tiene que dar un alta, modificar (o eliminar)
let editando    = false;

// Campos del formulario
const formulario    = document.querySelector('#formulario');
const apellidoInput = document.querySelector('#apellido');
const nombreInput   = document.querySelector('#nombre');
const tituloInput   = document.querySelector('#titulo');
const panelInput    = document.querySelector('#panel');
const subpanelInput = document.querySelector('#subpanel');
const nivelInput    = document.querySelector('#nivel');
const btnAgregar    = document.querySelector('btnAgregar');

formulario.addEventListener('submit', validarFormulario)

const listadoObras = "../informacion/biblioteca.json";

fetch(listadoObras)
    .then(respuesta => respuesta.json())
    .then(bibliotecaLevantada => {
        guardoLote(bibliotecaLevantada);
        mostrarObras(bibliotecaLevantada)
        biblioteca = bibliotecaLevantada
        ctrlCodigo = Math.max(...biblioteca.map(x=>parseInt(x.id)))
        localStorage.setItem("ctrlContadorId", ctrlCodigo);
        })
    .catch(error => muestroErrorCarga());
//---------------------------------------------------------------------*
function guardoLote(tablaGral){
    const tablaGralJSON = JSON.stringify(tablaGral);
    localStorage.setItem("cargaLote", tablaGralJSON);
}
//---------------------------------------------------------------------*
function recuperoLote(){
    const bibliotecaRecuperada = localStorage.getItem("cargaLote");
    return JSON.parse(bibliotecaRecuperada)
}
//---------------------------------------------------------------------*
function codigo() {
    if(localStorage.getItem("ctrlContadorId")) {
        const strCtrlCodigo = localStorage.getItem("ctrlContadorId");
        ctrlCodigo = parseInt(strCtrlCodigo); //paso a numerico
    } else {
    ctrlCodigo = 0
    }
    ctrlCodigo++
    localStorage.setItem("ctrlContadorId", ctrlCodigo);
    return (ctrlCodigo)
}
//---------------------------------------------------------------------*
function validarFormulario(e){
    e.preventDefault(); //para que no se ejecute automáticamente
     mensajeError = ""
    if(validoCampos() === false) {
        Swal.fire({
            icon: 'error',
            title: 'Error...',
            text: mensajeError,
        })
        return;
    }
    if(editando) {
        editarObra()
        editando = false
    } else {
        biblioteca.unshift(new obra(apellidoInput.value, nombreInput.value, tituloInput.value, panelInput.value, subpanelInput.value, nivelInput.value, codigo()));
        guardoLote(biblioteca)
        mostrarObras(biblioteca);
        formulario.reset();
    }
}
//---------------------------------------------------------------------*
function validoCampos() {
    if (apellidoInput.value === "" || nombreInput.value === "" || tituloInput.value === "") {
        mensajeError = "Debe completar los campos Apellido - Nombre - Título"
        return false
    }
    if (panelInput.value !== "IZQ" && panelInput.value !== "DER") {
        mensajeError = "Panel debe ser IZQ o DER"
        return false
    }
    if (subpanelInput.value !== "IZQ" && subpanelInput.value !== "DER") {
        mensajeError = "SubPanel debe ser IZQ o DER"
        return false
    }
    if (nivelInput.value < 1 || nivelInput.value > 6) {
        mensajeError = "Nivel debe ser 1, 2, 3, 4, 5 o 6"
        return false
    }
}
//---------------------------------------------------------------------*
function editarObra() {
    biblioteca.map(obra => {
        if(obra.id === objObra.id) {
            obra.apellido   = apellidoInput.value;
            obra.nombre     = nombreInput.value;
            obra.titulo     = tituloInput.value;
            obra.panel      = panelInput.value;
            obra.subpanel   = subpanelInput.value;
            obra.nivel      = nivelInput.value;
        }
    })

    guardoLote(biblioteca);
    mostrarObras(biblioteca);

    formulario.reset();
    document.getElementById("fApellido").value  = '';
    document.getElementById("fTitulo").value    = '';
    formulario.querySelector('button[type="submit"]').textContent = 'Agregar';
    editando = false;
}
//---------------------------------------------------------------------*
function mostrarObras(tablaGral){
    document.getElementById("tab").innerHTML="";
    tablaGral.forEach(obra => {
        const {apellido, nombre, titulo, panel, subpanel, nivel, id} = obra;
        document.getElementById("tab").innerHTML=document.getElementById("tab").innerHTML+
        `<tr class="table-primary table-responsive">
                <th> ${id}                      </th>
                <td> ${apellido+", "+nombre}    </td>
                <td> ${titulo}                  </td>
                <td> ${panel}                   </td>
                <td> ${subpanel}                </td>
                <td> ${nivel}                   </td>
                <td> <button  class= "btn btn-editar   btn-success colorBoton" onclick="cargarObra(${id})"   >Editar</button>      </td>
                <td> <button  class= "btn btn-eliminar btn-danger"             onclick="eliminarObra(${id})" >Eliminar</button>    </td>
            </tr>`;
    })
}
//---------------------------------------------------------------------*
function cargarObra(kid) {
    const index = biblioteca.findIndex(obra => obra.id === kid);
    const obra = biblioteca[index];
    const {apellido, nombre, titulo, panel, subpanel, nivel, id} = obra;
    apellidoInput.value = apellido;
    nombreInput.value   = nombre;
    tituloInput.value   = titulo;
    panelInput.value    = panel;
    subpanelInput.value = subpanel;
    nivelInput.value    = nivel;
    objObra.id          = id;
    formulario.querySelector('button[type="submit"]').textContent = 'Actualizar';
    editando = true;
    document.getElementById("apellido").focus();
}
//---------------------------------------------------------------------*
function eliminarObra(id) {
    const index = biblioteca.findIndex(obra => obra.id === id);
    const obra = biblioteca[index];
    const {apellido, nombre, titulo, panel, subpanel, nivel, kid} = obra;
    Swal.fire({
        title: 'Está seguro de eliminar la siguiente OBRA?',
        text: "(" + id +") " + apellido + ", " + nombre + " - " + titulo,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, Eliminarla!'
    }).then((result) => {
        if (result.isConfirmed) {
            biblioteca.splice(index,1);
        Swal.fire(
            "(" + id +") "+ apellido + ", " + nombre + " - " + titulo,
            'Eliminada!',
            'La Obra seleccionada ha sido eliminada.',
            'success'
        )
        document.getElementById("fApellido").value  = '';
        document.getElementById("fTitulo").value    = '';    
        guardoLote(biblioteca);
        mostrarObras(biblioteca);
        }
    })
}
//*--------------------------------------------------------------------*
function muestroErrorCarga () {
    Swal.fire({
        icon: 'error',
        title: 'Error Desconocido ...',
        text: "No se pudo leer el archivo de Biblioteca JSON",
    })
}
//*--------------------------------------------------------------------*
function ordenObra(ordenamiento,campo) {  
    if (ordenamiento === "dmaM") {
        salMas    =  1
        salMenos  = -1
    }else {
        salMas    = -1
        salMenos  =  1
    }
    biblioteca.sort(function (a ,b)  {
        if (campo === "codigo") {
            if (a.id > b.id) {
                return salMas;
            }
            if (a.id < b.id) {
                return salMenos;
            }
            // a = b
            return 0;
        } else {
            if (campo === "autor") {
                if (a.apellido+a.nombre > b.apellido+b.nombre) {
                    return salMas;
                }
                if (a.apellido+a.nombre < b.apellido+b.nombre) {
                    return salMenos;
                }
                // a = b
                    return 0;
            } else {
                if (campo === "titulo"){
                    if (a.titulo > b.titulo) {
                        return salMas
                    }
                    if (a.titulo < b.titulo) {
                        return salMenos;
                    }
                        // a = b
                        return 0; 
                } else {
                    if (campo === "panel") {
                        if (a.panel > b.panel) {
                            return salMas
                        }
                        if (a.panel < b.panel) {
                            return salMenos;
                        }
                        // a = b
                        return 0;
                    } else {
                        if (campo === "subpanel") {
                            if (a.subpanel > b.subpanel) {
                                return salMas
                            }
                            if (a.subpanel < b.subpanel) {
                                return salMenos;
                            }
                            // a = b
                            return 0;
                    } else {
                        if (campo === "nivel") {
                            if (a.nivel > b.nivel) {
                                return salMas
                            }
                            if (a.nivel < b.nivel) {
                                return salMenos;
                            }
                            // a = b
                            return 0;
                            }
                        }
                    }
                }
            }
        }
    });
    guardoLote(biblioteca);
    mostrarObras(biblioteca);
}
//*--------------------------------------------------------------------*
function seleObra(campo){
    bibliotecaFiltrada = [];
    console.log(biblioteca);
    switch(campo){
        case "autor":
            const apellidoFiltro = document.getElementById("fApellido").value;
            bibliotecaFiltrada = biblioteca.filter(obra => (obra.apellido+obra.nombre).includes(apellidoFiltro) === true);
            break
        case "titulo":
            const tituloFiltro = document.getElementById("fTitulo").value;
            bibliotecaFiltrada = biblioteca.filter(obra => obra.titulo.includes(tituloFiltro) === true);
            break
        case "panel":
            const panelFiltro = document.getElementById("fPanel").value;
            bibliotecaFiltrada = biblioteca.filter(obra => obra.panel.includes(panelFiltro) === true);
            break
        case "subpanel":
            const subPanelFiltro = document.getElementById("fSubPanel").value;
            bibliotecaFiltrada = biblioteca.filter(obra => obra.subpanel.includes(subPanelFiltro) === true);
            break   
            case "nivel":
                const nivelFiltro = document.getElementById("fNivel").value;
                bibliotecaFiltrada = biblioteca.filter(obra => obra.nivel.includes(nivelFiltro) === true);
                break      
    }
    mostrarObras(bibliotecaFiltrada);  
}
//---------------------------------------------------------------------*
function eliminarFiltros(){
    document.getElementById("fApellido").value  = '';
    document.getElementById("fTitulo").value  = '';
    biblioteca = recuperoLote();
    mostrarObras(biblioteca);
}
//*Fin biblioteca.js***************************************************