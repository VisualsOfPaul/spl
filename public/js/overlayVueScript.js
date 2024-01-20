// BANDAGES
const bandagesLeft = Vue.createApp({
	data() {
		return {
			bandages: [],
		};
	},
	template: `
        <div v-for="bandage in bandages" id="bandage" class="bandage-outer">
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
                    <h3>{{ bandage.name }} {{ bandage.surname }}</h3>
                    <h4>{{ bandage.pronouns }}</h4>
                    <p>{{ bandage.info }}</p>
                </aside>
            </div>
        </div>
    `,
	methods: {
		async getBandages() {
			const RESPONSE = await fetch("/api/bandages");
			this.bandages = await RESPONSE.json();
		},
	},
	mounted() {
		this.getBandages();
	},
}).mount("#bandages-container-left");

const bandagesRight = Vue.createApp({
	data() {
		return {
			bandages: [],
		};
	},
	template: `
        <div v-for="bandage in bandages" id="bandage" class="bandage-outer">
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
                    <h3>{{ bandage.name }} {{ bandage.surname }}</h3>
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
			const RESPONSE = await fetch("/api/bandages");
			this.bandages = await RESPONSE.json();
		},
	},
	mounted() {
		this.getBandages();
	},
}).mount("#bandages-container-right");

// QUIZ
const quiz = Vue.createApp({
	data() {
		return {
			quiz: [],
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
			const response = await fetch("/api/quiz");
			this.quiz = await response.json();
		},
	},
	mounted() {
		this.getQuiz();
	},
}).mount("#quiz-container");

// LEGO
const legoBuilds = Vue.createApp({
	data() {
		return {
			legoBuilds: [],
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
			const response = await fetch("/api/lego-builds");
			this.legoBuilds = await response.json();
		},
	},
	mounted() {
		this.getLegoBuilds();
	},
}).mount("#lego-builds-container");

// MEMORY
const MEMORY = Vue.createApp({
	data() {
		return {
			tiles: {},
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
			const response = await fetch("/api/memory");
			this.tiles = await (await response.json()).tiles;
		},
	},
	mounted() {
		this.getTiles();
	},
}).mount("#memory-container");

// TIMER
const timer = Vue.createApp({
	data() {
		return {
			time: {
				minutes: "00",
				seconds: "00",
			},
			action: "count-up",
			timeoutID: null,
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
			return number.toLocaleString("de-DE", {
				minimumIntegerDigits: 2,
				useGrouping: false,
			});
		},

		showTime(data) {
			this.action = data.action;

			switch (this.action) {
				case "count-down":
					this.time = {
						minutes: this.formatTime(Number(data.time.minutes)),
						seconds: this.formatTime(Number(data.time.seconds)),
					};
					break;
				case "count-up":
					this.time = {
						minutes: "00",
						seconds: "00",
					};
					break;
			}
		},

		start(data) {
			switch (this.action) {
				case "count-down":
					this.countDown(data);
					break;
				case "count-up":
					this.countUp(data);
					break;
			}
		},

		countDown(data) {
			this.timeoutID = setTimeout(() => {
				if (this.formatTime(Number(this.time.seconds)) === this.formatTime(0)) {
					if (
						this.formatTime(Number(this.time.minutes)) === this.formatTime(0)
					) {
						this.time = {
							minutes: this.formatTime(Number(data.time.minutes)),
							seconds: this.formatTime(Number(data.time.seconds)),
						};
						clearTimeout(this.timeoutID);
						return;
					} else {
						this.time.minutes = this.formatTime(Number(this.time.minutes) - 1);
						this.time.seconds = 59;
					}
				} else {
					this.time.seconds = this.formatTime(Number(this.time.seconds) - 1);
				}

				this.countDown(data);
			}, 1000);
		},

		countUp(data) {
			this.timeoutID = setTimeout(() => {
				if (
					this.formatTime(Number(this.time.minutes)) ===
						this.formatTime(Number(data.time.minutes)) &&
					this.formatTime(Number(this.time.seconds)) ===
						this.formatTime(Number(data.time.seconds))
				) {
					this.time = {
						minutes: "00",
						seconds: "00",
					};
					clearTimeout(this.timeoutID);
					return;
				}

				if (this.time.seconds === 59) {
					this.time.minutes = this.formatTime(Number(this.time.minutes) + 1);
					this.time.seconds = this.formatTime(0);
				} else {
					this.time.seconds = this.formatTime(Number(this.time.seconds) + 1);
				}

				this.countUp(data);
			}, 1000);
		},

		stop() {
			clearTimeout(this.timeoutID);
		},
	},
}).mount("#timer-container");

function showTime(data) {
	timer.showTime(data);
}

window.showTime = showTime;

function startTimer(data) {
	timer.start(data);
}

window.startTimer = startTimer;

function stopTimer() {
	timer.stop();
}

window.stopTimer = stopTimer;

// WIT
const WHEREISTHIS = Vue.createApp({
	data() {
		return {
			images: [],
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
			const response = await fetch("/api/where-is-this");
			this.images = await response.json();
		},
	},
	mounted() {
		this.getImages();
	},
}).mount("#where-is-this-container");

// COUNT LETTERS
const COUNTLETTERS = Vue.createApp({
	data() {
		return {
			words: [],
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
			await fetch("/api/count-letters")
				.then((RESPONSE) => {
					return RESPONSE.json();
				})
				.then((DATA) => {
					const MODIFIEDARRAY = [];

					for (const WORD of DATA) {
						MODIFIEDARRAY.push(WORD.word);
						MODIFIEDARRAY.push(WORD.letters);
					}

					return MODIFIEDARRAY;
				})
				.then((MODIFIEDARRAY) => {
					this.words = MODIFIEDARRAY;
				});
		},

		type(index) {
			return index % 2 === 0 ? "word" : "solution";
		},
	},
	mounted() {
		this.getWords();
	},
}).mount("#count-letters-container");
