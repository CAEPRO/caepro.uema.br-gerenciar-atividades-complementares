// Constantes e configurações
const HORAS_NECESSARIAS = 225;
const CURSO_DE_GRADUACAO = 'Engenharia de Produção Bacharelado UEMA, Campus São Luis';
const opcoesAtividades = [ // Lista de atividades
    'Bolsista em projeto de pesquisa',
    'Voluntário em projeto de pesquisa',
    'Bolsista em projeto de extensão',
    'Voluntário em projeto de extensão',
    'Bolsista em monitoria',
    'Monitoria voluntária',
    'Disciplinas cursadas com aprovação',
    'Participação em projetos especiais e atléticas desportivas',
    'Publicação de artigo em revista Qualis A1, A2, B1, B2 e B3',
    'Publicação de artigo em revista Qualis B4, B5 e C',
    'Publicação de artigo completo em congresso internacional (autor principal)',
    'Publicação de artigo completo em congresso internacional (co-autoria)',
    'Publicação de artigo completo em congresso nacional',
    'Depósito de pedido de Patente',
    'Participação em congressos internacionais',
    'Participação em congressos nacionais/Regionais',
    'Apresentação de artigo em congresso internacional',
    'Apresentação de artigo em congresso nacional',
    'Apresentação de trabalhos em seminários, encontros, jornadas, colóquios, workshops locais',
    'Participação como ouvinte em palestras, congressos, seminários, conferências, encontros, workshops',
    'Participação em audiências de defesas de monografias, dissertações e teses',
    'Organização de eventos: seminários, congressos, encontros, jornadas e colóquios',
    'Participação na composição de empresa júnior do Curso',
    'Participação na diretoria do centro Acadêmico do Curso',
    'Participação na condição de representante estudantil no colegiado de curso, assembleia departamental ou conselho de centro',
    'Treinamento como participante',
    'Treinamento como ministrante',
    'Participação em CREA Jr e ABEPRO-JUNIOR',
    'Consultoria',
    'Estágio Não-Curricular',
    'Participação em gincanas ou torneios de conhecimento',
    'Participação em atividades de voluntariado, campanhas beneficentes e beneméritas',
    'Visitas técnicas realizadas em atividades referentes ao Curso',
    'Participação em atividades desportivas representando o Curso de Engenharia de Produção ou a UEMA',
    'Participação em Cursos (áreas da ABEPRO)',
    'Participação de cursos via plataforma Eskada',
    'Facilitador de Cursos (ministrante)',
    'Curso de língua Estrangeira',
    'Intercâmbio',
    'Participação em startups ou incubadoras',
    'Registro de Software'
];

const maxHorasAtividades = { // Máximo de horas por tipo de atividade (limite global)
    'Bolsista em projeto de pesquisa': 80,
    'Voluntário em projeto de pesquisa': 80,
    'Bolsista em projeto de extensão': 80,
    'Voluntário em projeto de extensão': 80,
    'Bolsista em monitoria': 80,
    'Monitoria voluntária': 80,
    'Disciplinas cursadas com aprovação': 90,
    'Participação em projetos especiais e atléticas desportivas': 90,
    'Publicação de artigo em revista Qualis A1, A2, B1, B2 e B3': 180,
    'Publicação de artigo em revista Qualis B4, B5 e C': 120,
    'Publicação de artigo completo em congresso internacional (autor principal)': 60,
    'Publicação de artigo completo em congresso internacional (co-autoria)': 60,
    'Publicação de artigo completo em congresso nacional': 60,
    'Depósito de pedido de Patente': 120,
    'Participação em congressos internacionais': 60,
    'Participação em congressos nacionais/Regionais': 60,
    'Apresentação de artigo em congresso internacional': 60,
    'Apresentação de artigo em congresso nacional': 60,
    'Apresentação de trabalhos em seminários, encontros, jornadas, colóquios, workshops locais': 60,
    'Participação como ouvinte em palestras, congressos, seminários, conferências, encontros, workshops': 60,
    'Participação em audiências de defesas de monografias, dissertações e teses': 15,
    'Organização de eventos: seminários, congressos, encontros, jornadas e colóquios': 60,
    'Participação na composição de empresa júnior do Curso': 120,
    'Participação na diretoria do centro Acadêmico do Curso': 120,
    'Participação na condição de representante estudantil no colegiado de curso, assembleia departamental ou conselho de centro': 30,
    'Treinamento como participante': 30,
    'Treinamento como ministrante': 30,
    'Participação em CREA Jr e ABEPRO-JUNIOR': 60,
    'Consultoria': 30,
    'Estágio Não-Curricular': 60,
    'Participação em gincanas ou torneios de conhecimento': 15,
    'Participação em atividades de voluntariado, campanhas beneficentes e beneméritas': 30,
    'Visitas técnicas realizadas em atividades referentes ao Curso': 30,
    'Participação em atividades desportivas representando o Curso de Engenharia de Produção ou a UEMA': 30,
    'Participação em Cursos (áreas da ABEPRO)': 40,
    'Participação de cursos via plataforma Eskada': 50,
    'Facilitador de Cursos (ministrante)': 60,
    'Curso de língua Estrangeira': 30,
    'Intercâmbio': 30,
    'Participação em startups ou incubadoras': 40,
    'Registro de Software': 120
};

const maxHorasValidadasPorTipo = { // Máximo de horas validadas por tipo por período/registro
    'Bolsista em projeto de pesquisa': 20,
    'Voluntário em projeto de pesquisa': 20,
    'Bolsista em projeto de extensão': 20,
    'Voluntário em projeto de extensão': 20,
    'Bolsista em monitoria': 20,
    'Monitoria voluntária': 20,
    'Disciplinas cursadas com aprovação': 90,
    'Participação em projetos especiais e atléticas desportivas': 30,
    'Publicação de artigo em revista Qualis A1, A2, B1, B2 e B3': 90,
    'Publicação de artigo em revista Qualis B4, B5 e C': 60,
    'Publicação de artigo completo em congresso internacional (autor principal)': 30,
    'Publicação de artigo completo em congresso internacional (co-autoria)': 15,
    'Publicação de artigo completo em congresso nacional': 20,
    'Depósito de pedido de Patente': 120,
    'Participação em congressos internacionais': 20,
    'Participação em congressos nacionais/Regionais': 10,
    'Apresentação de artigo em congresso internacional': 30,
    'Apresentação de artigo em congresso nacional': 20,
    'Apresentação de trabalhos em seminários, encontros, jornadas, colóquios, workshops locais': 15,
    'Participação como ouvinte em palestras, congressos, seminários, conferências, encontros, workshops': 7.5,
    'Participação em audiências de defesas de monografias, dissertações e teses': 5,
    'Organização de eventos: seminários, congressos, encontros, jornadas e colóquios': 20,
    'Participação na composição de empresa júnior do Curso': 30,
    'Participação na diretoria do centro Acadêmico do Curso': 30,
    'Participação na condição de representante estudantil no colegiado de curso, assembleia departamental ou conselho de centro': 5,
    'Treinamento como participante': 5,
    'Treinamento como ministrante': 10,
    'Participação em CREA Jr e ABEPRO-JUNIOR': 30,
    'Consultoria': 15,
    'Estágio Não-Curricular': 30,
    'Participação em gincanas ou torneios de conhecimento': 5,
    'Participação em atividades de voluntariado, campanhas beneficentes e beneméritas': 5,
    'Visitas técnicas realizadas em atividades referentes ao Curso': 5,
    'Participação em atividades desportivas representando o Curso de Engenharia de Produção ou a UEMA': 5,
    'Participação em Cursos (áreas da ABEPRO)': 10,
    'Participação de cursos via plataforma Eskada': 10,
    'Facilitador de Cursos (ministrante)': 15,
    'Curso de língua Estrangeira': 15,
    'Intercâmbio': 15,
    'Participação em startups ou incubadoras': 20,
    'Registro de Software': 60
};

