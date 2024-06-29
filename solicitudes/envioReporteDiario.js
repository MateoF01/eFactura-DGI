import 'dotenv/config'

import fs, { writeFileSync } from 'fs'
import { parseString } from 'xml2js'
import { incrementarIdEmisor, actualizarToken } from '../lib/tools.js'
import { crearCliente, firmarReporte, setClientSecurity, ejecutarSolicitudSoap } from '../lib/soap.js'

import { Factory } from '../XmlBuilder/Factory.js'
import { Reporte } from '../XmlBuilder/Reporte/Reporte.js'

const certificado = '../samples/certificados/La_Riviera.pfx'
const jsonReporte = '../samples/jsons/reporte-base.json'
const jsonRsmnTck = '../samples/jsons/rsmn-Tck.json'

// Seteo cliente
const url = 'https://efactura.dgi.gub.uy:6443/ePrueba/ws_eprueba?wsdl' //testing
const cliente = await crearCliente(url, {})
setClientSecurity(cliente, certificado, process.env.PASSWORD)

// Creo el sobre

const args_reporte = JSON.parse(fs.readFileSync(jsonReporte, 'utf8'))

const reporteBuilder = new Reporte();
let reporteXml = reporteBuilder.buildXml(args_reporte)

const argsRSMN = JSON.parse(fs.readFileSync(jsonRsmnTck, 'utf8'))
// Construyo RSMN y lo agrego al reporte
for (let i = 0; i < 1; i++){
  const factory = new Factory('./RSMNs');
  const builder = await factory.createBuilder('RsmnTck'); // yo le paso a la fabrica el cfe que quiero (será un for de cfes)
  
  const xmlRSmn = builder.buildXml(argsRSMN);

  // Inserto RSMN en reporte
  
  reporteXml = reporteBuilder.insertarRSMN(reporteXml, xmlRSmn)

}

//FIRMO EL REPORTE

const reporteFirmado = firmarReporte(reporteXml, certificado, process.env.PASSWORD)

fs.writeFileSync('../samples/reporte-final.xml', reporteFirmado);

// Envio a la DGI

const resultado = await ejecutarSolicitudSoap(cliente, 'EFACRECEPCIONREPORTEAsync', { Datain: { xmlData: reporteFirmado} })

console.log('----------REPORTE-----------\n')

parseString(resultado[0].Dataout.xmlData, (err, result) => {
  if (err) {
    console.error('Error al parsear el XML:', err)
  } else {

    //!!!!
    //Si me dice que no existe caratula es porque estoy mandando un reporte duplicado     
    //!!!!

    //console.log(result.Respuestas.Respuesta)

    const caratula = result.ACKRepDiario.Caratula
    const detalle = result.ACKRepDiario.Detalle

    console.log('Caratula SOBRE: ', JSON.stringify(caratula))
    console.log('\n')
    console.log('Detalle SOBRE: ', JSON.stringify(detalle))
    console.log('\n')
    
    }
    
})
