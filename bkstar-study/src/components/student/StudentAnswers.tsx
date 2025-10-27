import type {Dispatch, ChangeEvent} from 'react'
import {useCallback, memo} from "react";
import type {ExamDoing, Answer, Action} from '@/types';

import {
    Grid,
    Box,
    TextField,
    Radio,
    Checkbox,
    Typography
} from '@mui/material';

interface StudentAnswersProps {
    state: ExamDoing,
    dispatch: Dispatch<Action>
}

export default function StudentAnswers({state, dispatch}: StudentAnswersProps) {
    const handleAnswerChange = useCallback((question: Answer) => {
        return (e: ChangeEvent<HTMLInputElement>) => {
            const payload = {
                targetedAnswer: e.target.value,
                index: question.questionIndex,
            }

            switch (question.questionType) {
                case 'single-choice':
                    dispatch({type: 'SINGLE_CHANGE_ANSWER', payload: payload});
                    break;
                case 'multiple-choice':
                    if (e.target.checked) {
                        dispatch({type: 'MULTIPLE_CHECK_OPTION', payload: payload})
                    } else {
                        dispatch({type: 'MULTIPLE_UNCHECK_OPTION', payload: payload})
                    }
                    break;
                case 'long-response':
                    dispatch({type: 'LONG_RESPONSE_ANSWER', payload: payload});
                    break;
            }
        }
    },[dispatch]);

    return (
        <>
            <Typography variant={'h5'} color={'primary'} sx={{m: '1px 2px', fontWeight: 600}}>
                Phiếu trả lời
            </Typography>
            <Box>
                <Grid container spacing={1}>
                    {
                        state.questions.map((question: Answer) =>
                            (
                                <Grid size={{xs: 6}} key={question.questionId}>
                                    <MemoizedQuestionUnit question={question}
                                                          onAnswerChange={handleAnswerChange(question)}
                                    />

                                </Grid>
                            ))
                    }
                </Grid>

            </Box>
        </>
    )
}

interface QuestionUnitProps {
    question: Answer,
    onAnswerChange: (e: ChangeEvent<HTMLInputElement>) => void,
}

const MemoizedQuestionUnit = memo(function QuestionUnit({question, onAnswerChange}: QuestionUnitProps) {
    const options: string[] = ["A", "B", "C", "D"];
    let questionElement;

    switch (question.questionType) {
        case 'single-choice':
            questionElement = options.map((option: string, index: number) => {
                return (
                    <Box key={index} sx={{display:'flex', alignItems: 'center'}}>
                        <Radio name={`question-${question.questionIndex}`}
                               onChange={onAnswerChange}
                               checked={question.answer === option}
                               id={`question-${question.questionIndex}-${option}`} value={option}/>
                        <label htmlFor={`question-${question.questionIndex}-${option}`}>{option}</label>
                    </Box>
                )
            });
            break;

        case 'multiple-choice':
            questionElement = options.map((option: string, index: number) => {
                return (
                    <Box key={index} sx={{display:'flex', alignItems: 'center'}}>
                        <Checkbox name={`question-${question.questionIndex}`}
                                  onChange={onAnswerChange}
                                  checked={question.answer.includes(option)}
                                  id={`question-${question.questionIndex}-${option}`} value={option}/>
                        <label htmlFor={`question-${question.questionIndex}-${option}`}>{option}</label>
                    </Box>
                )
            });
            break;

        case 'long-response':
            questionElement = <TextField
                fullWidth
                size={'small'}
                variant="outlined"
                value={question.answer}
                onChange={onAnswerChange}
                slotProps={{
                    input: {
                        style: {whiteSpace: 'nowrap', overflowX: 'auto'}
                    }
                }}
            />
            break;

        default: questionElement = <></>;
    }

    return (
        <Box sx={{m: "10px 0 10px 10px "}}>
            <Grid container spacing={2} style={{alignItems: 'center'}}>
                <Grid size={{xs: 2}}>
                    <Typography sx={{fontSize: 20}}>C{question.questionIndex + 1}:</Typography>
                </Grid>

                <Grid size={{xs: 10}} sx={{display: 'flex', gap: '10px'}}>
                    {
                        questionElement
                    }
                </Grid>

            </Grid>
        </Box>
    )
})