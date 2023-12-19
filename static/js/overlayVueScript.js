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


// Quiz
const quiz = Vue.createApp({
    data() {
        return {
            quiz: []
        };
    },
    template: `
        <article v-for="question in quiz">
            <h1>{{ question.question }}</h1>
            <ul>
                <li v-for="answer in question.answers">{{ answer.answer }}</li>
            </ul>
        </article>
    `,
    methods: {
        async getQuiz() {
            const response = await fetch('/api/quiz');
            const data = await response.json();
            this.quiz = await data;
        },
    },
    mounted() {
        this.getQuiz();
    }
}).mount("#quiz-container");