const restricaoPorTipo = { // Tipo de restrição por atividade
    'Bolsista em projeto de pesquisa': 'periodo',
    'Voluntário em projeto de pesquisa': 'periodo',
    'Bolsista em projeto de extensão': 'periodo',
    'Voluntário em projeto de extensão': 'periodo',
    'Bolsista em monitoria': 'periodo',
    'Monitoria voluntária': 'periodo',
    'Disciplinas cursadas com aprovação': 'registro',
    'Participação em projetos especiais e atléticas desportivas': 'periodo',
    'Publicação de artigo em revista Qualis A1, A2, B1, B2 e B3': 'registro',
    'Publicação de artigo em revista Qualis B4, B5 e C': 'registro',
    'Publicação de artigo completo em congresso internacional': 'registro',
    'Publicação de artigo completo em congresso nacional': 'registro',
    'Depósito de pedido de Patente': 'registro',
    'Participação em congressos internacionais': 'registro',
    'Participação em congressos nacionais/Regionais': 'registro',
    'Apresentação de artigo em congresso internacional': 'registro',
    'Apresentação de artigo em congresso nacional': 'registro',
    'Apresentação de trabalhos em seminários, encontros, jornadas, colóquios, workshops locais': 'registro',
    'Participação como ouvinte em palestras, congressos, seminários, conferências, encontros, workshops': 'registro',
    'Participação em audiências de defesas de monografias, dissertações e teses': 'registro',
    'Organização de eventos: seminários, congressos, encontros, jornadas e colóquios': 'registro',
    'Participação na composição de empresa júnior do Curso': 'periodo',
    'Participação na diretoria do centro Acadêmico do Curso': 'periodo',
    'Participação na condição de representante estudantil no colegiado de curso, assembleia departamental ou conselho de centro': 'registro',
    'Treinamento como participante': 'registro',
    'Treinamento como ministrante': 'registro',
    'Participação em CREA Jr e ABEPRO-JUNIOR': 'periodo',
    'Consultoria': 'registro',
    'Estágio Não-Curricular': 'periodo',
    'Participação em gincanas ou torneios de conhecimento': 'registro',
    'Participação em atividades de voluntariado, campanhas beneficentes e beneméritas': 'registro',
    'Visitas técnicas realizadas em atividades referentes ao Curso': 'registro',
    'Participação em atividades desportivas representando o Curso de Engenharia de Produção ou a UEMA': 'registro',
    'Participação em Cursos (áreas da ABEPRO)': 'registro',
    'Participação de cursos via plataforma Eskada': 'registro',
    'Facilitador de Cursos (ministrante)': 'registro',
    'Curso de língua Estrangeira': 'periodo',
    'Intercâmbio': 'registro',
    'Participação em startups ou incubadoras': 'registro',
    'Registro de Software': 'registro'
};

// Estado da aplicação
let db;
let currentUser = null;
let isDev = false;
let horasChart = null;

// Inicialização do IndexedDB
const request = indexedDB.open("HorasComplementaresDB", 12); // Versão incrementada

request.onupgradeneeded = function (event) {
    db = event.target.result;

    // Criar/atualizar object store de usuários
    if (!db.objectStoreNames.contains("usuarios")) {
        db.createObjectStore("usuarios", { keyPath: "username" });
    }

    // Criar/atualizar object store de atividades
    let atividadesStore;
    if (!db.objectStoreNames.contains("atividades")) {
        atividadesStore = db.createObjectStore("atividades", {
            keyPath: "id",
            autoIncrement: true
        });
    } else {
        atividadesStore = event.target.transaction.objectStore("atividades");
    }

    // Criar índices
    try {
        if (!atividadesStore.indexNames.contains("usuario")) {
            atividadesStore.createIndex("usuario", "usuario", { unique: false });
        }
        if (!atividadesStore.indexNames.contains("tipo")) {
            atividadesStore.createIndex("tipo", "tipo", { unique: false });
        }
        if (!atividadesStore.indexNames.contains("periodo")) {
            atividadesStore.createIndex("periodo", "periodo", { unique: false });
        }
    } catch (e) {
        console.error("Erro ao criar índices:", e);
    }
};

request.onsuccess = function (event) {
    db = event.target.result;
    popularSelects();
    initEventListeners();
};

request.onerror = function (event) {
    console.error("Erro no IndexedDB", event);
    showError("Erro ao inicializar o banco de dados. Tente recarregar a página.");
};

// Funções auxiliares
function popularSelects() {
    const selects = [
        document.getElementById("tipo"),
        document.getElementById("tipoEdicao")
    ];

    const filtroSelect = document.getElementById("filtroTipo");

    selects.forEach(select => {
        select.innerHTML = '<option value="">Selecione um tipo</option>';
    });

    filtroSelect.innerHTML = '<option value="Todos">Todos os tipos</option>';

    opcoesAtividades.forEach(opt => {
        selects.forEach(select => {
            const option = document.createElement("option");
            option.value = opt;
            option.textContent = opt;
            select.appendChild(option);
        });

        const filtroOption = document.createElement("option");
        filtroOption.value = opt;
        filtroOption.textContent = opt;
        filtroSelect.appendChild(filtroOption);
    });
}

