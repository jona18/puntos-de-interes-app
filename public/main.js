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
  var popOverTimeOut;

  getPuntos();

  var form = $('#formAgregar');  
  form.on('submit', function(e){
    e.preventDefault();

    var inputNombre = $('#inputNombre').val();
    var inputDireccion = $('#inputDireccion').val();
    var inputTelefono = $('#inputTelefono').val();
    var inputCategoria = $('#inputCategoria').val();
    var inputCoordenadas = $('#inputCoordenadas').val();

    if(validarCampos(inputNombre, inputDireccion, inputTelefono, inputCategoria, inputCoordenadas)){
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
    }
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
    inputCoordenadas.popover('dispose');
    inputCoordenadas.popover({animation: true, content: 'Coordenadas copiadas.', trigger: 'focus'});
    inputCoordenadas.popover('show');
    clearTimeout(popOverTimeOut);
    hideCoordenadasPopover();
  });

  $('#inputCoordenadas').on('click', function(){
    $('#inputCoordenadas').popover('dispose');
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
    if(feature.properties.categoria === 'Comercial'){
      var markerIcon = L.icon({
        iconUrl: 'marker-icon-green.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: 'marker-shadow.png',
        shadowSize: [41, 41],
        shadowAnchor: [12, 41]
      });
      layer.setIcon(markerIcon);
    }
    if(feature.properties.categoria === 'Residencial'){
      var markerIcon = L.icon({
        iconUrl: 'marker-icon-red.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: 'marker-shadow.png',
        shadowSize: [41, 41],
        shadowAnchor: [12, 41]
      });
      layer.setIcon(markerIcon);
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

  function validarNombre(text){
    var inputNombre = $('#inputNombre');
    if(text.length > 30 || text.replace(/\s+/g, '').length === 0){
      inputNombre.focus();
      inputNombre.popover({animation: true, content: 'Debe llenar este campo correctamente. Maximo de 30 carateres.', trigger: 'focus'});
      inputNombre.popover('show');
      setTimeout(function(){
        inputNombre.popover('hide');
      }, 2000);
      return false;
    } else {
      return true;
    }
  }

  function validarDireccion(text){
    var inputDireccion = $('#inputDireccion');
    if(text.length > 30 || text.replace(/\s+/g, '').length === 0){
      inputDireccion.focus();
      inputDireccion.popover({animation: true, content: 'Debe llenar este campo correctamente. Maximo de 30 carateres.', trigger: 'focus'});
      inputDireccion.popover('show');
      setTimeout(function(){
        inputDireccion.popover('hide');
      }, 2000);
      return false;
    } else {
      return true;
    }
  }

  function validarTelefono(text){
    var inputTelefono = $('#inputTelefono');
    var numero = text.replace(/\s+/g, '');
    if(isNaN(numero) || text.length > 30){
      inputTelefono.focus();
      inputTelefono.popover({animation: true, content: 'Debe llenar este campo correctamente. Solo numeros y un maximo de 20 carateres. Campo no obligatorio.', trigger: 'focus'});
      inputTelefono.popover('show');
      setTimeout(function(){
        inputTelefono.popover('hide');
      }, 2000);
      return false;
    } else if(text === ''){
      return true;
    } else {
      return true;
    }
  }

  function validarCategoria(text){
    var inputCategoria = $('#inputCategoria');
    if(inputCategoria.val() !== 'Comercial' && inputCategoria.val() !== 'Residencial' && inputCategoria.val() !== 'Mixta'){
      inputCategoria.focus();
      inputCategoria.focus();
      inputCategoria.popover({animation: true, content: 'Debe seleccionar una opción.', trigger: 'focus'});
      inputCategoria.popover('show');
      setTimeout(function(){
        inputCategoria.popover('hide');
      }, 2000);
      return false;
    } else {
      return true;
    }
  }

  function validarCoordenadas(text){
    var inputCoordenadas = $('#inputCoordenadas');
    if(!/^[-]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/.test(text)){
      inputCoordenadas.focus();
      inputCoordenadas.popover('dispose');
      inputCoordenadas.popover({animation: true, content: 'Debe llenar este campo correctamente.', trigger: 'focus'});
      inputCoordenadas.popover('show');
      clearTimeout(popOverTimeOut);
      hideCoordenadasPopover();
      
      return false;
    } else {
      return true;
    }
  }

  function validarCampos(inputNombre, inputDireccion, inputTelefono, inputCategoria, inputCoordenadas){
    if(!validarNombre(inputNombre)){
      return false;
    }
    if(!validarDireccion(inputDireccion)){
      return false;
    }
    if(!validarTelefono(inputTelefono)){
      return false;
    }
    if(!validarCategoria(inputCategoria)){
      return false;
    }
    if(!validarCoordenadas(inputCoordenadas)){
      return false;
    }
    return true;
  }

  function hideCoordenadasPopover(){
    popOverTimeOut = setTimeout(function(){
      $('#inputCoordenadas').popover('hide');
    }, 3000);
  }
});