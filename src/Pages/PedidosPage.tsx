import { useState, type JSX } from "react";

const pedidosIniciais = [
    { id: 1, cliente: "Ana Souza", data: "06/10/2026", total: "R$ 32,40", itens: 2, status: "Finalizado" },
    { id: 2, cliente: "Carlos Lima", data: "05/10/2026", total: "R$ 15,90", itens: 1, status: "Finalizado" },
    { id: 3, cliente: "Juliana Alves", data: "04/10/2026", total: "R$ 45,20", itens: 3, status: "Em andamento" },
    { id: 4, cliente: "Roberto Silva", data: "03/10/2026", total: "R$ 27,50", itens: 2, status: "Finalizado" },
    { id: 5, cliente: "Fernanda Costa", data: "02/10/2026", total: "R$ 13,80", itens: 1, status: "Cancelado" },
];

type Pedido = (typeof pedidosIniciais)[number];

const navegar = (rota: string) => {
    window.history.pushState({}, "", rota);
    window.dispatchEvent(new PopStateEvent("popstate"));
};

function PedidosPage(): JSX.Element {
    const [pedidos] = useState<Pedido[]>(pedidosIniciais);
    const [busca, setBusca] = useState("");
    const [clienteFiltro, setClienteFiltro] = useState("Todos");
    const [dataFiltro, setDataFiltro] = useState("");
    const [statusFiltro, setStatusFiltro] = useState("Todos");
    const [filtrosAplicados, setFiltrosAplicados] = useState({ cliente: "Todos", data: "", status: "Todos" });
    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 5;

    const pedidosFiltrados = pedidos.filter((pedido) =>
        `${pedido.id} ${pedido.cliente} ${pedido.data} ${pedido.status}`.toLowerCase().includes(busca.trim().toLowerCase())
        && (filtrosAplicados.cliente === "Todos" || pedido.cliente === filtrosAplicados.cliente)
        && pedido.data.includes(filtrosAplicados.data.trim())
        && (filtrosAplicados.status === "Todos" || pedido.status === filtrosAplicados.status),
    );
    const totalPaginas = Math.max(1, Math.ceil(pedidosFiltrados.length / itensPorPagina));
    const pedidosDaPagina = pedidosFiltrados.slice((paginaAtual - 1) * itensPorPagina, paginaAtual * itensPorPagina);

    const visualizarPedido = (pedido: Pedido) => {
        window.alert(`Pedido #${pedido.id}\nCliente: ${pedido.cliente}\nData: ${pedido.data}\nItens: ${pedido.itens}\nTotal: ${pedido.total}\nStatus: ${pedido.status}`);
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
                    <button type="button" className="menu-item" onClick={() => navegar("/clientes")}>
                        <span className="menu-icon">◌</span>
                        Clientes
                    </button>
                    <button type="button" className="menu-item active" onClick={() => navegar("/pedidos")}>
                        <span className="menu-icon">◫</span>
                        Pedidos
                    </button>
                </nav>

                <button type="button" className="logout-button" onClick={() => navegar("/")}>
                    Sair
                </button>
            </aside>

            <main className="page-content">
                <div className="pedido-page">
                    <header className="dashboard-topbar pedido-topbar">
                        <div className="search-box">
                            <span className="search-icon">⌕</span>
                            <input type="search" placeholder="Buscar por pedido, cliente ou produto..." aria-label="Buscar pedido" value={busca} onChange={(event) => { setBusca(event.target.value); setPaginaAtual(1); }} />
                        </div>

                        <div className="user-badge">
                            <span className="user-icon">◔</span>
                            <span>Usuário</span>
                            <span className="caret">▾</span>
                        </div>
                    </header>

                    <section className="pedido-header-panel">
                        <div className="pedido-title-wrap">
                            <div className="pedido-icon">◫</div>
                            <div>
                                <h2>Pedidos</h2>
                                <p>Acompanhe e gerencie os pedidos da farmácia.</p>
                            </div>
                        </div>
                        <button type="button" className="primary-action" onClick={() => navegar("/pedidos/novo")}>
                            + Novo Pedido
                        </button>
                    </section>

                    <div className="pedido-filtro-row">
                        <div className="filtro-grupo largura-grande">
                            <label>Cliente</label>
                            <select value={clienteFiltro} onChange={(event) => setClienteFiltro(event.target.value)}>
                                <option>Todos</option>
                                <option>Ana Souza</option>
                                <option>Carlos Lima</option>
                                <option>Juliana Alves</option>
                            </select>
                        </div>

                        <div className="filtro-grupo largura-grande">
                            <label>Data</label>
                            <input type="search" placeholder="dd/mm/aaaa" value={dataFiltro} onChange={(event) => setDataFiltro(event.target.value)} />
                        </div>

                        <div className="filtro-grupo largura-grande">
                            <label>Status</label>
                            <select value={statusFiltro} onChange={(event) => setStatusFiltro(event.target.value)}>
                                <option>Todos</option>
                                <option>Finalizado</option>
                                <option>Em andamento</option>
                                <option>Cancelado</option>
                            </select>
                        </div>

                        <button type="button" className="filter-button" onClick={() => { setFiltrosAplicados({ cliente: clienteFiltro, data: dataFiltro, status: statusFiltro }); setPaginaAtual(1); }}>
                            Filtrar
                        </button>
                    </div>

                    <div className="table-wrap pedido-table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Cliente</th>
                                    <th>Data da venda</th>
                                    <th>Total</th>
                                    <th>Itens</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pedidosDaPagina.map((pedido) => (
                                    <tr key={pedido.id}>
                                        <td>{pedido.id}</td>
                                        <td>{pedido.cliente}</td>
                                        <td>{pedido.data}</td>
                                        <td>{pedido.total}</td>
                                        <td>{pedido.itens}</td>
                                        <td>
                                            <span className={
                                                pedido.status === "Finalizado"
                                                    ? "status-pill green"
                                                    : pedido.status === "Em andamento"
                                                        ? "status-pill warning"
                                                        : "status-pill red"
                                            }>
                                                {pedido.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button type="button" className="action-button view" aria-label={`Visualizar pedido ${pedido.id}`} onClick={() => visualizarPedido(pedido)}>
                                                ◌
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {pedidosDaPagina.length === 0 && <p className="sem-resultados">Nenhum pedido encontrado com esses filtros.</p>}

                    <div className="produto-footer-row pedido-pagination" aria-label="Paginação de pedidos">
                        <button type="button" className="pagination-arrow" aria-label="Página anterior" disabled={paginaAtual <= 1} onClick={() => setPaginaAtual((pagina) => Math.max(1, pagina - 1))}>‹</button>
                        {Array.from({ length: totalPaginas }, (_, index) => index + 1).map((pagina) => (
                            <button type="button" key={pagina} className={`pagination-page${pagina === paginaAtual ? " active" : ""}`} aria-current={pagina === paginaAtual ? "page" : undefined} onClick={() => setPaginaAtual(pagina)}>{pagina}</button>
                        ))}
                        <button type="button" className="pagination-arrow" aria-label="Próxima página" disabled={paginaAtual >= totalPaginas} onClick={() => setPaginaAtual((pagina) => Math.min(totalPaginas, pagina + 1))}>›</button>
                    </div>

                    <div className="pedido-banner">
                        <span className="pedido-banner-plus">＋</span>
                        <span>Mais praticidade no seu dia a dia.</span>
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

export default PedidosPage;
