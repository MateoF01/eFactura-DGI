import forge from 'node-forge'
import { readFileSync } from 'fs'
import { SignedXml } from 'xml-crypto'
import { createClient, WSSecurityCert } from 'soap'
import { EXTRACT_X509_CERTS } from 'xml-crypto/lib/utils.js'

SignedXml.getKeyInfoContent = ({ publicCert, prefix }) => {
  if (publicCert == null) return null
  prefix = prefix ? `${prefix}:` : ''

  let x509Certs = ''

  if (Buffer.isBuffer(publicCert)) {
    publicCert = publicCert.toString('latin1')
  }

  let publicCertMatches = []

  if (typeof publicCert === 'string') {
    publicCertMatches = publicCert.match(EXTRACT_X509_CERTS) || []
  }

  if (publicCertMatches.length > 0) {
    x509Certs = publicCertMatches
      .map(c => {
        const certificate = forge.pki.certificateFromPem(c)
        const issuerName = certificate.issuer.attributes.map(attr => `${attr.shortName}=${attr.value}`).join(', ')
        const serialNumber = certificate.serialNumber
        return (
          `<${prefix}X509IssuerSerial>` +
          `<${prefix}X509IssuerName>${issuerName}</${prefix}X509IssuerName>` +
          `<${prefix}X509SerialNumber>${BigInt(`0x${serialNumber}`).toString()}</${prefix}X509SerialNumber>` +
          `</${prefix}X509IssuerSerial>`
        )
      })
      .join('')
  }

  return `<${prefix}X509Data>${x509Certs}</${prefix}X509Data>`
}

const crearCliente = async (url, options) => {
  try {
    const cliente = await new Promise((resolve, reject) => {
      createClient(url, options, (err, client) => {
        if (err) reject(err)
        else resolve(client)
      })
    })
    return cliente
  } catch (error) {
    throw new Error('Error al crear el cliente SOAP: ' + error.message)
  }
}

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
    digestAlgorithm: 'http://www.w3.org/2001/04/xmlenc#sha256',
    canonicalizationAlgorithm: 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315',
    signatureAlgorithm: 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256',
    hasTimeStamp: false,
    signerOptions: {},
  }

  cliente.setSecurity(new WSSecurityCert(privateKey, certificate, password, options))
}

const ejecutarSolicitudSoap = async (cliente, methodName, args) => {
  try {
    const result = await cliente[methodName](args)
    return result
  } catch (error) {
    throw new Error('Error al ejecutar la solicitud SOAP: ' + error.message)
  }
}

const firmarXml = (xml, certPath, password) => {
  const { privateKey, certificate } = retornaCertificado(certPath, password)

  const sig = new SignedXml({ privateKey: privateKey, publicCert: certificate })
  
  sig.signatureAlgorithm = 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256'
  sig.canonicalizationAlgorithm = 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315'

  sig.addReference({
    xpath: "//*[local-name(.)='EnvioCFE']",
    transforms: ["http://www.w3.org/2000/09/xmldsig#enveloped-signature", "http://www.w3.org/TR/2001/REC-xml-c14n-20010315"],
    digestAlgorithm: 'http://www.w3.org/2001/04/xmlenc#sha256',
    isEmptyUri: true,
  })

  sig.computeSignature(xml, {
    location: {
      reference: "//*[local-name(.)='CFE']",
      action: 'append',
    },
  })
  
  console.log("Sobre firmado")
  return { Datain: { xmlData: sig.getSignedXml() } }
}

export { crearCliente, setClientSecurity, ejecutarSolicitudSoap, firmarXml }
