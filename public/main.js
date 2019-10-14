$(function(){
  var map = L.map('map').setView([-34.60947549180878,-58.440055847167976], 13);

  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  minZoom: 3,
	maxZoom: 18,
	id: 'mapbox.streets',
	accessToken: 'pk.eyJ1Ijoiam9uYXJvZHJpZ3VleiIsImEiOiJjazFvOXhsa3QwZm90M2pwaGFtY2pwb2d4In0.p9yl1DskBoxSTygzcgg7Gg'
  }).addTo(map);

  var form = $('#formAgregar');  
  form.on('submit', function(e){
    e.preventDefault();

    var descripcion = $('#inputNombre').val();
    var direccion = $('#inputDireccion').val();
    var telefono = $('#inputTelefono').val();
    var coordenadasInput = $('#inputCoordenadas').val();
    var coordenadas = coordenadasInput.split(',');
    var categoria = $('#inputCategoria').val();

    var point = L.marker(coordenadas).addTo(map)
      .bindPopup(
        "<b>Descripción: </b>" + descripcion + "<br>" +
        "<b>Dirección: </b>" + direccion + "<br>" +
        "<b>Teléfono: </b>" + telefono + "<br>" +
        "<b>(X, Y): </b>" + coordenadasInput + "<br>" +
        "<b>Categoría: </b>" + categoria
      )
      .openPopup();
  });
});