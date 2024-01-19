// IMPORTS
const QUIZ = require("../data/quiz");

// FUNCTIONS
async function getQuiz() {
	return await QUIZ;
}

async function toggle(visibleQuestionindex) {
	if (!QUIZ[visibleQuestionindex].visible) {
		QUIZ.forEach((question, index) => {
			question.visible = visibleQuestionindex === index;
		});
	} else {
		QUIZ[visibleQuestionindex].visible = false;
	}

	return await QUIZ;
}

async function logAnswer(visibleQuestionindex, answerId) {
	QUIZ[visibleQuestionindex].selectedAnswerIndex = answerId;
	return await QUIZ;
}

async function showAnswer(visibleQuestionindex) {
	QUIZ[visibleQuestionindex].showAnswer = true;
	return await QUIZ;
}

async function resetQuiz() {
	QUIZ.forEach((question) => {
		question.visible = false;
		question.selectedAnswerIndex = null;
		question.showAnswer = false;
	});

	return await QUIZ;
}

// EXPORTS
module.exports = {
	getQuiz,
	toggle,
	logAnswer,
	showAnswer,
	resetQuiz,
};
