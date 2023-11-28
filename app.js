

const Key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkYW5vb3Rrb2FmZGhveW9ia3pwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMDE0MDY2MywiZXhwIjoyMDE1NzE2NjYzfQ.e44Su-sEHw12cz9j_cmi1CY93ThLDVxJ6hLfCzmWF54';
const Url = 'https://fdanootkoafdhoyobkzp.supabase.co';


const database = supabase.createClient(Url, Key);





// Função para copiar modelos
function copiarModelo(textoModelo) {
  try {
    // Crie um elemento temporário para armazenar o texto formatado
    const tempElement = document.createElement('div');
    tempElement.innerHTML = textoModelo;

    // Adicione o elemento temporário ao corpo do documento
    document.body.appendChild(tempElement);

    // Selecione o texto no elemento temporário
    const range = document.createRange();
    range.selectNodeContents(tempElement);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    // Execute o comando de cópia
    document.execCommand('copy');

    // Limpe a seleção e remova o elemento temporário
    selection.removeAllRanges();
    document.body.removeChild(tempElement);

    alert("Modelo copiado para a área de transferência!");
  } catch (err) {
    console.error('Erro ao copiar modelo:', err);
    alert('Erro ao copiar o modelo. Consulte o console para obter mais detalhes.');
  }
}















// Função para exibir modelos
function exibirModelos(departamento, departamentoNome) {
  const departamentos = ["privado", "corporativo", "regional", "publicos", "cofres"];

  departamentos.forEach((dep) => {
    const container = document.getElementById(`${dep}Container`);
    const modelos = container.querySelectorAll(".modelo-container");

    if (departamento === "todos" || departamento === dep) {
      modelos.forEach((modelo) => (modelo.style.display = "block"));
    } else {
      modelos.forEach((modelo) => (modelo.style.display = "none"));
    }
  });





  // Atualize a indicação da aba atual
  document.getElementById("aba-atual").textContent = departamentoNome;
  document.getElementById("busca").value = ""; // Limpar o campo de busca
}



// Função para excluir um modelo específico
async function excluirModelo(modeloId) {
  const modeloContainer = document.getElementById(modeloId);
  modeloContainer.remove();

  // Remova o modelo do Supabase
  try {
    const { data, error } = await database
      .from('modelos')
      .delete()
      .eq('id', modeloId);

    if (error) {
      console.error('Erro ao excluir o modelo:', error);
      alert('Erro ao excluir o modelo. Consulte o console para obter mais detalhes.');
    } else {
      alert('Modelo excluído com sucesso!');
      // Recarrega a página imediatamente após a exclusão
      window.location.reload();
    }
  } catch (error) {
    console.error('Erro ao excluir o modelo:', error);
    alert('Erro ao excluir o modelo. Consulte o console para obter mais detalhes.');
  }
}

}





// Função para exibir o formulário para adicionar modelos
function exibirFormulario() {
  // Mova o formulário para o topo da lista
  const modelosContainer = document.getElementById("privadoContainer"); // Use o container apropriado
  const formulario = document.getElementById("modelo-form");

  modelosContainer.insertBefore(formulario, modelosContainer.firstChild);

  // Exiba o formulário
  formulario.style.display = "block";

  // Limpe o formulário e redefina os valores
  document.querySelector("form").reset();
}





// Função para limpar o formulário e redefinir os valores
function limparFormulario() {
  document.getElementById("modelo-form").style.display = "none";
  document.querySelector("form").reset();
  document.getElementById("titulo").value = ""; // Limpar o valor do título
  document.getElementById("texto").innerHTML = ""; // Limpar o valor do texto
}

document.querySelector("form").addEventListener("submit", async function (event) {
  event.preventDefault();

  const titulo = document.getElementById("titulo").value;
  const departamento = document.getElementById("departamento").value;
  const texto = document.getElementById("texto").innerHTML;

  if (!titulo || !departamento || !texto) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  await adicionarModelo(titulo, departamento, texto);

  limparFormulario();
});





