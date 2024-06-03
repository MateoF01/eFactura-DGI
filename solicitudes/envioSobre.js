import 'dotenv/config'

import fs, { writeFileSync } from 'fs'
import { parseString } from 'xml2js'
import { incrementarIdEmisor, actualizarToken } from '../lib/tools.js'
import { crearCliente, firmarXml, setClientSecurity, ejecutarSolicitudSoap } from '../lib/soap.js'
import { DOMParser, XMLSerializer } from 'xmldom'
import { select } from 'xpath'

import {CFEFactory} from '../XmlBuilder/CFEFactory.js'
import { Sobre } from '../XmlBuilder/Sobre/Sobre.js'


const certificado = '../certificados/La_Riviera.pfx'
const jsonSobre = '../samples/jsons/sobre-base.json'
const jsonEFact = '../samples/jsons/cfe-eFact.json'

// Seteo cliente
const url = 'https://efactura.dgi.gub.uy:6443/ePrueba/ws_eprueba?wsdl' //testing
const cliente = await crearCliente(url, {})
setClientSecurity(cliente, certificado, process.env.PASSWORD)

// Creo el sobre

//await incrementarIdEmisor(sobre_prueba)
const args_sobre = JSON.parse(fs.readFileSync(jsonSobre, 'utf8'))

const sobreBuilder = new Sobre();
let sobreXml = sobreBuilder.buildXml(args_sobre)


// Construyo y Firmo CFE

const argsCFE = JSON.parse(fs.readFileSync(jsonEFact, 'utf8'))

const factory = new CFEFactory();
const builder = await factory.createBuilder('eFact'); // yo le paso a la fabrica el cfe que quiero (será un for de cfes)

const xmlCFE = builder.buildXml(argsCFE);
const CFE_firmado = firmarXml(xmlCFE, certificado, process.env.PASSWORD)

// Inserto CFE en sobre

const baseDoc = new DOMParser().parseFromString(sobreXml, 'text/xml');

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
