import { useState, type JSX } from "react";

const estatisticas = [
    { label: "Produtos cadastrados", valor: "24", icon: "▣", rota: "/produtos" },
    { label: "Clientes cadastrados", valor: "18", icon: "◌", rota: "/clientes" },
    { label: "Pedidos realizados", valor: "32", icon: "◫", rota: "/pedidos" },
    { label: "Estoque baixo", valor: "5", icon: "⚠", rota: "/produtos" },
];

const movimentacoes = [
    { data: "06/10/2026", cliente: "Ana Souza", produto: "Paracetamol", quantidade: 2, total: "R$ 15,90" },
    { data: "05/10/2026", cliente: "Carlos Lima", produto: "Vitamina C", quantidade: 1, total: "R$ 13,50" },
    { data: "04/10/2026", cliente: "Juliana Alves", produto: "Dipirona", quantidade: 3, total: "R$ 25,97" },
    { data: "03/10/2026", cliente: "Roberto Silva", produto: "Protetor Solar", quantidade: 1, total: "R$ 45,90" },
    { data: "02/10/2026", cliente: "Fernanda Costa", produto: "Shampoo Anticaspa", quantidade: 2, total: "R$ 37,80" },
];

const navegar = (rota: string) => {
    window.history.pushState({}, "", rota);
    window.dispatchEvent(new PopStateEvent("popstate"));
};

function DashboardPage(): JSX.Element {
    const [busca, setBusca] = useState("");
    const movimentacoesFiltradas = movimentacoes.filter((movimento) =>
        `${movimento.data} ${movimento.cliente} ${movimento.produto}`
            .toLowerCase()
            .includes(busca.trim().toLowerCase()),
    );

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
                    <button type="button" className="menu-item active" onClick={() => navegar("/")}>
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
                <div className="dashboard-shell">
                    <header className="dashboard-topbar">
                        <div className="search-box">
                            <span className="search-icon">⌕</span>
                            <input
                                type="search"
                                placeholder="Buscar cliente ou produto nas movimentações..."
                                aria-label="Buscar movimentações"
                                value={busca}
                                onChange={(event) => setBusca(event.target.value)}
                            />
                        </div>

                        <div className="user-badge">
                            <span className="user-icon">◔</span>
                            <span>Usuário</span>
                            <span className="caret">▾</span>
                        </div>
                    </header>

                    <section className="welcome-banner">
                        <div className="welcome-text">
                            <p>Olá, bem-vindo(a) à</p>
                            <h2>Farmácia Vida+</h2>
                            <span>Cuidando de você em todas as fases da vida.</span>
                            <button type="button" className="cta-button" onClick={() => navegar("/produtos")}>
                                Ver produtos da farmácia
                            </button>
                        </div>

                        <div className="welcome-visual" aria-hidden="true">
                            <div className="shelf-scene">
                                <div className="plus-mark" />
                            </div>
                        </div>
                    </section>

                    <div className="stats-grid">
                        {estatisticas.map((item) => (
                            <button
                                type="button"
                                key={item.label}
                                className="stat-card"
                                onClick={() => navegar(item.rota)}
                                aria-label={`Abrir ${item.label.toLowerCase()}`}
                            >
                                <span className="stat-icon">{item.icon}</span>
                                <span>{item.label}</span>
                                <strong>{item.valor}</strong>
                            </button>
                        ))}
                    </div>

                    <section className="movimentacoes-box">
                        <h3>Movimentações recentes</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Data</th>
                                    <th>Cliente</th>
                                    <th>Produto</th>
                                    <th>Quantidade</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {movimentacoesFiltradas.map((movimento) => (
                                    <tr key={`${movimento.data}-${movimento.cliente}`}>
                                        <td>{movimento.data}</td>
                                        <td>{movimento.cliente}</td>
                                        <td>{movimento.produto}</td>
                                        <td>{movimento.quantidade}</td>
                                        <td>{movimento.total}</td>
                                    </tr>
                                ))}
                                {movimentacoesFiltradas.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="sem-resultados">
                                            Nenhuma movimentação encontrada.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </section>

                    <div className="footer-banner">
                        <span>Mais saúde</span>
                        <strong>para você!</strong>
                    </div>

                    <div className="footer-brand">
                        <span className="brand-dot">♥</span>
                        Farmácia Vida+
                    </div>
                </div>
            </main>
        </div>
    );
}

export default DashboardPage;
