import fs from 'fs'
import xml2js from 'xml2js'


async function incrementarIdEmisor(nombreArchivo) {
  try {
    const xmlData = fs.readFileSync(nombreArchivo, 'utf-8')

    const parser = new xml2js.Parser()
    const data = await parser.parseStringPromise(xmlData)

    if (data['DGICFE:EnvioCFE']['DGICFE:Caratula'][0]['DGICFE:Idemisor']) {
      const idEmisor = parseInt(data['DGICFE:EnvioCFE']['DGICFE:Caratula'][0]['DGICFE:Idemisor'][0])
      data['DGICFE:EnvioCFE']['DGICFE:Caratula'][0]['DGICFE:Idemisor'][0] = idEmisor + 1
    }

    const builder = new xml2js.Builder()
    const xml = builder.buildObject(data)

    fs.writeFileSync(nombreArchivo, xml)

    console.log(`Se ha incrementado en 1 el valor de Idemisor en el archivo "${nombreArchivo}".`)
  } catch (error) {
    console.error('Error al incrementar el valor de Idemisor en el archivo XML:', error)
  }
}

function actualizarToken(nuevoToken, nuevoIdReceptor) {

  fs.readFile('../token.xml', 'utf-8', (err, data) => {
      if (err) {
          console.error('Error al leer el archivo XML:', err);
          return;
      }

      xml2js.parseString(data, (parseErr, result) => {
          if (parseErr) {
              console.error('Error al parsear el XML:', parseErr);
              return;
          }

          result.ConsultaCFE.Token = nuevoToken;
          result.ConsultaCFE.IdReceptor = nuevoIdReceptor;

          const builder = new xml2js.Builder();
          const xml = builder.buildObject(result);

          fs.writeFile('../token.xml', xml, 'utf-8', (writeErr) => {
              if (writeErr) {
                  console.error('Error al escribir el archivo XML:', writeErr);
                  return;
              }
              console.log('Se ha actualizado el token correctamente.');
          });
      });
  });
}

export {incrementarIdEmisor, actualizarToken }
