import forge from 'node-forge'
import { readFileSync } from 'fs'
import { Client, createClient, WSSecurityCert } from 'soap'
import { parseString } from 'xml2js';
import dotenv from 'dotenv';
import {construirXML} from './tools.js'
import fs from 'fs'

dotenv.config();

const crearCliente = async (url, options) => {
    try {
      const cliente = await new Promise((resolve, reject) => {
        createClient(url, options, (err, client) => {
          if (err) reject(err);
          else resolve(client);
        });
      });
      return cliente;
    } catch (error) {
      throw new Error('Error al crear el cliente SOAP: ' + error.message);
    }
  };

  const retornaCertificado = (pfxPath, password) => {
    const pfxFile = readFileSync(pfxPath)
  
    const p12Der = forge.util.decode64(pfxFile.toString('base64'))
    const p12Asn1 = forge.asn1.fromDer(p12Der)
    const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, password)
  
    const keyObj = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag })[forge.pki.oids.pkcs8ShroudedKeyBag][0]
    const privateKey = forge.pki.privateKeyToPem(keyObj.key)
  
    const certObj = p12.getBags({ bagType: forge.pki.oids.certBag })[forge.pki.oids.certBag][0]
    const certificate = forge.pki.certificateToPem(certObj.cert)
  
    return { privateKey, certificate }
  }

  const setClientSecurity = (cliente, certPath, password) => {
    const { privateKey, certificate } = retornaCertificado(certPath, password)
    //console.log(privateKey)
    //console.log(certificate)
    cliente.setSecurity(new WSSecurityCert(privateKey, certificate, password))
  }

  const ejecutarSolicitudSoap = async (cliente, methodName, args) => {
    try {
        const result = await cliente[methodName](args);
        return result;
    } catch (error) {
        throw new Error('Error al ejecutar la solicitud SOAP: ' + error.message);
    }
};

const url = 'https://efactura.dgi.gub.uy:6443/ePrueba/ws_eprueba?wsdl' //testing
//const url2 = 'https://servicios.dgi.gub.uy/serviciosenlinea/envio-cfe' esta me la paso ernesto pero no se de donde la sacó

const cliente = await crearCliente(url, {})

setClientSecurity(cliente, './La_Riviera.pfx', process.env.PASSWORD)

const now = new Date();
const offset = -3 * 60; 
const offsetDate = new Date(now.getTime() + offset * 60000); 
const formattedDate = offsetDate.toISOString().slice(0, 19) + "-03:00";

const RutReceptor = 219999830019;
const RUCEmisor = 219999820013;
const Idemisor = 3009;
const CantCFE = 1;

//const xmlData = construirXML(RutReceptor, RUCEmisor, Idemisor, CantCFE, formattedDate)

const xmlData = fs.readFileSync('ejemplo-sobre.xml', 'utf8');

const args = {
    Datain: {
        xmlData: xmlData
    } 
};


const resultado = await ejecutarSolicitudSoap(cliente, "EFACRECEPCIONSOBREAsync", args)



parseString(resultado[0].Dataout.xmlData, (err, result) => {
    if (err) {
        console.error('Error al parsear el XML:', err);
    } else {
        console.log("Caratula SOBRE: ", JSON.stringify(result.ACKSobre.Caratula))        
        console.log("Detalle SOBRE: ", JSON.stringify(result.ACKSobre.Detalle))        
    }
  });

  const xmlCFE = resultado[1] // ver como parsear

