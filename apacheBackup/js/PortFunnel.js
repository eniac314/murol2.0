!function(e){function o(e){if("object"==typeof e){var n=e.module,r=PortFunnel.modules[n];if(r){var t=r.cmd;if(t&&!s[n])return t(e.tag,e.args);var u=s[n];u||(u=[]),u.push(e),s[n]=u,l||a()}}}PortFunnel={},e.PortFunnel=PortFunnel,PortFunnel.subscribe=function(e,n){n||(n={}),portNames=n.portNames,portNames||(portNames=["cmdPort","subPort"]);var r=e.ports,t=r[portNames[1]];PortFunnel.sub=t,r[portNames[0]].subscribe(function(e){var n=o(e);n&&t.send(n)})},PortFunnel.modules={},PortFunnel.sub=null;var s={},l=!1;function a(){queueDrainOutStanding=!0,setTimeout(n,10)}function n(){for(var e in needReschedule=!1,s){var n=PortFunnel.modules[e];if(n){if(n.cmd){var r=s[e];for(var t in delete s[e],r){var u=o(r[t]);u&&PortFunnel.sub.send(u)}}else needReschedule=!0;needReschedule?a():l=!1}else delete s[e]}}}(this);