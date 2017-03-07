
function busyIndicator(show) {};

String.prototype.hash = function() {
  var self = this, range = Array(this.length);
  for(var i = 0; i < this.length; i++) {
    range[i] = i;
  }
  return Array.prototype.map.call(range, function(i) {
    return self.charCodeAt(i).toString(16);
  }).join('');
}

toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": false,
  "progressBar": false,
  "positionClass": "toast-top-right",
  "preventDuplicates": true,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "2000",
  "timeOut": "3000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}

Array.prototype.removeAll = function(key){
    var index = this.indexOf(key);

    if(index === -1) return;

    this.splice(index, 1);
    this.removeAll(key);
}

L.Icon.Default.imagePath = "images/markers/";

if(navigator.serviceWorker){
    navigator.serviceWorker.register('sw.js').then(function(registration) {
      $.get("images/markers/marker-icon-green.png");
      $.get("images/markers/marker-icon-red.png");
      $.get("images/markers/marker-icon-orange.png");
    }).catch(function(err) {
      console.info('ServiceWorker registration failed: ', err);
    });
}
