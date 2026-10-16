/**
 * Classe para lidar com autenticação
 */
class AuthRequests {

    private serverUrl: string;
    private endpointLogin: string;
    
    /**
     * Construtor das rotas e do endereço do servidor
     */
    constructor() {
        // endereço do servidor
        this.serverUrl = 'http://localhost:3333';
        // rota do servidor
        this.endpointLogin = '/api/login';
    }

    /**
     * Realiza a autenticação no servidor
     * @param {*} login - email e senha
     * @returns **true** caso sucesso, **false** caso erro
     */
    async login(login: { email: string, senha: string}) {       
        try {
            const response = await fetch(`${this.serverUrl}${this.endpointLogin}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(login)
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                console.log('Erro na autenticação', data);
                return false;
            }

            if (data?.auth) {
                this.persistToken(data.token, data.usuario, data.auth);
                return true;
            }

            return false;
        } catch (error) {
            console.error('Erro: ', error);
            return false;
        }
    }

    /**
     * Persiste o token no localStorage
     * @param {*} token - token recebido do servidor
     * @param {*} usuario - objeto com informações do usuário vindos do servidor
     * @param {*} isAuth - estado da autenticação do usuário
     */
    persistToken(token: string, usuario: {id_usuario: number, nome: string, email: string, role: string}, isAuth: boolean) {
        localStorage.setItem('token', token);
        localStorage.setItem('nome', usuario.nome);
        localStorage.setItem('idUsuario', usuario.id_usuario.toString());
        localStorage.setItem('email', usuario.email);
        localStorage.setItem('role', usuario.role);
        localStorage.setItem('isAuth', isAuth.toString());
    }

    /**
     * Remove as informações do localStorage
     */
    removeToken() {
        const keys = [
            'token',
            'nome',
            'idUsuario',
            'email',
            'role',
            'isAuth'
        ];

        keys.forEach(key => localStorage.removeItem(key));
        window.location.href = "/login";
    }

    /**
     * Verifica a validade do token sem executar redirecionamento durante a leitura.
     * @returns **true** caso token válido, **false** caso token inválido ou inválido
     */
    checkTokenExpiry(): boolean {
        const token = localStorage.getItem('token');

        if (!token) {
            return false;
        }

        try {
            const payloadBase64 = token.split('.')[1];

            if (!payloadBase64) {
                return false;
            }

            const payload = JSON.parse(
                decodeURIComponent(
                    escape(atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/")))
                )
            ) as { exp?: number };

            return typeof payload.exp === "number" && payload.exp > Math.floor(Date.now() / 1000);
        } catch {
            return false;
        }
    }

    isAuthenticated(): boolean {
        return localStorage.getItem("isAuth") === "true" && this.checkTokenExpiry();
    }
}

export default new AuthRequests();