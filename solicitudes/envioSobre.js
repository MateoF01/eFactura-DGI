import 'dotenv/config'

import fs, { writeFileSync } from 'fs'
import { parseString } from 'xml2js'
import { incrementarIdEmisor, actualizarToken } from '../lib/tools.js'
import { crearCliente, firmarXml, setClientSecurity, ejecutarSolicitudSoap } from '../lib/soap.js'
import { DOMParser, XMLSerializer } from 'xmldom'
import { select } from 'xpath'



const CFE_prueba = '../CFE-prueba.xml'
const sobre_prueba = '../sobre-base.xml'
const certificado = '../certificados/La_Riviera.pfx'

// Seteo cliente
const url = 'https://efactura.dgi.gub.uy:6443/ePrueba/ws_eprueba?wsdl' //testing
const cliente = await crearCliente(url, {})
setClientSecurity(cliente, certificado, process.env.PASSWORD)

// Firmo CFE
const xmlData = fs.readFileSync(CFE_prueba, 'utf8')
const CFE_firmado = firmarXml(xmlData, certificado, process.env.PASSWORD)

writeFileSync('../CFE-firmado.xml', CFE_firmado, 'utf8')

// Inserto CFE en sobre

await incrementarIdEmisor(sobre_prueba)

const sobre = fs.readFileSync(sobre_prueba, 'utf8');
const baseDoc = new DOMParser().parseFromString(sobre, 'text/xml');

const fragmentDoc = new DOMParser().parseFromString(CFE_firmado, 'text/xml');

const cfeNode = select("//*[local-name(.)='EnvioCFE']", baseDoc)[0];
const importedNode = baseDoc.importNode(fragmentDoc.documentElement, true);
cfeNode.appendChild(importedNode);

const serializer = new XMLSerializer();
const updatedXmlContent = serializer.serializeToString(baseDoc);

fs.writeFileSync('../sobre-final.xml', updatedXmlContent);

// Envio a la DGI

const resultado = await ejecutarSolicitudSoap(cliente, 'EFACRECEPCIONSOBREAsync', { Datain: { xmlData: updatedXmlContent} })

console.log('----------SOBRE-----------\n')

parseString(resultado[0].Dataout.xmlData, (err, result) => {
  if (err) {
    console.error('Error al parsear el XML:', err)
  } else {

    const caratula = result.ACKSobre.Caratula
    const detalle = result.ACKSobre.Detalle

    console.log('Caratula SOBRE: ', JSON.stringify(caratula))
    console.log('\n')
    console.log('Detalle SOBRE: ', JSON.stringify(detalle))
    console.log('\n')

    const token = detalle[0]["ParamConsulta"][0]["Token"][0]
    const idreceptor = caratula[0]["IDReceptor"][0]
  
    if (token != undefined){
      actualizarToken(token, idreceptor)
    }
  }
})
