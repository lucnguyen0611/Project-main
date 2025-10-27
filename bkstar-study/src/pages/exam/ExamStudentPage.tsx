import {Box, Typography, Grid} from '@mui/material';
import {useNavigate, useParams, Link} from 'react-router-dom';
import {useEffect} from 'react';
import type { ExamWithStatus } from "@/types";
import {LoadingData} from "@/components/common/LoadingData.tsx";
import { useExamFlow } from "@/contexts";

export default function StudentExamGroup() {
    const navigate = useNavigate();
    const {classId: id, examGroupId: groupId} = useParams();
    const examGroupId = Number(groupId);
    const classId = Number(id);

    // load from context
    const {
        isLoading,
        examGroupDetail,
        examsWithStatus,
        awaitingTime,
        initializeExamData
    } = useExamFlow();

    const handleBackToExamGroupsList = () => {
        navigate(`/class/${classId}/exam`);
    };

    // mounting
    useEffect(() => {
        if(examGroupId){
            initializeExamData(examGroupId);
        }
    }, [initializeExamData, examGroupId]);

    const numberOfCompletedExams: number = examsWithStatus.filter(exam => exam.status === 'completed').length;
    const awaitTimeInMinutes: number = examGroupDetail ? examGroupDetail.await_time / 60 : 0;

    if (isLoading) return <LoadingData/>;

    return (
        <>
            <Box sx={{display: 'flex', mb: 1}}>
                <Typography variant="h6" fontWeight="600" onClick={handleBackToExamGroupsList} sx={{cursor: 'pointer', '&:hover': {textDecoration: 'underline'}, mr: 2}}>
                    Danh sách bài thi
                </Typography>
                <Typography variant="h6" fontWeight="600">{`>`} Chi tiết bài thi</Typography>
            </Box>

            <Box sx={{mb: 3, p: 2, backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #0000ff'}}>
                <Typography variant={"h6"} fontWeight={600} color={'info'}>Tên bài thi: {examGroupDetail?.name}</Typography>
                <Typography variant={"h6"} fontWeight={600} color={'error'}>Thời gian chờ giữa các đề bài: {awaitTimeInMinutes} phút</Typography>
                <Typography variant={"h6"} fontWeight={600} color={'success'}>Trạng thái hoàn thành: {numberOfCompletedExams}/{examsWithStatus.length}</Typography>
            </Box>

            <Box><Typography variant={"h6"} fontWeight={600} color={'primary'}>Danh sách đề bài</Typography></Box>

            {(!examsWithStatus || examsWithStatus.length === 0)
                ? <Typography fontWeight={500}>Chưa có đề bài nào được tải lên</Typography>
                : <ExamsGrid exams={examsWithStatus} classId={classId} examGroupId={examGroupId!} awaitingTime={awaitingTime} />
            }
        </>
    );
}

function ExamsGrid({exams, classId, examGroupId, awaitingTime}: { exams: ExamWithStatus[], classId: number, examGroupId: number, awaitingTime: number }) {
    return (
        <Grid container spacing={2} sx={{my: 3}}>
            {exams.map((exam: ExamWithStatus) => (
                <Grid key={exam.id} size={{xs: 12, lg: 6}}>

                    {exam.status === 'unlocked' ? (
                        <Link to={`/class/${classId}/exam/${examGroupId}/doing/${exam.id}`} style={{textDecoration: 'none', color: "#000000"}}>
                            <ExamBox exam={exam} awaitingTime={awaitingTime}/>
                        </Link>
                    ) : (
                        <Box sx={{backgroundColor: '#e0ecf6', cursor: 'not-allowed'}}>
                            <ExamBox exam={exam} awaitingTime={awaitingTime}/>
                        </Box>
                    )}

                </Grid>
            ))}
        </Grid>
    );
}

function ExamBox({exam, awaitingTime}: { exam: ExamWithStatus, awaitingTime: number }) {
    return (
        <Box sx={{border: '1px dotted #0000ff', borderRadius: '8px', p: 1}}>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '16px'}}>
                <Typography sx={{fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 'calc(100% - 150px)'}}>
                    Đề bài: {exam.name}
                </Typography>
                <ExamStatusLabel exam={exam} awaitingTime={awaitingTime} />
            </Box>
            <Typography>Mã đề: {exam.code}</Typography>
            <Typography>Thời gian làm bài: {exam.total_time / 60} phút</Typography>
        </Box>
    );
}

function ExamStatusLabel({exam, awaitingTime}: { exam: ExamWithStatus, awaitingTime: number }){
    switch(exam.status) {
        case 'completed':
            return <Typography color={'primary'} sx={{fontWeight: 600}}>Đã hoàn thành</Typography>;
        case 'locked':
            return <Typography color={'error'} sx={{fontWeight: 600}}>Chưa mở</Typography>;
        case 'unlocking':
            return <Typography color={'warning'} sx={{fontWeight: 600}}>Mở sau: {awaitingTime}s</Typography>;
        case 'unlocked':
            return <Typography color={'success.dark'} sx={{fontWeight: 600}}>Đang mở</Typography>;
        default: return <></>;
    }
}