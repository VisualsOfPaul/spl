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
            },
            timeoutID: null
        };
    },
    template: `
        <article id="timer" class="timer-outer">
            <ul class="corners">
                <li>&nbsp;</li>
                <li>&nbsp;</li>
                <li>&nbsp;</li>
                <li>&nbsp;</li>
            </ul>

            <div class="timer-inner">
                <ul class="corners">
                    <li>&nbsp;</li>
                    <li>&nbsp;</li>
                    <li>&nbsp;</li>
                    <li>&nbsp;</li>
                </ul>

                <p class="content">{{ this.formatTime(time.minutes) }}:{{ this.formatTime(time.seconds) }}</p>
            </div>
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
            this.timeoutID = setTimeout(() => {
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
                if (this.time.hours < end.hours || this.time.minutes < end.minutes || this.time.seconds < end.seconds) {
                    this.countUp(end);
                }
            }, 1000);
        },

        async countDown(start) {
            this.time = start;

            this.timeoutID = setTimeout(() => {
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
        },

        async stop() {
            // Stop timer
            clearTimeout(this.timeoutID);            

            // Reset timer
            this.time = {
                hours: 0,
                minutes: 0,
                seconds: 0
            }

            // Clear timeoutID
            this.timeoutID = null;
        }
    }
}).mount("#timer-container");


// Functions to manage the timer
function countDown(data) {
    timer.countDown(data);
}

function countUp(data) {
    timer.countUp(data);
}

function stopTimer() {
    timer.stop();
}

window.countDown = countDown;
window.countUp = countUp;
window.stopTimer = stopTimer;




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





// COUNT LETTERS
const COUNTLETTERS = Vue.createApp({
    data() {
        return {
            words: []
        };
    },
    template: `
        <ul>
            <li v-for="(content, index) in words" :id="'count-letters-' + type(index)">
                <article id="count-letters-item" class="count-letters-item-outer">
                    <ul class="corners">
                        <li>&nbsp;</li>
                        <li>&nbsp;</li>
                        <li>&nbsp;</li>
                        <li>&nbsp;</li>
                    </ul>

                    <div class="count-letters-item-inner">
                        <ul class="corners">
                            <li>&nbsp;</li>
                            <li>&nbsp;</li>
                            <li>&nbsp;</li>
                            <li>&nbsp;</li>
                        </ul>

                        <p class="content">{{ content }}</p>
                    </div>
                </article>
            </li>
        </ul>
    `,
    methods: {
        async getWords() {
            await fetch('/api/count-letters').then((RESPONSE) => {
                return RESPONSE.json();
            }).then((DATA) => {
                const MODIFIEDARRAY = [];

                for(const WORD of DATA) {
                    MODIFIEDARRAY.push(WORD.word);
                    MODIFIEDARRAY.push(WORD.letters);
                }

                return MODIFIEDARRAY;
            }).then((MODIFIEDARRAY) => {
                this.words = MODIFIEDARRAY;
            });
        },

        type(index) {
            return (index % 2 === 0 ? "word" : "solution")
        }
    },
    mounted() {
        this.getWords();
    }
}).mount("#count-letters-container");