function initEventListeners() {
    document.getElementById("loginForm").addEventListener("submit", handleLoginSubmit);
    document.getElementById("togglePassword").addEventListener("click", togglePasswordVisibility);
    document.getElementById("toggleLink").addEventListener("click", toggleLoginMode);
    document.getElementById("aboutLink").addEventListener("click", mostrarSobre);

    document.getElementById("formCadastro").addEventListener("submit", handleCadastroSubmit);
    document.getElementById("formFiltro").addEventListener("submit", handleFiltroSubmit);
    document.getElementById("formEdicao").addEventListener("submit", handleEdicaoSubmit);
    document.getElementById("limparCadastroBtn").addEventListener("click", limparCadastro);
    document.getElementById("limparFiltrosBtn").addEventListener("click", limparFiltros);
    document.getElementById("imprimirBtn").addEventListener("click", handleImprimir);
    document.getElementById("cancelarEdicaoBtn").addEventListener("click", limparEdicao);
    // document.getElementById("excluirAtividadeBtn").addEventListener("click", deletarAtividade);
    document.getElementById("tabsContainer").addEventListener("click", handleTabClick);

    // Botões de exportação e importação
    document.getElementById("exportBtn").addEventListener("click", exportarDados);
    document.getElementById("importBtn").addEventListener("click", importarDados);

    // Botões de logout
    document.getElementById("logoutBtn").addEventListener("click", logout);

    // Administração
    document.getElementById("buscarUsuarioBtn").addEventListener("click", buscarUsuario);
    document.getElementById("salvarUsuarioBtn").addEventListener("click", salvarUsuario);
    document.getElementById("resetarUsuarioBtn").addEventListener("click", resetarUsuario);
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Sistema de login
function handleLoginSubmit(e) {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        showError('Por favor, preencha todos os campos.');
        return;
    }

    hideMessages();

    const submitBtn = document.getElementById("submitBtn");
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
    submitBtn.disabled = true;

    setTimeout(() => {
        let transaction = db.transaction("usuarios", "readonly");
        let store = transaction.objectStore("usuarios");
        let req = store.get(username);

        req.onsuccess = function (event) {
            const isLoginMode = document.getElementById("loginTitle").textContent === "Login";
            let user = event.target.result;

            if (username === "caepro.uema@gmail.com" && password === "producao.ca") {
                isDev = true;
                currentUser = username;
                iniciarApp();
            } else if (isLoginMode) {
                if (user && user.password === password) {
                    currentUser = username;
                    iniciarApp();
                } else {
                    showError("Usuário ou senha inválidos!");
                    submitBtn.innerHTML = 'Entrar';
                    submitBtn.disabled = false;
                }
            } else {
                if (user) {
                    showError("Usuário já existe!");
                    submitBtn.innerHTML = 'Registrar';
                    submitBtn.disabled = false;
                } else {
                    let trans = db.transaction("usuarios", "readwrite");
                    let storeWrite = trans.objectStore("usuarios");
                    storeWrite.add({ username, password });

                    showSuccess("Registro realizado com sucesso! Faça login.");

                    setTimeout(() => {
                        toggleLoginMode();
                        submitBtn.innerHTML = 'Entrar';
                        submitBtn.disabled = false;

                        document.getElementById("username").value = "";
                        document.getElementById("password").value = "";
                    }, 2000);
                }
            }
        };

        req.onerror = function () {
            const isLoginMode = document.getElementById("loginTitle").textContent === "Login";
            showError("Erro ao acessar o banco de dados");
            submitBtn.innerHTML = isLoginMode ? 'Entrar' : 'Registrar';
            submitBtn.disabled = false;
        };
    }, 1000);
}

function toggleLoginMode() {
    const loginTitle = document.getElementById("loginTitle");
    const submitBtn = document.getElementById("submitBtn");
    const toggleLink = document.getElementById("toggleLink");

    if (loginTitle.textContent === "Login") {
        loginTitle.textContent = "Registro";
        submitBtn.textContent = "Registrar";
        toggleLink.innerHTML = '<i class="fas fa-sign-in-alt"></i> Voltar para login';
    } else {
        loginTitle.textContent = "Login";
        submitBtn.textContent = "Entrar";
        toggleLink.innerHTML = '<i class="fas fa-user-plus"></i> Não tem conta? Registre-se';
    }
    hideMessages();
}

function togglePasswordVisibility() {
    const passwordInput = document.getElementById("password");
    const toggleIcon = document.getElementById("togglePassword");
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";

    passwordInput.setAttribute("type", type);
    toggleIcon.classList.toggle("fa-eye");
    toggleIcon.classList.toggle("fa-eye-slash");
}

function iniciarApp() {
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("mainScreen").style.display = "block";
    document.getElementById("userName").textContent = currentUser;

    popularSelects();
    atualizarTabela();
    atualizarResumo();
    recalcularHorasGlobal();

    if (isDev) {
        adicionarAbaDesenvolvedor();
    }
}

function adicionarAbaDesenvolvedor() {
    const tabsContainer = document.getElementById("tabsContainer");

    if (document.querySelector('.tab[data-tab="desenvolvedor"]')) {
        return;
    }

    const devTab = document.createElement("div");
    devTab.className = "tab";
    devTab.dataset.tab = "desenvolvedor";
    devTab.innerHTML = '<i class="fas fa-cogs"></i> Admin';
    tabsContainer.appendChild(devTab);
}

function removerAbaDesenvolvedor() {
    const devTab = document.querySelector('.tab[data-tab="desenvolvedor"]');
    if (devTab) {
        devTab.remove();
    }

    const activeTab = document.querySelector(".tab.active");
    if (activeTab && activeTab.dataset.tab === "desenvolvedor") {
        document.querySelector('.tab[data-tab="cadastrar"]').click();
    }

    const devContent = document.getElementById("desenvolvedor");
    if (devContent) {
        devContent.classList.remove("active");
    }
}

function logout() {
    if (confirm("Tem certeza que deseja sair do sistema?")) {
        removerAbaDesenvolvedor();
        currentUser = null;
        isDev = false;
        document.getElementById("mainScreen").style.display = "none";
        document.getElementById("loginScreen").style.display = "block";
        document.getElementById("username").value = "";
        document.getElementById("password").value = "";

        const submitBtn = document.getElementById("submitBtn");
        submitBtn.innerHTML = 'Entrar';
        submitBtn.disabled = false;

        hideMessages();
    }
}

function mostrarSobre() {
    alert("Atividades Complementares - Versão 1.0\n\nDesenvolvido pelo CAEPRO/UEMA (Centro acadêmico de Engenharia de Produção) para auxiliar os estudantes do curso no gerenciamento de atividades complementares.\n\nPara esclarecimentos de dúvidas ou recuperação de login e senhas, entrar em contato com os perfis oficiais do CAEPRO/UEMA.\n\nEmail: caepro.uema@gmail.com\nInstagram: @caepro.uema\nCentro de Ciências Tecnológicas - CCT/UEMA, Cidade Universitária Paulo VI.");
}

// Funções das abas
function handleTabClick(e) {
    if (e.target.classList.contains("tab")) {
        const tabs = document.querySelectorAll(".tab");
        const tabId = e.target.dataset.tab;

        tabs.forEach(tab => tab.classList.remove("active"));
        e.target.classList.add("active");

        document.querySelectorAll(".tab-content").forEach(content => {
            content.classList.remove("active");
        });

        document.getElementById(tabId).classList.add("active");

        if (tabId === "resumo") {
            atualizarGraficoResumo();
        }
    }
}

// Função para converter arquivo para ArrayBuffer
function fileToArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

// Cadastro de atividades
async function handleCadastroSubmit(e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const tipo = document.getElementById("tipo").value;
    const horas = parseFloat(document.getElementById("horas").value);
    const periodo = document.getElementById("periodo").value.trim();
    const comprovanteInput = document.getElementById("comprovante");
    const comprovanteFile = comprovanteInput.files[0];

    if (!nome || !tipo || isNaN(horas) || horas < 0 || !periodo) {
        showSystemMessage("Preencha todos os campos obrigatórios", "error");
        return;
    }

    if (!validarPeriodo(periodo)) {
        showSystemMessage("Período inválido. Formato esperado: AAAA.S (ex: 2025.1) com ano entre 2000-2100", "error");
        return;
    }

    try {
        const horasValidadasEfetivas = await calcularHorasValidadas(tipo, horas, periodo);

        let comprovanteArrayBuffer = null;
        if (comprovanteFile) {
            comprovanteArrayBuffer = await fileToArrayBuffer(comprovanteFile);
        }

        const novaAtividade = {
            usuario: currentUser,
            nome,
            tipo,
            horasRegistradas: horas,
            horasValidadas: horasValidadasEfetivas,
            periodo,
            status: horasValidadasEfetivas > 0 ? 'Aprovado' : 'Rejeitado',
            comprovante: comprovanteArrayBuffer
        };

        const transaction = db.transaction("atividades", "readwrite");
        const store = transaction.objectStore("atividades");
        const request = store.add(novaAtividade);

        request.onsuccess = function () {
            let msg = "Atividade cadastrada com sucesso!";
            if (horasValidadasEfetivas < horas) {
                const motivo = horasValidadasEfetivas === 0 ?
                    "limite global atingido para este tipo de atividade" :
                    "limites de horas atingidos";

                msg = `Atividade cadastrada, mas apenas ${horasValidadasEfetivas}h validadas (${motivo}).`;
            }
            showSystemMessage(msg, "success");
            document.getElementById("formCadastro").reset();
            atualizarTabela();
            atualizarResumo();
        };
    } catch (error) {
        showSystemMessage("Erro ao cadastrar atividade: " + error, "error");
    }
}

