import forge from 'node-forge'
import { readFileSync } from 'fs'
import { Client, createClient, WSSecurityCert } from 'soap'
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
  const options = {
    hasTimeStamp: false,
    signatureAlgorithm: 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256',
    digestAlgorithm: 'http://www.w3.org/2001/04/xmlenc#sha256',
    canonicalizationAlgorithm: 'http://www.w3.org/2001/10/xml-exc-c14n#',
    signerOptions: {
      //prefix: 'ds',
      //attrs: { Id: 'SIG-C7F2874F2B188481A9169565362166845' },
      existingPrefixes: {
        wsse: 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd',
      },
    },
  }
  cliente.setSecurity(new WSSecurityCert(privateKey, certificate, password, options))
}

const ejecutarSolicitudSoap = async (cliente, methodName, args) => {
  try {
      debugger; // Agregar este punto de interrupción
      const result = await cliente[methodName](args);
      return result;
  } catch (error) {
      throw new Error('Error al ejecutar la solicitud SOAP: ' + error.message);
  }
};

export { crearCliente, setClientSecurity, ejecutarSolicitudSoap };


const url = 'https://efactura.dgi.gub.uy:6443/ePrueba/ws_eprueba?wsdl' //testing
//const url2 = 'https://servicios.dgi.gub.uy/serviciosenlinea/envio-cfe' esta me la paso ernesto pero no se de donde la sacó
