import {
    Box,
    Button,
    Grid,
    Paper,
    Typography,
    Tooltip
} from "@mui/material";
import { ContentCopy as ContentCopyIcon } from "@mui/icons-material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PeopleIcon from "@mui/icons-material/People";
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import RecentActivity from '../recentActivity/RecentActivity';
import Member from '../member/Member';
import type {UserClassI} from "@/types/user.types";
import type { ExamGroup } from "@/types/exam.types";
import type { Course } from "@/types/user.types";
import { useOutletContext } from "react-router-dom";

interface Props {
    course?: Course | null;
    examGroups?: ExamGroup| null;
}

export default function ClassOverview() {
    const { course, examGroups } = useOutletContext<Props>();
    if (!course) {
        return (
            <Box sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="body2">Đang tải thông tin lớp...</Typography>
            </Box>
        );
    }

    // Lấy mảng users (fallback về mảng rỗng)
    const users: UserClassI[] = Array.isArray(course.users) ? course.users : [];

    // Phân loại teacher / student dựa trên trường role
    const teachers = users.filter(u => u.role === "teacher");
    const students = users.filter(u => u.role === "student");

    const teachersName: string = teachers.map(t => t.name ?? "").filter(Boolean).join(", ");
    const newUsers = [...teachers, ...students];

    /*********** share invite link *************/
    const baseUrl: string = window.location.origin;
    const linkToInvite = `${baseUrl}/invite?class=${course.id}`;
    const onCopyLink = () => {
        navigator.clipboard.writeText(linkToInvite).then(() => {
            // toast.info('Đã sao chép link lớp học!');
        }).catch((err) => {
            // toast.error('Sao chép thất bại !');
            console.error('Failed to copy link to clipboard: ', err);
        });
    };

    return (
        <Grid >
            <Grid size={{ xs: 12, lg: 8 }}>
                {/* Header section */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        mb: 3,
                        borderRadius: 2,
                        backgroundColor: '#3498db',
                        color: 'white'
                    }}>
                    <Box>
                        <Box>
                            <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
                                <AssignmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                {course.name ?? "Tên lớp"}
                            </Typography>

                            <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                Giáo viên: {teachersName || "Chưa có giáo viên"}
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'flex-end', mt: 2, gap: '10px' }}>
                                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                    Chia sẻ lớp học
                                </Typography>

                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <Tooltip title={'Copy link mời vào lớp'} arrow>
                                        <Button
                                            variant="outlined"
                                            startIcon={<ContentCopyIcon />}
                                            size="small"
                                            sx={{
                                                mt: 1,
                                                color: 'white',
                                                borderColor: 'white',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                    borderColor: 'white',
                                                }
                                            }}
                                            onClick={onCopyLink}
                                        >
                                            <Typography variant='caption' sx={{ opacity: 0.9 }}>
                                                Sao chép liên kết
                                            </Typography>
                                        </Button>
                                    </Tooltip>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Paper>

                {/* Statistics section */}
                <Grid container spacing={2}>
                    <Grid size={6}>
                        <Paper elevation={0} sx={{ p: 2, borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <PeopleIcon sx={{ color: '#3498db', mr: 2, fontSize: 48 }} />
                                <Typography variant="h5" fontWeight="medium">
                                    {newUsers.length} Thành Viên
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>

                    <Grid size={6}>
                        <Paper elevation={0} sx={{ p: 2, borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <ContentCopyOutlinedIcon sx={{ color: '#3498db', mr: 2, fontSize: 48 }} />
                                <Typography variant="h5" fontWeight="medium">
                                    {Array.isArray(examGroups) ? examGroups.length : 0} Bài Kiểm Tra
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>

                <Member />
            </Grid>

            {/*Recent Activity section - bật khi cần */}
            <Grid size={{ xs: 0, lg: 4 }} sx={{ flexGrow: 1, flexShrink: 0 }}>
                <RecentActivity examGroups={examGroups} />
            </Grid>
        </Grid>
    );
}

