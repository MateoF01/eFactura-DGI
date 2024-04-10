import forge from 'node-forge'
import { readFileSync } from 'fs'
import { Client, createClient, WSSecurityCert } from 'soap'
import { parseString } from 'xml2js';
import dotenv from 'dotenv';

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

const cliente = await crearCliente(url, {})

setClientSecurity(cliente, './La_Riviera.pfx', process.env.PASSWORD)

const args = {
    Datain: {
        xmlData: ""
    } 

}

const resultado = await ejecutarSolicitudSoap(cliente, "EFACRECEPCIONSOBREAsync", args)

parseString(resultado[0].Dataout.xmlData, (err, result) => {
    if (err) {
        console.error('Error al parsear el XML:', err);
    } else {
        console.log("Caratula: ", JSON.stringify(result.ACKSobre.Caratula))        
        console.log("Detalle: ", JSON.stringify(result.ACKSobre.Detalle))        
    }
    });