// Função auxiliar para validar o formato do período
function validarPeriodo(periodo) {
    if (typeof periodo !== 'string') return false;
    const regex = /^\d{4}\.[12]$/;
    if (!regex.test(periodo)) return false;
    const ano = parseInt(periodo.split('.')[0], 10);
    return ano >= 2000 && ano <= 2100;
}

// Função para calcular horas validadas
async function calcularHorasValidadas(tipo, horas, periodo, excludeId = null) {
    const horasCadastradasGlobal = await consultarHorasCadastradasGlobal(tipo, excludeId);
    const disponibilidadeGlobal = Math.max(0, maxHorasAtividades[tipo] - horasCadastradasGlobal);

    if (disponibilidadeGlobal <= 0) {
        return 0;
    }

    let limiteEspecifico;

    if (restricaoPorTipo[tipo] === 'registro') {
        limiteEspecifico = maxHorasValidadasPorTipo[tipo];
    } else {
        const horasPeriodo = await consultarHorasPorTipo(tipo, periodo, excludeId);
        const disponibilidadePeriodo = Math.max(0, maxHorasValidadasPorTipo[tipo] - horasPeriodo.totalValidadas);
        limiteEspecifico = disponibilidadePeriodo;
    }

    return Math.min(horas, limiteEspecifico, disponibilidadeGlobal);
}

// Função para consultar horas cadastradas globalmente (para um tipo)
async function consultarHorasCadastradasGlobal(tipo, excludeId = null) {
    return new Promise((resolve, reject) => {
        let totalHoras = 0;

        const transaction = db.transaction("atividades", "readonly");
        const store = transaction.objectStore("atividades");
        const request = store.openCursor();

        request.onsuccess = function (e) {
            const cursor = e.target.result;
            if (cursor) {
                const atividade = cursor.value;

                if (atividade.tipo === tipo &&
                    atividade.usuario === currentUser &&
                    (!excludeId || atividade.id !== excludeId)) {
                    totalHoras += atividade.horasValidadas;
                }
                cursor.continue();
            } else {
                resolve(totalHoras);
            }
        };

        request.onerror = function () {
            reject("Erro ao consultar horas cadastradas globalmente");
        };
    });
}

// Função para consultar horas por tipo e período
async function consultarHorasPorTipo(tipo, periodo = null, excludeId = null) {
    return new Promise((resolve, reject) => {
        let totalHoras = 0;
        let totalValidadas = 0;

        const transaction = db.transaction("atividades", "readonly");
        const store = transaction.objectStore("atividades");
        const request = store.openCursor();

        request.onsuccess = function (e) {
            const cursor = e.target.result;
            if (cursor) {
                const atividade = cursor.value;

                const mesmoTipo = atividade.tipo === tipo;
                const mesmoPeriodo = periodo ? atividade.periodo === periodo : true;
                const mesmoUsuario = atividade.usuario === currentUser;
                const naoExcluida = !excludeId || atividade.id !== excludeId;

                if (mesmoTipo && mesmoPeriodo && mesmoUsuario && naoExcluida) {
                    totalHoras += atividade.horasRegistradas;
                    totalValidadas += atividade.horasValidadas;
                }
                cursor.continue();
            } else {
                resolve({ totalHoras, totalValidadas });
            }
        };

        request.onerror = function () {
            reject("Erro ao consultar horas por tipo");
        };
    });
}

function limparCadastro() {
    document.getElementById("formCadastro").reset();
}

// Exibição de atividades
function handleFiltroSubmit(e) {
    e.preventDefault();
    atualizarTabela();
}

function limparFiltros() {
    document.getElementById("filtroTipo").value = "Todos";
    document.getElementById("filtroPeriodo").value = "";
    atualizarTabela();
}

function atualizarTabela() {
    const filtroTipo = document.getElementById("filtroTipo").value;
    const filtroPeriodo = document.getElementById("filtroPeriodo").value.trim().toLowerCase();
    const tbody = document.getElementById("tabelaAtividades");

    tbody.innerHTML = "";

    const transaction = db.transaction("atividades", "readonly");
    const store = transaction.objectStore("atividades");
    const request = store.openCursor();

    let index = 1;
    let totalHorasRegistradas = 0;
    let totalHorasValidadas = 0;

    request.onsuccess = function (e) {
        const cursor = e.target.result;

        if (cursor) {
            const atividade = cursor.value;
            const aplicarFiltro =
                (filtroTipo === "Todos" || atividade.tipo === filtroTipo) &&
                (filtroPeriodo === "" || atividade.periodo.toLowerCase().includes(filtroPeriodo)) &&
                atividade.usuario === currentUser;

            if (aplicarFiltro) {
                const row = document.createElement("tr");

                let statusClass = "";
                let statusText = "";

                if (atividade.status === 'Aprovado') {
                    statusClass = "approved";
                    statusText = "Aprovado";
                } else if (atividade.status === 'Rejeitado') {
                    statusClass = "rejected";
                    statusText = "Rejeitado";
                } else {
                    statusClass = "pending";
                    statusText = "Aprovado";
                }

                row.innerHTML = `
          <td>${index}</td>
          <td>${atividade.nome}</td>
          <td>${atividade.tipo}</td>
          <td>${atividade.horasRegistradas}</td>
          <td>${atividade.horasValidadas}</td>
          <td>${atividade.periodo}</td>
          <td><span class="status-badge ${statusClass}">${statusText}</span></td>
          <td style="text-align: center; vertical-align: middle;">
            <button class="action-btn download" onclick="baixarComprovante(${atividade.id})" ${!atividade.comprovante ? 'disabled' : ''}>
              <i class="fas fa-download"></i>
            </button>
          </td>
          <td style="vertical-align: middle;">
            <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
                <button class="action-btn edit" onclick="carregarEdicao(${atividade.id})">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" onclick="confirmarExclusao(${atividade.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
          </td>
        `;

                tbody.appendChild(row);
                index++;
                totalHorasRegistradas += atividade.horasRegistradas;
                totalHorasValidadas += atividade.horasValidadas;
            }

            cursor.continue();
        } else {
            document.getElementById("totalHorasRegistradas").textContent = totalHorasRegistradas;
            document.getElementById("totalHorasValidadas").textContent = totalHorasValidadas;
        }
    };

    request.onerror = function () {
        showSystemMessage("Erro ao carregar atividades", "error");
    };
}

