import 'dotenv/config'

import { parseString } from 'xml2js'
import { crearCliente, setClientSecurity, ejecutarSolicitudSoap } from '../lib/soap.js'
//import { Token } from '../XmlBuilder/Token/Token.js'
import fs from 'fs'

const url = 'https://efactura.dgi.gub.uy:6443/ePrueba/ws_eprueba?wsdl' //testing

const cliente = await crearCliente(url, {})

setClientSecurity(cliente, '../samples/certificados/La_Riviera.pfx', process.env.PASSWORD)


//const token = "4dyL8iPQZIHix6ejRGeVQi0dRDZ0tkS7NkTuHyhJhCEIgb8qXwz9WdJxLw6jwl6KZhdCcpUyJrNBlJeJ5lLSMDJyFaUxKCLoe4P6jU5pX01COiKLKitH/tGA8Txo2w/N"
//const idReceptor = "259721443"

//const tokenBuilder = new Token();
//const xmlData = tokenBuilder.buildXml(idReceptor, token)

const xmlData = fs.readFileSync('../samples/token.xml', 'utf-8')

const args = {
  Datain: {
    xmlData: xmlData,
  },
}

const resultado = await ejecutarSolicitudSoap(cliente, 'EFACCONSULTARESTADOENVIOAsync', args)

parseString(resultado[0].Dataout.xmlData, (err, result) => {
  if (err) {
    console.error('Error al parsear el XML:', err)
  } else {
    console.log(result) //Puede pasar que no se procese en el momento y tarde un toque en dar la respuesta
    
    const caratula = result.ACKCFE?.Caratula
    const detalle = result.ACKCFE?.ACKCFE_Det[0]
    
    console.log('Caratula SOBRE: ', JSON.stringify(caratula))
    console.log('Detalle SOBRE: ', JSON.stringify(detalle)) //esto debe ser un array porque pueden ser varios CFEs
  
  
  }
})

