import { XmlBuilder } from '../XmlBuilder.js';

class eFact extends XmlBuilder {
    buildXml(args) {
        const { TmstFirma, Encabezado, Detalle, Referencia, CAEData } = args;

        // Construir las secciones comunes del XML
        const xmlHeader = `
            <ns0:TmstFirma>${TmstFirma}</ns0:TmstFirma>
            <ns0:Encabezado>
                ${this.buildIdDoc(Encabezado.IdDoc)}
                ${this.buildEmisor(Encabezado.Emisor)}
                ${this.buildReceptor(Encabezado.Receptor)}
                ${this.buildTotales(Encabezado.Totales)}
            </ns0:Encabezado>
            <ns0:Detalle>
                ${Detalle.map(item => this.buildItem(item)).join('')}
            </ns0:Detalle>
        `;

        // Añadir sección de referencia solo para notas de crédito y débito
        const xmlReferencia = Encabezado.IdDoc.TipoCFE === '111' ? '' : `
        <ns0:Referencia>
            <ns0:Referencia>
                    ${this.buildReferencia(Referencia)}
            </ns0:Referencia>
        </ns0:Referencia>
        `;

        const xmlCAE = `${this.buildCAEData(CAEData)}`;

        return `
            <ns0:CFE version="1.0" xmlns:ns0="http://cfe.dgi.gub.uy">
                <ns0:eFact>
                    ${xmlHeader}
                    ${xmlReferencia}
                    ${xmlCAE}
                </ns0:eFact>
            </ns0:CFE>
        `;
    }

    buildIdDoc(idDoc) {
        return `
            <ns0:IdDoc>
                <ns0:TipoCFE>${idDoc.TipoCFE}</ns0:TipoCFE>
                <ns0:Serie>${idDoc.Serie}</ns0:Serie>
                <ns0:Nro>${idDoc.Nro}</ns0:Nro>
                <ns0:FchEmis>${idDoc.FchEmis}</ns0:FchEmis>
                <ns0:FmaPago>${idDoc.FmaPago}</ns0:FmaPago>
            </ns0:IdDoc>
        `;
    }

    buildEmisor(emisor) {
        return `
            <ns0:Emisor>
                <ns0:RUCEmisor>${emisor.RUCEmisor}</ns0:RUCEmisor>
                <ns0:RznSoc>${emisor.RznSoc}</ns0:RznSoc>
                <ns0:CdgDGISucur>${emisor.CdgDGISucur}</ns0:CdgDGISucur>
                <ns0:DomFiscal>${emisor.DomFiscal}</ns0:DomFiscal>
                <ns0:Ciudad>${emisor.Ciudad}</ns0:Ciudad>
                <ns0:Departamento>${emisor.Departamento}</ns0:Departamento>
            </ns0:Emisor>
        `;
    }

    buildReceptor(receptor) {
        return `
            <ns0:Receptor>
                <ns0:TipoDocRecep>${receptor.TipoDocRecep}</ns0:TipoDocRecep>
                <ns0:CodPaisRecep>${receptor.CodPaisRecep}</ns0:CodPaisRecep>
                <ns0:DocRecep>${receptor.DocRecep}</ns0:DocRecep>
                <ns0:RznSocRecep>${receptor.RznSocRecep}</ns0:RznSocRecep>
                <ns0:DirRecep>${receptor.DirRecep}</ns0:DirRecep>
                <ns0:CiudadRecep>${receptor.CiudadRecep}</ns0:CiudadRecep>
            </ns0:Receptor>
        `;
    }

    buildTotales(totales) {
        return `
            <ns0:Totales>
                <ns0:TpoMoneda>${totales.TpoMoneda}</ns0:TpoMoneda>
                <ns0:MntNetoIVATasaBasica>${totales.MntNetoIVATasaBasica}</ns0:MntNetoIVATasaBasica>
                <ns0:IVATasaMin>${totales.IVATasaMin}</ns0:IVATasaMin>
                <ns0:IVATasaBasica>${totales.IVATasaBasica}</ns0:IVATasaBasica>
                <ns0:MntIVATasaBasica>${totales.MntIVATasaBasica}</ns0:MntIVATasaBasica>
                <ns0:MntTotal>${totales.MntTotal}</ns0:MntTotal>
                <ns0:CantLinDet>${totales.CantLinDet}</ns0:CantLinDet>
                <ns0:MontoNF>${totales.MontoNF}</ns0:MontoNF>
                <ns0:MntPagar>${totales.MntPagar}</ns0:MntPagar>
            </ns0:Totales>
        `;
    }

    buildItem(item) {
        return `
            <ns0:Item>
                <ns0:NroLinDet>${item.NroLinDet}</ns0:NroLinDet>
                <ns0:IndFact>${item.IndFact}</ns0:IndFact>
                <ns0:NomItem>${item.NomItem}</ns0:NomItem>
                <ns0:Cantidad>${item.Cantidad}</ns0:Cantidad>
                <ns0:UniMed>${item.UniMed}</ns0:UniMed>
                <ns0:PrecioUnitario>${item.PrecioUnitario}</ns0:PrecioUnitario>
                <ns0:MontoItem>${item.MontoItem}</ns0:MontoItem>
            </ns0:Item>
        `;
    }

    buildReferencia(referencia) {
        return `
            <ns0:NroLinRef>${referencia.NroLinRef}</ns0:NroLinRef>
            <ns0:TpoDocRef>${referencia.TpoDocRef}</ns0:TpoDocRef>
            <ns0:Serie>${referencia.Serie}</ns0:Serie>
            <ns0:NroCFERef>${referencia.NroCFERef}</ns0:NroCFERef>
        `;
    }

    buildCAEData(caeData) {
        return `
            <ns0:CAEData>
                <ns0:CAE_ID>${caeData.CAE_ID}</ns0:CAE_ID>
                <ns0:DNro>${caeData.DNro}</ns0:DNro>
                <ns0:HNro>${caeData.HNro}</ns0:HNro>
                <ns0:FecVenc>${caeData.FecVenc}</ns0:FecVenc>
            </ns0:CAEData>
        `;
    }
}

export { eFact };
