// Definição do problema - Knapsack Problem
const itens = [
  { nome: "Item 1", peso: 2, valor: 10 },
  { nome: "Item 2", peso: 3, valor: 15 },
  { nome: "Item 3", peso: 5, valor: 20 },
  { nome: "Item 4", peso: 7, valor: 25 },
  { nome: "Item 5", peso: 10, valor: 30 }
];

const capacidadeMochila = 15;

// Função de fitness - Retorna o valor total do conjunto de itens selecionados
function fitness(individuo) {
  let pesoTotal = 0;
  let valorTotal = 0;

  for (let i = 0; i < individuo.length; i++) {
    if (individuo[i]) {
      pesoTotal += itens[i].peso;
      valorTotal += itens[i].valor;
    }
  }

  if (pesoTotal > capacidadeMochila) {
    return 0; // Penaliza soluções que excedem a capacidade da mochila
  } else {
    return valorTotal;
  }
}

// Função para criar um indivíduo aleatório
function criarIndividuo() {
  return Array.from({ length: itens.length }, () => Math.random() > 0.5);
}

// Função para realizar o cruzamento entre dois indivíduos
function cruzamento(pai1, pai2) {
  const pontoCorte = Math.floor(Math.random() * (itens.length - 1)) + 1;
  const filho1 = pai1.slice(0, pontoCorte).concat(pai2.slice(pontoCorte));
  const filho2 = pai2.slice(0, pontoCorte).concat(pai1.slice(pontoCorte));
  return [filho1, filho2];
}

// Função para realizar a mutação de um indivíduo
function mutacao(individuo) {
  const indiceMutacao = Math.floor(Math.random() * individuo.length);
  individuo[indiceMutacao] = !individuo[indiceMutacao];
  return individuo;
}

// Função para executar o algoritmo genético
function algoritmoGenetico() {
  const tamanhoPopulacao = 100;
  const taxaMutacao = 0.1;
  const numeroGeracoes = 50;

  let populacao = Array.from({ length: tamanhoPopulacao }, criarIndividuo);

  for (let geracao = 0; geracao < numeroGeracoes; geracao++) {
    let fitnessPopulacao = populacao.map(fitness);

    // Obter o melhor indivíduo da geração atual
    const melhorIndividuo = populacao[fitnessPopulacao.indexOf(Math.max(...fitnessPopulacao))];
    console.log(`Geração ${geracao + 1}: Melhor valor = ${fitness(melhorIndividuo)}`);

    let novaPopulacao = [];

    for (let i = 0; i < tamanhoPopulacao / 2; i++) {
      const pais = [selecionarPai(populacao, fitnessPopulacao), selecionarPai(populacao, fitnessPopulacao)];
      const filhos = cruzamento(pais[0], pais[1]);
      const filho1 = mutacao(filhos[0]);
      const filho2 = mutacao(filhos[1]);
      novaPopulacao.push(filho1, filho2);
    }

    populacao = novaPopulacao;
  }

  // Obter o melhor indivíduo da última geração
  const fitnessPopulacao = populacao.map(fitness);
  const melhorIndividuo = populacao[fitnessPopulacao.indexOf(Math.max(...fitnessPopulacao))];

  return melhorIndividuo;
}

// Função para selecionar um pai para reprodução usando seleção por torneio
function selecionarPai(populacao, fitnessPopulacao) {
  const torneioSize = Math.floor(populacao.length / 10);
  const participantes = Array.from({ length: torneioSize }, () => Math.floor(Math.random() * populacao.length));
  const fitnessParticipantes = participantes.map((indice) => fitnessPopulacao[indice]);
  return populacao[participantes[fitnessParticipantes.indexOf(Math.max(...fitnessParticipantes))]];
}

// Executar o algoritmo genético
const melhorIndividuo = algoritmoGenetico();
console.log("Melhor indivíduo: ", melhorIndividuo);
