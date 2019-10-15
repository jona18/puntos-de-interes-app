$(function(){
  var map = L.map('map').setView([-34.60947549180878,-58.440055847167976], 13);

  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  minZoom: 3,
	maxZoom: 18,
	id: 'mapbox.streets',
	accessToken: 'pk.eyJ1Ijoiam9uYXJvZHJpZ3VleiIsImEiOiJjazFvOXhsa3QwZm90M2pwaGFtY2pwb2d4In0.p9yl1DskBoxSTygzcgg7Gg'
  }).addTo(map);

  var myLayer;

  getPuntos();

  var form = $('#formAgregar');  
  form.on('submit', function(e){
    e.preventDefault();

    var formData = form.serialize();

    $.ajax({
      type: 'POST',
      url: '/createPuntos',
      data: formData,
      datatype: 'json',
      success: function(data){
        updateMap(data);
        abrirPopup(myLayer);
      }
    });
  });

  map.on('popupopen', function(e){
    $('.botonBorrar').on('click', borrarPunto);
  });
  map.on('click', function(e){
    var y = e.latlng.lat;
    var x = e.latlng.lng;
    var inputCoordenadas = $('#inputCoordenadas');

    inputCoordenadas.val(y + ',' + x);
    inputCoordenadas.focus();
    inputCoordenadas.popover({animation: true, content: 'Coordenadas copiadas.', trigger: 'focus'});
    inputCoordenadas.popover('show');
    setTimeout(function(){
      inputCoordenadas.popover('hide');
    }, 2000);
  });

  function getPuntos(){
    $.ajax({
      type: 'GET',
      url: '/getPuntos',
      dataType: 'json',
      success: function(data){
        updateMap(data);
      }
    });
  }

  function onEachFeature(feature, layer) {
    if (feature.properties && feature.properties.popupContent) {
      layer.bindPopup(feature.properties.popupContent);
    }
  }

  function updateMap(data){
    if(myLayer) {
      myLayer.remove();
    }
    myLayer = L.geoJSON(data, {onEachFeature: onEachFeature}).addTo(map);
  }

  function abrirPopup(layer){
    var ultimoMarcador = Object.keys(layer._layers)[Object.keys(layer._layers).length - 1]
    layer._layers[ultimoMarcador].openPopup();
  }

  function borrarPunto(e){
    var id = "id=" + $(e.currentTarget).attr('id').replace('punto', '');

    $.ajax({
      type: 'DELETE',
      url: '/deletePuntos',
      data: id,
      success: function(data){
        updateMap(data);
      }
    });
  }
});