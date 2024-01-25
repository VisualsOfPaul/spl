// OUTRO
const OUTRO = Vue.createApp({
	data() {
		return {
			departments: [],
		};
	},
	template: `
		<article id="outro-box" class="outro-box">
			<!-- Logo -->
			<figure class="logo-container">
				<img src="/assets/img/logo-color.png" class="logo">
			</figure>

			<!-- Departments -->
			<ul class="departments">
				<li v-for="department in departments" class="department-item">
					<aside>
						<h1>{{ department.role }}</h1>
					</aside>
					<aside>
						<ul>
							<li v-for="person in department.people">
								<p>{{ person }}</p>
							</li>
						</ul>
					</aside>
				</li>
			</ul>
		</article>
	`,
	methods: {
		async getOutro() {
			const RESPONSE = await fetch("/api/outro");
			const DATA = await RESPONSE.json();
			this.departments = await DATA.member;
		},
	},
	mounted() {
		this.getOutro();
	},
}).mount("#outro-container");

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
                    <h3>{{ bandage.name }}</h3>
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
                    <h3>{{ bandage.name }}</h3>
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

// HALLI GALLI
const HALLIGALLI = Vue.createApp({
	data() {
		return {
			cards: [],
		};
	},
	template: `
		<div class="halli-galli-card" id="halli-galli-card">
			<div v-for="(image, index) of cards" :class="'halli-galli-outer side-' + index" :id="'halli-galli-card-side-' + index">
				<ul class="corners">
					<li>&nbsp;</li>
					<li>&nbsp;</li>
					<li>&nbsp;</li>
					<li>&nbsp;</li>
				</ul>

				<div class="halli-galli-inner">
					<ul class="corners">
						<li>&nbsp;</li>
						<li>&nbsp;</li>
						<li>&nbsp;</li>
						<li>&nbsp;</li>
					</ul>

					<div class="content">
						<figure class="image">
							<img :src="'/assets/halli-galli/' + image.file">
						</figure>
					</div>
				</div>
			</div>
		</div>
	`,
	methods: {
		async getCards() {
			const response = await fetch("/api/halli-galli");
			const data = await response.json();
			this.cards = data;
		},
	},
	mounted() {
		this.getCards();
	},
}).mount("#halli-galli-container");

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
                        <h1>// Frage {{ index + 1 }}</h1>
                        <h2 v-html="this.formatQuestion(question.question)"></h2>
                    </header>
                    <p>> <span id="answer" :class="'answer hidden ' + question.answer">{{ question.answer }}</span></p>
                </div>
            </div>
        </article>
    `,
	methods: {
		async getQuiz() {
			const response = await fetch("/api/quiz");
			this.quiz = await response.json();
		},

		formatQuestion(question) {
			const LINES = question.split("\n");
			const FORMATTEDLINES = LINES.map((line) => `// ${line}`);
			return FORMATTEDLINES.join("<br>");
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
            <li v-for="(build, index) in legoBuilds" :id="'lego-build-image-' + index" class="lego-outer">
				<ul class="corners">
					<li>&nbsp;</li>
					<li>&nbsp;</li>
					<li>&nbsp;</li>
					<li>&nbsp;</li>
				</ul>

				<div class="lego-inner">
					<ul class="corners">
						<li>&nbsp;</li>
						<li>&nbsp;</li>
						<li>&nbsp;</li>
						<li>&nbsp;</li>
					</ul>

					<figure class="image">
						<img :src="'/assets/lego-builds/' + build">
					</figure>
				</div>
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
            <li v-for="(image, index) in images" :id="'where-is-this-image-' + index" class="where-is-this-outer">
				<ul class="corners">
					<li>&nbsp;</li>
					<li>&nbsp;</li>
					<li>&nbsp;</li>
					<li>&nbsp;</li>
				</ul>

				<div class="where-is-this-inner">
					<ul class="corners">
						<li>&nbsp;</li>
						<li>&nbsp;</li>
						<li>&nbsp;</li>
						<li>&nbsp;</li>
					</ul>

					<figure class="image">
						<img :src="'/assets/where-is-this/' + image.file">
						<figcaption>
							<div id="scale" class="scale"></div>
						</figcaption>
						<div class="correct-answer" id="correct-answer">
							<p class="correct-answer-content">{{ image.correctAnswer }}</p>
						</div>
					</figure>
				</div>
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

