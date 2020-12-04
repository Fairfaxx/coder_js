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
const submitButton = $(".btn")


function eventListeners() {
    pacienteInput.addEventListener('change', datosTurno);
    emailInput.addEventListener('change', datosTurno);
    telefonoInput.addEventListener('change', datosTurno);
    fechaInput.addEventListener('change', datosTurno);
    horaInput.addEventListener('change', datosTurno);
    sintomasInput.addEventListener('change', datosTurno);

    formulario.addEventListener('submit', nuevoTurno);
}


//Obj con la info del turno
const turnosObj = {
    paciente: '',
    email: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: '',
}

//Funcion que agrega los datos ingresados en los inputs
const datosTurno = (e) => {
    turnosObj[e.target.name] = e.target.value;
}


//Validacion y agregado de turnos a la clase de Turnos
const nuevoTurno = (e) => {
    e.preventDefault();
    const { paciente, email, telefono, fecha, hora, sintomas } = turnosObj;

    //validacion de campos
    if (paciente === '' || email === '' || telefono === '' || fecha === '' || hora === '' || sintomas === '') {
        ui.imprimirAlerta('Todos los campos son obligatorios', 'error');

        return;
    }

    //Agregar id
    turnosObj.id = Date.now()

    //Crear nuevo turno
    adminTurnos.agregarTurno({ ...turnosObj })

    //Reinicio de obj
    resetObj()

    //Reinicio de form
    formulario.reset();

    //Agrega turno al localstorage
    updateStorage()

    //Agrega turno al html
    ui.imprimirTurno(adminTurnos)

}
eventListeners()

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
    $(this).css("background-color", "#D41872");
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
            divMensaje.classList.add('alert-success');
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

    imprimirTurno({ turnos }) {

        this.removeHtml()

        turnos.map(turno => {
            const { paciente, email, telefono, fecha, hora, sintomas, id } = turno;
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

            //Add txt to pacienteTxt
            divTurno.appendChild(pacienteTxt);
            divTurno.appendChild(pacienteEmail);
            divTurno.appendChild(pacienteTelefono);
            divTurno.appendChild(pacienteFecha);
            divTurno.appendChild(pacienteHora);
            divTurno.appendChild(pacienteSintomas);

            //Add to HTML
            containerTurnos.appendChild(divTurno);
        })
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

