// Bandages
const bandagesLeft = Vue.createApp({
    data() {
        return {
            bandages: []
        };
    },
    template: `
        <div v-for="bandage in bandages" :data-value="bandage.id" id="bandage" class="bandage-outer">
            <ul class="corners">
                <li>&nbsp;</li>
                <li>&nbsp;</li>
                <li>&nbsp;</li>
                <li>&nbsp;</li>
            </ul>
            <div class="bandage-inner">
                <ul class="corners">
                    <li>&nbsp;</li>
                    <li>&nbsp;</li>
                    <li>&nbsp;</li>
                    <li>&nbsp;</li>
                </ul>

                <aside>
                    <figure class="logo-container">
                        <img src="/assets/img/logo-color.png" class="logo">
                    </figure>
                </aside>
                <aside class="content">
                    <h3>{{ bandage.forename }} {{ bandage.surname }}</h3>
                    <h4>{{ bandage.pronouns }}</h4>
                    <p>{{ bandage.info }}</p>
                </aside>
            </div>
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
}).mount("#bandages-container-left");

const bandagesRight = Vue.createApp({
    data() {
        return {
            bandages: []
        };
    },
    template: `
        <div v-for="bandage in bandages" :data-value="bandage.id" id="bandage" class="bandage-outer">
            <ul class="corners">
                <li>&nbsp;</li>
                <li>&nbsp;</li>
                <li>&nbsp;</li>
                <li>&nbsp;</li>
            </ul>
            <div class="bandage-inner">
                <ul class="corners">
                    <li>&nbsp;</li>
                    <li>&nbsp;</li>
                    <li>&nbsp;</li>
                    <li>&nbsp;</li>
                </ul>

                <aside class="content">
                    <h3>{{ bandage.forename }} {{ bandage.surname }}</h3>
                    <h4>{{ bandage.pronouns }}</h4>
                    <p>{{ bandage.info }}</p>
                </aside>
                <aside>
                <figure class="logo-container">
                    <img src="/assets/img/logo-color.png" class="logo">
                </figure>
            </aside>
            </div>
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
}).mount("#bandages-container-right");

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

// Memory
const memory = Vue.createApp({
    data() {
        return {
            tiles: {}
        };
    },
    template: `
        <ul>
            <li v-for="(tile, index) in tiles" :id="'tile-' + index">
                {{ tile.solution }}
            </li>
        </ul>
    `,
    methods: {
        async getTiles() {
            const response = await fetch('/api/memory');
            const data = await response.json();
            this.tiles = await data.tiles;
        }
    },
    mounted() {
        this.getTiles();
    }
}).mount("#memory-container");