// REMEMBER IMAGE
const REMEMBERIMAGE = Vue.createApp({
	data() {
		return {
			images: [],
		};
	},
	template: `
		<ul>
			<li v-for="(image, index) in images" :id="'remember-image-' + index">
				<div class="card">
					<div class="remember-image-outer front">
						<ul class="corners">
							<li>&nbsp;</li>
							<li>&nbsp;</li>
							<li>&nbsp;</li>
							<li>&nbsp;</li>
						</ul>

						<div class="remember-image-inner">
							<ul class="corners">
								<li>&nbsp;</li>
								<li>&nbsp;</li>
								<li>&nbsp;</li>
								<li>&nbsp;</li>
							</ul>

							<div class="content">
								<figure class="image">
									<img :src="'/assets/remember-image/' + image.file">
								</figure>
							</div>
						</div>
					</div>
					<div class="remember-image-outer back">
						<ul class="corners">
							<li>&nbsp;</li>
							<li>&nbsp;</li>
							<li>&nbsp;</li>
							<li>&nbsp;</li>
						</ul>

						<div class="remember-image-inner">
							<ul class="corners">
								<li>&nbsp;</li>
								<li>&nbsp;</li>
								<li>&nbsp;</li>
								<li>&nbsp;</li>
							</ul>

							<div class="content">
								<p id="question-1" class="question-1">{{ image.question }}</p>
								<p id="question-2" class="question-2 hidden">{{ (image.question2 == null) ? "" : image.question2 }}</p>
							</div>
						</div>
					</div>
				</div>
			</li>
		</ul>
	`,
	methods: {
		async getImages() {
			const response = await fetch("/api/remember-image");
			this.images = await response.json();
		},
	},
	mounted() {
		this.getImages();
	},
}).mount("#remember-image-container");

// IMITATE
const IMITATE = Vue.createApp({
	data() {
		return {
			imitates: [],
		};
	},
	template: `
		<ul>
			<li v-for="(imitate, index) in imitates" :id="'imitate-' + index">
				<div class="card">
					<div class="imitate-outer">
						<ul class="corners">
							<li>&nbsp;</li>
							<li>&nbsp;</li>
							<li>&nbsp;</li>
							<li>&nbsp;</li>
						</ul>

						<div class="imitate-inner">
							<ul class="corners">
								<li>&nbsp;</li>
								<li>&nbsp;</li>
								<li>&nbsp;</li>
								<li>&nbsp;</li>
							</ul>

							<div class="content">
								<p>{{ imitate.description }}</p>
							</div>
						</div>
					</div>
				</div>
			</li>
		</ul>
	`,
	methods: {
		async getImitates() {
			const response = await fetch("/api/imitate");
			this.imitates = await response.json();
		},
	},
	mounted() {
		this.getImitates();
	},
}).mount("#imitate-container");

// POINTS (TOTAL)
const POINTSTOTAL = Vue.createApp({
	data() {
		return {
			teams: [],
		};
	},
	template: `
		<ul class="corners">
			<li>&nbsp;</li>
			<li>&nbsp;</li>
			<li>&nbsp;</li>
			<li>&nbsp;</li>
		</ul>
		<div class="points-total-outer">
			<ul class="corners">
				<li>&nbsp;</li>
				<li>&nbsp;</li>
				<li>&nbsp;</li>
				<li>&nbsp;</li>
			</ul>

			<div class="points-total-inner">
				<ul class="corners">
					<li>&nbsp;</li>
					<li>&nbsp;</li>
					<li>&nbsp;</li>
					<li>&nbsp;</li>
				</ul>

				<div id="pixels"></div>

				<div class="content">
					<div>
						<h1>Punkte</h1>
						<h2>Aktueller Punktestand</h2>
					</div>

					<div>
						<template v-for="team of teams">
							<div class="points-total-team-outer">
								<ul class="corners">
									<li>&nbsp;</li>
									<li>&nbsp;</li>
									<li>&nbsp;</li>
									<li>&nbsp;</li>
								</ul>

								<div class="points-total-team-inner">
									<ul class="corners">
										<li>&nbsp;</li>
										<li>&nbsp;</li>
										<li>&nbsp;</li>
										<li>&nbsp;</li>
									</ul>

									<div class="content">
										<h2>{{ team.name }}</h2>
										<p>{{ team.points }}</p>
									</div>
								</div>
							</div>
						</template>
					</div>
				</div>
			</div>
		</div>
	`,
	methods: {
		async getTeams() {
			const RESPONSE = await fetch("/api/teams");
			const DATA = await RESPONSE.json();

			this.teams = DATA.sort((a, b) => {
				return b.points - a.points;
			});
		},

		async updateTeams(data) {
			this.teams = data.teams.sort((a, b) => {
				return b.points - a.points;
			});
		},
	},
	mounted() {
		this.getTeams();
	},
}).mount("#points-total-container");

