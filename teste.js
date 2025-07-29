let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
let indiceEditando = null; // Adicione essa variável global

function salvarTarefas() {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

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


    tarefas.push({ texto: tarefa, concluida: false });
    salvarTarefas();
    renderizarTarefas();

    inputTarefa.value = "";
    inputTarefa.focus(); // Deixa o campo pronto para digitar novamente
    }
}

function renderizarTarefas() {
    const listaTarefas = document.getElementById("listaTarefas");
    listaTarefas.innerHTML = "";

    for (let i = 0; i < tarefas.length; i++) {
        const itemLista = document.createElement("li");
        const textoTarefa = document.createElement("span");
        textoTarefa.className = "tarefa-texto";
        textoTarefa.textContent = tarefas[i].texto;
        itemLista.appendChild(textoTarefa);
        if (tarefas[i].concluida) {
            itemLista.classList.add("concluida");
        }

        let botaoConcluir = document.createElement("button");
        botaoConcluir.textContent = tarefas[i].concluida ? "Desfazer" : "Concluir";
        botaoConcluir.className = "concluir";
        botaoConcluir.onclick = function() {
            tarefas[i].concluida = !tarefas[i].concluida;
            salvarTarefas();
            renderizarTarefas();
        };

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

        itemLista.appendChild(botaoConcluir);
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
    salvarTarefas(); // Salva no localStorage
    renderizarTarefas();
    const msg = document.getElementById("mensagem");
    msg.textContent = "Tarefa removida com sucesso!";
    msg.style.color = "var(--text-color)";
    setTimeout(function() {
        msg.textContent = "";
    }, 3000);
}

function editarTarefa(i) {
    indiceEditando = i;
    document.getElementById("input-editar").value = tarefas[i].texto;
    document.getElementById("modal-editar").style.display = "flex";
    document.getElementById("modal-editar").classList.add("mostrar");
}

// Função para salvar a edição
document.getElementById("salvarEdicao").onclick = function() {
    const novoValor = document.getElementById("input-editar").value.trim();
    if (novoValor !== "") {
        tarefas[indiceEditando].texto = novoValor;
        salvarTarefas(); // Salva no localStorage
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
    salvarTarefas(); // Salva no localStorage
    renderizarTarefas();
    const msg = document.getElementById("mensagem");
    msg.textContent = "Lista limpa com sucesso!";
    msg.style.color = "#28A745";
    setTimeout(function() {
        msg.textContent = "";
    }, 3000);
};

// Botão para alternar tema
document.getElementById("toggleTema").onclick = function() {
    document.body.classList.toggle("dark-theme");
    localStorage.setItem("tema", document.body.classList.contains("dark-theme") ? "dark" : "light");
};

document.body.classList.add("no-transition");

if (localStorage.getItem("tema") === "dark") {
    document.body.classList.add("dark-theme");
    document.getElementById("toggleTema").checked = true;
} else {
    document.body.classList.remove("dark-theme");
    document.getElementById("toggleTema").checked = false;
}

// Remova a classe após o carregamento completo
window.onload = function() {
    document.body.classList.remove("no-transition");
    renderizarTarefas();
    document.querySelector('.container').classList.add('mostrar');
};

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('service-worker.js');
    });
}

// Adiciona tarefa ao pressionar Enter
document.getElementById("Tarefa").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        adicionarTarefa();
    }
});