// Baixar comprovante individual
async function baixarComprovante(id) {
    try {
        const atividade = await new Promise((resolve, reject) => {
            const transaction = db.transaction("atividades", "readonly");
            const store = transaction.objectStore("atividades");
            const request = store.get(id);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject("Erro ao buscar atividade");
        });

        if (atividade && atividade.comprovante) {
            const blob = new Blob([atividade.comprovante], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `comprovante_${id}.pdf`;
            document.body.appendChild(a);
            a.click();

            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
        } else {
            showSystemMessage("Nenhum comprovante disponível para esta atividade", "info");
        }
    } catch (error) {
        showSystemMessage("Erro ao baixar comprovante: " + error, "error");
    }
}

// Exportação de dados para ZIP
async function exportarDados() {
    try {
        const atividades = await new Promise((resolve) => {
            const atividadesDoUsuario = [];

            const transaction = db.transaction("atividades", "readonly");
            const store = transaction.objectStore("atividades");
            const index = store.index("usuario");
            const request = index.openCursor(IDBKeyRange.only(currentUser));

            request.onsuccess = (e) => {
                const cursor = e.target.result;
                if (cursor) {
                    atividadesDoUsuario.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(atividadesDoUsuario);
                }
            };
        });

        const zip = new JSZip();

        // 1. Criar arquivo CSV com proteção de curso
        let csvContent = `Curso;${CURSO_DE_GRADUACAO}\n`; // Linha de proteção
        csvContent += "ID;Nome;Tipo;Horas Registradas;Horas Validadas;Período;Status;\n";
        atividades.forEach(atividade => {
            csvContent += `${atividade.id};${atividade.nome};${atividade.tipo};${atividade.horasRegistradas};${atividade.horasValidadas};${atividade.periodo};${atividade.status}\n`;
        });
        zip.file("atividades.csv", csvContent);

        // 2. Adicionar comprovantes PDF
        const comprovantesFolder = zip.folder("comprovantes");
        for (const atividade of atividades) {
            if (atividade.comprovante) {
                comprovantesFolder.file(`comprovante_${atividade.id}.pdf`, atividade.comprovante);
            }
        }

        // 3. Gerar e baixar ZIP
        const content = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(content);
        const a = document.createElement("a");
        a.href = url;
        a.download = `atividades_${currentUser}_${new Date().toISOString().slice(0, 10)}.zip`;
        document.body.appendChild(a);
        a.click();

        // Limpeza
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);

        showSystemMessage("Dados exportados com sucesso!", "success");
    } catch (error) {
        showSystemMessage("Erro na exportação: " + error.message, "error");
    }
}

// Importação de dados de ZIP
async function importarDados() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.zip';

    fileInput.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const zip = new JSZip();
            const content = await zip.loadAsync(file);

            // 1. Processar CSV e verificar compatibilidade do curso
            const csvFiles = Object.values(content.files).filter(f => f.name.endsWith('.csv'));
            if (csvFiles.length === 0) throw new Error("Arquivo CSV não encontrado no ZIP");

            const csvFile = csvFiles[0];
            const csvContent = await csvFile.async('string');
            const linhas = csvContent.split('\n').filter(linha => linha.trim() !== '');

            // Verificação de compatibilidade do curso
            if (linhas.length === 0 || !linhas[0].startsWith('Curso;')) {
                throw new Error("Arquivo inválido: Formato não reconhecido");
            }

            const cursoImportado = linhas[0].split(';')[1];
            if (cursoImportado !== CURSO_DE_GRADUACAO) {
                throw new Error(`Arquivo incompatível! Este arquivo pertence ao curso: "${cursoImportado}". O sistema atual é configurado para: "${CURSO_DE_GRADUACAO}".`);
            }

            // 2. Mapear comprovantes
            const comprovantes = {};
            for (const relativePath in content.files) {
                if (relativePath.startsWith('comprovantes/') && relativePath.endsWith('.pdf')) {
                    const match = relativePath.match(/comprovante_(\d+)\.pdf$/);
                    if (match) {
                        const id = match[1];
                        comprovantes[id] = await content.files[relativePath].async('arraybuffer');
                    }
                }
            }

            // 3. Importar atividades (ignorando a primeira linha do curso)
            let importadas = 0;
            for (let i = 2; i < linhas.length; i++) {
                try {
                    const campos = linhas[i].split(';');
                    if (campos.length < 7) continue;

                    const novaAtividade = {
                        usuario: currentUser,
                        nome: campos[1],
                        tipo: campos[2],
                        horasRegistradas: parseFloat(campos[3]),
                        horasValidadas: parseFloat(campos[4]),
                        periodo: campos[5],
                        status: campos[6],
                        comprovante: comprovantes[campos[0]] || null
                    };

                    await new Promise((resolve, reject) => {
                        const transaction = db.transaction("atividades", "readwrite");
                        const store = transaction.objectStore("atividades");
                        const request = store.add(novaAtividade);

                        request.onsuccess = resolve;
                        request.onerror = () => reject("Erro ao salvar atividade");
                    });

                    importadas++;
                } catch (error) {
                    console.error(`Erro na linha ${i}:`, error);
                }
            }

            // 4. Atualizar UI
	    recalcularHorasGlobal();
            atualizarTabela();
            atualizarResumo();
            showSystemMessage(`${importadas} atividades importadas com sucesso!`, "success");

        } catch (error) {
            // Tratamento especial para erro de compatibilidade
            if (error.message.includes("incompatível")) {
                showSystemMessage(error.message, "error", 10000); // Mostra por 10 segundos
            } else {
                showSystemMessage("Erro na importação: " + error.message, "error");
            }
        }
    };

    fileInput.click();
}

// Edição de atividades
function carregarEdicao(id) {
    document.querySelector('[data-tab="editar"]').click();

    const transaction = db.transaction("atividades", "readonly");
    const store = transaction.objectStore("atividades");
    const request = store.get(id);

    request.onsuccess = function (e) {
        const atividade = e.target.result;

        if (atividade) {
            document.getElementById("idEdicao").value = atividade.id;
            document.getElementById("nomeEdicao").value = atividade.nome;
            document.getElementById("tipoEdicao").value = atividade.tipo;
            document.getElementById("horasEdicao").value = atividade.horasRegistradas;
            document.getElementById("periodoEdicao").value = atividade.periodo;

            // Mostrar info do comprovante atual
            const comprovanteInfo = document.getElementById("comprovanteAtualInfo");
            if (atividade.comprovante) {
                const size = atividade.comprovante.byteLength;
                comprovanteInfo.innerHTML = `
                    Comprovante atual: 
                    <a href="#" onclick="baixarComprovante(${atividade.id}); return false;">
                        comprovante_${atividade.id}.pdf
                    </a> 
                    (${formatFileSize(size)})
                `;
            } else {
                comprovanteInfo.textContent = "Nenhum comprovante cadastrado";
            }
        }
    };

    request.onerror = function () {
        showSystemMessage("Erro ao carregar atividade para edição", "error");
    };
}

function confirmarExclusao(id) {
    if (confirm("Tem certeza que deseja excluir esta atividade?")) {
        deletarAtividade(id);
    }
}

async function deletarAtividade(id) {
    let idParaExcluir = id;

    if (!idParaExcluir && idParaExcluir !== 0) {
        const idInput = document.getElementById("idEdicao");
        if (idInput && idInput.value) {
            idParaExcluir = parseInt(idInput.value);
        }
    }

    if (idParaExcluir === undefined || idParaExcluir === null || isNaN(idParaExcluir)) {
        showSystemMessage("ID inválido para exclusão. Selecione uma atividade primeiro.", "error");
        return;
    }

    try {
        const atividade = await new Promise((resolve, reject) => {
            const transaction = db.transaction("atividades", "readonly");
            const store = transaction.objectStore("atividades");
            const request = store.get(idParaExcluir);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject("Erro ao buscar atividade");
        });

        if (!atividade) {
            showSystemMessage("Atividade não encontrada no banco de dados", "error");
            return;
        }

        const tipo = atividade.tipo;

        await new Promise((resolve, reject) => {
            const transaction = db.transaction("atividades", "readwrite");
            const store = transaction.objectStore("atividades");
            const request = store.delete(idParaExcluir);

            request.onsuccess = resolve;
            request.onerror = (e) => {
                console.error("Erro na transação de exclusão:", e);
                reject("Erro ao excluir atividade");
            };
        });

        await recalcularHorasTipo(tipo);

        showSystemMessage("Atividade excluída com sucesso!", "success");
        document.getElementById("formEdicao").reset();
        atualizarTabela();
        atualizarResumo();

    } catch (error) {
        showSystemMessage(`Erro ao excluir atividade: ${error}`, "error");
    }
}

