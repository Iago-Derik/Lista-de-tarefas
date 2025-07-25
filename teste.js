let tarefas = [];
let indiceEditando = null; // Adicione essa variável global

function adicionarTarefa(){

    // Criando a variável que informe que foi adicionada a tarefa
    const mensagem = "Tarefa adicionada com sucesso!";
    const inputTarefa = document.getElementById("Tarefa");
    let tarefa = inputTarefa.value.trim();

    const msg = document.getElementById("mensagem");
    msg.style.color = "#28A745";

    // Validando se a tarefa está vazia
    if (tarefa === "") {
        msg.textContent = "Por favor, insira uma tarefa.";
        msg.style.color = "#A34743";
        setTimeout(function() {
            msg.textContent = "";
        }, 2000);
    }
    // Se a tarefa não estiver vazia, adicioná-la à lista
    else {
        msg.textContent = mensagem;
        setTimeout(function() {
            msg.textContent = "";
        }, 4000);


    tarefas.push(tarefa);
    renderizarTarefas();

    inputTarefa.value = "";
    }
}

function renderizarTarefas() {
    const listaTarefas = document.getElementById("listaTarefas");
    listaTarefas.innerHTML = "";

    for (let i = 0; i < tarefas.length; i++) {
        const itemLista = document.createElement("li");
        itemLista.textContent = tarefas[i];

        let botaoRemover = document.createElement("button");
        botaoRemover.textContent = "Remover";
        botaoRemover.className = "remover";
        botaoRemover.onclick = function() {
            removerTarefa(i);
        };

        let botaoEditar = document.createElement("button");
        botaoEditar.textContent = "Editar";
        botaoEditar.className = "editar";
        botaoEditar.onclick = function() {
            editarTarefa(i);
        };

        itemLista.appendChild(botaoEditar);
        itemLista.appendChild(botaoRemover);
        listaTarefas.appendChild(itemLista);
    }

    // Mostra ou esconde o botão "Limpar Lista"
    const btnLimpar = document.getElementById("limparLista");
    btnLimpar.style.display = tarefas.length > 0 ? "inline-block" : "none";
}

function removerTarefa(i) {
    tarefas.splice(i, 1);
    renderizarTarefas();
    const msg = document.getElementById("mensagem");
    msg.textContent = "Tarefa removida com sucesso!";
    msg.style.color = "#000000ff";
    setTimeout(function() {
        msg.textContent = "";
    }, 3000);
}

function editarTarefa(i) {
    indiceEditando = i;
    document.getElementById("input-editar").value = tarefas[i];
    document.getElementById("modal-editar").style.display = "flex";
}

// Função para salvar a edição
document.getElementById("salvarEdicao").onclick = function() {
    const novoValor = document.getElementById("input-editar").value.trim();
    if (novoValor !== "") {
        tarefas[indiceEditando] = novoValor;
        renderizarTarefas();
        document.getElementById("mensagem").textContent = "Tarefa editada com sucesso!";
        document.getElementById("mensagem").style.color = "#28A745";
        setTimeout(() => document.getElementById("mensagem").textContent = "", 3000);
    }
    document.getElementById("modal-editar").style.display = "none";
    indiceEditando = null;
};

// Função para cancelar a edição
document.getElementById("cancelar-edicao").onclick = function() {
    document.getElementById("modal-editar").style.display = "none";
    indiceEditando = null;
};

// Função para limpar a lista
document.getElementById("limparLista").onclick = function() {
    tarefas = [];
    renderizarTarefas();
    const msg = document.getElementById("mensagem");
    msg.textContent = "Lista limpa com sucesso!";
    msg.style.color = "#28A745";
    setTimeout(function() {
        msg.textContent = "";
    }, 3000);
};