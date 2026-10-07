
import { useState, type JSX } from "react";

import "./Navegacao.css";

import AuthRequests from "../../fetch/AuthRequests";

function Navegacao(): JSX.Element {

    const [menuAberto, setMenuAberto] = useState(false);

    const isAuthenticated = (() => {

        const isAuth = localStorage.getItem("isAuth");
        const token = localStorage.getItem("token");

        return !!(
            isAuth &&
            token &&
            AuthRequests.checkTokenExpiry()
        );

    })();

    const nome =
        localStorage.getItem("nome") || "Usuário";

    const email =
        localStorage.getItem("email") || "";

    const navegar = (rota: string) => {

        window.location.href = rota;

        setMenuAberto(false);

    };

    const sair = () => {

        AuthRequests.removeToken();

        setMenuAberto(false);

    };

    return (

        <nav className="navegacao">

            <div className="nav-container">

                {/* LOGO */}

                <button
                    className="nav-logo-container"
                    onClick={() => navegar("/")}
                    type="button"
                >

                    <div className="nav-logo-mark">
                        IT
                    </div>

                    <div className="nav-logo-text">

                        <strong>
                            InfoTech
                        </strong>

                        <span>
                            Informática
                        </span>

                    </div>

                </button>


                {/* BOTÃO MOBILE */}

                <button
                    className="nav-toggle"
                    onClick={() =>
                        setMenuAberto(!menuAberto)
                    }
                    type="button"
                    aria-label="Abrir menu"
                >
                    ☰
                </button>


                {/* MENU */}

                <ul
                    className={
                        `nav-menu ${
                            menuAberto
                                ? "nav-menu-aberto"
                                : ""
                        }`
                    }
                >

                    {/* HOME */}

                    <li>

                        <button
                            className="nav-link"
                            onClick={() => navegar("/")}
                            type="button"
                        >

                            <span>⌂</span>

                            Home

                        </button>

                    </li>


                    {/* PRODUTOS */}

                    {isAuthenticated && (

                        <li>

                            <button
                                className="nav-link"
                                onClick={() =>
                                    navegar(
                                        "/lista/produtos"
                                    )
                                }
                                type="button"
                            >

                                <span>▣</span>

                                Produtos

                            </button>

                        </li>

                    )}


                    {/* CATEGORIAS */}

                    {isAuthenticated && (

                        <li>

                            <button
                                className="nav-link"
                                onClick={() =>
                                    navegar(
                                        "/lista/categorias"
                                    )
                                }
                                type="button"
                            >

                                <span>◇</span>

                                Categorias

                            </button>

                        </li>

                    )}


                    {/* ESTOQUE */}

                    {isAuthenticated && (

                        <li>

                            <button
                                className="nav-link"
                                onClick={() =>
                                    navegar("/estoque")
                                }
                                type="button"
                            >

                                <span>▥</span>

                                Estoque

                            </button>

                        </li>

                    )}


                    {/* USUÁRIO */}

                    {isAuthenticated ? (

                        <li className="nav-user">

                            <div className="nav-user-avatar">
                                {nome.charAt(0).toUpperCase()}
                            </div>

                            <div className="nav-user-info">

                                <strong>
                                    {nome}
                                </strong>

                                <span>
                                    {email}
                                </span>

                            </div>

                            <button
                                className="nav-button-sair"
                                onClick={sair}
                                type="button"
                            >
                                Sair
                            </button>

                        </li>

                    ) : (

                        <li>

                            <button
                                className="nav-button-login"
                                onClick={() =>
                                    navegar("/login")
                                }
                                type="button"
                            >
                                Entrar
                            </button>

                        </li>

                    )}

                </ul>

            </div>

        </nav>

    );
}

export default Navegacao;

