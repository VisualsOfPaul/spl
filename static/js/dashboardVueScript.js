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


// Quiz
const quiz = Vue.createApp({
    data() {
        return {
            quiz: [],
            selectedAnswers: []
        };
    },
    template: `
        <ol>
            <li v-for="(question, index) in quiz" :id="'question-' + Number(index + 1)">
                <p>{{ question.question }}</p>
                <button @click="showQuestion(index)">Frage anzeigen</button>
                <select v-model="selectedAnswers[index]">
                    <option disabled selected>Antwort festlegen...</option>
                    <option v-for="answer in question.answers" :value="index">{{ answer.answer }}</option>
                </select>
                <button @click="sendAnswer(index)">Antwort abschicken</button>
            </li>
        </ol>
    `,
    methods: {
        async getQuiz() {
            const response = await fetch('/api/quiz');
            const data = await response.json();
            this.quiz = await data;
        },

        async showQuestion(index) {
            showQuestion(index)
        },

        async sendAnswer(index) {
            sendAnswer(index, this.selectedAnswers[index]);
        }
    },
    mounted() {
        this.getQuiz();
    }
}).mount("#quiz");