// Função para adicionar um modelo
async function adicionarModelo(titulo, departamento, texto) {
  const departamentosAceitos = ["privado", "corporativo", "regional", "publicos", "cofres"];

  if (!departamentosAceitos.includes(departamento)) {
    alert("Departamento inválido. Os departamentos aceitos são: privado, corporativo, regional, publicos, cofres.");
    return;
  }

  // Cria um elemento temporário para armazenar o texto formatado
  const tempElement = document.createElement('div');
  tempElement.innerHTML = texto;

  // Obtém o texto formatado
  const textoFormatado = tempElement.innerHTML;

  // Adiciona o modelo ao Supabase
  try {
    const { data, error } = await database
      .from('modelos')
      .insert([{ titulo, departamento, texto: textoFormatado }]);

    if (error) {
      console.error('Erro ao adicionar o modelo:', error);
      alert('Erro ao adicionar o modelo. Consulte o console para obter mais detalhes.');
    } else {
      alert('Modelo adicionado com sucesso!');
      // Recarrega a página após um curto intervalo (por exemplo, 1 segundo)
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  } catch (error) {
    console.error('Erro ao adicionar o modelo:', error);
    alert('Erro ao adicionar o modelo. Consulte o console para obter mais detalhes.');
  }
}








// Exemplo de implementação na função editarModelo
function editarModelo(modeloId) {
  const novoTitulo = prompt("Novo título:");
  const novoTexto = prompt("Novo texto:");

  if (novoTitulo && novoTexto) {
    salvarAlteracoesModelo(modeloId, novoTitulo, novoTexto);
  } else {
    alert("Por favor, preencha todos os campos.");
  }
}



// Função para buscar modelos
function buscarModelos() {
  const busca = document.getElementById("busca").value.toLowerCase();
  const modelos = document.querySelectorAll(".modelo-container");

  modelos.forEach((modelo) => {
    const titulo = modelo
      .querySelector("h2 .titulo-editavel")
      .textContent.toLowerCase();
    if (titulo.includes(busca)) {
      modelo.style.display = "block";
    } else {
      modelo.style.display = "none";
    }
  });
}




// Função para atualizar o título de um modelo
function atualizarTitulo(modeloId) {
  const modeloContainer = document.getElementById(modeloId);
  const novoTitulo = modeloContainer.querySelector(
    "h2 .titulo-editavel"
  ).textContent;
  modeloContainer.querySelector("h2 span.titulo-editavel").textContent =
    novoTitulo;
}





// Função para excluir modelos selecionados
async function excluirModelosSelecionados() {
  const checkboxes = document.querySelectorAll(".modelo-checkbox");

  const modelosSelecionados = Array.from(checkboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.getAttribute("data-modelo"));

  if (modelosSelecionados.length === 0) {
    alert("Selecione pelo menos um modelo para excluir.");
    return;
  }

  try {
    const { data, error } = await database
      .from('modelos')
      .delete()
      .in('id', modelosSelecionados);

    if (error) {
      console.error('Erro ao excluir modelos:', error);
      alert('Erro ao excluir modelos. Consulte o console para obter mais detalhes.');
    } else {
      alert('Modelos excluídos com sucesso!');
      carregarModelos(); // Recarrega os modelos após a exclusão
    }
  } catch (error) {
    console.error('Erro ao excluir modelos:', error);
    alert('Erro ao excluir modelos. Consulte o console para obter mais detalhes.');
  }
}


// funçao carregarModelos

async function carregarModelos() {
  try {
    const { data, error } = await database
      .from('modelos')
      .select('id, titulo, departamento, texto');

    if (error) {
      console.error('Erro ao carregar modelos:', error);
      alert('Erro ao carregar modelos. Consulte o console para obter mais detalhes.');
    } else {
      // Limpe os contêineres de modelos existentes antes de adicionar os novos
      const departamentos = ["privado", "corporativo", "regional", "publicos", "cofres"];
      departamentos.forEach((dep) => {
        const container = document.getElementById(`${dep}Container`);
        container.innerHTML = '';
      });





      // Adicione os modelos aos contêineres apropriados
      data.forEach((modelo) => {
        const container = document.getElementById(`${modelo.departamento}Container`);
        const modeloHtml = criarModeloHtml(modelo);
        container.appendChild(modeloHtml);
      });
    }
  } catch (error) {
    console.error('Erro ao carregar modelos:', error);
    alert('Erro ao carregar modelos. Consulte o console para obter mais detalhes.');
  }
}






// Chame carregarModelos quando a página é carregada
document.addEventListener("DOMContentLoaded", carregarModelos);





// Função auxiliar para criar o HTML de um modelo
function criarModeloHtml(modelo) {
  const modeloHtml = document.createElement('div');
  modeloHtml.classList.add('modelo-container');

  
  modeloHtml.innerHTML = `
  <input type="checkbox" class="modelo-checkbox" data-modelo="${modelo.id}">
  <h2>
    <span class="titulo-editavel">${modelo.titulo}</span>
    <button onclick="editarModelo('${modelo.id}')">Editar</button>
  </h2>
  <p>${modelo.texto}</p>
  <button class="copiarmodelo" onclick="copiarModelo('${modelo.texto}')">Copiar Modelo</button>
`;

  return modeloHtml;
}

