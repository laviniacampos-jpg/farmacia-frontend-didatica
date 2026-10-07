import { useEffect, useState, type JSX } from "react";
import ProdutoRequests from "../../../../fetch/ProdutoRequest";
import type { ProdutoDTO } from "../../../dto/ProdutoDTO";

interface DetalhesProdutoProps {
    id_produto: number;
}


function DetalhesProduto({
    id_produto
}: DetalhesProdutoProps): JSX.Element {

    const [produto, setProduto] = useState<ProdutoDTO | null>(null);

    const [loading, setLoading] = useState<boolean>(true);

    const [error, setError] = useState<string | null>(null);

    const formatarPreco = (preco: number) =>
        new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(preco);

    const formatarData = (data?: string | null) => {
        if (!data) return "Não informada";

        return new Date(`${data}T00:00:00`).toLocaleDateString("pt-BR");
    };

    useEffect(() => {

        async function buscarDados() {

            setLoading(true);

            setError(null);

            try {

                const dados =
                    await ProdutoRequests.obterProdutoPorId(id_produto);

                if (dados) {

                    setProduto(dados);

                } else {

                    setError("Produto não encontrado.");

                }

            } catch (err) {

                console.error(
                    "Erro ao carregar detalhes do produto:",
                    err
                );

                setError(
                    "Ocorreu um erro ao buscar as informações do produto."
                );

            } finally {

                setLoading(false);

            }
        }

        buscarDados();

    }, [id_produto]);


    if (loading) {

        return (

            <main className="bg-gray-200 flex-1 py-6 sm:py-10 px-4 overflow-y-auto">

                <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8">

                    <div className="animate-pulse">

                        <div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div>

                        <div className="h-5 bg-gray-200 rounded w-1/3 mb-8"></div>


                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {[1, 2, 3, 4, 5, 6].map((item) => (

                                <div key={item}>

                                    <div className="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>

                                    <div className="h-6 bg-gray-200 rounded w-2/3"></div>

                                </div>

                            ))}

                        </div>

                    </div>

                </div>

            </main>
        );
    }




    if (error || !produto) {

        return (

            <main className="bg-gray-200 flex-1 flex items-center justify-center p-4">

                <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8 text-center">

                    <div className="text-red-500 text-5xl mb-4">

                        <i className="pi pi-exclamation-triangle"></i>

                    </div>

                    <h2 className="text-xl font-bold text-slate-800 mb-2">

                        Produto não encontrado

                    </h2>

                    <p className="text-slate-500 mb-6">

                        {error || "Não foi possível encontrar este produto."}

                    </p>

                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-md font-bold transition-all"
                    >

                        Voltar para Produtos

                    </button>

                </div>

            </main>
        );
    }


    const estoqueBaixo =
        produto.qtd_estoque <= produto.qtd_min_estoque;

    return (

        <main className="bg-gray-200 flex-1 py-6 sm:py-10 px-4 overflow-y-auto">

            <div className="w-full max-w-4xl mx-auto">

                <div className="bg-white rounded-xl shadow-lg p-5 sm:p-8 animate-fade-in">


                    <div className="flex flex-col gap-3">

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">

                            <div>

                                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">

                                    Produto #{produto.id_produto}

                                </h1>

                                <p className="text-slate-500 mt-1">

                                    Detalhes do produto

                                </p>

                            </div>


                            {/* SITUAÇÃO DO ESTOQUE */}

                            <span
                                className={
                                    estoqueBaixo
                                        ? "inline-flex px-4 py-2 rounded-full text-sm font-semibold bg-red-100 text-red-700"
                                        : "inline-flex px-4 py-2 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-700"
                                }
                            >

                                {estoqueBaixo
                                    ? "Estoque baixo"
                                    : "Estoque normal"
                                }

                            </span>

                        </div>


                        <div className="border-b border-slate-200 my-4"></div>



                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">


                            
                            <section>

                                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-5">

                                    <i className="pi pi-box text-blue-500"></i>

                                    Informações do Produto

                                </h2>


                                <div className="flex flex-col gap-5 border-l-2 border-blue-100 pl-4">


                                    {/* ID */}

                                    <div>

                                        <span className="block text-xs uppercase text-gray-400 font-bold tracking-wider">

                                            ID do Produto

                                        </span>

                                        <span className="text-slate-700 font-medium">

                                            {produto.id_produto}

                                        </span>

                                    </div>


                                    {/* DESCRIÇÃO */}

                                    <div>

                                        <span className="block text-xs uppercase text-gray-400 font-bold tracking-wider">

                                            Descrição

                                        </span>

                                        <span className="text-slate-700 font-medium leading-relaxed">

                                            {produto.descricao ||
                                                "Nenhuma descrição informada."}

                                        </span>

                                    </div>


                                    {/* VALIDADE */}

                                    <div>

                                        <span className="block text-xs uppercase text-gray-400 font-bold tracking-wider">

                                            Validade

                                        </span>

                                        <span className="text-slate-700 font-medium">

                                            {formatarData(produto.validade)}

                                        </span>

                                    </div>

                                </div>

                            </section>


                            {/* =================================================
                                ESTOQUE E VALORES
                            ================================================= */}

                            <section>

                                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-5">

                                    <i className="pi pi-chart-bar text-orange-500"></i>

                                    Estoque e Valores

                                </h2>


                                <div className="flex flex-col gap-5 border-l-2 border-orange-100 pl-4">


                                    {/* PREÇO */}

                                    <div>

                                        <span className="block text-xs uppercase text-gray-400 font-bold tracking-wider">

                                            Preço Unitário

                                        </span>

                                        <span className="text-emerald-600 font-bold text-xl">

                                            {formatarPreco(produto.preco)}

                                        </span>

                                    </div>


                                    {/* QUANTIDADE */}

                                    <div>

                                        <span className="block text-xs uppercase text-gray-400 font-bold tracking-wider">

                                            Quantidade Disponível

                                        </span>

                                        <span className="text-slate-700 font-medium">

                                            {produto.qtd_estoque}{" "}

                                            {produto.qtd_estoque === 1
                                                ? "unidade"
                                                : "unidades"
                                            }

                                        </span>

                                    </div>


                                    {/* MÍNIMO */}

                                    <div>

                                        <span className="block text-xs uppercase text-gray-400 font-bold tracking-wider">

                                            Quantidade Mínima

                                        </span>

                                        <span className="text-slate-700 font-medium">

                                            {produto.qtd_min_estoque}{" "}

                                            {produto.qtd_min_estoque === 1
                                                ? "unidade"
                                                : "unidades"
                                            }

                                        </span>

                                    </div>


                                    {/* SITUAÇÃO ESTOQUE */}

                                    <div>

                                        <span className="block text-xs uppercase text-gray-400 font-bold tracking-wider">

                                            Situação do Estoque

                                        </span>

                                        <span
                                            className={
                                                estoqueBaixo
                                                    ? "inline-flex mt-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700"
                                                    : "inline-flex mt-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700"
                                            }
                                        >

                                            {estoqueBaixo
                                                ? "Estoque baixo"
                                                : "Estoque normal"
                                            }

                                        </span>

                                    </div>

                                </div>

                            </section>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    BOTÃO
                ================================================= */}

                <div className="w-full mt-6">

                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="w-full bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 px-4 py-3 rounded-md font-bold transition-all shadow-md active:scale-95"
                    >

                        <i className="pi pi-arrow-left mr-2"></i>

                        Voltar

                    </button>

                </div>

            </div>


            {/* =================================================
                ANIMAÇÃO
            ================================================= */}

            <style>{`

                .animate-fade-in {
                    animation: fadeIn 0.5s ease-out;
                }

                @keyframes fadeIn {

                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }

                }

            `}</style>

        </main>
    );
}

export default DetalhesProduto;