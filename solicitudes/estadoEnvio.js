import { crearCliente, setClientSecurity, ejecutarSolicitudSoap } from './index.js'; 
import fs from 'fs'
import { parseString } from 'xml2js';



const url = 'https://efactura.dgi.gub.uy:6443/ePrueba/ws_eprueba?wsdl' //testing

const cliente = await crearCliente(url, {})

setClientSecurity(cliente, './certificados/La_Riviera.pfx', process.env.PASSWORD)

console.log("----------CFEs-----------")

const xmlData = fs.readFileSync('token.xml', 'utf8');

const args = {
  Datain: {
      xmlData: xmlData
  } 
};

const resultado = await ejecutarSolicitudSoap(cliente, "EFACCONSULTARESTADOENVIOAsync", args)


parseString(resultado[0].Dataout.xmlData, (err, result) => {
    if (err) {
        console.error('Error al parsear el XML:', err);
    } else {
        console.log(result)//Puede pasar que no se procese en el momento y tarde un toque en dar la respuesta
        console.log("Caratula SOBRE: ", JSON.stringify(result.ACKCFE?.Caratula))        
        console.log("Detalle SOBRE: ", JSON.stringify(result.ACKCFE?.ACKCFE_Det[0]))//esto debe ser un array porque pueden ser varios CFEs        
    }
  });
