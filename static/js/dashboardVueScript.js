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
                    <option :value="null" disabled>Antwort auswählen...</option>
                    <option v-for="(answer, index) in question.answers" :value="index">{{ answer.answer }}</option>
                </select>
                <button @click="sendAnswer(index)">Antwort festlegen</button>
                <button @click="showAnswer(index)" id="show answer">Antwort auflösen</button>
            </li>
        </ol>
    `,
    methods: {
        async getQuiz() {
            const response = await fetch('/api/quiz');
            const data = await response.json();
            this.quiz = await data;

            this.selectedAnswers = Array(this.quiz.length).fill(null);
        },

        async showQuestion(index) {
            showQuestion(index)
        },

        async sendAnswer(index) {
            sendAnswer(index, this.selectedAnswers[index]);
        },

        async showAnswer(index) {
            showAnswer(index, this.selectedAnswers[index]);
        }
    },
    mounted() {
        this.getQuiz();
    }
}).mount("#quiz");

// Lego builds
const legoBuilds = Vue.createApp({
    data() {
        return {
            images: []
        };
    },
    template: `
        <ul>
            <li v-for="(image, index) in images">
                <img :src="'/assets/lego-builds/' + image">
                <button @click="toggleImage(index)" :id="'toggle-lego-build-' + index">Bild anzeigen</button>
            </li>
        </ul>
    `,
    methods: {
        async getBuilds() {
            const response = await fetch('/api/lego-builds');
            const data = await response.json();
            this.images = await data.images;
        },

        async toggleImage(index) {
            toggleLegoBuild(index);
        }
    },
    mounted() {
        this.getBuilds();
    }
}).mount("#lego-builds-container");