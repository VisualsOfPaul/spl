// Bandages
const bandages = Vue.createApp({
    data() {
        return {
            bandages: []
        };
    },
    template: `
        <div v-for="bandage in bandages" :data-value="bandage.id">
            <h3>{{ bandage.forename }} {{ bandage.surname }} ({{ bandage.course }})</h3>
            <h4>{{ bandage.pronouns }}</h4>
            <p>{{ bandage.info }}</p>
        </div>
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
}).mount("#bandages-container");