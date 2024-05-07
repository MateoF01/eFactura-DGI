import { crearCliente, setClientSecurity, ejecutarSolicitudSoap } from '../lib/soap.js'; 
import fs from 'fs'
import { parseString } from 'xml2js';
import { incrementarIdEmisor } from '../lib/tools.js';
import { firmarXml } from '../lib/firmarXML.js';

const sobre_prueba = '../sobre-prueba.xml'
const signed = '../signed.xml'
const certificado = '../certificados/La_Riviera.pfx'
const url = 'https://efactura.dgi.gub.uy:6443/ePrueba/ws_eprueba?wsdl' //testing

const cliente = await crearCliente(url, {})

setClientSecurity(cliente, certificado, process.env.PASSWORD)

await incrementarIdEmisor(sobre_prueba)
//firmarXml (sobre_prueba)

const xmlData = fs.readFileSync(signed, 'utf8');

//el problema que veo es que calculo que se me firma la solicitud pero necesito que se firme el xmlData

const args = {
    Datain: {
        xmlData: xmlData
    } 
};


const resultado = await ejecutarSolicitudSoap(cliente, "EFACRECEPCIONSOBREAsync", args)


console.log("----------SOBRE-----------\n")


parseString(resultado[0].Dataout.xmlData, (err, result) => {
    if (err) {
        console.error('Error al parsear el XML:', err);
    } else {
        console.log("Caratula SOBRE: ", JSON.stringify(result.ACKSobre.Caratula))  
        console.log("\n")      
        console.log("Detalle SOBRE: ", JSON.stringify(result.ACKSobre.Detalle))        
    }
  });


