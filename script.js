// Função para importar dados de um arquivo CSV
function importarDados() {
    // 1. Criar input para seleção de arquivo
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.csv';

    fileInput.onchange = async function (e) {
        const file = e.target.files[0];
        if (!file) return;

        try {
            // 2. Ler e validar o arquivo
            const conteudo = await lerArquivo(file);
            const linhas = conteudo.split('\n').filter(linha => linha.trim() !== '');

            // Verificar cabeçalho
            const cabecalho = linhas[0].split(';');
            if (cabecalho.length < 7 || cabecalho[1] !== "Nome") {
                throw new Error("Formato de cabeçalho inválido");
            }

            // 3. Processar linhas
            let importadas = 0;
            let erros = 0;

            for (let i = 1; i < linhas.length; i++) {
                try {
                    await cadastroImportacao(linhas[i]);
                    importadas++;
                } catch (error) {
                    console.error(`Erro na linha ${i + 1}:`, error);
                    erros++;
                }
            }

            // Atualizar interface e mostrar resultado
            atualizarTabela();
            atualizarResumo();
            showSystemMessage(
                `Importação concluída: ${importadas} atividades importadas, ${erros} erros.`,
                importadas > 0 ? "success" : "error"
            );

        } catch (error) {
            showSystemMessage("Falha na importação: " + error.message, "error");
        }
    };

    fileInput.click();
}

// Função auxiliar para ler arquivo
function lerArquivo(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                // Converter para UTF-8 usando TextDecoder
                const decoder = new TextDecoder('utf-8');
                const data = new Uint8Array(e.target.result);
                const text = decoder.decode(data);

                // Remover possíveis caracteres BOM remanescentes
                resolve(text.replace(/^\uFEFF/, ''));
            } catch (error) {
                reject(new Error("Erro na decodificação do arquivo: " + error.message));
            }
        };
        reader.onerror = () => reject(new Error("Erro na leitura do arquivo"));
        reader.readAsArrayBuffer(file);
    });
}

// Função para processar cada linha do CSV
async function cadastroImportacao(linhaCSV) {
    // 4. Extrair dados da linha
    const campos = linhaCSV.split(';');

    if (campos.length < 7) {
        throw new Error("Formato inválido: campos insuficientes");
    }

    // Mapeamento dos índices (baseado na estrutura do CSV)
    const nome = campos[1].trim();
    const tipo = campos[2].trim();
    const horas = parseFloat(campos[3].replace(',', '.')); // Suporte a decimais
    const periodo = campos[5].trim();

    // Validação básica
    if (!nome || !tipo || isNaN(horas) || horas < 0 || !periodo) {
        throw new Error("Dados inválidos ou faltantes");
    }

    // 5. Criar atividade (reutilizando a lógica original)
    try {
        const horasValidadasEfetivas = await calcularHorasValidadas(tipo, horas, periodo);

        const novaAtividade = {
            usuario: currentUser,
            nome,
            tipo,
            horasRegistradas: horas,
            horasValidadas: horasValidadasEfetivas,
            periodo,
            status: horasValidadasEfetivas > 0 ? 'Aprovado' : 'Rejeitado'
        };

        // Salvar no IndexedDB
        await salvarAtividade(novaAtividade);

    } catch (error) {
        throw new Error(`Erro no processamento: ${error.message}`);
    }
}

// Função auxiliar para salvar no IndexedDB
function salvarAtividade(atividade) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction("atividades", "readwrite");
        const store = transaction.objectStore("atividades");
        const request = store.add(atividade);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(new Error("Falha ao salvar no banco de dados"));
    });
}

// Inicialização do IndexedDB
const request = indexedDB.open("HorasComplementaresDB", 8);

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

    // Criar índices necessários se não existirem
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

