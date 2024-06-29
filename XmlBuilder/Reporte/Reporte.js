import {XmlBuilder} from '../XmlBuilder.js'

class Reporte extends XmlBuilder {

    buildXml(args){
        const reporteBase = `<ns1:Reporte xsi:schemaLocation="http://cfe.dgi.gub.uy ReporteDiarioCFE_v1.15.xsd"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xmlns:ds="http://www.w3.org/2000/09/xmldsig#"
            xmlns:ns1="http://cfe.dgi.gub.uy">
            <ns1:Caratula version="1.0">
                <ns1:RUCEmisor>${args.RUCEmisor}</ns1:RUCEmisor>
                <ns1:FechaResumen>${args.FechaResumen}</ns1:FechaResumen>
                <ns1:SecEnvio>${args.SecEnvio}</ns1:SecEnvio>
                <ns1:TmstFirmaEnv>${args.TmstFirmaEnv}</ns1:TmstFirmaEnv>
                <ns1:CantComprobantes>${args.CantComprobantes}</ns1:CantComprobantes>
            </ns1:Caratula>
        </ns1:Reporte>`
          return reporteBase
        }

    insertarRSMN(reporteXml, rsmn){


        const finalReporte = "</ns1:Reporte>"
        const index = reporteXml.indexOf(finalReporte)
        const posicionAInsertar = index - 1

        const updatedXmlContent = reporteXml.slice(0, posicionAInsertar) + rsmn 
                            + reporteXml.slice(posicionAInsertar)

        return updatedXmlContent
    }

}

export { Reporte }


