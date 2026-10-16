class Utilitario {

    // =====================================================
    // DATA
    // =====================================================

    // Formata a data no padrão DD/MM/AAAA
    formatarData(data: string | Date | undefined): string {
        if (!data) return '';

        return new Date(data).toLocaleDateString('pt-BR', {
            timeZone: 'UTC'
        });
    }


    // Formata uma data para utilizar em <input type="date">
    formatarDataParaInput(
        data: string | Date | undefined
    ): string {

        if (!data) return '';

        const d = new Date(data);

        return d.toISOString().split('T')[0];
    }


    // =====================================================
    // PRODUTO
    // =====================================================

    // Formata o código do produto
    formatarCodigo(codigo: string): string {

        // Remove caracteres que não sejam letras ou números
        const codigoLimpo = codigo
            .replace(/[^a-zA-Z0-9]/g, '')
            .toUpperCase();

        return codigoLimpo;
    }


    // Formata preço para Real brasileiro
    formatarParaReal(valor: number): string {

        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    }


    // Converte um valor digitado para número
    converterParaNumero(valor: string): number {

        if (!valor) return 0;

        const numero = Number(
            valor.replace(',', '.')
        );

        return isNaN(numero) ? 0 : numero;
    }


    // Formata quantidade disponível
    formatarQuantidade(quantidade: number | undefined): string {

        if (quantidade === undefined) {
            return '0';
        }

        return quantidade.toString();
    }


    // Verifica se a quantidade está abaixo da quantidade mínima
    estoqueBaixo(
        quantidadeDisponivel: number | undefined,
        quantidadeMinima: number
    ): boolean {

        const quantidade = quantidadeDisponivel ?? 0;

        return quantidade <= quantidadeMinima;
    }


    // =====================================================
    // VALIDAÇÕES
    // =====================================================

    // Valida o código do produto
    validarCodigo(codigo: string): boolean {

        if (!codigo) return false;

        return codigo.trim().length >= 1;
    }


    // Valida o nome do produto
    validarNome(nome: string): boolean {

        if (!nome) return false;

        return nome.trim().length >= 3;
    }


    // Valida preço
    validarPreco(valor: number): boolean {

        return valor >= 0;
    }


    // Valida quantidade
    validarQuantidade(valor: number): boolean {

        return Number.isInteger(valor) && valor >= 0;
    }


    // Valida quantidade mínima
    validarQuantidadeMinima(valor: number): boolean {

        return Number.isInteger(valor) && valor >= 0;
    }


    // =====================================================
    // STATUS
    // =====================================================

    // Retorna o texto do status do produto
    formatarStatus(ativo: boolean | undefined): string {

        return ativo ? 'Ativo' : 'Inativo';
    }


    // =====================================================
    // CATEGORIA
    // =====================================================

    // Verifica se uma categoria foi selecionada
    validarCategoria(idCategoria: number): boolean {

        return idCategoria > 0;
    }
}

export default new Utilitario();



/*esse arquivo é um utilitário que contém métodos para formatação e validação de dados relacionados a produtos, como datas, códigos, preços, quantidades e status. Ele também inclui métodos para verificar se uma categoria foi selecionada. A classe Utilitario é exportada como uma instância única para ser utilizada em outras partes da aplicação.*/