async function recalcularHorasTipo(tipo) {
    try {
        // 1. Coletar todas as atividades do tipo
        const atividades = await new Promise((resolve, reject) => {
            const atividadesDoTipo = [];

            const transaction = db.transaction("atividades", "readonly");
            const store = transaction.objectStore("atividades");
            const request = store.openCursor();

            request.onsuccess = function (e) {
                const cursor = e.target.result;
                if (cursor) {
                    const atividade = cursor.value;
                    // Filtrar por tipo e usuário
                    if (atividade.usuario === currentUser && atividade.tipo === tipo) {
                        atividadesDoTipo.push(atividade);
                    }
                    cursor.continue();
                } else {
                    resolve(atividadesDoTipo);
                }
            };

            request.onerror = (e) => {
                console.error("Erro no cursor:", e);
                reject("Erro ao buscar atividades");
            };
        });

        // Ordenar por ID (ordem de inserção)
        atividades.sort((a, b) => a.id - b.id);

        // 2. Calcular o limite global para o tipo
        const limiteGlobal = maxHorasAtividades[tipo] || 0;
        let acumuladoGlobal = 0;

        // 3. Preparar as atualizações
        const atualizacoes = [];

        for (const atividade of atividades) {
            // Calcular o máximo que pode ser validado para esta atividade
            const maxIndividual = maxHorasValidadasPorTipo[atividade.tipo] || 0;

            // Quanto ainda resta no limite global?
            const restanteGlobal = Math.max(0, limiteGlobal - acumuladoGlobal);

            // Horas validadas efetivas: o mínimo entre:
            // - O limite individual
            // - O restante global
            // - As horas registradas
            const novasHorasValidadas = Math.min(
                maxIndividual,
                restanteGlobal,
                atividade.horasRegistradas
            );

            // Atualizar o acumulado global
            acumuladoGlobal += novasHorasValidadas;

            // Verificar se houve alteração
            if (novasHorasValidadas !== atividade.horasValidadas) {
                const atividadeAtualizada = {
                    ...atividade,
                    horasValidadas: novasHorasValidadas,
                    status: novasHorasValidadas > 0 ? 'Aprovado' : 'Rejeitado'
                };
                atualizacoes.push(atividadeAtualizada);
            }
        }

        // 4. Executar as atualizações em uma transação
        if (atualizacoes.length > 0) {
            await new Promise((resolve, reject) => {
                const transaction = db.transaction("atividades", "readwrite");
                const store = transaction.objectStore("atividades");

                transaction.oncomplete = resolve;
                transaction.onerror = (e) => {
                    console.error("Erro na transação de atualização:", e);
                    reject("Erro ao atualizar atividades");
                };

                for (const atividade of atualizacoes) {
                    store.put(atividade);
                }
            });
        }

        return true;

    } catch (error) {
        console.error("Erro no recálculo:", error);
        throw error;
    }
}

// Constantes
const HORAS_NECESSARIAS = 225;

