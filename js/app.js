let DB;
//Los campos del Form
const pacienteInput = document.querySelector('#paciente');
const emailInput = document.querySelector('#email');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');
// User Interface
const formulario = document.querySelector('#nuevo-turno');
const containerTurnos = document.querySelector('#turnos');

// const heading = document.querySelector('#administra')
const submitButton = $(".btn")
let editing;

function eventListeners() {
    pacienteInput.addEventListener('change', datosTurno);
    emailInput.addEventListener('change', datosTurno);
    telefonoInput.addEventListener('change', datosTurno);
    fechaInput.addEventListener('change', datosTurno);
    horaInput.addEventListener('change', datosTurno);
    sintomasInput.addEventListener('change', datosTurno);

    formulario.addEventListener('submit', nuevoTurno);
}

window.onload = () => {
    eventListeners();

    createDB();
}

//Obj con la info del turno
const turnosObj = {
    paciente: '',
    email: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: '',
    id: ''
}

//Funcion que agrega los datos ingresados en los inputs
const datosTurno = (e) => {
    turnosObj[e.target.name] = e.target.value;
}


//Validacion y agregado de turnos a la clase de Turnos
const nuevoTurno = (e) => {
    e.preventDefault();
    const { paciente, email, telefono, fecha, hora, sintomas, id } = turnosObj;

    //validacion de campos
    if (paciente === '' || email === '' || telefono === '' || fecha === '' || hora === '' || sintomas === '') {
        ui.imprimirAlerta('Todos los campos son obligatorios', 'error');

        return;
    }

    if (editing) {
        ui.imprimirAlerta('Se editó correctamente', 'error');

        //Pasar el obj del turnos edicion
        adminTurnos.editarTurno({ ...turnosObj });

        //Editar el indexDB
        const transaction = DB.transaction(['turnos'], 'readwrite');
        const objectStore = transaction.objectStore('turnos');

        objectStore.put(turnosObj);

        transaction.oncomplete = () => {
            formulario.querySelector('button[type="submit"]').textContent = 'Crear Turno';
            //Sacar el modo edicion
            editing = false;
        }

        transaction.onerror = () => {
            console.log('Hubo un error');
        }


    } else {
        //Agregar id
        turnosObj.id = Date.now();

        //Crear nuevo turno
        adminTurnos.agregarTurno({ ...turnosObj });

        //Insertando el registro en indexDB
        const transaction = DB.transaction(['turnos'], 'readwrite');

        // Habilitando el ObjStore
        const objectStore = transaction.objectStore('turnos');

        //Insertando en BD
        objectStore.add(turnosObj);

        transaction.oncomplete = () => {
            console.log('Turno agregado');

            //Mensaje de confirmacion
            ui.imprimirAlerta('Se agregó correctamente', 'error');
        }
    }

    // //Agregar id
    // turnosObj.id = Date.now()

    // //Crear nuevo turno
    // adminTurnos.agregarTurno({ ...turnosObj })

    //Reinicio de obj
    resetObj()

    //Reinicio de form
    formulario.reset();

    //Agrega turno al localstorage
    updateStorage();

    //Agrega turno al html
    ui.imprimirTurno();
    //adminTurnos
}
// eventListeners()

// jQuery agregado al proyecto

$("#add").click(function () {
    alert("Turno agregado correctamente");
});

$(document).ready(function () {
    var inputs = $('.input_highlight');
    inputs.hover(function () {
        if ($(this).hasClass('highlight') === false)
            $(this).addClass('highlight');
    },
        function () {
            $(this).removeClass('highlight');
        }
    );
});

$("input").focus(function () {
    $(this).css("background-color", "#000000");
    $(this).css("color", "#ffff");

});
//Class de Turnos
class Turnos {
    constructor() {
        this.turnos = [];
    }

    agregarTurno(turno) {
        this.turnos = [...this.turnos, turno];
        console.log(this.turnos);
    }

    eliminarTurno(id) {
        this.turnos = this.turnos.filter(turno => turno.id !== id)
    }

    editarTurno(turnoActualizado) {
        this.turnos = this.turnos.map(turno => turno.id === turnoActualizado.id ? turnoActualizado : turno);
    }

}


//Class de User Interface
class UserInterface {
    imprimirAlerta(mensaje, tipo) {
        //Creacion del div
        const divMessage = document.createElement('div');
        divMessage.classList.add('text-center', 'alert', 'd-block', 'col-12');

        //Agregar clase segun el tipo de error
        if (tipo === 'error') {
            divMessage.classList.add('alert-danger');
        } else if (tipo === 'success') {
            divMensaje.classList.add('alert-warning');
        }
        //Mensaje de error
        divMessage.textContent = mensaje;

        //Insertar div en el DOM
        document.querySelector('#contenido').insertBefore(divMessage, document.querySelector('.agregar-cita'));

        //Sacar el mensaje despues de 5seg
        setTimeout(() => {
            divMessage.remove()
        }, 5000)
    }