async function recalcularHorasTipo(tipo) {
    try {
        const atividades = await new Promise((resolve, reject) => {
            const atividadesDoTipo = [];

            const transaction = db.transaction("atividades", "readonly");
            const store = transaction.objectStore("atividades");
            const request = store.openCursor();

            request.onsuccess = function (e) {
                const cursor = e.target.result;
                if (cursor) {
                    const atividade = cursor.value;
                    if (atividade.usuario === currentUser && atividade.tipo === tipo) {
                        atividadesDoTipo.push(atividade);
                    }
                    cursor.continue();
                } else {
                    resolve(atividadesDoTipo);
                }
            };

            request.onerror = (e) => {
                reject("Erro ao buscar atividades");
            };
        });

        atividades.sort((a, b) => a.id - b.id);

        const limiteGlobal = maxHorasAtividades[tipo] || 0;
        let acumuladoGlobal = 0;

        const atualizacoes = [];

        for (const atividade of atividades) {
            const maxIndividual = maxHorasValidadasPorTipo[atividade.tipo] || 0;
            const restanteGlobal = Math.max(0, limiteGlobal - acumuladoGlobal);
            const novasHorasValidadas = Math.min(
                maxIndividual,
                restanteGlobal,
                atividade.horasRegistradas
            );

            acumuladoGlobal += novasHorasValidadas;

            if (novasHorasValidadas !== atividade.horasValidadas) {
                const atividadeAtualizada = {
                    ...atividade,
                    horasValidadas: novasHorasValidadas,
                    status: novasHorasValidadas > 0 ? 'Aprovado' : 'Rejeitado'
                };
                atualizacoes.push(atividadeAtualizada);
            }
        }

        if (atualizacoes.length > 0) {
            await new Promise((resolve, reject) => {
                const transaction = db.transaction("atividades", "readwrite");
                const store = transaction.objectStore("atividades");

                transaction.oncomplete = resolve;
                transaction.onerror = (e) => {
                    reject("Erro ao atualizar atividades");
                };

                for (const atividade of atualizacoes) {
                    store.put(atividade);
                }
            });
        }

        return true;

    } catch (error) {
        throw error;
    }
}

async function recalcularHorasGlobal() {
    try {
        const tiposCadastrados = new Set();
        const atividades = await new Promise((resolve, reject) => {
            const todasAtividades = [];

            const transaction = db.transaction("atividades", "readonly");
            const store = transaction.objectStore("atividades");
            const request = store.openCursor();

            request.onsuccess = function (e) {
                const cursor = e.target.result;
                if (cursor) {
                    if (cursor.value.usuario === currentUser) {
                        tiposCadastrados.add(cursor.value.tipo);
                        todasAtividades.push(cursor.value);
                    }
                    cursor.continue();
                } else {
                    resolve(todasAtividades);
                }
            };

            request.onerror = () => reject("Erro ao coletar tipos de atividades");
        });

        for (const tipo of tiposCadastrados) {
            if (!opcoesAtividades.includes(tipo)) {
                for (const atividade of atividades.filter(a => a.tipo === tipo)) {
                    const atividadeAtualizada = {
                        ...atividade,
                        horasValidadas: 0,
                        status: 'Rejeitado'
                    };

                    await new Promise((resolve) => {
                        const transaction = db.transaction("atividades", "readwrite");
                        const store = transaction.objectStore("atividades");
                        store.put(atividadeAtualizada);
                        transaction.oncomplete = resolve;
                    });
                }
            }
        }

        for (const tipo of opcoesAtividades) {
            await recalcularHorasTipo(tipo);
        }

        atualizarTabela();
        atualizarResumo();
    } catch (error) {
        console.error("Erro no recálculo global:", error);
    }
}

// Edição de atividades
async function handleEdicaoSubmit(e) {
    e.preventDefault();

    const id = parseInt(document.getElementById("idEdicao").value);
    const nome = document.getElementById("nomeEdicao").value.trim();
    const tipoNovo = document.getElementById("tipoEdicao").value;
    const horasNovas = parseFloat(document.getElementById("horasEdicao").value);
    const periodoNovo = document.getElementById("periodoEdicao").value.trim();

    // Novo: Obter arquivo de comprovante
    const comprovanteInput = document.getElementById("comprovanteEdicao");
    const comprovanteFile = comprovanteInput.files[0];

    if (!nome || !tipoNovo || isNaN(horasNovas) || horasNovas < 0 || !periodoNovo) {
        showSystemMessage("Preencha todos os campos obrigatórios", "error");
        return;
    }

    if (!validarPeriodo(periodoNovo)) {
        showSystemMessage("Período inválido. Formato esperado: AAAA.S (ex: 2025.1) com ano entre 2000-2100", "error");
        return;
    }

    try {
        const atividadeOriginal = await new Promise((resolve, reject) => {
            const transaction = db.transaction("atividades", "readonly");
            const store = transaction.objectStore("atividades");
            const request = store.get(id);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject("Erro ao obter atividade");
        });

        if (!atividadeOriginal) {
            showSystemMessage("Atividade não encontrada", "error");
            return;
        }

        const tipoAntigo = atividadeOriginal.tipo;

        // PROCESSAR NOVO COMPROVANTE SE HOUVER
        let novoComprovante = atividadeOriginal.comprovante;
        if (comprovanteFile) {
            novoComprovante = await fileToArrayBuffer(comprovanteFile);
        }

        const atividadeAtualizada = {
            ...atividadeOriginal,
            nome,
            tipo: tipoNovo,
            horasRegistradas: horasNovas,
            periodo: periodoNovo,
            comprovante: novoComprovante // Atualiza o comprovante (pode ser o mesmo ou novo)
        };

        await new Promise((resolve, reject) => {
            const transaction = db.transaction("atividades", "readwrite");
            const store = transaction.objectStore("atividades");
            const request = store.put(atividadeAtualizada);

            request.onsuccess = resolve;
            request.onerror = () => reject("Erro ao atualizar atividade");
        });

        const tiposParaRecalcular = new Set();
        tiposParaRecalcular.add(tipoNovo);
        if (tipoNovo !== tipoAntigo) {
            tiposParaRecalcular.add(tipoAntigo);
        }

        for (const tipo of tiposParaRecalcular) {
            await recalcularHorasTipo(tipo);
        }

        const atividadeRecalculada = await new Promise((resolve, reject) => {
            const transaction = db.transaction("atividades", "readonly");
            const store = transaction.objectStore("atividades");
            const request = store.get(id);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject("Erro ao obter atividade após recálculo");
        });

        const horasValidadas = atividadeRecalculada.horasValidadas;
        let msg = "Atividade atualizada com sucesso!";
        if (horasValidadas < horasNovas) {
            const motivo = horasValidadas === 0 ?
                "limite global atingido para este tipo de atividade" :
                "limites de horas atingidos";

            msg = `Atividade atualizada, mas apenas ${horasValidadas}h validadas (${motivo}).`;
        }

        showSystemMessage(msg, "success");
        document.getElementById("formEdicao").reset();
        // Limpar campo de arquivo após sucesso
        comprovanteInput.value = "";
        // Limpar info do comprovante atual
        document.getElementById("comprovanteAtualInfo").textContent = "Nenhum comprovante cadastrado";
        atualizarTabela();
        atualizarResumo();

    } catch (error) {
        showSystemMessage("Erro ao atualizar atividade: " + error, "error");
    }
}