// Lista de atividades
const opcoesAtividades = [
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

// Máximo de horas por tipo de atividade (limite global)
const maxHorasAtividades = {
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

// Máximo de horas validadas por tipo por período/registro
const maxHorasValidadasPorTipo = {
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

// Tipo de restrição por atividade
const restricaoPorTipo = {
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
let devTabContent; // Armazena o conteúdo da aba Admin

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
    document.getElementById("excluirAtividadeBtn").addEventListener("click", deletarAtividade);

    // Debug de eventos
    document.addEventListener('click', function (e) {
        console.log('Click propagado para:', e.target);
    });

    // Nos botões
    document.getElementById("exportBtn").addEventListener("click", function (e) {
        console.log('Export click - target:', e.target);
        e.stopImmediatePropagation();
    });

    document.getElementById("importBtn").addEventListener("click", function (e) {
        console.log('Import click - target:', e.target);
        e.stopImmediatePropagation();
    });

    document.getElementById("logoutBtn").addEventListener("click", function (e) {
        console.log('Import click - target:', e.target);
        e.stopImmediatePropagation();
    });

    document.getElementById("tabsContainer").addEventListener("click", handleTabClick);

    document.getElementById("buscarUsuarioBtn").addEventListener("click", buscarUsuario);
    document.getElementById("salvarUsuarioBtn").addEventListener("click", salvarUsuario);
    document.getElementById("resetarUsuarioBtn").addEventListener("click", resetarUsuario);
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
            // Captura o modo ANTES de qualquer operação
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
                    submitBtn.innerHTML = 'Entrar'; // Modo login
                    submitBtn.disabled = false;
                }
            } else {
                if (user) {
                    showError("Usuário já existe!");
                    submitBtn.innerHTML = 'Registrar'; // Mantém modo registro
                    submitBtn.disabled = false;
                } else {
                    let trans = db.transaction("usuarios", "readwrite");
                    let storeWrite = trans.objectStore("usuarios");
                    storeWrite.add({ username, password });
                    showSuccess("Registro realizado com sucesso! Faça login.");
                    toggleLoginMode();
                    // Atualiza o botão para o novo modo (Login)
                    submitBtn.innerHTML = 'Entrar'; // Força texto "Entrar"
                    submitBtn.disabled = false;
                }
            }
        };

        req.onerror = function () {
            // Captura o modo atual para o erro
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

    if (isDev) {
        adicionarAbaDesenvolvedor();
    }
}

function adicionarAbaDesenvolvedor() {
    const tabsContainer = document.getElementById("tabsContainer");

    // Verificar se a aba já existe
    if (document.querySelector('.tab[data-tab="desenvolvedor"]')) {
        return;
    }

    // Criar a aba
    const devTab = document.createElement("div");
    devTab.className = "tab";
    devTab.dataset.tab = "desenvolvedor";
    devTab.innerHTML = '<i class="fas fa-cogs"></i> Admin';
    tabsContainer.appendChild(devTab);

    // Certificar que o conteúdo existe
    const devContent = document.getElementById("desenvolvedor");
    if (!devContent) {
        criarConteudoDesenvolvedor();
    }
}

function criarConteudoDesenvolvedor() {
    // Criar o conteúdo da aba Admin se não existir
    const tabContentContainer = document.querySelector(".tab-content.active").parentNode;
    const devContent = document.createElement("div");
    devContent.className = "tab-content";
    devContent.id = "desenvolvedor";
    devContent.innerHTML = `
        <div class="form-container">
          <h3 class="form-title"><i class="fas fa-cogs"></i> Administração</h3>
          
          <div class="system-message info">
            <i class="fas fa-info-circle"></i>
            <span>Esta área é restrita aos administradores do sistema.</span>
          </div>
          
          <div class="form-container">
            <h4><i class="fas fa-users"></i> Gerenciar Usuários</h4>
            
            <div class="form-group-main">
              <label for="filtroUsuario">Buscar Usuário</label>
              <div style="display: flex; gap: 10px;">
                <input type="text" id="filtroUsuario" placeholder="Digite o nome de usuário" style="flex: 1;">
                <button class="form-btn primary" id="buscarUsuarioBtn">
                  <i class="fas fa-search"></i> Buscar
                </button>
              </div>
            </div>
            
            <div id="detalhesUsuario" class="hidden" style="margin-top: 20px;">
              <h5>Detalhes do Usuário</h5>
              <div class="form-grid">
                <div class="form-group-main">
                  <label for="adminUsername">Usuário</label>
                  <input type="text" id="adminUsername" readonly>
                </div>
                <div class="form-group-main">
                  <label for="adminPassword">Nova Senha</label>
                  <input type="password" id="adminPassword" placeholder="Deixe em branco para manter">
                </div>
              </div>
              <div class="form-actions">
                <button type="button" class="form-btn primary" id="salvarUsuarioBtn">
                  <i class="fas fa-save"></i> Salvar Alterações
                </button>
                <button type="button" class="form-btn danger" id="resetarUsuarioBtn">
                  <i class="fas fa-trash"></i> Resetar Atividades
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    tabContentContainer.appendChild(devContent);

    // Reatribuir event listeners
    document.getElementById("buscarUsuarioBtn").addEventListener("click", buscarUsuario);
    document.getElementById("salvarUsuarioBtn").addEventListener("click", salvarUsuario);
    document.getElementById("resetarUsuarioBtn").addEventListener("click", resetarUsuario);
}

function removerAbaDesenvolvedor() {
    // Remover a aba
    const devTab = document.querySelector('.tab[data-tab="desenvolvedor"]');
    if (devTab) {
        devTab.remove();
    }

    // Se a aba estava ativa, mudar para a primeira aba
    const activeTab = document.querySelector(".tab.active");
    if (activeTab && activeTab.dataset.tab === "desenvolvedor") {
        document.querySelector('.tab[data-tab="cadastrar"]').click();
    }

    // Não removemos o conteúdo, apenas ocultamos
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

        // Resetar o botão de login
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

// Função para calcular horas validadas
async function calcularHorasValidadas(tipo, horas, periodo, excludeId = null) {
    // 1. Consultar horas já cadastradas globalmente para o tipo
    const horasCadastradasGlobal = await consultarHorasCadastradasGlobal(tipo, excludeId);

    // 2. Calcular disponibilidade global
    const disponibilidadeGlobal = Math.max(0, maxHorasAtividades[tipo] - horasCadastradasGlobal);

    // Se não há disponibilidade global, retorna 0
    if (disponibilidadeGlobal <= 0) {
        return 0;
    }

    // 3. Determinar o limite específico (por período ou registro)
    let limiteEspecifico;

    if (restricaoPorTipo[tipo] === 'registro') {
        // Limite por registro: máximo por atividade individual
        limiteEspecifico = maxHorasValidadasPorTipo[tipo];
    } else {
        // Limite por período: consultar horas no período específico
        const horasPeriodo = await consultarHorasPorTipo(tipo, periodo, excludeId);
        const disponibilidadePeriodo = Math.max(0, maxHorasValidadasPorTipo[tipo] - horasPeriodo.totalValidadas);
        limiteEspecifico = disponibilidadePeriodo;
    }

    // 4. Calcular horas validadas efetivas
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
              <td style="vertical-align: middle;">
                <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
                    <button class="action-btn" onclick="carregarEdicao(${atividade.id})">
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

function handleImprimir() {
    window.print();
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

// Função auxiliar para validar o formato do período
function validarPeriodo(periodo) {
    if (typeof periodo !== 'string') return false;

    // Verifica o formato: 4 dígitos + ponto + 1 ou 2
    const regex = /^\d{4}\.[12]$/;
    if (!regex.test(periodo)) return false;

    // Valida se o ano está em um intervalo razoável (2000-2100)
    const ano = parseInt(periodo.split('.')[0], 10);
    return ano >= 2000 && ano <= 2100;
}

// Cadastro de atividades
async function handleCadastroSubmit(e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const tipo = document.getElementById("tipo").value;
    const horas = parseFloat(document.getElementById("horas").value);
    const periodo = document.getElementById("periodo").value.trim();

    // Validação básica
    if (!nome || !tipo || isNaN(horas) || horas < 0 || !periodo) {
        showSystemMessage("Preencha todos os campos obrigatórios", "error");
        return;
    }

    // Validação do formato do período
    if (!validarPeriodo(periodo)) {
        showSystemMessage("Período inválido. Formato esperado: AAAA.S (ex: 2025.1) com ano entre 2000-2100", "error");
        return;
    }

    try {
        const horasValidadasEfetivas = await calcularHorasValidadas(tipo, horas, periodo);

        const novaAtividade = {
            usuario: currentUser,
            nome,
            tipo,
            horasRegistradas: horas,
            horasValidadas: horasValidadasEfetivas,
            periodo,
            status: horasValidadasEfetivas > 0 ? 'Aprovado' : 'Rejeitado'
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

// Edição de atividades
async function handleEdicaoSubmit(e) {
    e.preventDefault();

    const id = parseInt(document.getElementById("idEdicao").value);
    const nome = document.getElementById("nomeEdicao").value.trim();
    const tipoNovo = document.getElementById("tipoEdicao").value;
    const horasNovas = parseFloat(document.getElementById("horasEdicao").value);
    const periodoNovo = document.getElementById("periodoEdicao").value.trim();

    // Validação básica
    if (!nome || !tipoNovo || isNaN(horasNovas) || horasNovas < 0 || !periodoNovo) {
        showSystemMessage("Preencha todos os campos obrigatórios", "error");
        return;
    }

    // Validação do formato do período
    if (!validarPeriodo(periodoNovo)) {
        showSystemMessage("Período inválido. Formato esperado: AAAA.S (ex: 2025.1) com ano entre 2000-2100", "error");
        return;
    }

    try {
        // Obter atividade original
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

        // Atualizar apenas os dados básicos primeiro
        const atividadeAtualizada = {
            ...atividadeOriginal,
            nome,
            tipo: tipoNovo,
            horasRegistradas: horasNovas,
            periodo: periodoNovo,
            // Não atualizar horasValidadas ainda
        };

        await new Promise((resolve, reject) => {
            const transaction = db.transaction("atividades", "readwrite");
            const store = transaction.objectStore("atividades");
            const request = store.put(atividadeAtualizada);

            request.onsuccess = resolve;
            request.onerror = () => reject("Erro ao atualizar atividade");
        });

        // Determinar tipos afetados
        const tiposParaRecalcular = new Set();
        tiposParaRecalcular.add(tipoNovo);
        if (tipoNovo !== tipoAntigo) {
            tiposParaRecalcular.add(tipoAntigo);
        }

        // Recalcular cada tipo usando a nova função
        for (const tipo of tiposParaRecalcular) {
            await recalcularHorasTipo(tipo);
        }

        // Agora buscar a atividade novamente para obter as horas validadas atualizadas
        const atividadeRecalculada = await new Promise((resolve, reject) => {
            const transaction = db.transaction("atividades", "readonly");
            const store = transaction.objectStore("atividades");
            const request = store.get(id);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject("Erro ao obter atividade após recálculo");
        });

        // Feedback ao usuário com os valores atualizados
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
        atualizarTabela();
        atualizarResumo();

    } catch (error) {
        showSystemMessage("Erro ao atualizar atividade: " + error, "error");
    }
}

async function deletarAtividade(id) {
    if (!id) {
        id = parseInt(document.getElementById("idEdicao").value);
    }

    if (!id) {
        showSystemMessage("Nenhuma atividade selecionada", "error");
        return;
    }

    try {
        // Obter atividade para saber o tipo
        const atividade = await new Promise((resolve, reject) => {
            const transaction = db.transaction("atividades", "readonly");
            const store = transaction.objectStore("atividades");
            const request = store.get(id);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject("Erro ao obter atividade");
        });

        if (!atividade) {
            showSystemMessage("Atividade não encontrada", "error");
            return;
        }

        const tipo = atividade.tipo;

        // Excluir a atividade
        await new Promise((resolve, reject) => {
            const transaction = db.transaction("atividades", "readwrite");
            const store = transaction.objectStore("atividades");
            const request = store.delete(id);

            request.onsuccess = resolve;
            request.onerror = () => reject("Erro ao excluir atividade");
        });

        // Recalcular o tipo usando a nova função
        await recalcularHorasTipo(tipo);

        showSystemMessage("Atividade excluída com sucesso!", "success");
        document.getElementById("formEdicao").reset();
        atualizarTabela();
        atualizarResumo();

    } catch (error) {
        showSystemMessage("Erro ao excluir atividade: " + error, "error");
    }
}

function limparEdicao() {
    document.getElementById("formEdicao").reset();
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

// Exportação de dados
function exportarDados() {
    const transaction = db.transaction("atividades", "readonly");
    const store = transaction.objectStore("atividades");
    const index = store.index("usuario");
    const request = index.openCursor(IDBKeyRange.only(currentUser));

    let atividades = [];
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID;Nome;Tipo;Horas Registradas;Horas Validadas;Período;Status\n";

    request.onsuccess = function (e) {
        const cursor = e.target.result;
        if (cursor) {
            const atividade = cursor.value;
            atividades.push(atividade);
            csvContent += `${atividade.id};${atividade.nome};${atividade.tipo};${atividade.horasRegistradas};${atividade.horasValidadas};${atividade.periodo};${atividade.status}\n`;
            cursor.continue();
        } else {
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `atividades_${currentUser}_${new Date().toISOString().slice(0, 10)}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            showSystemMessage("Dados exportados com sucesso!", "success");
        }
    };
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

        // Usar índice "usuario" se existir, caso contrário usar cursor geral
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

