import {XmlBuilder} from '../XmlBuilder.js'

class eFact extends XmlBuilder {

  buildXml(args){
    const { TmstFirma, Encabezado, Detalle, CAEData } = args;

    const detalleItems = Detalle.map(item => {
        return `<ns0:Item>
                    <ns0:NroLinDet>${item.NroLinDet}</ns0:NroLinDet>
                    <ns0:IndFact>${item.IndFact}</ns0:IndFact>
                    <ns0:NomItem>${item.NomItem}</ns0:NomItem>
                    <ns0:Cantidad>${item.Cantidad}</ns0:Cantidad>
                    <ns0:UniMed>${item.UniMed}</ns0:UniMed>
                    <ns0:PrecioUnitario>${item.PrecioUnitario}</ns0:PrecioUnitario>
                    <ns0:MontoItem>${item.MontoItem}</ns0:MontoItem>
                </ns0:Item>`;
        }).join('');

    const xml = `<ns0:CFE version="1.0" xmlns:ns0="http://cfe.dgi.gub.uy">
            <ns0:eFact>
                <ns0:TmstFirma>${TmstFirma}</ns0:TmstFirma>
                <ns0:Encabezado>
                    <ns0:IdDoc>
                        <ns0:TipoCFE>${Encabezado.IdDoc.TipoCFE}</ns0:TipoCFE>
                        <ns0:Serie>${Encabezado.IdDoc.Serie}</ns0:Serie>
                        <ns0:Nro>${Encabezado.IdDoc.Nro}</ns0:Nro>
                        <ns0:FchEmis>${Encabezado.IdDoc.FchEmis}</ns0:FchEmis>
                        <ns0:FmaPago>${Encabezado.IdDoc.FmaPago}</ns0:FmaPago>
                    </ns0:IdDoc>
                    <ns0:Emisor>
                        <ns0:RUCEmisor>${Encabezado.Emisor.RUCEmisor}</ns0:RUCEmisor>
                        <ns0:RznSoc>${Encabezado.Emisor.RznSoc}</ns0:RznSoc>
                        <ns0:CdgDGISucur>${Encabezado.Emisor.CdgDGISucur}</ns0:CdgDGISucur>
                        <ns0:DomFiscal>${Encabezado.Emisor.DomFiscal}</ns0:DomFiscal>
                        <ns0:Ciudad>${Encabezado.Emisor.Ciudad}</ns0:Ciudad>
                        <ns0:Departamento>${Encabezado.Emisor.Departamento}</ns0:Departamento>
                    </ns0:Emisor>
                    <ns0:Receptor>
                        <ns0:TipoDocRecep>${Encabezado.Receptor.TipoDocRecep}</ns0:TipoDocRecep>
                        <ns0:CodPaisRecep>${Encabezado.Receptor.CodPaisRecep}</ns0:CodPaisRecep>
                        <ns0:DocRecep>${Encabezado.Receptor.DocRecep}</ns0:DocRecep>
                        <ns0:RznSocRecep>${Encabezado.Receptor.RznSocRecep}</ns0:RznSocRecep>
                        <ns0:DirRecep>${Encabezado.Receptor.DirRecep}</ns0:DirRecep>
                        <ns0:CiudadRecep>${Encabezado.Receptor.CiudadRecep}</ns0:CiudadRecep>
                    </ns0:Receptor>
                    <ns0:Totales>
                        <ns0:TpoMoneda>${Encabezado.Totales.TpoMoneda}</ns0:TpoMoneda>
                        <ns0:MntNetoIVATasaBasica>${Encabezado.Totales.MntNetoIVATasaBasica}</ns0:MntNetoIVATasaBasica>
                        <ns0:IVATasaMin>${Encabezado.Totales.IVATasaMin}</ns0:IVATasaMin>
                        <ns0:IVATasaBasica>${Encabezado.Totales.IVATasaBasica}</ns0:IVATasaBasica>
                        <ns0:MntIVATasaBasica>${Encabezado.Totales.MntIVATasaBasica}</ns0:MntIVATasaBasica>
                        <ns0:MntTotal>${Encabezado.Totales.MntTotal}</ns0:MntTotal>
                        <ns0:CantLinDet>${Encabezado.Totales.CantLinDet}</ns0:CantLinDet>
                        <ns0:MontoNF>${Encabezado.Totales.MontoNF}</ns0:MontoNF>
                        <ns0:MntPagar>${Encabezado.Totales.MntPagar}</ns0:MntPagar>
                    </ns0:Totales>
                </ns0:Encabezado>
                <ns0:Detalle>
                    ${detalleItems}
                </ns0:Detalle>
                <ns0:CAEData>
                    <ns0:CAE_ID>${CAEData.CAE_ID}</ns0:CAE_ID>
                    <ns0:DNro>${CAEData.DNro}</ns0:DNro>             
                    <ns0:HNro>${CAEData.HNro}</ns0:HNro>
                    <ns0:FecVenc>${CAEData.FecVenc}</ns0:FecVenc>
                </ns0:CAEData>
            </ns0:eFact>
        </ns0:CFE>`;

    return xml;
    }
}

export {eFact}