function limparEdicao() {
    // Limpa todos os campos da aba edição
    document.getElementById("formEdicao").reset();
    // Limpar info do comprovante atual
    document.getElementById("comprovanteAtualInfo").textContent = "Nenhum comprovante cadastrado";
}

// Resumo e estatísticas
async function atualizarResumo() {
    let totalHorasRegistradas = 0;
    let totalHorasValidadas = 0;

    const transaction = db.transaction("atividades", "readonly");
    const store = transaction.objectStore("atividades");
    const request = store.openCursor();

    request.onsuccess = function (e) {
        const cursor = e.target.result;
        if (cursor) {
            const atividade = cursor.value;
            if (atividade.usuario === currentUser) {
                totalHorasRegistradas += atividade.horasRegistradas;
                totalHorasValidadas += atividade.horasValidadas;
            }
            cursor.continue();
        } else {
            const progressoTotal = Math.min(100, Math.round((totalHorasValidadas / HORAS_NECESSARIAS) * 100));

            document.getElementById("resumoHorasRegistradas").textContent = totalHorasRegistradas;
            document.getElementById("resumoHorasValidadas").textContent = totalHorasValidadas;

            document.getElementById("totalHorasRegistradas").textContent = totalHorasRegistradas;
            document.getElementById("totalHorasValidadas").textContent = totalHorasValidadas;

            document.getElementById("progressoTotalPercent").textContent = `${progressoTotal}%`;
            document.getElementById("progressoTotalFill").style.width = `${progressoTotal}%`;

            document.getElementById("horasValidadasPercent").textContent = `${totalHorasValidadas}/${HORAS_NECESSARIAS}`;
            document.getElementById("horasValidadasFill").style.width = `${progressoTotal}%`;

            if (document.getElementById("resumo").classList.contains("active")) {
                atualizarGraficoResumo();
            }
        }
    };
}

function atualizarGraficoResumo() {
    const ctx = document.getElementById('hoursChart').getContext('2d');

    if (horasChart) {
        horasChart.destroy();
    }

    const totalHorasValidadas = parseInt(document.getElementById("resumoHorasValidadas").textContent);
    const horasRestantes = Math.max(0, HORAS_NECESSARIAS - totalHorasValidadas);

    horasChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Horas Validadas', 'Horas Restantes'],
            datasets: [{
                data: [totalHorasValidadas, horasRestantes],
                backgroundColor: [
                    '#28a745',
                    '#e9ecef'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            return `${label}: ${value} horas`;
                        }
                    }
                }
            }
        }
    });
}

