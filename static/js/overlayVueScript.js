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
            <header>
                <h1>Frage</h1>
                <h2>{{ question.question }}</h2>
            </header>
            <ul>
                <li class="answer" v-for="answer in question.answers">{{ answer.answer }}</li>
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

// Lego builds
const legoBuilds = Vue.createApp({
    data() {
        return {
            legoBuilds: []
        };
    },
    template: `
        <ul>
            <li v-for="(build, index) in legoBuilds" :id="'lego-build-image-' + index">
                <figure>
                    <img :src="'/assets/lego-builds/' + build">
                </figure>
            </li>
        </ul>
    `,
    methods: {
        async getLegoBuilds() {
            const response = await fetch('/api/lego-builds');
            const data = await response.json();
            this.legoBuilds = await data.images;
        }
    },
    mounted() {
        this.getLegoBuilds();
    }
}).mount("#lego-builds-container");