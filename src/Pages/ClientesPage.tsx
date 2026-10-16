import { useState, type JSX } from "react";

const clientesIniciais = [
    { id: 1, nome: "Ana Souza", cpf: "123.456.789-00" },
    { id: 2, nome: "Carlos Lima", cpf: "234.567.890-11" },
    { id: 3, nome: "Juliana Alves", cpf: "345.678.901-22" },
    { id: 4, nome: "Roberto Silva", cpf: "456.789.012-33" },
    { id: 5, nome: "Fernanda Costa", cpf: "567.890.123-44" },
];

type Cliente = (typeof clientesIniciais)[number];

const navegar = (rota: string) => {
    window.history.pushState({}, "", rota);
    window.dispatchEvent(new PopStateEvent("popstate"));
};

function ClientesPage(): JSX.Element {
    const [clientes, setClientes] = useState<Cliente[]>(clientesIniciais);
    const [busca, setBusca] = useState("");
    const [nomeFiltro, setNomeFiltro] = useState("");
    const [cpfFiltro, setCpfFiltro] = useState("");
    const [filtrosAplicados, setFiltrosAplicados] = useState({ nome: "", cpf: "" });
    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 5;

    const clientesFiltrados = clientes.filter((cliente) =>
        `${cliente.id} ${cliente.nome} ${cliente.cpf}`.toLowerCase().includes(busca.trim().toLowerCase())
        && cliente.nome.toLowerCase().includes(filtrosAplicados.nome.trim().toLowerCase())
        && cliente.cpf.includes(filtrosAplicados.cpf.trim()),
    );
    const totalPaginas = Math.max(1, Math.ceil(clientesFiltrados.length / itensPorPagina));
    const clientesDaPagina = clientesFiltrados.slice((paginaAtual - 1) * itensPorPagina, paginaAtual * itensPorPagina);

    const editarCliente = (cliente: Cliente) => {
        const nome = window.prompt("Editar nome do cliente:", cliente.nome);
        if (!nome?.trim()) return;
        const cpf = window.prompt("Editar CPF:", cliente.cpf);
        if (cpf === null) return;
        if (cpf.replace(/\D/g, "").length !== 11) {
            window.alert("Informe um CPF com 11 números.");
            return;
        }
        const numeros = cpf.replace(/\D/g, "");
        const cpfFormatado = `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6, 9)}-${numeros.slice(9)}`;
        setClientes((lista) => lista.map((item) => item.id === cliente.id ? { ...item, nome: nome.trim(), cpf: cpfFormatado } : item));
    };

    const excluirCliente = (cliente: Cliente) => {
        if (!window.confirm(`Excluir o cadastro de ${cliente.nome}?`)) return;
        setClientes((lista) => lista.filter((item) => item.id !== cliente.id));
        setPaginaAtual(1);
    };

    return (
        <div className="farmacia-app">
            <aside className="farmacia-sidebar">
                <div className="brand-area">
                    <div className="brand-mark">✚</div>
                    <div className="brand-copy">
                        <h1>Farmácia</h1>
                        <span>Vida+</span>
                    </div>
                </div>

                <p className="sidebar-subtitle">Sua saúde em boas mãos</p>

                <nav className="sidebar-menu" aria-label="Menu principal">
                    <button type="button" className="menu-item" onClick={() => navegar("/")}>
                        <span className="menu-icon">⌂</span>
                        Início
                    </button>
                    <button type="button" className="menu-item" onClick={() => navegar("/produtos")}>
                        <span className="menu-icon">▣</span>
                        Produtos
                    </button>
                    <button type="button" className="menu-item active" onClick={() => navegar("/clientes")}>
                        <span className="menu-icon">◌</span>
                        Clientes
                    </button>
                    <button type="button" className="menu-item" onClick={() => navegar("/pedidos")}>
                        <span className="menu-icon">◫</span>
                        Pedidos
                    </button>
                </nav>

                <button type="button" className="logout-button" onClick={() => navegar("/")}>
                    Sair
                </button>
            </aside>

            <main className="page-content">
                <div className="cliente-page">
                    <header className="dashboard-topbar cliente-topbar">
                        <div className="search-box">
                            <span className="search-icon">⌕</span>
                            <input type="search" placeholder="Buscar por cliente..." aria-label="Buscar cliente" value={busca} onChange={(event) => { setBusca(event.target.value); setPaginaAtual(1); }} />
                        </div>

                        <div className="user-badge">
                            <span className="user-icon">◔</span>
                            <span>Usuário</span>
                            <span className="caret">▾</span>
                        </div>
                    </header>

                    <section className="cliente-header-panel">
                        <div className="cliente-title-wrap">
                            <div className="cliente-icon">◌</div>
                            <div>
                                <h2>Clientes</h2>
                                <p>Cadastre e gerencie seus clientes.</p>
                            </div>
                        </div>

                        <button type="button" className="primary-action" onClick={() => navegar("/clientes/novo")}>
                            + Novo Cliente
                        </button>
                    </section>

                    <div className="filtro-row cliente-filtro-row">
                        <div className="filtro-grupo largura-grande">
                            <label>Nome</label>
                            <input type="search" placeholder="Buscar por nome..." value={nomeFiltro} onChange={(event) => setNomeFiltro(event.target.value)} />
                        </div>

                        <div className="filtro-grupo largura-grande">
                            <label>CPF</label>
                            <input type="search" placeholder="Buscar por CPF..." value={cpfFiltro} onChange={(event) => setCpfFiltro(event.target.value)} />
                        </div>

                        <button type="button" className="filter-button" onClick={() => { setFiltrosAplicados({ nome: nomeFiltro, cpf: cpfFiltro }); setPaginaAtual(1); }}>
                            Filtrar
                        </button>
                    </div>

                    <div className="table-wrap cliente-table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>CPF</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clientesDaPagina.map((cliente) => (
                                    <tr key={cliente.id}>
                                        <td>{cliente.id}</td>
                                        <td>{cliente.nome}</td>
                                        <td>{cliente.cpf}</td>
                                        <td>
                                            <div className="table-actions">
                                                <button type="button" className="action-button edit" aria-label={`Editar ${cliente.nome}`} onClick={() => editarCliente(cliente)}>
                                                    ✎
                                                </button>
                                                <button type="button" className="action-button delete" aria-label={`Excluir ${cliente.nome}`} onClick={() => excluirCliente(cliente)}>
                                                    🗑
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {clientesDaPagina.length === 0 && <p className="sem-resultados">Nenhum cliente encontrado com esses filtros.</p>}

                    <div className="produto-footer-row cliente-pagination" aria-label="Paginação de clientes">
                        <button type="button" className="pagination-arrow" aria-label="Página anterior" disabled={paginaAtual <= 1} onClick={() => setPaginaAtual((pagina) => Math.max(1, pagina - 1))}>‹</button>
                        {Array.from({ length: totalPaginas }, (_, index) => index + 1).map((pagina) => (
                            <button type="button" key={pagina} className={`pagination-page${pagina === paginaAtual ? " active" : ""}`} aria-current={pagina === paginaAtual ? "page" : undefined} onClick={() => setPaginaAtual(pagina)}>{pagina}</button>
                        ))}
                        <button type="button" className="pagination-arrow" aria-label="Próxima página" disabled={paginaAtual >= totalPaginas} onClick={() => setPaginaAtual((pagina) => Math.min(totalPaginas, pagina + 1))}>›</button>
                    </div>

                    <div className="cliente-banner">
                        <div className="cliente-banner-icon">✚</div>
                        <span>Cuidar de você também é nossa especialidade.</span>
                    </div>

                    <div className="footer-brand produto-brand">
                        <span className="brand-dot">♥</span>
                        Farmácia Vida+
                    </div>
                </div>
            </main>
        </div>
    );
}

export default ClientesPage;
