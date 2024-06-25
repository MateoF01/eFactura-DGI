import { XmlBuilder } from '../XmlBuilder.js';

class eTck extends XmlBuilder {
    buildXml(args) {
        const {timestamp, encabezado, detalle, referencia, caeData } = args;

        // Construir las secciones comunes del XML
        const xmlHeader = `
            <ns0:TmstFirma>${timestamp}</ns0:TmstFirma>
            <ns0:Encabezado>
                ${this.buildIdDoc(encabezado.idDoc)}
                ${this.buildEmisor(encabezado.emisor)}
                ${this.buildReceptor(encabezado.receptor)}
                ${this.buildTotales(encabezado.totales)}
            </ns0:Encabezado>
            <ns0:Detalle>
                ${detalle.map(item => this.buildItem(item)).join('')}
            </ns0:Detalle>
        `;

        // Añadir sección de referencia solo para notas de crédito y débito
        const xmlReferencia = encabezado.idDoc.tipoCFE === '101' ? '' : `
        <ns0:Referencia>
            <ns0:Referencia>
                    ${this.buildReferencia(referencia)}
            </ns0:Referencia>
        </ns0:Referencia>
        `;

        const xmlCAE = `${this.buildCAEData(caeData)}`;


        return `
            <ns0:CFE version="1.0" xmlns:ns0="http://cfe.dgi.gub.uy">
                <ns0:eTck>
                    ${xmlHeader}
                    ${xmlReferencia}
                    ${xmlCAE}
                </ns0:eTck>
            </ns0:CFE>
        `;
    }

    buildIdDoc(idDoc) {
        return `
            <ns0:IdDoc>
                <ns0:TipoCFE>${idDoc.tipoCFE}</ns0:TipoCFE>
                <ns0:Serie>${idDoc.serie}</ns0:Serie>
                <ns0:Nro>${idDoc.nro}</ns0:Nro>
                <ns0:FchEmis>${idDoc.fchEmis}</ns0:FchEmis>
                <ns0:MntBruto>${idDoc.mntBruto}</ns0:MntBruto>
                <ns0:FmaPago>${idDoc.fmaPago}</ns0:FmaPago>
                <ns0:FchVenc>${idDoc.fchVenc}</ns0:FchVenc>
            </ns0:IdDoc>
        `;
    }

    buildEmisor(emisor) {
        return `
            <ns0:Emisor>
                <ns0:RUCEmisor>${emisor.rucEmisor}</ns0:RUCEmisor>
                <ns0:RznSoc>${emisor.rznSoc}</ns0:RznSoc>
                <ns0:CdgDGISucur>${emisor.cdgDGISucur}</ns0:CdgDGISucur>
                <ns0:DomFiscal>${emisor.domFiscal}</ns0:DomFiscal>
                <ns0:Ciudad>${emisor.ciudad}</ns0:Ciudad>
                <ns0:Departamento>${emisor.departamento}</ns0:Departamento>
            </ns0:Emisor>
        `;
    }

    buildReceptor(receptor) {
        return `
            <ns0:Receptor>
                <ns0:TipoDocRecep>${receptor.tipoDocRecep}</ns0:TipoDocRecep>
                <ns0:CodPaisRecep>${receptor.codPaisRecep}</ns0:CodPaisRecep>
                <ns0:DocRecep>${receptor.docRecep}</ns0:DocRecep>
                <ns0:RznSocRecep>${receptor.rznSocRecep}</ns0:RznSocRecep>
                <ns0:DirRecep>${receptor.dirRecep}</ns0:DirRecep>
                <ns0:CiudadRecep>${receptor.ciudadRecep}</ns0:CiudadRecep>
                <ns0:DeptoRecep>${receptor.deptoRecep}</ns0:DeptoRecep>
            </ns0:Receptor>
        `;
    }

    buildTotales(totales) {
        return `
            <ns0:Totales>
                <ns0:TpoMoneda>${totales.tpoMoneda}</ns0:TpoMoneda>
                <ns0:MntNoGrv>${totales.mntNoGrv}</ns0:MntNoGrv>
                <ns0:MntNetoIvaTasaMin>${totales.mntNetoIvaTasaMin}</ns0:MntNetoIvaTasaMin>
                <ns0:MntNetoIVATasaBasica>${totales.mntNetoIVATasaBasica}</ns0:MntNetoIVATasaBasica>
                <ns0:IVATasaMin>${totales.ivaTasaMin}</ns0:IVATasaMin>
                <ns0:IVATasaBasica>${totales.ivaTasaBasica}</ns0:IVATasaBasica>
                <ns0:MntIVATasaMin>${totales.mntIVATasaMin}</ns0:MntIVATasaMin>
                <ns0:MntIVATasaBasica>${totales.mntIVATasaBasica}</ns0:MntIVATasaBasica>
                <ns0:MntTotal>${totales.mntTotal}</ns0:MntTotal>
                <ns0:CantLinDet>${totales.cantLinDet}</ns0:CantLinDet>
                <ns0:MntPagar>${totales.mntPagar}</ns0:MntPagar>
            </ns0:Totales>
        `;
    }

    buildItem(item) {
        return `
            <ns0:Item>
                <ns0:NroLinDet>${item.nroLinDet}</ns0:NroLinDet>
                <ns0:IndFact>${item.indFact}</ns0:IndFact>
                <ns0:NomItem>${item.nomItem}</ns0:NomItem>
                <ns0:Cantidad>${item.cantidad}</ns0:Cantidad>
                <ns0:UniMed>${item.uniMed}</ns0:UniMed>
                <ns0:PrecioUnitario>${item.precioUnitario}</ns0:PrecioUnitario>
                <ns0:MontoItem>${item.montoItem}</ns0:MontoItem>
            </ns0:Item>
        `;
    }

    buildReferencia(referencia) {
        return `
            <ns0:NroLinRef>${referencia.nroLinRef}</ns0:NroLinRef>
            <ns0:TpoDocRef>${referencia.tpoDocRef}</ns0:TpoDocRef>
            <ns0:Serie>${referencia.serie}</ns0:Serie>
            <ns0:NroCFERef>${referencia.nroCFERef}</ns0:NroCFERef>
        `;
    }

    buildCAEData(caeData) {
        return `
            <ns0:CAEData>
                <ns0:CAE_ID>${caeData.caeId}</ns0:CAE_ID>
                <ns0:DNro>${caeData.dNro}</ns0:DNro>
                <ns0:HNro>${caeData.hNro}</ns0:HNro>
                <ns0:FecVenc>${caeData.fecVenc}</ns0:FecVenc>
            </ns0:CAEData>
        `;
    }
}

export { eTck };
