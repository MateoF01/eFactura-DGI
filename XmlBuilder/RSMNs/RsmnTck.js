import { XmlBuilder } from '../XmlBuilder.js';

class RsmnTck extends XmlBuilder {
    buildXml(args) {
        const { TipoComp, RsmnData } = args;

        // Determinar el nombre de la etiqueta principal según el tipo de comprobante
        let rootTag;
        switch (TipoComp) {
            case '101':
                rootTag = 'Rsmn_Tck';
                break;
            case '102':
                rootTag = 'Rsmn_Tck_Nota_Credito';
                break;
            case '103':
                rootTag = 'Rsmn_Tck_Nota_Debito';
                break;
            default:
                throw new Error('TipoComp inválido');
        }

        const xmlRsmnData = this.buildRsmnData(RsmnData);

        return `
            <ns1:${rootTag}>
                <ns1:TipoComp>${TipoComp}</ns1:TipoComp>
                ${xmlRsmnData}
            </ns1:${rootTag}>
        `;
    }

    buildRsmnData(rsmnData) {
        const { Montos, CantDocsUtil, CantDocsMay_topeUI, CantDocsAnulados, CantDocsEmi, RngDocsUtil } = rsmnData;

        const xmlMontos = Montos.map(item => this.buildMontos(item)).join('');
        const xmlRngDocsUtil = RngDocsUtil.map(item => this.buildRngDocsUtil(item)).join('');

        return `
            <ns1:RsmnData>
                <ns1:Montos>
                    ${xmlMontos}
                </ns1:Montos>
                <ns1:CantDocsUtil>${CantDocsUtil}</ns1:CantDocsUtil>
                <ns1:CantDocsMay_topeUI>${CantDocsMay_topeUI}</ns1:CantDocsMay_topeUI>
                <ns1:CantDocsAnulados>${CantDocsAnulados}</ns1:CantDocsAnulados>
                <ns1:CantDocsEmi>${CantDocsEmi}</ns1:CantDocsEmi>
                <ns1:RngDocsUtil>
                    ${xmlRngDocsUtil}
                </ns1:RngDocsUtil>
            </ns1:RsmnData>
        `;
    }

    buildMontos(montos) {
        const { Fecha, CodSuc, TotMntNoGrv, TotMntExpyAsim, TotMntImpPerc, TotMntIVAenSusp, TotMntIVATasaMin, TotMntIVATasaBas, TotMntIVAOtra, MntIVATasaMin, MntIVATasaBas, MntIVAOtra, IVATasaMin, IVATasaBas, TotMntTotal, TotMntRetenido } = montos;

        return `
            <ns1:Mnts_FyT_Item>
                <ns1:Fecha>${Fecha}</ns1:Fecha>
                <ns1:CodSuc>${CodSuc}</ns1:CodSuc>
                <ns1:TotMntNoGrv>${TotMntNoGrv}</ns1:TotMntNoGrv>
                <ns1:TotMntExpyAsim>${TotMntExpyAsim}</ns1:TotMntExpyAsim>
                <ns1:TotMntImpPerc>${TotMntImpPerc}</ns1:TotMntImpPerc>
                <ns1:TotMntIVAenSusp>${TotMntIVAenSusp}</ns1:TotMntIVAenSusp>
                <ns1:TotMntIVATasaMin>${TotMntIVATasaMin}</ns1:TotMntIVATasaMin>
                <ns1:TotMntIVATasaBas>${TotMntIVATasaBas}</ns1:TotMntIVATasaBas>
                <ns1:TotMntIVAOtra>${TotMntIVAOtra}</ns1:TotMntIVAOtra>
                <ns1:MntIVATasaMin>${MntIVATasaMin}</ns1:MntIVATasaMin>
                <ns1:MntIVATasaBas>${MntIVATasaBas}</ns1:MntIVATasaBas>
                <ns1:MntIVAOtra>${MntIVAOtra}</ns1:MntIVAOtra>
                <ns1:IVATasaMin>${IVATasaMin}</ns1:IVATasaMin>
                <ns1:IVATasaBas>${IVATasaBas}</ns1:IVATasaBas>
                <ns1:TotMntTotal>${TotMntTotal}</ns1:TotMntTotal>
                <ns1:TotMntRetenido>${TotMntRetenido}</ns1:TotMntRetenido>
            </ns1:Mnts_FyT_Item>
        `;
    }

    buildRngDocsUtil(rngDocsUtil) {
        const { Serie, NroDesde, NroHasta } = rngDocsUtil;

        return `
            <ns1:RDU_Item>
                <ns1:Serie>${Serie}</ns1:Serie>
                <ns1:NroDesde>${NroDesde}</ns1:NroDesde>
                <ns1:NroHasta>${NroHasta}</ns1:NroHasta>
            </ns1:RDU_Item>
        `;
    }
}

export { RsmnTck };
