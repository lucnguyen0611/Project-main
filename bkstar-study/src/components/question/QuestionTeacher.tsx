import {
    Box,
    Typography,
    TextField,
    MenuItem,
    RadioGroup,
    FormControlLabel,
    Radio,
    Checkbox,
} from "@mui/material";

interface QuestionEditorProps {
    index: number;
    type: string;
    onChangeType: (type: string) => void;
    singleAnswer: string;
    onChangeSingle: (value: string) => void;
    multiAnswers: string[];
    onChangeMulti: (answers: string[]) => void;
}

export default function QuestionEditor({
                                           index,
                                           type,
                                           onChangeType,
                                           singleAnswer,
                                           onChangeSingle,
                                           multiAnswers,
                                           onChangeMulti,
                                       }: QuestionEditorProps) {
    return (
        <Box mt={2}>


            {/* hàng chứa select + đáp án */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flexWrap: "wrap",
                }}
            >
                <Typography fontWeight="bold" mb={0.5} color={'#2b6cb0'}>
                    Câu {index + 1}
                </Typography>

                {/* dropdown chọn loại câu hỏi */}
                <TextField
                    select
                    size="small"
                    value={type}
                    onChange={(e) => onChangeType(e.target.value)}
                    sx={{
                        minWidth: 180,
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 1.25,
                            "& fieldset": { borderColor: "rgba(38,198,218,0.35)" },
                            "&:hover fieldset": { borderColor: "#00bcd4" },
                            "&.Mui-focused fieldset": { borderColor: "#00bcd4", borderWidth: 1.5 },
                        },
                    }}
                >
                    <MenuItem value="single">Chọn 1 đáp án</MenuItem>
                    <MenuItem value="multi">Chọn nhiều đáp án</MenuItem>
                    <MenuItem value="fill">Điền vào chỗ trống</MenuItem>
                </TextField>

                {/* single choice */}
                {type === "single" && (
                    <RadioGroup
                        row
                        value={singleAnswer}
                        onChange={(e) => onChangeSingle(e.target.value)}
                    >
                        {["A", "B", "C", "D"].map((opt) => (
                            <FormControlLabel key={opt} value={opt} control={<Radio />} label={opt} />
                        ))}
                    </RadioGroup>
                )}

                {/* multiple choice */}
                {type === "multi" && (
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        {["A", "B", "C", "D"].map((opt) => (
                            <FormControlLabel
                                key={opt}
                                control={
                                    <Checkbox
                                        checked={multiAnswers.includes(opt)}
                                        onChange={(e) => {
                                            const checked = e.target.checked;
                                            if (checked) onChangeMulti([...multiAnswers, opt]);
                                            else onChangeMulti(multiAnswers.filter((a) => a !== opt));
                                        }}
                                    />
                                }
                                label={opt}
                            />
                        ))}
                    </Box>
                )}

                {/* fill-in-the-blank */}
                {type === "fill" && (
                    <TextField
                        size="small"
                        disabled
                        placeholder="Học sinh tự điền"
                        sx={{
                            minWidth: 200,
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 1.25,
                                "& fieldset": { borderColor: "rgba(38,198,218,0.35)" },
                            },
                        }}
                    />
                )}
            </Box>
        </Box>
    );
}