    imprimirTurno() {

        this.removeHtml()

        //Leer el contenido de la BD
        const objectStore = DB.transaction('turnos').objectStore('turnos');

        const total = objectStore.count();

        total.onsuccess = function () {
            console.log(total.result)
        }

        objectStore.openCursor().onsuccess = function (e) {
            const cursor = e.target.result;

            if (cursor) {

                const { paciente, email, telefono, fecha, hora, sintomas, id } = cursor.value;
                const divTurno = document.createElement('div');
                divTurno.classList.add('cita', 'p-3');
                divTurno.dataset.id = id;

                const pacienteTxt = document.createElement('h2');
                pacienteTxt.classList.add('card-title', 'font-weight-bolder');
                pacienteTxt.textContent = paciente;

                const pacienteEmail = document.createElement('p');
                pacienteEmail.innerHTML = `
                <span class="font-weight-bolder">Email: </span> ${email}
            `;

                const pacienteTelefono = document.createElement('p');
                pacienteTelefono.innerHTML = `
                <span class="font-weight-bolder">Teléfono: </span> ${telefono}
            `;

                const pacienteFecha = document.createElement('p');
                pacienteFecha.innerHTML = `
                <span class="font-weight-bolder">Fecha: </span> ${fecha}
            `;

                const pacienteHora = document.createElement('p');
                pacienteHora.innerHTML = `
                <span class="font-weight-bolder">Hora: </span> ${hora}
            `;

                const pacienteSintomas = document.createElement('p');
                pacienteSintomas.innerHTML = `
                <span class="font-weight-bolder">Síntomas: </span> ${sintomas}
            `;

                //Boton que elimina el turno
                const btnEliminar = document.createElement('button');
                btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
                btnEliminar.innerHTML = 'Eliminar <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>';

                btnEliminar.onclick = () => eliminarTurno(id);

                //Boton para editar el turno
                const btnEditar = document.createElement('button');
                btnEditar.classList.add('btn', 'btn-info');
                btnEditar.innerHTML = ('Editar <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>');
                const turno = cursor.value;
                btnEditar.onclick = () => editarTurno(turno);
                //Add txt to pacienteTxt
                divTurno.appendChild(pacienteTxt);
                divTurno.appendChild(pacienteEmail);
                divTurno.appendChild(pacienteTelefono);
                divTurno.appendChild(pacienteFecha);
                divTurno.appendChild(pacienteHora);
                divTurno.appendChild(pacienteSintomas);
                divTurno.appendChild(btnEliminar);
                divTurno.appendChild(btnEditar);

                //Add to HTML
                containerTurnos.appendChild(divTurno);

                cursor.continue();
            }
        }


    }

    removeHtml() {
        while (containerTurnos.firstChild) {
            containerTurnos.removeChild(containerTurnos.firstChild)
        }
    }
}



const ui = new UserInterface();
const adminTurnos = new Turnos();



const resetObj = () => {
    turnosObj.paciente = '';
    turnosObj.email = '';
    turnosObj.telefono = '';
    turnosObj.hora = '';
    turnosObj.fecha = '';
    turnosObj.sintomas = '';
}

const updateStorage = () => {
    localStorage.setItem('turnos', JSON.stringify(adminTurnos))
}

const eliminarTurno = (id) => {

    const transaction = DB.transaction(['turnos'], 'readwrite');
    const objectStore = transaction.objectStore('turnos');

    objectStore.delete(id)

    transaction.oncomplete = () => {
        console.log(`Turno ${id} eliminado...`);
        ui.imprimirTurno();
    }

    transaction.onerror = () => {
        console.log('Hubo un error...')
    }
}

//Carga de datos y la edicion
const editarTurno = (turno) => {
    const { paciente, email, telefono, fecha, hora, sintomas, id } = turno;

    //Completar los inputs
    pacienteInput.value = paciente;
    emailInput.value = email;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    //Completar el Obj
    turnosObj.paciente = paciente;
    turnosObj.email = email;
    turnosObj.telefono = telefono;
    turnosObj.fecha = fecha;
    turnosObj.hora = hora;
    turnosObj.sintomas = sintomas;
    turnosObj.id = id;

    //Cambio de texto en el boton
    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';

    editing = true;
}

const createDB = () => {
    //Creacion de base de datos version 1.0
    const createDB = window.indexedDB.open('turnos', 1);

    // En caso de error
    createDB.onerror = function () {
        console.log('Hubo un error');
    };

    // En caso que este todo bien
    createDB.onsuccess = function () {
        console.log('BD Creada')

        DB = createDB.result;
        console.log(DB);

        // Si todo sale bien, muestro los turnos al cargar  (indexDB estara listo)
        ui.imprimirTurno();
    }

    //Definir el schema
    createDB.onupgradeneeded = function (e) {
        const db = e.target.result;

        const objectStore = db.createObjectStore('turnos', {
            keyPath: 'id',
            autoIncrement: true
        });

        objectStore.createIndex('paciente', 'paciente', { unique: false });
        objectStore.createIndex('email', 'email', { unique: false });
        objectStore.createIndex('telefono', 'telefono', { unique: false });
        objectStore.createIndex('fecha', 'fecha', { unique: false });
        objectStore.createIndex('hora', 'hora', { unique: true });
        objectStore.createIndex('sintomas', 'sintomas', { unique: false });
        objectStore.createIndex('id', 'id', { unique: true });

        console.log('DB creada')
    }
}