import fs from 'fs' 
import path from 'path'
import { fileURLToPath } from 'url';

class Factory {
  constructor(tipo) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    this.buildersDir = path.join(__dirname, tipo);
  }

  async loadBuilder(builderName) {
    const builderPath = path.join(this.buildersDir, `${builderName}.js`);
    if (!fs.existsSync(builderPath)) {
      throw new Error(`Constructor no encontrado: ${builderName}`);
    }
    const module = await import(builderPath);
    return module[builderName]; 
  }

  async createBuilder(builderName) {
    const BuilderClass = await this.loadBuilder(builderName);
    return new BuilderClass();
  }
}

export { Factory }
