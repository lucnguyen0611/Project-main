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
} from "@mui/material";
import type { Course, UserClassI } from "@/types/user.types";

interface MemberProps {
    course?: Course; // Có thể undefined khi chưa load xong
}

export default function Member({ course }: MemberProps) {
    // Lấy users từ course
    const users: UserClassI[] = Array.isArray(course?.users) ? course!.users! : [];

    // Phân loại giáo viên và học sinh
    const teachers = users.filter((u) => u.role === "teacher");
    const students = users.filter((u) => u.role === "student");
    const members = [...teachers, ...students]; // giáo viên trước, học sinh sau

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
                            <TableCell sx={{ fontWeight: "bold", color: "#666" }}>HỌ TÊN</TableCell>
                            <TableCell sx={{ fontWeight: "bold", color: "#666" }}>VỊ TRÍ</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {members.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4}>
                                    <Typography variant="body2" color="text.secondary">
                                        {course ? "Chưa có thành viên" : "Đang tải dữ liệu..."}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            members.map((member: UserClassI, index: number) => (
                                <TableRow
                                    key={member.id ?? index}
                                    sx={index % 2 !== 0 ? {} : { backgroundColor: "#f8f8f8" }}
                                >
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{member.name ?? `#${member.id}`}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={member.role === "student" ? "Học sinh" : "Giáo viên"}
                                            size="small"
                                            sx={{
                                                backgroundColor:
                                                    member.role === "teacher"
                                                        ? "rgba(255, 118, 117, 0.85)"
                                                        : "rgb(46, 204, 113)",
                                                color: "#fff",
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        {member.role === "teacher" && (
                                            <Chip
                                                icon={<KeyIcon />}
                                                size="small"
                                                sx={{ backgroundColor: "#f9ca24", color: "#fff" }}
                                            />
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

function KeyIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
                d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

