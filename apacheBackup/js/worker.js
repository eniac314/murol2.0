importScripts('/js/SearchEngine.js');

var app = Elm.SearchEngine.init();

self.addEventListener('message', function(e) {
  app.ports.inbound.send(e.data);
}, false);

app.ports.outbound.subscribe(function(data) {
  self.postMessage(data);
});