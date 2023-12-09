// Bandages
const bandages = Vue.createApp({
    data() {
        return {
            bandages: []
        };
    },
    template: `
        <option v-for="bandage in bandages" :value="bandage.id">
            {{ bandage.forename }} {{ bandage.surname }} ({{ bandage.course }})
        </option>
    `,
    methods: {
        async getBandages() {
            const response = await fetch('/api/bandages');
            const data = await response.json();
            this.bandages = await data.rows;
        }
    },
    mounted() {
        this.getBandages();
    }
}).mount("#bandage-select");