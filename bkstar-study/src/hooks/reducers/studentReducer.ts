// import type {Answer, ExamDoing, Action} from '@/types';
//
// const defaultAnswer = {
//     questionId: 0,
//     questionIndex: 0,
//     questionType: 'single-choice',
//     answer: ''
// }
//
// export const initState: ExamDoing = {
//     examName: '',
//     examCode: '',
//     file: {
//         id: null,
//         url: undefined,
//         file_type: undefined,
//     },
//     questions: [defaultAnswer],
//     timeLeft: 3600,
//     device: "desktop"
// }
//
// const actionHandlers = {
//     // load data from API to state
//     'LOAD_INITIAL_DATA': (state: ExamDoing, action: Action) => {
//         return {...state, ...action.payload};
//     },
//
//     // change the answer for a single-choice question
//     'SINGLE_CHANGE_ANSWER': (state: ExamDoing, action: Action) => {
//         const {targetedAnswer, index} = action.payload;
//         const newQuestions: Answer[] = state.questions.map((question: Answer) => {
//             if(question.questionIndex === index){
//                 return {
//                     ...question,
//                     answer: targetedAnswer
//                 }
//             }
//             return question;
//         });
//         return {
//             ...state,
//             questions: newQuestions
//         }
//     },
//
//     // uncheck an option of a multiple-choice question
//     'MULTIPLE_UNCHECK_OPTION': (state: ExamDoing, action: Action) => {
//         const {targetedAnswer: uncheckedAnswer, index} = action.payload;
//         const newQuestions: Answer[] = state.questions.map((question: Answer) => {
//             if(question.questionIndex === index){
//                 const curQuestion: Answer = state.questions[index];
//                 const curChosenAnswers: string[] = curQuestion.answer.split(',');
//                 if(curChosenAnswers.length === 1){
//                     return {
//                         ...question,
//                         answer: ''
//                     }
//                 }else{
//                     const newChosenAnswers: string[] = curChosenAnswers.filter(answer => answer!== uncheckedAnswer);
//                     return {
//                         ...question,
//                         answer: newChosenAnswers.sort().join(',')
//                     }
//                 }
//             }
//
//             return question;
//         })
//
//         return {
//             ...state,
//             questions: newQuestions
//         }
//     },
//
//     // check an option of a multiple-choice question
//     'MULTIPLE_CHECK_OPTION': (state: ExamDoing, action: Action) => {
//         const {targetedAnswer: checkedAnswer, index} = action.payload;
//         const newQuestions: Answer[] = state.questions.map((question: Answer) => {
//             if(question.questionIndex === index){
//                 const curQuestion: Answer = state.questions[index];
//                 // avoid saving the empty string by filter(Boolean)
//                 const curChosenAnswers: string[] = curQuestion.answer.split(',').filter(Boolean);
//                 curChosenAnswers.push(checkedAnswer);
//                 return {
//                     ...question,
//                     answer: curChosenAnswers.sort().join(',')
//                 }
//             }
//             return question;
//         })
//
//         return {
//             ...state,
//             questions: newQuestions
//         }
//     },
//
//     'LONG_RESPONSE_ANSWER': (state: ExamDoing, action: Action) => {
//         const {targetedAnswer, index} = action.payload;
//         const newQuestions: Answer[] = state.questions.map((question: Answer) => {
//             if(question.questionIndex === index){
//                 return {
//                     ...question,
//                     answer: targetedAnswer
//                 }
//             }
//             return question;
//         });
//
//         return {
//             ...state,
//             questions: newQuestions
//         }
//     },
//
//     'COUNTDOWN': (state: ExamDoing) => {
//         if(state.timeLeft <= 0) return state;
//         return {
//             ...state,
//             timeLeft: state.timeLeft - 1
//         }
//     }
//
// }
//
// export const reducer = (state: ExamDoing, action: Action) => {
//     const handler = actionHandlers[action.type as keyof typeof actionHandlers];
//     if (!handler) {
//         throw new Error(`No handler for action type ${action.type}`);
//     }
//     return handler(state, action);
// }

import type { Answer, ExamDoing, Action } from "@/types";

const defaultAnswer: Answer = {
    questionId: 0,
    questionIndex: 0,
    questionType: "single-choice",
    answer: "",
};

export const initState: ExamDoing = {
    examName: "",
    examCode: "",
    file: {
        id: null,
        url: undefined,
        file_type: undefined,
    },
    questions: [defaultAnswer],
    timeLeft: 300,
    device: "desktop",
};

const actionHandlers = {
    LOAD_INITIAL_DATA: (state: ExamDoing, action: Action) => ({
        ...state,
        ...action.payload,
    }),

    SINGLE_CHANGE_ANSWER: (state: ExamDoing, action: Action) => {
        const { targetedAnswer, index } = action.payload;
        const questions = state.questions.map((q) =>
            q.questionIndex === index ? { ...q, answer: targetedAnswer } : q
        );
        return { ...state, questions };
    },

    MULTIPLE_CHECK_OPTION: (state: ExamDoing, action: Action) => {
        const { targetedAnswer, index } = action.payload;
        const questions = state.questions.map((q) => {
            if (q.questionIndex === index) {
                const answers = q.answer.split(",").filter(Boolean);
                if (!answers.includes(targetedAnswer)) answers.push(targetedAnswer);
                return { ...q, answer: answers.sort().join(",") };
            }
            return q;
        });
        return { ...state, questions };
    },

    MULTIPLE_UNCHECK_OPTION: (state: ExamDoing, action: Action) => {
        const { targetedAnswer, index } = action.payload;
        const questions = state.questions.map((q) => {
            if (q.questionIndex === index) {
                const answers = q.answer.split(",").filter((a) => a !== targetedAnswer);
                return { ...q, answer: answers.join(",") };
            }
            return q;
        });
        return { ...state, questions };
    },

    LONG_RESPONSE_ANSWER: (state: ExamDoing, action: Action) => {
        const { targetedAnswer, index } = action.payload;
        const questions = state.questions.map((q) =>
            q.questionIndex === index ? { ...q, answer: targetedAnswer } : q
        );
        return { ...state, questions };
    },

    COUNTDOWN: (state: ExamDoing) =>
        state.timeLeft > 0 ? { ...state, timeLeft: state.timeLeft - 1 } : state,
};

export const reducer = (state: ExamDoing, action: Action) => {
    const handler = actionHandlers[action.type as keyof typeof actionHandlers];
    if (!handler) throw new Error(`No handler for ${action.type}`);
    return handler(state, action);
};
