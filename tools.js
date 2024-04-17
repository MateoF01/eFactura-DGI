function construirXML(RutReceptor, RUCEmisor, Idemisor, CantCFE, Fecha, TmstFirma, RznSoc, CdgDGISucur, DomFiscal, Ciudad, Departamento, TpoMoneda, MntTotal, CantLinDet, MntPagar, Items, CAE_ID, DNro, HNro, FecVenc, CAESignature) {
    const xmlData = `
<DGICFE:EnvioCFE version="1.0" xsi:schemaLocation="http://cfe.dgi.gub.uy EnvioCFE_v1.11.xsd" xmlns:DGICFE="http://cfe.dgi.gub.uy" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <DGICFE:Caratula version="1.0">
        <DGICFE:RutReceptor>${RutReceptor}</DGICFE:RutReceptor>
        <DGICFE:RUCEmisor>${RUCEmisor}</DGICFE:RUCEmisor>
        <DGICFE:Idemisor>${Idemisor}</DGICFE:Idemisor>
        <DGICFE:CantCFE>${CantCFE}</DGICFE:CantCFE>
        <DGICFE:Fecha>${Fecha}</DGICFE:Fecha>
        <DGICFE:X509Certificate>${certificado}</DGICFE:X509Certificate>
    </DGICFE:Caratula>
    <ns0:CFE version="1.0" xmlns:ns0="http://cfe.dgi.gub.uy">
        <ns0:eTck>
            <ns0:TmstFirma>${TmstFirma}</ns0:TmstFirma>
            <ns0:Encabezado>
                <ns0:Emisor>
                    <ns0:RUCEmisor>${RUCEmisor}</ns0:RUCEmisor>
                    <ns0:RznSoc>${RznSoc}</ns0:RznSoc>
                    <ns0:CdgDGISucur>${CdgDGISucur}</ns0:CdgDGISucur>
                    <ns0:DomFiscal>${DomFiscal}</ns0:DomFiscal>
                    <ns0:Ciudad>${Ciudad}</ns0:Ciudad>
                    <ns0:Departamento>${Departamento}</ns0:Departamento>
                </ns0:Emisor>
                <ns0:Totales>
                    <ns0:TpoMoneda>${TpoMoneda}</ns0:TpoMoneda>
                    <ns0:MntTotal>${MntTotal}</ns0:MntTotal>
                    <ns0:CantLinDet>${CantLinDet}</ns0:CantLinDet>
                    <ns0:MntPagar>${MntPagar}</ns0:MntPagar>
                </ns0:Totales>
            </ns0:Encabezado>
            <ns0:Detalle>
                ${Items.map(item => `
                <ns0:Item>
                    <ns0:NroLinDet>${item.NroLinDet}</ns0:NroLinDet>
                    <ns0:IndFact>${item.IndFact}</ns0:IndFact>
                    <ns0:NomItem>${item.NomItem}</ns0:NomItem>
                    <ns0:Cantidad>${item.Cantidad}</ns0:Cantidad>
                    <ns0:UniMed>${item.UniMed}</ns0:UniMed>
                    <ns0:PrecioUnitario>${item.PrecioUnitario}</ns0:PrecioUnitario>
                    <ns0:MontoItem>${item.MontoItem}</ns0:MontoItem>
                </ns0:Item>`).join('')}
            </ns0:Detalle>
            <ns0:CAEData>
                <ns0:CAE_ID>${CAE_ID}</ns0:CAE_ID>
                <ns0:DNro>${DNro}</ns0:DNro>
                <ns0:HNro>${HNro}</ns0:HNro>
                <ns0:FecVenc>${FecVenc}</ns0:FecVenc>
            </ns0:CAEData>
        </ns0:eTck>
        ${CAESignature}
    </ns0:CFE>
</DGICFE:EnvioCFE>`;
    return xmlData;
}
export {construirXML}