let tarefas = [];

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
        }, 5000);


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
        listaTarefas.appendChild(itemLista);
    }
}