window.updatePointsTotal = POINTSTOTAL.updateTeams;

// POLL

const POLL = Vue.createApp({
	data() {
		return {
			poll: [],
		};
	},
	template: `
		<article id="twitch-poll" class="twitch-poll-outer">
			<ul class="corners">
				<li>&nbsp;</li>
				<li>&nbsp;</li>
				<li>&nbsp;</li>
				<li>&nbsp;</li>
			</ul>

			<div class="twitch-poll-inner">
				<ul class="corners">
					<li>&nbsp;</li>
					<li>&nbsp;</li>
					<li>&nbsp;</li>
					<li>&nbsp;</li>
				</ul>

				<div class="content">
					<h1>{{this.poll.pollQuestion}}</h1>
					<div v-for="(player, index) in this.poll.pollPlayers" :key="index" :class="this.poll.winner == index ? 'winner' : ''">
						<h2>({{ index + 1 }}) {{ player.answer }} <span>({{ player.votes }}%)</span></h2>
						<div>
							<div class="scale">
								<div class="progress" :style="'width: ' + player.votes + '%;'"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</article>
    `,
	methods: {
		async getPoll() {
			const response = await fetch("/api/poll");
			this.poll = await response.json();
		},
		async updateVotes(poll) {
			this.poll.pollPlayers[0].votes = Math.round(
				(Number(poll.ones) / Number(poll.total)) * 100
			);
			this.poll.pollPlayers[1].votes = Math.round(
				(Number(poll.twos) / Number(poll.total)) * 100
			);
		},
		async updatePlayers(players) {
			this.poll.pollPlayers[0].answer = players.pollPlayers[0].answer;
			this.poll.pollPlayers[1].answer = players.pollPlayers[1].answer;
		},
		async showPollWinner(data) {
			this.poll.winner = await data;
		},
		async clearPoll(data) {
			this.poll = data;
			this.poll.winner = null;
		},
	},
	mounted() {
		this.getPoll();
	},
}).mount("#poll-container");

window.updateVotes = POLL.updateVotes;
window.updatePlayers = POLL.updatePlayers;
window.showPollWinner = POLL.showPollWinner;
window.clearPoll = POLL.clearPoll;

// WINNER
const WINNER = Vue.createApp({
	data() {
		return {
			teams: [],
		};
	},
	template: `
		<ul>
			<li v-for="(team, index) in teams" :id="'winner-item-' + index" class="winner-outer">
				<ul class="corners">
					<li>&nbsp;</li>
					<li>&nbsp;</li>
					<li>&nbsp;</li>
					<li>&nbsp;</li>
				</ul>

				<div class="winner-inner">
					<ul class="corners">
						<li>&nbsp;</li>
						<li>&nbsp;</li>
						<li>&nbsp;</li>
						<li>&nbsp;</li>
					</ul>

					<div class="content">
						<h2>G of IT ist</h2>
						<h3>{{ team.name }}</h3>
					</div>
				</div>
			</li>
		</ul>
	`,
	methods: {
		async getWinner() {
			const response = await fetch("/api/teams");
			this.teams = await response.json();
		},
	},
	mounted() {
		this.getWinner();
	},
}).mount("#winner-container");
