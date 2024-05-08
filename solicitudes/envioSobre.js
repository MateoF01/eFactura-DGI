import 'dotenv/config'

import fs, { writeFileSync } from 'fs'
import { parseString } from 'xml2js'
import { incrementarIdEmisor } from '../lib/tools.js'
import { crearCliente, firmarXml, setClientSecurity, ejecutarSolicitudSoap } from '../lib/soap.js'

const sobre_prueba = '../sobre-prueba.xml'

const certificado = '../certificados/La_Riviera.pfx'

const url = 'https://efactura.dgi.gub.uy:6443/ePrueba/ws_eprueba?wsdl' //testing

const cliente = await crearCliente(url, {})

setClientSecurity(cliente, certificado, process.env.PASSWORD)

await incrementarIdEmisor(sobre_prueba)

const xmlData = fs.readFileSync(sobre_prueba, 'utf8')

const args = firmarXml(xmlData, certificado, process.env.PASSWORD)

writeFileSync('../sobre-firmado.xml', args.Datain.xmlData, 'utf8')

const resultado = await ejecutarSolicitudSoap(cliente, 'EFACRECEPCIONSOBREAsync', args)

console.log('----------SOBRE-----------\n')

parseString(resultado[0].Dataout.xmlData, (err, result) => {
  if (err) {
    console.error('Error al parsear el XML:', err)
  } else {
    console.log('Caratula SOBRE: ', JSON.stringify(result.ACKSobre.Caratula))
    console.log('\n')
    console.log('Detalle SOBRE: ', JSON.stringify(result.ACKSobre.Detalle))
  }
})
