let HTML = ''
let Card = ""
let contenidoJSON = ""

function cargoContenidoStreaming() {
    $.ajax({
        url: 'https://randomuser.me/api/?results=12',
        dataType: 'json',
        success: function (data) {
            contenidoJSON = data.results
            for (let i in contenidoJSON) {
                HTML += `<div className="container">
                        <div class="card m-3" style="width: 18rem;">
                            <img src="${contenidoJSON[i].picture.large}" class="card-img-top" alt="...">
                            <div class="card-body">
                                <h5 class="card-title">${contenidoJSON[i].name.first} ${contenidoJSON[i].name.last}</h5>
                                <p class="card-text">${contenidoJSON[i].location.city}, ${contenidoJSON[i].location.country}</p>
                                <p class="card-text">${contenidoJSON[i].dob.age} años</p>
                                <p class="card-text">${contenidoJSON[i].email}</p>
                                <a href="#" class="btn btn-primary">Go somewhere</a>
                            </div>
                        </div>
                        </div>`
                $("#tabladeresultado").html(HTML)
            };
        },
        error: function () {
            Card = "<div class='center black-text'>" +
                "<br><br>" +
                "<br><br>" +
                "<h4>Error al cargar el listado de profesionales, inténtelo de nuevo por favor.</h4>" +
                "<br><br>" +
                "<i class='medium material-icons'>sentiment_very_dissatisfied</i>" +
                "<br><br>" +
                "</div>"
            $("#contenido").html(Card)
        }
    })
}

setTimeout(() => {
    cargoContenidoStreaming()
    $('#contenido').fadeIn("fast", function () {
        $('#cargando').fadeOut(2000)
    })
}, 100)