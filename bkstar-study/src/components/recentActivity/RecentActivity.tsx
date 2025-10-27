import {Box, Typography, Avatar} from '@mui/material'
import {
    NotificationsOutlined as NotificationIcon,
    AccessTime as ClockIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';

// import type {ExamGroup} from '../../utils/types';

export default function RecentActivity({examGroups}: { examGroups: any }) {
    const sortedExamGroups: any = examGroups.sort((a: any, b: any) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return (
        <Box sx={{
            borderLeft: '1px solid #e0e0e0',
            p: 3, backgroundColor: '#fff', borderRadius: 3,
            display: {xs: 'none', lg: 'block'},
            overflowY: 'auto'
        }}>
            <Typography variant={'h6'} fontWeight={600} mb={'10px'}>
                <NotificationIcon sx={{verticalAlign: 'middle', mr: 1}}/>
                Hoạt động gần đây
            </Typography>

            <Box>
                {
                    sortedExamGroups.map((examGroup: any) => (
                        <Box key={examGroup.id} sx={{px: 0, py: 1, display: 'flex', alignItems: 'center'}}>
                            <Avatar
                                src={`https://i.pravatar.cc/150?img=${examGroup.id}`}
                                sx={{width: 40, height: 40, mr: 2}}
                            />
                            <Box>
                                <Typography variant="body2">
                                    Bài thi <Typography component="span" color="primary"
                                                        fontWeight="medium">{examGroup.name}</Typography> vừa
                                    được tải lên
                                </Typography>

                                <Box sx={{display: 'flex', alignItems: 'center', mt: 0.5}}>
                                    <ClockIcon sx={{fontSize: 14, mr: 0.5, color: 'text.secondary'}}/>
                                    <Typography variant="caption" color="text.secondary">
                                        {dayjs(examGroup.created_at).format("DD-MM-YYYY HH:mm:ss")}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    ))
                }
            </Box>

        </Box>
    )
}