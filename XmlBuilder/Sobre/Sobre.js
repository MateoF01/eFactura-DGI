import { DOMParser, XMLSerializer } from 'xmldom'
import { select } from 'xpath'
import {XmlBuilder} from '../XmlBuilder.js'

class Sobre extends XmlBuilder {

    buildXml(args){
        const sobreBase = `<DGICFE:EnvioCFE version="1.0" xsi:schemaLocation="http://cfe.dgi.gub.uy EnvioCFE_v1.11.xsd" xmlns:DGICFE="http://cfe.dgi.gub.uy" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
            <DGICFE:Caratula version="1.0">
                <DGICFE:RutReceptor>${args.RutReceptor}</DGICFE:RutReceptor>
                <DGICFE:RUCEmisor>${args.RUCEmisor}</DGICFE:RUCEmisor>
                <DGICFE:Idemisor>${args.Idemisor}</DGICFE:Idemisor>
                <DGICFE:CantCFE>${args.CantCFE}</DGICFE:CantCFE>
                <DGICFE:Fecha>${args.Fecha}</DGICFE:Fecha>
                <DGICFE:X509Certificate>${args.Certificado}</DGICFE:X509Certificate>
            </DGICFE:Caratula>
        </DGICFE:EnvioCFE>`
          return sobreBase
        }

    insertarCFE(sobreXml, CFE_firmado){//refactorizar con menos librerias

        console.log("SOBREXML: ", sobreXml)
        console.log("CFE_FIRMADO: ", CFE_firmado)
        //la logica sería appendear el cfe firmado antes de </DGICFE:EnvioCFE>
        const finalSobre = "</DGICFE:EnvioCFE>"
        const index = sobreXml.indexOf(finalSobre)
        console.log(index)
        const posicionAInsertar = index - 1

        const updatedXmlContent = sobreXml.slice(0, posicionAInsertar) + CFE_firmado 
                            + sobreXml.slice(posicionAInsertar)


        /*
        const baseDoc = new DOMParser().parseFromString(sobreXml, 'text/xml');
        const fragmentDoc = new DOMParser().parseFromString(CFE_firmado, 'text/xml');
        
        const cfeNode = select("//*[local-name(.)='EnvioCFE']", baseDoc)[0];
        const importedNode = baseDoc.importNode(fragmentDoc.documentElement, true);
        cfeNode.appendChild(importedNode);
        
        const serializer = new XMLSerializer();
        const updatedXmlContent = serializer.serializeToString(baseDoc);
        */
        return updatedXmlContent
    }

}

export { Sobre }


