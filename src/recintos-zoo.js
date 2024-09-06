-- src/
recintos-zoo.js
  recintos-zoo.test.js
.gitignore
jest.config.js
package-lock.json
package.json
readme.md--

--RecintosZoo--


const recintos = [
  { numero: 1, bioma: 'savana', tamanhoTotal: 10, animaisExistentes: { 'MACACO': 3 } },
  { numero: 2, bioma: 'floresta', tamanhoTotal: 5, animaisExistentes: {} },
  { numero: 3, bioma: 'savana e rio', tamanhoTotal: 7, animaisExistentes: { 'GAZELA': 1 } },
  { numero: 4, bioma: 'rio', tamanhoTotal: 8, animaisExistentes: {} },
  { numero: 5, bioma: 'savana', tamanhoTotal: 9, animaisExistentes: { 'LEAO': 1 } }
];

const animais = {
  'LEAO': { tamanho: 3, bioma: 'savana' },
  'LEOPARDO': { tamanho: 2, bioma: 'savana' },
  'CROCODILO': { tamanho: 3, bioma: 'rio' },
  'MACACO': { tamanho: 1, bioma: 'savana ou floresta' },
  'GAZELA': { tamanho: 2, bioma: 'savana' },
  'HIPOPOTAMO': { tamanho: 4, bioma: 'savana ou rio' }
};

class RecintosZoo {
  analisaRecintos(animal, quantidade) {
    // Verifica se o animal é válido
    if (!animais[animal]) {
      return { erro: "Animal inválido" };
    }

    // Verifica se a quantidade é válida
    if (quantidade <= 0 || !Number.isInteger(quantidade)) {
      return { erro: "Quantidade inválida" };
    }

    const animalInfo = animais[animal];
    const biomaAnimal = animalInfo.bioma;
    const tamanhoAnimal = animalInfo.tamanho;

    const recintosViaveis = [];

    // Verifica cada recinto
    recintos.forEach(recinto => {
      const { numero, bioma, tamanhoTotal, animaisExistentes } = recinto;

      // Verifica se o bioma é adequado
      if (!this.biomaAdequado(bioma, biomaAnimal)) {
        return;
      }

      // Verifica se o recinto pode acomodar o animal
      if (!this.podeAcomodarAnimal(recinto, animal, quantidade)) {
        return;
      }

      const espacoOcupado = this.calculaEspacoOcupado(animaisExistentes);
      const espacoNecessario = quantidade * tamanhoAnimal + (Object.keys(animaisExistentes).length > 0 ? 1 : 0);

      if (tamanhoTotal - espacoOcupado >= espacoNecessario) {
        recintosViaveis.push(`Recinto ${numero} (espaço livre: ${tamanhoTotal - espacoOcupado - espacoNecessario} total: ${tamanhoTotal})`);
      }
    });

    // Verifica se há recintos viáveis
    if (recintosViaveis.length > 0) {
      return { recintosViaveis };
    } else {
      return { erro: "Não há recinto viável" };
    }
  }

  biomaAdequado(bioma, biomaAnimal) {
    const biomas = {
      'savana': ['savana'],
      'floresta': ['floresta'],
      'rio': ['rio'],
      'savana e rio': ['savana', 'rio']
    };

    if (biomaAnimal === 'savana ou floresta' && (bioma === 'savana' || bioma === 'floresta')) {
      return true;
    }

    if (biomaAnimal === 'savana ou rio' && (bioma === 'savana' || bioma === 'rio')) {
      return true;
    }

    return biomas[biomaAnimal].includes(bioma);
  }

  podeAcomodarAnimal(recinto, animal, quantidade) {
    const { animaisExistentes, bioma } = recinto;
    const animalInfo = animais[animal];
    const tamanhoAnimal = animalInfo.tamanho;
    
    if (animal === 'HIPOPOTAMO') {
      if (bioma !== 'savana e rio' && Object.keys(animaisExistentes).length > 0) {
        return false;
      }
    }

    if (animal === 'MACACO' && quantidade > 1 && Object.keys(animaisExistentes).length === 0) {
      return false;
    }

    if (Object.keys(animaisExistentes).some(a => animais[a].bioma === animalInfo.bioma && a !== animal)) {
      return false;
    }

    return true;
  }

  calculaEspacoOcupado(animaisExistentes) {
    let espacoOcupado = 0;
    for (const [animal, quantidade] of Object.entries(animaisExistentes)) {
      espacoOcupado += quantidade * animais[animal].tamanho;
    }
    return espacoOcupado;
  }
}

export { RecintosZoo as RecintosZoo };
