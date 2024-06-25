import {XmlBuilder} from '../XmlBuilder.js'

class Token extends XmlBuilder{
    
    buildXml(idReceptor, token){
        const tokenXml = `
            <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
            <ConsultaCFE xmlns="http://dgi.gub.uy">
                <IdReceptor>${idReceptor}</IdReceptor>
                <Token>${token}</Token>
            </ConsultaCFE>
            `
        return tokenXml
        }

}

export {Token}