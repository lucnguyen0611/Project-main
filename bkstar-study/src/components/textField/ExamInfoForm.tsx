import { Grid, TextField } from "@mui/material";

interface ExamInfoFormProps {
    name: string;
    code: string;
    totalTime: number | "";
    questionCount: number;
    description: string;
    validationErrors: {
        name?: string;
        code?: string;
        totalTime?: string;
        description?: string;
    };
    onChange: (field: string, value: any) => void;
}

export default function ExamInfoForm({
                                         name,
                                         code,
                                         totalTime,
                                         questionCount,
                                         description,
                                         validationErrors,
                                         onChange,
                                     }: ExamInfoFormProps) {
    // ✨ Reuse style cho các TextField
    const textFieldStyle = {
        "& .MuiOutlinedInput-root": {
            borderRadius: 1.25,
            "& fieldset": { borderColor: "rgba(38,198,218,0.35)" },
            "&:hover fieldset": { borderColor: "#00bcd4" },
            "&.Mui-focused fieldset": {
                borderColor: "#00bcd4",
                borderWidth: 1.5,
            },
        },
    };

    return (

            <Grid container spacing={2}>
                {/* ✅ Tên đề */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label="Tên đề"
                        fullWidth
                        size="small"
                        required
                        value={name}
                        onChange={(e) => onChange("name", e.target.value)}
                        error={!!validationErrors.name}
                        helperText={validationErrors.name}
                        sx={textFieldStyle}
                    />
                </Grid>

                {/* ✅ Mã đề */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label="Mã đề"
                        fullWidth
                        size="small"
                        required
                        value={code}
                        onChange={(e) => onChange("code", e.target.value)}
                        error={!!validationErrors.code}
                        helperText={
                            validationErrors.code
                        }
                        sx={textFieldStyle}
                    />
                </Grid>

                {/* ✅ Thời gian */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label="Thời gian làm bài (phút)"
                        type="number"
                        inputProps={{ min: 1 }}
                        fullWidth
                        size="small"
                        required
                        value={totalTime}
                        onChange={(e) => {
                            const val = e.target.value;
                            onChange("totalTime", val === "" ? "" : Math.max(0, Number(val)));
                        }}
                        error={!!validationErrors.totalTime}
                        helperText={
                            validationErrors.totalTime
                        }
                        sx={textFieldStyle}
                    />
                </Grid>

                {/* ✅ Số câu hỏi */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label="Số câu"
                        type="number"
                        fullWidth
                        size="small"
                        inputProps={{ min: 1 }}
                        value={questionCount}
                        onChange={(e) => {
                            const val = Number(e.target.value);
                            onChange("questionCount", isNaN(val) || val < 1 ? 1 : val);
                        }}
                        sx={textFieldStyle}
                    />
                </Grid>

                {/* ✅ Mô tả */}
                <Grid size={{ xs: 12, sm: 12 }}>
                    <TextField
                        label="Mô tả bài thi"
                        fullWidth
                        multiline
                        minRows={2}
                        size="small"
                        value={description}
                        onChange={(e) => onChange("description", e.target.value)}
                        error={!!validationErrors.description}
                        helperText={
                            validationErrors.description
                        }
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 1.25,
                                "& fieldset": { borderColor: "rgba(38,198,218,0.15)" },
                                "&:hover fieldset": { borderColor: "#00bcd4" },
                            },
                        }}
                    />
                </Grid>
            </Grid>
    );
}
