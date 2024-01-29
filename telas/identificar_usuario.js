import pergunta from '../componentes/pergunta.js'
import botao from '../componentes/botao.js'
import pesquisa from '../componentes/pesquisa.js'

export default {
    props: ['senhaApp'],
    components: {
        pergunta,
        botao,
        pesquisa
    },
    data() {
        return {
            senha: this.senhaApp
        }
    },
    watch: {
        senha(novo) {
            this.$emit('attSenha', novo)
        }  
    },
    methods: {
        abrirTecladoVirtual() {

        },
        conferirUsuario() {
            $.ajax({
                type: 'POST',
                url: '../servicos.php?s=buscarUsuario',
                dataType: 'json',
                data: {
                    senha: this.senha
                },
                success: (res) => {
                    if(res !== null) {
                        this.$emit('attUsuario', res)
                        this.$emit('avancar', 2)
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Confira sua digitação!',
                            text: 'Não foi encontrado nenhum paciente para triagem com essa senha.',
                            showConfirmButton: false,
                            timer: 3000
                        })
                    }

                    // descomentar quando arrumar o BUG de FASE
                    // if(res.FASE == 2) {
                    //     this.$emit('attUsuario', res)
                    //     this.$emit('avancar', 2)
                    // } else {
                    //     if(res == null) {
                    //         Swal.fire({
                    //             icon: 'error',
                    //             title: 'Confira sua digitação!',
                    //             text: 'Não foi encontrado nenhum paciente para triagem com essa senha.',
                    //             showConfirmButton: false,
                    //             timer: 3000
                    //         })
                    //     } else if(res.FASE == 3) {
                    //         Swal.fire({
                    //             icon: 'error',
                    //             title: 'Senha já triada!',
                    //             showConfirmButton: false,
                    //             timer: 3000
                    //         })
                    //     }
                    // }
                    
                }
            })
        },
        attSenha(novo) {
            this.senha = novo.replace(/\D/g, "")
        }
    },
    template: `
        <div class="z-10 w-full h-full flex flex-col items-center justify-evenly">
            <pergunta titulo="QUAL A SUA SENHA? IDENTIFIQUE-SE" />
            <div class="flex items-center w-3/4 md:w-1/2 border-b-4 border-emerald-700 py-2">
                <pesquisa maxlength="3" @click="abrirTecladoVirtual" @attValor="attSenha" aviso="SUA SENHA..." :valorPai="senha" />
                <botao :disabled="senha == '' ? true : false" :class="senha == '' ? 'bg-gray-300 border-gray-300' : 'bg-emerald-800 border-emerald-800'" texto="PRÓXIMO" @click="conferirUsuario" />
            </div>
        </div>
    `
}