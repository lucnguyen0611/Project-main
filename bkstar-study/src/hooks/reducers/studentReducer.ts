import type {Answer, ExamDoing, Action} from '@/types';

const defaultAnswer = {
    questionId: 0,
    questionIndex: 0,
    questionType: 'single-choice',
    answer: ''
}

export const initState: ExamDoing = {
    examName: '',
    examCode: '',
    examFile: {
        id: null,
        url: undefined,
        file_type: undefined,
    },
    questions: [defaultAnswer],
    timeLeft: 3600,
    device: "desktop"
}

const actionHandlers = {
    // load data from API to state
    'LOAD_INITIAL_DATA': (state: ExamDoing, action: Action) => {
        return {...state, ...action.payload};
    },

    // change the answer for a single-choice question
    'SINGLE_CHANGE_ANSWER': (state: ExamDoing, action: Action) => {
        const {targetedAnswer, index} = action.payload;
        const newQuestions: Answer[] = state.questions.map((question: Answer) => {
            if(question.questionIndex === index){
                return {
                    ...question,
                    answer: targetedAnswer
                }
            }
            return question;
        });
        return {
            ...state,
            questions: newQuestions
        }
    },

    // uncheck an option of a multiple-choice question
    'MULTIPLE_UNCHECK_OPTION': (state: ExamDoing, action: Action) => {
        const {targetedAnswer: uncheckedAnswer, index} = action.payload;
        const newQuestions: Answer[] = state.questions.map((question: Answer) => {
            if(question.questionIndex === index){
                const curQuestion: Answer = state.questions[index];
                const curChosenAnswers: string[] = curQuestion.answer.split(',');
                if(curChosenAnswers.length === 1){
                    return {
                        ...question,
                        answer: ''
                    }
                }else{
                    const newChosenAnswers: string[] = curChosenAnswers.filter(answer => answer!== uncheckedAnswer);
                    return {
                        ...question,
                        answer: newChosenAnswers.sort().join(',')
                    }
                }
            }

            return question;
        })

        return {
            ...state,
            questions: newQuestions
        }
    },

    // check an option of a multiple-choice question
    'MULTIPLE_CHECK_OPTION': (state: ExamDoing, action: Action) => {
        const {targetedAnswer: checkedAnswer, index} = action.payload;
        const newQuestions: Answer[] = state.questions.map((question: Answer) => {
            if(question.questionIndex === index){
                const curQuestion: Answer = state.questions[index];
                // avoid saving the empty string by filter(Boolean)
                const curChosenAnswers: string[] = curQuestion.answer.split(',').filter(Boolean);
                curChosenAnswers.push(checkedAnswer);
                return {
                    ...question,
                    answer: curChosenAnswers.sort().join(',')
                }
            }
            return question;
        })

        return {
            ...state,
            questions: newQuestions
        }
    },

    'LONG_RESPONSE_ANSWER': (state: ExamDoing, action: Action) => {
        const {targetedAnswer, index} = action.payload;
        const newQuestions: Answer[] = state.questions.map((question: Answer) => {
            if(question.questionIndex === index){
                return {
                    ...question,
                    answer: targetedAnswer
                }
            }
            return question;
        });

        return {
            ...state,
            questions: newQuestions
        }
    },

    'COUNTDOWN': (state: ExamDoing) => {
        if(state.timeLeft <= 0) return state;
        return {
            ...state,
            timeLeft: state.timeLeft - 1
        }
    }

}

export const reducer = (state: ExamDoing, action: Action) => {
    const handler = actionHandlers[action.type as keyof typeof actionHandlers];
    if (!handler) {
        throw new Error(`No handler for action type ${action.type}`);
    }
    return handler(state, action);
}