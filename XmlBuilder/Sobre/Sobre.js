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

}

export { Sobre }


