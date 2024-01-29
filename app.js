import inicio from './telas/inicio.js'
import identificarUsuario from './telas/identificar_usuario.js'
import confirmarUsuario from './telas/confirmar_usuario.js'
import motivo from './telas/motivo.js'
import aguarde from './telas/aguarde.js'
import sintomas from './telas/sintomas.js'

Vue.createApp({
    components: {
        inicio,
        identificarUsuario,
        confirmarUsuario,
        motivo,
        aguarde,
        sintomas
    },
    data() {
        return {
            etapasPercorridas: [0],
            senha: '',
            prioridade: [0],
            usuario: undefined,
            sintomas: [],
            tempoReset: 120000
        }
    },
    computed: {
        etapaAtual() {
            return this.etapasPercorridas[this.etapasPercorridas.length - 1]
        }
    },
    methods: {
        avancar(proxima) {
            this.etapasPercorridas.push(proxima)
        },
        voltar() {
            this.etapasPercorridas.pop()
            this.sintomas = []
            this.prioridade = []
        },
        finalizar() {
            $.ajax({
                type: 'POST',
                url: './servicos.php?s=finalizarTriagem',
                dataType: 'json',
                data: {
                    prioridade: Math.max(...this.prioridade),
                    sintomas: this.sintomas.join(', '),
                    usuario: this.usuario
                },
                success: (res) => {
                    console.log(res)
                },
                error: (res) => {
                    console.log(res)
                }
            })
        },
        emergencia() {
            this.prioridade = [100]
            this.sintomas = ['EMERGÊNCIA']
            this.finalizar()
        },
        resetarTotemCasoNaoUso() {
            setTimeout(() => {
                this.resetar()
                this.resetarTotemCasoNaoUso()
            }, this.tempoReset)
        },
        resetar() {
            this.etapasPercorridas = [0]
            this.senha = ''
            this.prioridade = [0]
            this.sintomas = []
            this.usuario = undefined
        },
        attSintomas(novo, prioridade) {
            let index = this.sintomas.indexOf(novo)
            if(index == -1) {
                this.sintomas.push(novo)
                this.prioridade.push(prioridade)
            } else {
                this.sintomas.splice(index, 1)
                this.prioridade.splice(index+1, 1)
            }
        },
        attSenha(novo) {
            this.senha = novo
        },
        attUsuario(novo) {
            this.usuario = novo
        },
    },
    created() {
        this.resetarTotemCasoNaoUso()
        window.addEventListener('keydown', () => this.tempoReset = 120000)
    },  
    template: `
        <div class="select-none h-screen w-screen bg-zinc-50 flex items-center justify-center">
            <transition mode="out-in" name="slide-up">
                <inicio v-if="etapaAtual == 0" @avancar="avancar"/>
                <identificar-usuario v-else-if="etapaAtual == 1" :senhaApp="senha" @attUsuario="attUsuario" @attSenha="attSenha" @avancar="avancar"/>
                <confirmar-usuario v-else-if="etapaAtual == 2" :senhaApp="senha" :usuarioApp="usuario" @avancar="avancar" @voltar="voltar" @emergencia="emergencia"/>
                <motivo v-else-if="etapaAtual == 3" @avancar="avancar" @finalizar="finalizar" @attSintomas="attSintomas"/>
                <sintomas :etapaAtual="etapaAtual" :sintomasEscolhidos="sintomas" v-else-if="etapaAtual == 4" @avancar="avancar" @attSintomas="attSintomas" @finalizar="finalizar"/>
                <sintomas :etapaAtual="etapaAtual" :sintomasEscolhidos="sintomas" v-else-if="etapaAtual == 5" @avancar="avancar" @attSintomas="attSintomas" @finalizar="finalizar"/>
                <aguarde v-else-if="etapaAtual == 6" @avancar="avancar" @resetar="resetar"/>
            </transition>
            <transition name="fade">
                <svg @click="voltar" v-if="etapaAtual != 0 && etapaAtual != 6" class="w-16 z-20 fill-emerald-800 fixed top-6 left-6 cursor-pointer" viewBox="0 -960 960 960" width="48"><path d="M280-200v-60h289q70 0 120.5-46.5T740-422q0-69-50.5-115.5T569-584H274l114 114-42 42-186-186 186-186 42 42-114 114h294q95 0 163.5 64T800-422q0 94-68.5 158T568-200H280Z"/></svg>
            </transition>
            <img class="w-24 z-0 fixed bottom-4 left-4" src="./recursos/imagens/logo.png">
        </div>
    `
}).mount('#triagem')
