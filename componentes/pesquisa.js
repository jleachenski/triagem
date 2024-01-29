export default {
    props: ['aviso', 'valorPai'],
    data() {
        return {
            valor: this.valorPai
        }
    },
    watch: {
        valor(novo) {
            this.$emit('attValor', novo)
            this.valor = this.valorPai
        }
    },
    template: `
        <input v-model="valor" class="appearance-none bg-transparent text-3xl border-none w-full text-emerald-700 font-black mr-3 py-1 px-2 placeholder-gray-400 focus:outline-none" type="text" :placeholder="aviso">
    `
}