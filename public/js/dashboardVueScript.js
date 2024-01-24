// Naviagtion
const NAVIGATION = Vue.createApp({
	data() {
		return {
			games: [],
		};
	},
	template: `
        <select @change="switchView($event.target.value)">
            <option v-for="(game, index) in games" :value="index">
                {{ game.name }}
            </option>
        </select>
    `,
	methods: {
		async getGames() {
			const allGames = document.querySelectorAll("section[data-navigation]");
			allGames.forEach((game) => {
				this.games.push({
					name: game.dataset.navigation,
				});
			});
		},
		async switchView(index) {
			switchView(index);
		},
	},
	mounted() {
		this.getGames();
	},
}).mount("#navigation-container");

// BANDAGES
const BANDAGES = Vue.createApp({
	data() {
		return {
			bandages: [],
		};
	},
	template: `
        <option v-for="(bandage, index) in bandages" :value="index">
            {{ bandage.name }} {{ bandage.surname }} ({{ bandage.info }})
        </option>
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
}).mount("#bandage-select");

// HALLI GALLI
const HALLIGALLI = Vue.createApp({
	data() {
		return {
			cards: [],
		};
	},
	template: `
		<ul>
			<li v-for="(card, index) in cards">
				<figure>
					<img :src="'/assets/halli-galli/' + card.file">
				</figure>
				<button @click="toggleHalliGalli(index)" :id="'toggle-halli-galli-' + index">Karte anzeigen</button>
			</li>
		</ul>
	`,
	methods: {
		async getCards() {
			const response = await fetch("/api/halli-galli");
			this.cards = await response.json();
		},

		async toggleHalliGalli(index) {
			toggleHalliGalli(index);
		},
	},
	mounted() {
		this.getCards();
	},
}).mount("#halli-galli-container");

// QUIZ
const QUIZ = Vue.createApp({
	data() {
		return {
			quiz: [],
			selectedAnswers: [],
		};
	},
	template: `
        <ol>
            <li v-for="(question, index) in quiz" :id="'question-' + Number(index + 1)">
                <p>{{ question.question }}</p>
                <button @click="showQuestion(index)">Frage einblenden</button>
                <button @click="showAnswer(index)" id="show answer">Antwort auflösen</button>
            </li>
        </ol>
    `,
	methods: {
		async getQuiz() {
			const response = await fetch("/api/quiz");
			const data = await response.json();
			this.quiz = await data;

			this.selectedAnswers = Array(this.quiz.length).fill(null);
		},

		async showQuestion(index) {
			showQuestion(index);
		},

		async logAnswer(index) {
			logAnswer(index, this.selectedAnswers[index]);
		},

		async showAnswer(index) {
			showAnswer(index, this.selectedAnswers[index]);
		},
	},
	mounted() {
		this.getQuiz();
	},
}).mount("#quiz-container");

// LEGO
const LEGOBUILDS = Vue.createApp({
	data() {
		return {
			images: [],
		};
	},
	template: `
        <ul>
            <li v-for="(image, index) in images">
				<figure>
					<img :src="'/assets/lego-builds/' + image">
				</figure>
                <button @click="toggleImage(index)" :id="'toggle-lego-build-' + index">Bild anzeigen</button>
            </li>
        </ul>
    `,
	methods: {
		async getBuilds() {
			const response = await fetch("/api/lego-builds");
			this.images = await response.json();
		},

		async toggleImage(index) {
			toggleLegoBuild(index);
		},
	},
	mounted() {
		this.getBuilds();
	},
}).mount("#lego-builds-container");

// WIT
const WHEREISTHIS = Vue.createApp({
	data() {
		return {
			images: [],
		};
	},
	template: `
        <ul>
            <li v-for="(image, index) in images">
				<figure>
					<img :src="'/assets/where-is-this/' + image.file">
				</figure>
                <button @click="toggleImage(index)" :id="'toggle-where-is-this-' + index">Bild anzeigen</button>
				<button @click="toggleAnswer(index)" :id="'toggle-answer' + index">Lösung anzeigen</button>
            </li>
        </ul>
    `,
	methods: {
		async getBuilds() {
			const response = await fetch("/api/where-is-this");
			this.images = await response.json();
		},

		async toggleImage(index) {
			toggleWhereIsThis(index);
		},

		async toggleAnswer(index) {
			toggleWhereIsThisAnswer(index);
		},
	},
	mounted() {
		this.getBuilds();
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
            <li v-for="(word, index) in words">
                <p>{{ word.word }} ({{ word.letters }} Buchstaben)</p>
                <button @click="toggleWord(index)" :id="'toggle-word-' + index">Wort anzeigen</button>
                <button @click="showSolution(index)" :id="'show-solution-' + index">Lösung anzeigen</button>
            </li>
        </ul>
    `,
	methods: {
		async getWords() {
			const response = await fetch("/api/count-letters");
			this.words = await response.json();
		},

		async toggleWord(index) {
			toggleWord(index);
		},

		async showSolution(index) {
			showSolution(index);
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
			<li v-for="(image, index) in images">
				<figure>
					<img :src="'/assets/remember-image/' + image.file">
				</figure>
				<button @click="toggleImage(index)" :id="'toggle-remember-image-' + index">Bild anzeigen</button>
			</li>
		</ul>
	`,
	methods: {
		async getImages() {
			const response = await fetch("/api/remember-image");
			this.images = await response.json();
		},

		async toggleImage(index) {
			toggleRememberImage(index);
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
			<li v-for="(imitate, index) in imitates">
				<p>{{ imitate.description }}</p>
				<button @click="toggleImitate(index)" :id="'toggle-imitate-' + index">Beschreibung anzeigen</button>
			</li>
		</ul>
	`,
	methods: {
		async getImitates() {
			const response = await fetch("/api/imitate");
			this.imitates = await response.json();
		},

		async toggleImitate(index) {
			toggleImitate(index);
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
		<div v-for="(team, index) in teams">
			<h2>{{ team.name }}</h2>
			<div class="points-total-input">
				<label :for="'team-points-' + index">Punkte</label>
				<input type="text" placeholder="Punkte" :value="team.points" :id="'team-points-' + index">
			</div>
		</div>
	`,
	methods: {
		async getTeams() {
			const response = await fetch("/api/teams");
			this.teams = await response.json();
		},
	},
	mounted() {
		this.getTeams();
	},
}).mount("#points-total-container");
