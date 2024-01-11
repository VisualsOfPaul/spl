// BANDAGES
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

// QUIZ
const quiz = Vue.createApp({
    data() {
        return {
            quiz: []
        };
    },
    template: `
        <article v-for="(question, index) in quiz" class="question-outer" :id="'question-' + index">
            <ul class="corners">
                <li>&nbsp;</li>
                <li>&nbsp;</li>
                <li>&nbsp;</li>
                <li>&nbsp;</li>
            </ul>
            <div class="question-inner">
                <ul class="corners">
                    <li>&nbsp;</li>
                    <li>&nbsp;</li>
                    <li>&nbsp;</li>
                    <li>&nbsp;</li>
                </ul>

                <div class="content">
                    <header>
                        <h1>Frage {{ index + 1 }}</h1>
                        <h2>{{ question.question }}</h2>
                    </header>
                    <ul>
                        <li class="answer" id="answer" v-for="answer in question.answers">
                            <p id="content" class="content">
                                {{ answer.answer }}
                            </p>
                        </li>
                    </ul>
                </div>
            </div>
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


// Timer
const timer = Vue.createApp({
    data() {
        return {
            time: {
                hours: 0,
                minutes: 0,
                seconds: 0
            }
        };
    },
    template: `
        <article style="display: none">
            <p>{{ this.formatTime(time.hours) }}:{{ this.formatTime(time.minutes) }}:{{ this.formatTime(time.seconds) }}</p>
        </article>
    `,
    methods: {
        formatTime(number) {
            return number.toLocaleString('de-DE', {
                minimumIntegerDigits: 2,
                useGrouping: false
              });
        },

        async countUp(end) {
            setTimeout(() => {
                if (this.time.seconds < 59) {
                    this.time.seconds++;
                } else {
                    this.time.seconds = 0;
                    if (this.time.minutes < 59) {
                        this.time.minutes++;
                    } else {
                        this.time.minutes = 0;
                        this.time.hours++;
                    }
                }
                if (this.time.hours < max.hours || this.time.minutes < max.minutes || this.time.seconds < max.seconds) {
                    this.countUp(end);
                }
            }, 1000);
        },

        async countDown(start) {
            this.time = start;

            setTimeout(() => {
                if (this.time.seconds > 0) {
                    this.time.seconds--;
                } else {
                    this.time.seconds = 59;
                    if (this.time.minutes > 0) {
                        this.time.minutes--;
                    } else {
                        this.time.minutes = 59;
                        this.time.hours--;
                    }
                }
                if (this.time.hours > 0 || this.time.minutes > 0 || this.time.seconds > 0) {
                    this.countDown(this.time);
                }
            }, 1000);
        }
    }
}).mount("#timer-container");

// Where is this?
const whereIsThis = Vue.createApp({
    data() {
        return {
            images: []
        };
    },
    template: `
        <ul>
            <li v-for="(image, index) in images" :id="'where-is-this-image-' + index">
                <figure>
                    <img :src="'/assets/where-is-this/' + image">
                </figure>
            </li>
        </ul>
    `,
    methods: {
        async getImages() {
            const response = await fetch('/api/where-is-this');
            const data = await response.json();
            this.images = await data.images;
        }
    },
    mounted() {
        this.getImages();
    }
}).mount("#where-is-this-container");