// Geração de relatório em PDF
async function handleImprimir() {
    const btn = document.getElementById("imprimirBtn");
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gerando PDF...';
    btn.disabled = true;

    try {
        const nomeAluno = currentUser;
        const matricula = await obterMatriculaAluno();
        const atividades = await obterAtividadesParaRelatorio();

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        // Configurações de estilo
        const primaryColor = [13, 27, 71];
        const secondaryColor = [243, 115, 33];

        // Cabeçalho institucional
        doc.setFillColor(...primaryColor);
        doc.rect(0, 0, 210, 30, 'F');
        doc.setFontSize(16);
        doc.setTextColor(255, 255, 255);
        doc.text("UEMA", 20, 20);
        doc.setFontSize(10);
        doc.text("Universidade Estadual do Maranhão", 105, 10, null, null, 'center');
        doc.text("Centro de Ciências Tecnológicas - CCT", 105, 15, null, null, 'center');
        doc.text("Curso Engenharia de Produção Bacharelado", 105, 20, null, null, 'center');
        doc.text("Centro Acadêmico de Engenharia de Produção - CAEPRO", 105, 25, null, null, 'center');
        doc.text("Sistema Integrado de Gestão de Atividades Acadêmicas", 105, 30, null, null, 'center');

        // Informações do aluno
        const yStart = 40;
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Aluno: ${nomeAluno}`, 20, yStart);
        doc.text(`Matrícula: ${matricula}`, 20, yStart + 7);
        doc.text(`Data de emissão: ${new Date().toLocaleDateString('pt-BR')}`, 120, yStart + 7);

        // Título do relatório
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("RELATÓRIO DE ATIVIDADES COMPLEMENTARES", 105, yStart + 20, null, null, 'center');

        // Texto introdutório
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        const textoIntro = [
            "Declaro para os devidos fins que o(a) aluno(a) acima identificado(a) realizou as atividades",
            "complementares relacionadas abaixo durante o curso de Engenharia de Produção, conforme registro",
            "no sistema de gestão do CAEPRO/UEMA e em atendimento à Resolução CEPE 037/2024."
        ];

        textoIntro.forEach((linha, i) => {
            doc.text(linha, 20, yStart + 35 + (i * 6));
        });

        // Preparar dados da tabela
        const headers = [["Nome da Atividade", "Tipo", "Horas Registradas", "Horas Validadas", "Período", "Status"]];
        const data = atividades.map(atividade => [
            atividade.nome,
            atividade.tipo,
            atividade.horasRegistradas.toString(),
            atividade.horasValidadas.toString(),
            atividade.periodo,
            atividade.status
        ]);

        // Gerar tabela estilizada
        doc.autoTable({
            startY: yStart + 60,
            head: headers,
            body: data,
            theme: 'grid',
            styles: {
                fontSize: 9,
                cellPadding: 2,
                textColor: [0, 0, 0],
                font: 'helvetica',
                lineWidth: 0.1
            },
            headStyles: {
                fillColor: primaryColor,
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                halign: 'center',
                lineWidth: 0.1
            },
            bodyStyles: {
                lineWidth: 0.1
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245]
            },
            columnStyles: {
                0: { cellWidth: 55, halign: 'left' },
                1: { cellWidth: 45, halign: 'left' },
                2: { halign: 'center', cellWidth: 20 },
                3: { halign: 'center', cellWidth: 20 },
                4: { halign: 'center', cellWidth: 20 },
                5: { halign: 'center', cellWidth: 20 }
            },
            margin: { left: 15, right: 15 }
        });

        const finalY = doc.autoTable.previous.finalY;

        // Totais
        const totalHorasRegistradas = atividades.reduce((sum, a) => sum + a.horasRegistradas, 0);
        const totalHorasValidadas = atividades.reduce((sum, a) => sum + a.horasValidadas, 0);
        const progresso = (totalHorasValidadas / 225) * 100;

        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("RESUMO DE HORAS", 20, finalY + 15);

        doc.setFont("helvetica", "normal");
        doc.text(`Total de Horas Registradas: ${totalHorasRegistradas}`, 30, finalY + 25);
        doc.text(`Total de Horas Validadas: ${totalHorasValidadas}`, 30, finalY + 32);
        doc.text(`Horas Necessárias: 225`, 30, finalY + 39);

        // Barra de progresso
        const barWidth = 80;
        const barHeight = 8;
        const barX = 130;
        const barY = finalY + 25;

        // Fundo da barra
        doc.setFillColor(200, 200, 200);
        doc.rect(barX, barY, barWidth, barHeight, 'F');

        // Barra de progresso
        doc.setFillColor(...secondaryColor);
        doc.rect(barX, barY, barWidth * (progresso / 100), barHeight, 'F');

        // Texto da barra
        doc.setFontSize(9);
        doc.text(`Progresso: ${progresso.toFixed(1)}%`, barX, barY - 2);
        doc.text(`${totalHorasValidadas} / 225 horas`, barX + barWidth + 5, barY + barHeight / 2 + 1);

        // Rodapé institucional
        doc.setDrawColor(...primaryColor);
        doc.setLineWidth(0.5);
        const footerY = 285;
        doc.line(15, footerY, 195, footerY);

        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text("Centro de Ciências Tecnológicas - CCT/UEMA, Cidade Universitária Paulo VI, São Luís - MA", 105, footerY + 5, null, null, 'center');
        doc.text("Contato: caepro.uema@gmail.com | Instagram: @caepro.uema", 105, footerY + 10, null, null, 'center');
        doc.text("SIGUEMA Acadêmico - Sistema Integrado de Gestão de Atividades Acadêmicas", 105, footerY + 15, null, null, 'center');

        // Salvar PDF
        doc.save(`Relatorio_Atividades_Complementares_${nomeAluno.replace(/\s+/g, '_')}.pdf`);

    } catch (error) {
        showSystemMessage("Erro ao gerar relatório: " + error.message, "error");
        console.error(error);
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

async function obterMatriculaAluno() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction("usuarios", "readonly");
        const store = transaction.objectStore("usuarios");
        const request = store.get(currentUser);

        request.onsuccess = () => {
            if (request.result) {
                resolve(request.result.password);
            } else {
                reject(new Error("Usuário não encontrado"));
            }
        };

        request.onerror = () => reject(new Error("Erro ao acessar banco de dados"));
    });
}

async function obterAtividadesParaRelatorio() {
    return new Promise((resolve, reject) => {
        const atividades = [];

        const transaction = db.transaction("atividades", "readonly");
        const store = transaction.objectStore("atividades");
        const index = store.index("usuario");
        const request = index.openCursor(IDBKeyRange.only(currentUser));

        request.onsuccess = function (e) {
            const cursor = e.target.result;
            if (cursor) {
                atividades.push({
                    nome: cursor.value.nome,
                    tipo: cursor.value.tipo,
                    horasRegistradas: cursor.value.horasRegistradas,
                    horasValidadas: cursor.value.horasValidadas,
                    periodo: cursor.value.periodo,
                    status: cursor.value.status
                });
                cursor.continue();
            } else {
                atividades.sort((a, b) => b.periodo.localeCompare(a.periodo));
                resolve(atividades);
            }
        };

        request.onerror = () => reject(new Error("Erro ao carregar atividades"));
    });
}

// Administração
function buscarUsuario() {
    const username = document.getElementById("filtroUsuario").value.trim();
    if (!username) {
        showSystemMessage("Digite um nome de usuário", "error");
        return;
    }

    const transaction = db.transaction("usuarios", "readonly");
    const store = transaction.objectStore("usuarios");
    const request = store.get(username);

    request.onsuccess = function (e) {
        const user = e.target.result;
        if (user) {
            document.getElementById("adminUsername").value = user.username;
            document.getElementById("detalhesUsuario").classList.remove("hidden");
        } else {
            showSystemMessage("Usuário não encontrado", "error");
            document.getElementById("detalhesUsuario").classList.add("hidden");
        }
    };

    request.onerror = function () {
        showSystemMessage("Erro ao buscar usuário", "error");
    };
}

function salvarUsuario() {
    const username = document.getElementById("adminUsername").value;
    const newPassword = document.getElementById("adminPassword").value.trim();

    if (!username) {
        showSystemMessage("Nenhum usuário selecionado", "error");
        return;
    }

    const transaction = db.transaction("usuarios", "readwrite");
    const store = transaction.objectStore("usuarios");
    const request = store.get(username);

    request.onsuccess = function (e) {
        const user = e.target.result;
        if (user) {
            if (newPassword) {
                user.password = newPassword;
            }

            const updateRequest = store.put(user);
            updateRequest.onsuccess = function () {
                showSystemMessage("Usuário atualizado com sucesso", "success");
                document.getElementById("adminPassword").value = "";
            };
            updateRequest.onerror = function () {
                showSystemMessage("Erro ao atualizar usuário", "error");
            };
        } else {
            showSystemMessage("Usuário não encontrado", "error");
        }
    };
}

function resetarUsuario() {
    const username = document.getElementById("adminUsername").value;

    if (!username) {
        showSystemMessage("Nenhum usuário selecionado", "error");
        return;
    }

    if (confirm(`Tem certeza que deseja resetar todas as atividades de ${username}? Esta ação não pode ser desfeita.`)) {
        const transaction = db.transaction("atividades", "readwrite");
        const store = transaction.objectStore("atividades");

        let request;
        if (store.indexNames.contains("usuario")) {
            const index = store.index("usuario");
            request = index.openCursor(IDBKeyRange.only(username));
        } else {
            request = store.openCursor();
        }

        let count = 0;
        let error = null;

        request.onsuccess = function (e) {
            const cursor = e.target.result;
            if (cursor) {
                if (cursor.value.usuario === username) {
                    cursor.delete();
                    count++;
                }
                cursor.continue();
            } else {
                if (error) {
                    showSystemMessage(`Erro ao resetar atividades: ${error}`, "error");
                } else {
                    const message = count > 0
                        ? `Resetadas ${count} atividades de ${username}`
                        : `Nenhuma atividade encontrada para ${username}`;
                    showSystemMessage(message, "success");
                }
            }
        };

        request.onerror = function (e) {
            error = e.target.error;
            console.error("Erro ao resetar atividades:", error);
        };
    }
}

// Mensagens do sistema
function showError(message) {
    const errorMessage = document.getElementById("errorMessage");
    errorMessage.querySelector("span").textContent = message;
    errorMessage.style.display = "flex";
    document.getElementById("successMessage").style.display = "none";
}

function showSuccess(message) {
    const successMessage = document.getElementById("successMessage");
    successMessage.querySelector("span").textContent = message;
    successMessage.style.display = "flex";
    document.getElementById("errorMessage").style.display = "none";
}

function hideMessages() {
    document.getElementById("errorMessage").style.display = "none";
    document.getElementById("successMessage").style.display = "none";
}

function showSystemMessage(message, type) {
    document.querySelectorAll('.system-message.temp').forEach(msg => msg.remove());

    const messageContainer = document.createElement("div");
    messageContainer.className = `system-message ${type} temp`;

    let iconClass = 'fa-info-circle';
    if (type === 'success') iconClass = 'fa-check-circle';
    if (type === 'error') iconClass = 'fa-exclamation-circle';
    if (type === 'warning') iconClass = 'fa-exclamation-triangle';

    messageContainer.innerHTML = `
    <i class="fas ${iconClass}"></i>
    <span>${message}</span>
  `;

    const activeTab = document.querySelector(".tab-content.active");
    activeTab.insertBefore(messageContainer, activeTab.firstChild);

    setTimeout(() => {
        messageContainer.remove();
    }, 5000);
}
