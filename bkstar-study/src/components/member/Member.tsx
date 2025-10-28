import {
    Box,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Paper,
    useTheme,
} from "@mui/material";
import type { Course } from "@/types/user.types";
import type { ClassUser } from "@/types/class.types.ts";
import { getTeachers, getStudents } from "@/utils/class.utils";

interface MemberProps {
    course?: Course;
}

export default function Member({ course }: MemberProps) {
    const theme = useTheme();

    let teachers: ClassUser[] = [];
    let students: ClassUser[] = [];

    if (course) {
        teachers = getTeachers(course);
        students = getStudents(course);
    }

    // Giáo viên trước, học sinh sau
    const members: ClassUser[] = [...teachers, ...students];
    const hasMembers = members.length > 0;

    return (
        <Box>
            <Typography
                variant="h5"
                sx={{
                    fontWeight: "bold",
                    mb: 3,
                    mt: 1,
                }}
            >
                Danh sách thành viên
            </Typography>

            <TableContainer
                component={Paper}
                sx={{ borderRadius: 2, overflow: "hidden", maxWidth: "100%" }}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: "bold", color: "#666" }}>NO.</TableCell>
                            <TableCell sx={{ fontWeight: "bold", color: "#666" }}>Họ tên</TableCell>
                            <TableCell sx={{ fontWeight: "bold", color: "#666" }}>VỊ TRÍ</TableCell>
                            <TableCell sx={{ fontWeight: "bold", color: "#666" }}></TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {!hasMembers ? (
                            <TableRow>
                                <TableCell colSpan={4}>
                                    <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                                        {course ? "Chưa có thành viên" : "Đang tải dữ liệu..."}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            members.map((member: ClassUser, index: number) => {
                                const isTeacher = member.role === "teacher";
                                const bg = index % 2 === 0 ? theme.palette.background.paper : "#f8f8f8";

                                return (
                                    <TableRow key={member.id ?? index} sx={{ backgroundColor: bg }}>
                                        <TableCell>{index + 1}</TableCell>

                                        <TableCell>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                                <Box>
                                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                        {member.name ?? `#${member.id}`}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>

                                        <TableCell>
                                            <Chip
                                                label={isTeacher ? "Giáo viên" : "Học sinh"}
                                                size="small"
                                                sx={{
                                                    backgroundColor: isTeacher
                                                        ? "rgba(255,118,117,0.85)"
                                                        : "rgb(46,204,113)",
                                                    color: "#fff",
                                                }}
                                            />
                                        </TableCell>

                                        <TableCell align="right">
                                            {isTeacher && (
                                                <svg
                                                    stroke="currentColor"
                                                    fill="currentColor"
                                                    strokeWidth="0"
                                                    viewBox="0 0 512 512"
                                                    focusable="false"
                                                    height="2em"
                                                    width="2em"
                                                    style={{ color: "gold" }}
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path d="M249.2 224c-14.2-40.2-55.1-72-100.2-72-57.2 0-101 46.8-101 104s45.8 104 103 104c45.1 0 84.1-31.8 98.2-72H352v64h69.1v-64H464v-64H249.2zm-97.6 66.5c-19 0-34.5-15.5-34.5-34.5s15.5-34.5 34.5-34.5 34.5 15.5 34.5 34.5-15.5 34.5-34.5 34.5z"></path>
                                                </svg>

                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}