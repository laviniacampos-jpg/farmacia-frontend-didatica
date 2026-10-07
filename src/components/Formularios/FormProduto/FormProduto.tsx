import React, { useState } from "react";
import ProdutoRequests from "../../../fetch/ProdutoRequest.ts";

interface IProduto {
  id_produto: number;
  descricao: string;
  validade?: string | null;
  preco: number;
  qtd_estoque: number;
  qtd_min_estoque: number;
}

interface FormProdutoProps {
  produtos?: IProduto[];
  onSuccess?: () => void;
}

export default function FormProduto({ produtos = [], onSuccess }: FormProdutoProps) {
  const [formData, setFormData] = useState({
    descricao: "",
    validade: "",
    preco: 0,
    qtd_estoque: 0,
    qtd_min_estoque: 0,
  });
  const [erroTela, setErroTela] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    let val: string | number | boolean = value;

    if (type === "checkbox") {
      val = (e.target as HTMLInputElement).checked;
    } else if (type === "number") {
      val = value === "" ? 0 : Number(value);
    } else if (name === "id_categoria") {
      val = Number(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Formulário enviado:", formData);
    setErroTela(null);

    if (!formData.descricao.trim()) {
      const erroValidacao = "Por favor, informe a descrição do produto.";
      console.error("Erro de validação:", erroValidacao, formData);
      setErroTela(`Erro ao cadastrar: ${erroValidacao}`);
      return;
    }

    const payload = {
      descricao: formData.descricao.trim(),
      validade: formData.validade || null,
      preco: Number(formData.preco),
      qtd_estoque: Number(formData.qtd_estoque),
      qtd_min_estoque: Number(formData.qtd_min_estoque),
    };

    try {
      console.log("Payload enviado:", payload);
      const resposta = await ProdutoRequests.criar(payload);
      console.log("Resposta do servidor:", resposta);

      if (!resposta) {
        throw new Error(
          "O servidor recusou o cadastro. Verifique se o Código do produto já existe no banco!"
        );
      }

      alert("Produto cadastrado com sucesso!");
      setFormData({
        descricao: "",
        validade: "",
        preco: 0,
        qtd_estoque: 0,
        qtd_min_estoque: 0,
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Erro ao cadastrar produto:", error);
      const erroApi = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      setErroTela(
        "Erro ao cadastrar: " +
        (erroApi.response?.data?.message || erroApi.message || "Erro desconhecido")
      );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSubmit} className="form-container mb-8">
        <h2>Cadastro de Produtos</h2>

        <div>
          <label>Descrição:</label>
          <textarea
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Validade:</label>
          <input
            type="date"
            name="validade"
            value={formData.validade}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Preço:</label>
          <input
            type="number"
            step="0.01"
            min="0"
            name="preco"
            value={formData.preco}
            onChange={(e) =>
              setFormData({
                ...formData,
                preco: e.target.value === "" ? 0 : parseFloat(e.target.value),
              })
            }
            required
          />
        </div>

        <div>
          <label>Quantidade em estoque:</label>
          <input
            type="number"
            min="0"
            name="qtd_estoque"
            value={formData.qtd_estoque}
            onChange={(e) =>
              setFormData({
                ...formData,
                qtd_estoque: e.target.value === "" ? 0 : parseInt(e.target.value, 10),
              })
            }
            required
          />
        </div>

        <div>
          <label>Quantidade mínima em estoque:</label>
          <input
            type="number"
            min="0"
            name="qtd_min_estoque"
            value={formData.qtd_min_estoque}
            onChange={(e) =>
              setFormData({
                ...formData,
                qtd_min_estoque: e.target.value === "" ? 0 : parseInt(e.target.value, 10),
              })
            }
            required
          />
        </div>

        {erroTela && (
          <div
            style={{
              color: "red",
              backgroundColor: "#fee2e2",
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "10px",
            }}
          >
            {erroTela}
          </div>
        )}

        <button
          type="submit"
          className="button-class"
        >
          Cadastrar Produto
        </button>
      </form>

      {/* Exibição da Lista */}
      <section className="produtos-cadastrados">
        <h3>Produtos Cadastrados ({produtos.length})</h3>
        {produtos.length === 0 ? (
          <p>Nenhum produto cadastrado.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {produtos.map((item, index) => (
              <div key={item.id_produto || index} className="border p-4 rounded shadow">
                <h4>{item.descricao}</h4>
                <p>Validade: {item.validade || "Não informada"}</p>
                <p><strong>R$ {Number(item.preco || 0).toFixed(2)}</strong></p>
                <span>Estoque: {item.qtd_estoque ?? 0}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}