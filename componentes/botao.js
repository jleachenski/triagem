export default {
    props: ['texto'],
    template: `
        <button class="text-3xl min-w-fit w-1/4 font-bold border-4 text-white py-2.5 px-6 rounded shadow cursor-pointer transition duration-300" type="button">
            {{ texto }}
        </button>
    `
}