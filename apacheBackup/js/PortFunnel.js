var PortFunnel={};!function(){function a(e,n){PortFunnel.modules[e]={};var r=n+"/"+e+".js",t=document.createElement("script");t.type="text/javascript",t.src=r,document.head.appendChild(t)}function l(e){if("object"==typeof e){var n=e.module,r=PortFunnel.modules[n];if(r){var t=r.cmd;if(t&&!u[n])return t(e.tag,e.args);var o=u[n];o||(o=[]),o.push(e),u[n]=o,s||d()}}}PortFunnel.subscribe=function(e,n){n||(n={}),portNames=n.portNames,portNames||(portNames=["cmdPort","subPort"]);var r=n.moduleDirectory;r||(r="js/PortFunnel");var t=e.ports,o=t[portNames[1]];PortFunnel.sub=o,t[portNames[0]].subscribe(function(e){var n=l(e);n&&o.send(n)});var u=n.modules;if(u)for(var s in u)a(u[s],r)},PortFunnel.modules={},PortFunnel.sub=null;var u={},s=!1;function d(){queueDrainOutStanding=!0,setTimeout(e,10)}function e(){for(var e in needReschedule=!1,u){var n=PortFunnel.modules[e];if(n){if(n.cmd){var r=u[e];for(var t in delete u[e],r){var o=l(r[t]);o&&PortFunnel.sub.send(o)}}else needReschedule=!0;needReschedule?d():s=!1}else delete u[e]}}}();