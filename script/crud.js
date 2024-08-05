const btnAdicionarTarefa = document.querySelector('.app__button--add-task');
const formulario = document.querySelector('.app__form-add-task');
const textarea = document.querySelector('.app__form-textarea');
const btnCancelarTarefa = document.querySelector('.app__form-footer__button--cancel');
const paragrafoDescricaoTarefa = document.querySelector('.app__section-active-task-description');
const btnRemoverConcluidas = document.querySelector('#btn-remover-concluidas');
const btnRemoverTodas = document.querySelector('#btn-remover-todas');

//ARRAY QUE ARMAZENA TODAS AS TAREFAS
//parse é oposto do stringfy - transforma string para JSON
let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

let tarefaSelecionada = null;
let liTarefaSelecionada = null;

//ul que aloca todas as tarefas 
const ulTarefas = document.querySelector('.app__section-task-list');

function atualizarTarefa(){
    //adicionar tarefa na local storage - array
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

//Cria a estrura do item da lista de tarefas - <li></li>
function criarTarefa(tarefa){
    const li = document.createElement('li');
    li.classList.add('app__section-task-list-item');

    const svg = document.createElement('svg');
    svg.innerHTML = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>
    `;

    const p = document.createElement('p');
    p.classList.add('app__section-task-list-item-description');
    p.textContent = tarefa.descricao;

    const button = document.createElement('button');
    button.classList.add('app_button-edit');

    button.onclick = () => {
        //variavel armazena entrada do prompt
        const novaTarefa = prompt("Digite o nome da tarefa");
        //Se 'novaTarefa' não estiver vazia ou nula
        if(novaTarefa){
            //altera referencia
            tarefa.descricao = novaTarefa
            //altera HTML
            p.textContent = novaTarefa;
            //altera na local storage
            atualizarTarefa()
        }
    }

    const imgButton = document.createElement('img');
    imgButton.setAttribute('src', './imagens/edit.png');
    button.append(imgButton);

    li.append(svg);
    li.append(p);
    li.append(button);

    //Persistir tarefa competa na local storage e recuperá-la
    if(tarefa.completa){
        li.classList.add('app__section-task-list-item-complete');
        button.setAttribute('disabled', 'disabled');
    }
    else{
        li.onclick = () => {
            //remove a classe active de todos os elemento que a possuírem
            document.querySelectorAll('.app__section-task-list-item-active').forEach(elementoDaVez => {
                elementoDaVez.classList.remove('app__section-task-list-item-active');
            });
    
            //se o item for clicado uma segundo vez seguida, ele limpa o nome da tarefa da sessão em andamento e retorna ao programa - early return
            if(tarefaSelecionada == tarefa){
                paragrafoDescricaoTarefa.textContent = '';
                tarefaSelecionada = null;
                liTarefaSelecionada = null;
                return;
            }
    
            tarefaSelecionada = tarefa;
            liTarefaSelecionada = li;
            paragrafoDescricaoTarefa.textContent = tarefa.descricao;
    
            //Adiciona a classe active no elemento clicado
            li.classList.add('app__section-task-list-item-active');
        }
    }

    return li;
}

//ao clicar no botão 'Cancelar'
btnCancelarTarefa.addEventListener('click', () => {
    //limpa o valor do textarea
    textarea.value = '';
    //esconde o formulário
    formulario.classList.toggle('hidden');
});

btnAdicionarTarefa.addEventListener('click', () => {
    formulario.classList.toggle('hidden');
});

//CAPTURANDO A TAREFA COM AJUDA DO JSON E ARMAZENANDO NA LOCALSTORAGE
formulario.addEventListener('submit', (evento) => {
    //REMOVENDO A SUBMISSÃO DO FORMULÁRIO
    evento.preventDefault();

    //CAPTURANDO O TAREFA DIGITADA
    const tarefa = {
        descricao: textarea.value
    };
    //adicionar tarefa no array
    tarefas.push(tarefa);
    //cria a tarefa
    const elementoTarefa = criarTarefa(tarefa);
    //adiciona a tarefa na lista
    ulTarefas.append(elementoTarefa);
    //adicionar tarefa na local storage - array
    atualizarTarefa();

    //limpar o textarea
    textarea.value = '';
    //esconnder o form
    formulario.classList.add('hidden');
});

//capturando tarefas
tarefas.forEach(tarefa => {
    const elementoTarefa = criarTarefa(tarefa);
    ulTarefas.append(elementoTarefa);
});

//evento muda a cor de preenchimento quando o cronometo foco for finalizado
document.addEventListener('FocoFinalizado', () => {
    if(tarefaSelecionada && liTarefaSelecionada){
        liTarefaSelecionada.classList.remove('app__section-task-list-item-active');
        liTarefaSelecionada.classList.add('app__section-task-list-item-complete');
        liTarefaSelecionada.querySelector('button').setAttribute('disabled', 'disabled');
        tarefaSelecionada.completa = true;
        //Remove o nome da task da sessão em andamento
        paragrafoDescricaoTarefa.textContent = '';
        atualizarTarefa();
    }
})

//REMOVER TAREFA/TAREFAS DA LOCALSTORAGE
const removerTarefas = (somenteCompletas) => {
    debugger;
    let seletor = ".app__section-task-list-item";
    if(somenteCompletas){
        seletor = ".app__section-task-list-item-complete";
    }
    document.querySelectorAll(seletor).forEach(elemento => {
        elemento.remove();
    });
    tarefas = somenteCompletas ? tarefas.filter(tarefa => !tarefa.completa) : [];
    atualizarTarefa()
}

btnRemoverConcluidas.onclick = () => removerTarefas(true);
btnRemoverTodas.onclick = () => removerTarefas(false);