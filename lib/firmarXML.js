import fs from 'fs';
import { SignedXml } from 'xml-crypto';
import { DOMParser, XMLSerializer } from 'xmldom';

//Esto probé cuando cuando intentaba firmar el xml directamente

function firmarXml(rutaXml) {
  try {
      const xmlData = fs.readFileSync(rutaXml, 'utf-8');

      const sig = new SignedXml({ 
          privateKey: fs.readFileSync("../certificados/clave-privada.key"),
          publicCert: fs.readFileSync("../certificados/certificado.pem") 
      });

      sig.addReference({
          xpath: "//*[local-name(.)='eFact']",
          digestAlgorithm: "http://www.w3.org/2000/09/xmldsig#sha1",
          transforms: ["http://www.w3.org/2001/10/xml-exc-c14n#"],
      });

      sig.canonicalizationAlgorithm = "http://www.w3.org/TR/2001/REC-xml-c14n-20010315";
      sig.signatureAlgorithm = "http://www.w3.org/2000/09/xmldsig#rsa-sha1";

      sig.computeSignature(xmlData);

      fs.writeFileSync("../signed.xml", sig.getSignedXml());

      console.log("XML firmado correctamente.");
  } catch (error) {
      console.error('Error al firmar el XML:', error);
  }
}

export { firmarXml };
