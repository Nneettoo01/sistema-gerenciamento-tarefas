import PromptSync from "prompt-sync";
import fs from "fs/promises";

const prompt = PromptSync();
const caminhoDoArquivo = "./tarefas.json";

async function lerTarefas() {
  try {
    const dadosLidos = await fs.readFile(caminhoDoArquivo, "utf-8");
    return JSON.parse(dadosLidos);
  } catch (erro) {
    console.log("Erro ao ler o arquivo", erro.message);
    return undefined;
  }
}

async function escreverTarefas(listaTarefas) {
  const listaTarefasString = JSON.stringify(listaTarefas, null, 2);
  try {
    await fs.writeFile(caminhoDoArquivo, listaTarefasString, "utf-8");
    console.log("Arquivo atualizado com sucesso!");
  } catch (error) {
    console.error("Erro ao escrever no arquivo: ", error);
  }
}

// ====== FUNÇÕES AUXILIARES ======
async function criarTarefas() {
  const titulo = prompt("Digite o título: ");
  const descricao = prompt("Digite a descrição: ");
  const tarefas = await lerTarefas();
  const novaTarefa = {
    id: tarefas.length + 1,
    titulo,
    descricao,
    concluida: false,
  };
  tarefas.push(novaTarefa);
  await escreverTarefas(tarefas);
}

async function mostrarTodasTarefas() {
  const todasTarefas = await lerTarefas();
  console.log(todasTarefas);
}

async function mostrarTarefasConcluidas() {
  const tarefasConluidas = await lerTarefas();
  const concluidas = tarefasConluidas.filter(
    (tarefa) => tarefa.concluida === true
  );

  console.log(concluidas);
}

async function mostrarTarefasNaoConcluidas() {
  const tarefasNaoConluidas = await lerTarefas();
  const naoConluidas = tarefasNaoConluidas.filter(
    (tarefa) => tarefa.concluida === false
  );

  console.log(naoConluidas);
}

async function concluirTarefa() {
  const id = +prompt("Informe o ID da tarefa: ");
  const tarefas = await lerTarefas();

  const index = tarefas.findIndex((tarefa) => tarefa.id === id);

  if (index === -1) {
    console.log("ID não encontrado!");
  } else {
    tarefas[index].concluida = true;
    await escreverTarefas(tarefas);
  }
}

// ====== MENU DE OPÇÕES ======
async function menu() {
  console.log(`
    === MENU ===
    1. Criar uma nova tarefa.
    2. Visualizar todas as tarefas.
    3. Visualizar apenas tarefas concluídas.
    4. Visualizar apenas tarefas não concluídas.
    5. Concluir uma tarefa.
    6. Sair
  `);
}

let encerrar = false;

while (!encerrar) {
  menu();

  const opcao = +prompt("Digite a opção: ");

  switch (opcao) {
    case 1:
      await criarTarefas();
      break;
    case 2:
      await mostrarTodasTarefas();
      break;
    case 3:
      await mostrarTarefasConcluidas();
      break;
    case 4:
      await mostrarTarefasNaoConcluidas();
      break;
    case 5:
      await concluirTarefa();
      break;
    case 6:
      console.log("Menu encerrado!");
      encerrar = true;
      break;
    default:
      console.log("Opção inválida. Tente novamente!");
  }
}
