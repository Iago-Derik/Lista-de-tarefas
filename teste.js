let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
let indiceEditando = null; // Adicione essa variável global
let diaSelecionado = null;

function salvarTarefas() {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function adicionarTarefa() {
    const mensagem = "Tarefa adicionada com sucesso!";
    const inputTarefa = document.getElementById("Tarefa");
    const inputData = document.getElementById("dataTarefa");
    let tarefa = inputTarefa.value.trim();
    let data = inputData.value;

    const msg = document.getElementById("mensagem");
    msg.style.color = "#28A745";

    if (tarefa === "") {
        msg.textContent = "Por favor, insira uma tarefa.";
        msg.style.color = "#A34743";
        setTimeout(function() { msg.textContent = ""; }, 2000);
    } else if (data === "") {
        msg.textContent = "Selecione uma data para a tarefa.";
        msg.style.color = "#A34743";
        setTimeout(function() { msg.textContent = ""; }, 2000);
    } else {
        msg.textContent = mensagem;
        setTimeout(function() { msg.textContent = ""; }, 4000);

        tarefas.push({ texto: tarefa, concluida: false, data: data }); // data deve ser YYYY-MM-DD
        salvarTarefas();
        renderizarTarefas();

        inputTarefa.value = "";
        inputData.value = "";
        inputTarefa.focus();
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

        itemLista.onclick = function() {
            if (window.calendar && tarefas[i].data) {
                window.calendar.gotoDate(tarefas[i].data);

                // Aguarda o calendário renderizar e faz scroll até o dia
                setTimeout(function() {
                    const calendarEl = document.getElementById('calendario-dinamico');
                    // Procura o elemento do dia no calendário
                    const dayCell = calendarEl.querySelector('[data-date="' + tarefas[i].data + '"]');
                    if (dayCell) {
                        dayCell.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 200); // tempo suficiente para renderizar
            }
        };
    }

    // Mostra ou esconde o botão "Limpar Lista"
    const btnLimpar = document.getElementById("limparLista");
    btnLimpar.style.display = tarefas.length > 0 ? "inline-block" : "none";

    // Atualiza eventos do calendário imediatamente
    if (window.calendar) {
        window.calendar.removeAllEvents();
        tarefas.forEach((t, idx) => {
            if (t.data) {
                window.calendar.addEvent({
                    id: 'tarefa-' + idx,
                    title: t.texto,
                    start: t.data,
                    backgroundColor: t.concluida ? '#00bb0a' : (document.body.classList.contains('dark-theme') ? '#3a1c71' : '#FFD166'),
                    textColor: document.body.classList.contains('dark-theme') ? '#fff' : '#331F19'
                });
            }
        });
    }
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

    // Inicializa o calendário dinâmico
    const calendarEl = document.getElementById('calendario-dinamico');
    let calendarioView = 'dayGridMonth'; // Visualização inicial

    if (calendarEl) {
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: calendarioView,
            locale: 'pt-br',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: ''
            },
            buttonText: { today: 'Hoje' },
            editable: true, // Permite arrastar eventos
            events: tarefas.map((t, idx) => ({
                id: 'tarefa-' + idx,
                title: t.texto,
                start: t.data,
                backgroundColor: t.concluida ? '#00bb0a' : (document.body.classList.contains('dark-theme') ? '#3a1c71' : '#FFD166'),
                textColor: document.body.classList.contains('dark-theme') ? '#fff' : '#331F19'
            })),
            eventDrop: function(info) {
                const idx = tarefas.findIndex((t, i) => info.event.id === 'tarefa-' + i);
                if (idx !== -1) {
                    tarefas[idx].data = info.event.startStr;
                    salvarTarefas();
                    renderizarTarefas();
                }
            },
            dateClick: function(info) {
                // Destacar o dia clicado (opcional)
            },
            eventClick: function(info) {
                // Procura o item na lista de tarefas pelo texto e data
                const idx = tarefas.findIndex((t, i) => info.event.id === 'tarefa-' + i);
                if (idx !== -1) {
                    const listaTarefas = document.getElementById("listaTarefas");
                    const item = listaTarefas.children[idx];
                    if (item) {
                        item.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        // Opcional: destaque visual
                        item.classList.add('destaque-tarefa');
                        setTimeout(() => item.classList.remove('destaque-tarefa'), 1200);
                    }
                }
            }
        });
        calendar.render();
        window.calendar = calendar; // Salva a instância global para atualizar depois

        // Atualiza eventos ao mudar de semana/mês
        document.getElementById('toggleCalendario').onclick = function() {
            calendarioView = calendarioView === 'dayGridMonth' ? 'dayGridWeek' : 'dayGridMonth';
            calendar.changeView(calendarioView);
        };
    }

    // ...seu código do Pikaday pode ser removido...
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