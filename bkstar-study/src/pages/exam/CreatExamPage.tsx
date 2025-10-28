// // import {
// //     Grid,
// //     Typography,
// //     TextField,
// //     Button,
// //     MenuItem,
// //     RadioGroup,
// //     Radio,
// //     FormControlLabel,
// //     Paper,
// //     Box,
// //     Checkbox,
// // } from "@mui/material";
// // import { useEffect, useState } from "react";
// // import { useNavigate, useParams } from "react-router-dom";
// // import { examApi } from "@/api/exam.api";
// // import type { ExamItem } from "@/types";
// //
// // interface Props {
// //     mode: "create" | "edit";
// // }
// //
// // export default function CreatExamPage({ mode }: Props) {
// //     const { examGroupId, examDetailId } = useParams();
// //     const navigate = useNavigate();
// //
// //     const groupId = Number(examGroupId);
// //     const examId = Number(examDetailId);
// //
// //     const [name, setName] = useState("");
// //     const [code, setCode] = useState("");
// //     const [totalTime, setTotalTime] = useState(0);
// //     const [description, setDescription] = useState("");
// //     const [questionCount, setQuestionCount] = useState(1);
// //     const [questionTypes, setQuestionTypes] = useState<{ [key: number]: string }>({});
// //     const [singleAnswers, setSingleAnswers] = useState<{ [key: number]: string }>({});
// //     const [multiAnswers, setMultiAnswers] = useState<{ [key: number]: string[] }>({});
// //     const [fillAnswers, setFillAnswers] = useState<{ [key: number]: string }>({});
// //     // unified file state (PDF file)
// //     const [selectedFile, setSelectedFile] = useState<File | null>(null);
// //     const [fileUrl, setFileUrl] = useState<string | null>(null);
// //     const [fileId, setFileId] = useState<number | null>(null);
// //     const [fileType, setFileType] = useState<string | null>(null); // lưu file_type giống bên teacher file
// //     const [originalQuestions, setOriginalQuestions] = useState<any[]>([]);
// //
// //     // NOTE: vẫn giữ helper nếu bạn muốn chuyển sang base64 trong tương lai,
// //     // nhưng hiện dưới flow này chúng ta không dùng base64 để gửi file trong JSON.
// //     const toBase64 = (file: File): Promise<string> =>
// //         new Promise((resolve, reject) => {
// //             const reader = new FileReader();
// //             reader.readAsDataURL(file);
// //             reader.onload = () => resolve((reader.result as string).split(",")[1]);
// //             reader.onerror = reject;
// //         });
// //
// //     useEffect(() => {
// //         if (mode !== "edit" || !examId) return;
// //         const fetchExamDetail = async () => {
// //             try {
// //                 const data: ExamItem = await examApi.getExamById(examId);
// //                 setName(data.name);
// //                 setCode(data.code);
// //                 setTotalTime(Math.round(data.total_time / 60));
// //                 setDescription(data.description);
// //                 setQuestionCount(data.number_of_question);
// //                 setFileUrl(data.file?.url ?? null);
// //                 setFileId(data.file?.id ?? null);
// //                 setFileType(data.file?.file_type ?? null);
// //                 setOriginalQuestions(data.questions ?? []);
// //
// //                 const qt: any = {};
// //                 const s: any = {};
// //                 const m: any = {};
// //                 const f: any = {};
// //                 (data.questions ?? []).forEach((q, i) => {
// //                     const idx = i + 1;
// //                     if (q.type === "single-choice") qt[idx] = "single";
// //                     else if (q.type === "multiple-choice") qt[idx] = "multi";
// //                     else qt[idx] = "fill";
// //                     if (qt[idx] === "single") s[idx] = q.correct_answer;
// //                     if (qt[idx] === "multi") m[idx] = q.correct_answer?.split(",") || [];
// //                     if (qt[idx] === "fill") f[idx] = q.correct_answer;
// //                 });
// //                 setQuestionTypes(qt);
// //                 setSingleAnswers(s);
// //                 setMultiAnswers(m);
// //                 setFillAnswers(f);
// //
// //                 console.log('data sua exam', data)
// //             } catch (err) {
// //                 console.error(err);
// //             }
// //         };
// //         fetchExamDetail();
// //     }, [mode, examId]);
// //
// //     // handle selecting PDF file
// //     const handlePdfSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
// //         const f = e.target.files?.[0] ?? null;
// //         if (!f) return;
// //         if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
// //             alert("Vui lòng chọn file PDF");
// //             return;
// //         }
// //         const preview = URL.createObjectURL(f);
// //         setSelectedFile(preview);
// //         setFileUrl(preview);
// //         setFileType(f.type.split("/")[1] ?? "pdf");
// //         console.log(preview);
// //         // IMPORTANT:
// //         // - Đây chỉ là preview local. Nếu backend cần file thực tế stored => bạn phải upload file tới endpoint /files,
// //         //   nhận về file.id rồi setFileId(saved.id) trước khi submit exam.
// //         // - Nếu backend chấp nhận payload base64 trong `file.payload`, uncomment và gọi toBase64(selectedFile)
// //     };
// //
// //     const handleSubmit = async () => {
// //         // simple validation
// //         if (!name.trim()) {
// //             alert("Vui lòng nhập tên đề");
// //             return;
// //         }
// //         if (!questionCount || questionCount < 1) {
// //             alert("Số câu phải >= 1");
// //             return;
// //         }
// //
// //         // build questions array matching backend shape
// //         const questions = Array.from({ length: questionCount }, (_, i) => {
// //             const idx = i + 1; // 1-based index used in your UI state
// //             const uiType = questionTypes[idx] || "single"; // 'single' | 'multi' | 'fill'
// //             const type =
// //                 uiType === "single"
// //                     ? "single-choice"
// //                     : uiType === "multi"
// //                         ? "multiple-choice"
// //                         : "long-response";
// //
// //             let correct_answer = "";
// //             if (uiType === "single") correct_answer = singleAnswers[idx] ?? "";
// //             else if (uiType === "multi") correct_answer = (multiAnswers[idx] ?? []).join(",");
// //             else correct_answer = fillAnswers[idx] ?? "";
// //
// //             // keep id if editing existing question (so backend can update)
// //             const existing = originalQuestions?.[i]; // originalQuestions from useEffect when loading edit data
// //             if (existing && typeof existing.id !== "undefined") {
// //                 return {
// //                     id: existing.id,
// //                     index: i,
// //                     type,
// //                     correct_answer,
// //                 };
// //             }
// //
// //             // new question (no id)
// //             return {
// //                 index: i,
// //                 type,
// //                 correct_answer,
// //             };
// //         });
// //
// //         // prepare file object compatible với TeacherExamDetail (id, url, file_type)
// //         // nếu bạn đã upload file và có fileId => backend sẽ liên kết bằng id
// //         // const filePayloadObj: any = {
// //         //     id: fileId ?? null,
// //         //     url: fileUrl ?? "",
// //         //     file_type: fileType ?? "pdf",
// //         // };
// //
// //         // If you want to actually upload file first and get fileId, do it here.
// //         // Example (pseudo):
// //         // if (selectedFile && !fileId) {
// //         //   const fd = new FormData();
// //         //   fd.append('file', selectedFile);
// //         //   const saved = await fileApi.upload(fd);
// //         //   filePayloadObj.id = saved.id;
// //         //   filePayloadObj.url = saved.url;
// //         //   filePayloadObj.file_type = saved.file_type;
// //         // }
// //
// //         // final payload shaped like the teacher file expects
// //         const payload: any = {
// //             id: mode === "edit" ? examId : 0,
// //             name: name,
// //             code: String(code ?? ""),
// //             // IMPORTANT: use field name `exam_group` to match other file if backend expects it.
// //             exam_group_id: Number(groupId),
// //             number_of_question: Number(questionCount),
// //             total_time: Number(totalTime) * 60,
// //             correct_answer: {},
// //             questions: questions,
// //             description: description ?? "",
// //             file: selectedFile,
// //         };
// //
// //         try {
// //             if (mode === "edit" && examId) {
// //                 await examApi.updateExam(examId, payload);
// //                 alert("Cập nhật đề thành công!");
// //             } else {
// //                 await examApi.createExam(payload);
// //                 alert("Tạo đề thành công!");
// //             }
// //             navigate(-1);
// //         } catch (err) {
// //             console.error("Gửi payload lỗi:", err);
// //             const msg = (err as any)?.response?.data?.message || (err as any)?.message || "Lỗi khi gửi dữ liệu";
// //             alert(msg);
// //         }
// //     };
// //
// //     console.log('selectedFile', selectedFile);
// //
// //
// //     return (
// //         <Box p={2}>
// //             {/* upload area (PDF only) */}
// //             <Paper
// //                 sx={{
// //                     p: 3,
// //                     mb: 3,
// //                     borderRadius: 2,
// //                     minHeight: 220,
// //                     display: "flex",
// //                     alignItems: "center",
// //                     justifyContent: "center",
// //                     bgcolor: "#fafcff",
// //                     border: "1px dashed rgba(38,198,218,0.6)",
// //                 }}
// //             >
// //                 <input
// //                     type="file"
// //                     hidden
// //                     id="upload-pdf"
// //                     accept="application/pdf"
// //                     // id="upload-image"
// //                     // accept="image/*"
// //                     onChange={handlePdfSelect}
// //                 />
// //
// //                 {!fileUrl ? (
// //                     <label htmlFor="upload-pdf" style={{ width: "100%", textAlign: "center" }}>
// //                         <Button
// //                             variant="outlined"
// //                             component="span"
// //                             sx={{
// //                                 textTransform: "none",
// //                                 borderColor: "rgba(0,188,212,0.9)",
// //                                 color: "text.secondary",
// //                                 bgcolor: "transparent",
// //                                 "&:hover": { bgcolor: "rgba(3,169,244,0.06)" },
// //                             }}
// //                         >
// //                             <Box display="flex" alignItems="center" gap={1}>
// //                                 <Box component="span" sx={{ fontSize: 18 }}>⬆</Box>
// //                                 <Box component="span">Tải lên file PDF</Box>
// //                             </Box>
// //                         </Button>
// //                     </label>
// //                 ) : (
// //                     <Box
// //                         mt={2}
// //                         sx={{
// //                             display: "flex",
// //                             gap: 2,
// //                             alignItems: "flex-start",
// //                             width: "100%",
// //                             justifyContent: "center",
// //                             flexDirection: { xs: "column", md: "row" },
// //                         }}
// //                     >
// //                         <Box sx={{ textAlign: "center", width: "100%" }}>
// //                             {/* PDF preview using embed/object */}
// //                             <Box
// //                                 component="embed"
// //                                 src={fileUrl}
// //                                 type="application/pdf"
// //                                 sx={{
// //                                     width: { xs: "100%", md: 800 },
// //                                     height: 420,
// //                                     borderRadius: 1,
// //                                     boxShadow: 1,
// //                                 }}
// //                             />
// //                             <Box mt={1} display="flex" justifyContent="center" gap={2}>
// //                                 <Button
// //                                     variant="text"
// //                                     color="error"
// //                                     onClick={() => {
// //                                         setSelectedFile(null);
// //                                         setFileUrl(null);
// //                                         setFileId(null);
// //                                         setFileType(null);
// //                                     }}
// //                                 >
// //                                     Xóa file
// //                                 </Button>
// //                             </Box>
// //                         </Box>
// //                     </Box>
// //                 )}
// //             </Paper>
// //
// //             {/* form */}
// //             <Paper sx={{ p: 3, borderRadius: 2, bgcolor: "#fff", boxShadow: "none", border: "1px solid #f0f2f5" }}>
// //                 <Grid container spacing={2}>
// //                     <Grid item xs={12} sm={6}>
// //                         <TextField
// //                             label="Tên đề"
// //                             fullWidth
// //                             size="small"
// //                             value={name}
// //                             onChange={(e) => setName(e.target.value)}
// //                             sx={{
// //                                 "& .MuiOutlinedInput-root": {
// //                                     borderRadius: 1.25,
// //                                     "& fieldset": { borderColor: "rgba(38,198,218,0.35)" },
// //                                     "&:hover fieldset": { borderColor: "#00bcd4" },
// //                                     "&.Mui-focused fieldset": { borderColor: "#00bcd4", borderWidth: 1.5 },
// //                                 },
// //                             }}
// //                         />
// //                     </Grid>
// //
// //                     <Grid item xs={12} sm={6}>
// //                         <TextField
// //                             label="Mã đề"
// //                             fullWidth
// //                             size="small"
// //                             value={code}
// //                             onChange={(e) => setCode(e.target.value)}
// //                             variant="outlined"
// //                             sx={{
// //                                 "& .MuiOutlinedInput-root": {
// //                                     borderRadius: 1.25,
// //                                     "& fieldset": { borderColor: "rgba(38,198,218,0.35)" },
// //                                     "&:hover fieldset": { borderColor: "#00bcd4" },
// //                                     "&.Mui-focused fieldset": { borderColor: "#00bcd4", borderWidth: 1.5 },
// //                                 },
// //                             }}
// //                         />
// //                     </Grid>
// //
// //                     <Grid item xs={12} sm={6}>
// //                         <TextField
// //                             label="Thời gian làm bài (phút)"
// //                             type="number"
// //                             fullWidth
// //                             size="small"
// //                             value={totalTime}
// //                             onChange={(e) => setTotalTime(Number(e.target.value))}
// //                             variant="outlined"
// //                             sx={{
// //                                 "& .MuiOutlinedInput-root": {
// //                                     borderRadius: 1.25,
// //                                     "& fieldset": { borderColor: "rgba(38,198,218,0.35)" },
// //                                     "&:hover fieldset": { borderColor: "#00bcd4" },
// //                                     "&.Mui-focused fieldset": { borderColor: "#00bcd4", borderWidth: 1.5 },
// //                                 },
// //                             }}
// //                         />
// //                     </Grid>
// //
// //                     <Grid item xs={12} sm={6}>
// //                         <TextField
// //                             label="Số câu hỏi"
// //                             type="number"
// //                             fullWidth
// //                             size="small"
// //                             value={questionCount}
// //                             onChange={(e) => {
// //                                 const c = Math.max(1, Number(e.target.value || 1));
// //                                 setQuestionCount(c);
// //                                 setQuestionTypes((prev) => {
// //                                     const copy = { ...prev };
// //                                     for (let i = 1; i <= c; i++) if (!copy[i]) copy[i] = "single";
// //                                     return copy;
// //                                 });
// //                             }}
// //                             variant="outlined"
// //                             sx={{
// //                                 "& .MuiOutlinedInput-root": {
// //                                     borderRadius: 1.25,
// //                                     "& fieldset": { borderColor: "rgba(38,198,218,0.35)" },
// //                                     "&:hover fieldset": { borderColor: "#00bcd4" },
// //                                     "&.Mui-focused fieldset": { borderColor: "#00bcd4", borderWidth: 1.5 },
// //                                 },
// //                             }}
// //                         />
// //                     </Grid>
// //
// //                     <Grid item xs={12}>
// //                         <TextField
// //                             label="Mô tả"
// //                             fullWidth
// //                             multiline
// //                             rows={2}
// //                             size="small"
// //                             value={description}
// //                             onChange={(e) => setDescription(e.target.value)}
// //                             variant="outlined"
// //                             sx={{
// //                                 "& .MuiOutlinedInput-root": {
// //                                     borderRadius: 1.25,
// //                                     "& fieldset": { borderColor: "rgba(38,198,218,0.15)" },
// //                                     "&:hover fieldset": { borderColor: "#00bcd4" },
// //                                 },
// //                             }}
// //                         />
// //                     </Grid>
// //
// //                     {/* câu hỏi */}
// //                     {Array.from({ length: questionCount }, (_, i) => (
// //                         <Grid item xs={12} key={i}>
// //                             <Typography fontWeight="bold" mt={2}>
// //                                 Câu {i + 1}
// //                             </Typography>
// //
// //                             <TextField
// //                                 select
// //                                 size="small"
// //                                 fullWidth
// //                                 value={questionTypes[i + 1] || "single"}
// //                                 onChange={(e) => setQuestionTypes((prev) => ({ ...prev, [i + 1]: e.target.value }))}
// //                                 sx={{
// //                                     mb: 1,
// //                                     "& .MuiOutlinedInput-root": {
// //                                         borderRadius: 1.25,
// //                                         "& fieldset": { borderColor: "rgba(38,198,218,0.35)" },
// //                                         "&:hover fieldset": { borderColor: "#00bcd4" },
// //                                         "&.Mui-focused fieldset": { borderColor: "#00bcd4", borderWidth: 1.5 },
// //                                     },
// //                                 }}
// //                             >
// //                                 <MenuItem value="single">Chọn 1 đáp án</MenuItem>
// //                                 <MenuItem value="multi">Chọn nhiều đáp án</MenuItem>
// //                                 <MenuItem value="fill">Điền vào chỗ trống</MenuItem>
// //                             </TextField>
// //
// //                             {questionTypes[i + 1] === "single" && (
// //                                 <RadioGroup
// //                                     row
// //                                     value={singleAnswers[i + 1] || ""}
// //                                     onChange={(e) => setSingleAnswers((prev) => ({ ...prev, [i + 1]: e.target.value }))}
// //                                 >
// //                                     {["A", "B", "C", "D"].map((opt) => (
// //                                         <FormControlLabel key={opt} value={opt} control={<Radio />} label={opt} />
// //                                     ))}
// //                                 </RadioGroup>
// //                             )}
// //
// //                             {questionTypes[i + 1] === "multi" && (
// //                                 <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
// //                                     {["A", "B", "C", "D"].map((opt) => (
// //                                         <FormControlLabel
// //                                             key={opt}
// //                                             control={
// //                                                 <Checkbox
// //                                                     checked={multiAnswers[i + 1]?.includes(opt) || false}
// //                                                     onChange={(e) => {
// //                                                         const checked = e.target.checked;
// //                                                         setMultiAnswers((prev) => {
// //                                                             const cur = prev[i + 1] || [];
// //                                                             return {
// //                                                                 ...prev,
// //                                                                 [i + 1]: checked ? [...cur, opt] : cur.filter((a) => a !== opt),
// //                                                             };
// //                                                         });
// //                                                     }}
// //                                                 />
// //                                             }
// //                                             label={opt}
// //                                         />
// //                                     ))}
// //                                 </Box>
// //                             )}
// //
// //                             {questionTypes[i + 1] === "fill" && (
// //                                 <TextField
// //                                     fullWidth
// //                                     size="small"
// //                                     disabled
// //                                     placeholder="Học sinh tự điền"
// //                                     sx={{
// //                                         mt: 1,
// //                                         "& .MuiOutlinedInput-root": {
// //                                             borderRadius: 1.25,
// //                                             "& fieldset": { borderColor: "rgba(38,198,218,0.35)" },
// //                                         },
// //                                     }}
// //                                 />
// //                             )}
// //                         </Grid>
// //                     ))}
// //
// //                     <Grid item xs={12}>
// //                         <Button variant="contained" color="primary" fullWidth onClick={handleSubmit} sx={{ mt: 1.5 }}>
// //                             {mode === "edit" ? "Cập nhật đề thi" : "Tạo đề thi"}
// //                         </Button>
// //                     </Grid>
// //                 </Grid>
// //             </Paper>
// //         </Box>
// //     );
// // }
//
//
// import {
//     Grid,
//     Typography,
//     TextField,
//     Button,
//     MenuItem,
//     RadioGroup,
//     Radio,
//     FormControlLabel,
//     Paper,
//     Box,
//     Checkbox,
// } from "@mui/material";
// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { examApi } from "@/api/exam.api";
// import type { ExamItem } from "@/types";
//
// interface Props {
//     mode: "create" | "edit";
// }
//
// export default function CreatExamPage({ mode }: Props) {
//     const { examGroupId, examDetailId } = useParams();
//     const navigate = useNavigate();
//
//     const groupId = Number(examGroupId);
//     const examId = Number(examDetailId);
//
//     const [name, setName] = useState("");
//     const [code, setCode] = useState("");
//     const [totalTime, setTotalTime] = useState(0);
//     const [description, setDescription] = useState("");
//     const [questionCount, setQuestionCount] = useState(1);
//     const [questionTypes, setQuestionTypes] = useState<{ [key: number]: string }>({});
//     const [singleAnswers, setSingleAnswers] = useState<{ [key: number]: string }>({});
//     const [multiAnswers, setMultiAnswers] = useState<{ [key: number]: string[] }>({});
//     const [fillAnswers, setFillAnswers] = useState<{ [key: number]: string }>({});
//     // unified file state (PDF file)
//     const [selectedFile, setSelectedFile] = useState<File | null>(null);
//     const [fileUrl, setFileUrl] = useState<string | null>(null);
//     const [fileId, setFileId] = useState<number | null>(null);
//     const [fileType, setFileType] = useState<string | null>(null); // lưu file_type giống bên teacher file
//     const [originalQuestions, setOriginalQuestions] = useState<any[]>([]);
//
//     // helper nếu cần chuyển sang base64 (nên tránh với file lớn)
//     const toBase64 = (file: File): Promise<string> =>
//         new Promise((resolve, reject) => {
//             const reader = new FileReader();
//             reader.readAsDataURL(file);
//             reader.onload = () => resolve((reader.result as string).split(",")[1]);
//             reader.onerror = reject;
//         });
//
//     useEffect(() => {
//         if (mode !== "edit" || !examId) return;
//         const fetchExamDetail = async () => {
//             try {
//                 const data: ExamItem = await examApi.getExamById(examId);
//                 setName(data.name);
//                 setCode(data.code);
//                 setTotalTime(Math.round(data.total_time / 60));
//                 setDescription(data.description);
//                 setQuestionCount(data.number_of_question);
//                 setFileUrl(data.file?.url ?? null);
//                 setFileId(data.file?.id ?? null);
//                 setFileType(data.file?.file_type ?? null);
//                 setOriginalQuestions(data.questions ?? []);
//
//                 const qt: any = {};
//                 const s: any = {};
//                 const m: any = {};
//                 const f: any = {};
//                 (data.questions ?? []).forEach((q, i) => {
//                     const idx = i + 1;
//                     if (q.type === "single-choice") qt[idx] = "single";
//                     else if (q.type === "multiple-choice") qt[idx] = "multi";
//                     else qt[idx] = "fill";
//                     if (qt[idx] === "single") s[idx] = q.correct_answer;
//                     if (qt[idx] === "multi") m[idx] = q.correct_answer?.split(",") || [];
//                     if (qt[idx] === "fill") f[idx] = q.correct_answer;
//                 });
//                 setQuestionTypes(qt);
//                 setSingleAnswers(s);
//                 setMultiAnswers(m);
//                 setFillAnswers(f);
//
//                 console.log('data sua exam', data)
//             } catch (err) {
//                 console.error(err);
//             }
//         };
//         fetchExamDetail();
//     }, [mode, examId]);
//
//     // handle selecting PDF file
//     const handlePdfSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//         // const file: File | null = e.target.files?.[0] ?? null;
//         const f = e.target.files?.[0] ?? null;
//         if (!f) return;
//         if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
//             alert("Vui lòng chọn file PDF");
//             return;
//         }
//         // LƯU file thực để có thể upload nếu cần
//         setSelectedFile(f);
//
//         // preview local (blob:) để hiển thị trong client
//         const preview = URL.createObjectURL(f);
//         setFileUrl(preview);
//
//         setFileType(f.type.split("/")[1] ?? "pdf");
//         console.log('preview blob url:', preview);
//         // NOTE: preview (blob:) chỉ dùng cho client. Nếu backend cần public URL, bạn phải upload file trước và
//         // thay fileUrl bằng link public trả về từ server.
//     };
//
//     const handleSubmit = async () => {
//         // simple validation
//         if (!name.trim()) {
//             alert("Vui lòng nhập tên đề");
//             return;
//         }
//         if (!questionCount || questionCount < 1) {
//             alert("Số câu phải >= 1");
//             return;
//         }
//
//         // build questions array matching backend shape
//         const questions = Array.from({ length: questionCount }, (_, i) => {
//             const idx = i + 1; // 1-based index used in your UI state
//             const uiType = questionTypes[idx] || "single"; // 'single' | 'multi' | 'fill'
//             const type =
//                 uiType === "single"
//                     ? "single-choice"
//                     : uiType === "multi"
//                         ? "multiple-choice"
//                         : "long-response";
//
//             let correct_answer = "";
//             if (uiType === "single") correct_answer = singleAnswers[idx] ?? "";
//             else if (uiType === "multi") correct_answer = (multiAnswers[idx] ?? []).join(",");
//             else correct_answer = fillAnswers[idx] ?? "";
//
//             // keep id if editing existing question (so backend can update)
//             const existing = originalQuestions?.[i]; // originalQuestions from useEffect when loading edit data
//             if (existing && typeof existing.id !== "undefined") {
//                 return {
//                     id: existing.id,
//                     index: i,
//                     type,
//                     correct_answer,
//                 };
//             }
//
//             // new question (no id)
//             return {
//                 index: i,
//                 type,
//                 correct_answer,
//             };
//         });
//
//         // Nếu bạn muốn upload file trước để có link public, thực hiện upload ở đây và set fileUrl/fileId theo response.
//         // Ở flow hiện tại, chúng ta sẽ **gửi chỉ link** (fileUrl) trong payload.
//         const filePayloadObj: any = {
//             id: fileId ?? null,
//             url: fileUrl ?? "", // <-- CHỈ GỬI LINK (blob: preview hoặc public URL nếu bạn đã upload)
//             file_type: fileType ?? "pdf",
//         };
//
//         // final payload shaped like the teacher file expects
//         const payload: any = {
//             id: mode === "edit" ? examId : 0,
//             name: name,
//             code: String(code ?? ""),
//             // IMPORTANT: use field name `exam_group` to match other file if backend expects it.
//             exam_group_id: Number(groupId),
//             number_of_question: Number(questionCount),
//             total_time: Number(totalTime) * 60,
//             correct_answer: {},
//             questions: questions,
//             description: description ?? "",
//             file: selectedFile, // <-- chỉ link (và id nếu có)
//         };
//
//         try {
//             if (mode === "edit" && examId) {
//                 await examApi.updateExam(examId, payload);
//                 alert("Cập nhật đề thành công!");
//             } else {
//                 await examApi.createExam(payload);
//                 alert("Tạo đề thành công!");
//             }
//             navigate(-1);
//         } catch (err) {
//             console.error("Gửi payload lỗi:", err);
//             const msg = (err as any)?.response?.data?.message || (err as any)?.message || "Lỗi khi gửi dữ liệu";
//             alert(msg);
//         }
//     };
//
//     // release blob URL khi unmount / thay file để tránh memory leak
//     useEffect(() => {
//         return () => {
//             if (fileUrl && fileUrl.startsWith("blob:")) URL.revokeObjectURL(fileUrl);
//         };
//     }, [fileUrl]);
//
//     console.log('selectedFile', selectedFile, 'fileUrl', fileUrl);
//
//     return (
//         <Box p={2}>
//             {/* upload area (PDF only) */}
//             <Paper
//                 sx={{
//                     p: 3,
//                     mb: 3,
//                     borderRadius: 2,
//                     minHeight: 220,
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     bgcolor: "#fafcff",
//                     border: "1px dashed rgba(38,198,218,0.6)",
//                 }}
//             >
//                 <input
//                     type="file"
//                     hidden
//                     id="upload-pdf"
//                     accept="application/pdf"
//                     onChange={handlePdfSelect}
//                 />
//
//                 {!fileUrl ? (
//                     <label htmlFor="upload-pdf" style={{ width: "100%", textAlign: "center" }}>
//                         <Button
//                             variant="outlined"
//                             component="span"
//                             sx={{
//                                 textTransform: "none",
//                                 borderColor: "rgba(0,188,212,0.9)",
//                                 color: "text.secondary",
//                                 bgcolor: "transparent",
//                                 "&:hover": { bgcolor: "rgba(3,169,244,0.06)" },
//                             }}
//                         >
//                             <Box display="flex" alignItems="center" gap={1}>
//                                 <Box component="span" sx={{ fontSize: 18 }}>⬆</Box>
//                                 <Box component="span">Tải lên file PDF</Box>
//                             </Box>
//                         </Button>
//                     </label>
//                 ) : (
//                     <Box
//                         mt={2}
//                         sx={{
//                             display: "flex",
//                             gap: 2,
//                             alignItems: "flex-start",
//                             width: "100%",
//                             justifyContent: "center",
//                             flexDirection: { xs: "column", md: "row" },
//                         }}
//                     >
//                         <Box sx={{ textAlign: "center", width: "100%" }}>
//                             {/* PDF preview using embed/object */}
//                             <Box
//                                 component="embed"
//                                 src={fileUrl}
//                                 type="application/pdf"
//                                 sx={{
//                                     width: { xs: "100%", md: 800 },
//                                     height: 420,
//                                     borderRadius: 1,
//                                     boxShadow: 1,
//                                 }}
//                             />
//                             <Box mt={1} display="flex" justifyContent="center" gap={2}>
//                                 <Button
//                                     variant="text"
//                                     color="error"
//                                     onClick={() => {
//                                         setSelectedFile(null);
//                                         setFileUrl(null);
//                                         setFileId(null);
//                                         setFileType(null);
//                                     }}
//                                 >
//                                     Xóa file
//                                 </Button>
//                             </Box>
//                         </Box>
//                     </Box>
//                 )}
//             </Paper>
//
//             {/* form */}
//             <Paper sx={{ p: 3, borderRadius: 2, bgcolor: "#fff", boxShadow: "none", border: "1px solid #f0f2f5" }}>
//                 <Grid container spacing={2}>
//                     <Grid item xs={12} sm={6}>
//                         <TextField
//                             label="Tên đề"
//                             fullWidth
//                             size="small"
//                             value={name}
//                             onChange={(e) => setName(e.target.value)}
//                             sx={{
//                                 "& .MuiOutlinedInput-root": {
//                                     borderRadius: 1.25,
//                                     "& fieldset": { borderColor: "rgba(38,198,218,0.35)" },
//                                     "&:hover fieldset": { borderColor: "#00bcd4" },
//                                     "&.Mui-focused fieldset": { borderColor: "#00bcd4", borderWidth: 1.5 },
//                                 },
//                             }}
//                         />
//                     </Grid>
//
//                     <Grid item xs={12} sm={6}>
//                         <TextField
//                             label="Mã đề"
//                             fullWidth
//                             size="small"
//                             value={code}
//                             onChange={(e) => setCode(e.target.value)}
//                             variant="outlined"
//                             sx={{
//                                 "& .MuiOutlinedInput-root": {
//                                     borderRadius: 1.25,
//                                     "& fieldset": { borderColor: "rgba(38,198,218,0.35)" },
//                                     "&:hover fieldset": { borderColor: "#00bcd4" },
//                                     "&.Mui-focused fieldset": { borderColor: "#00bcd4", borderWidth: 1.5 },
//                                 },
//                             }}
//                         />
//                     </Grid>
//
//                     <Grid item xs={12} sm={6}>
//                         <TextField
//                             label="Thời gian làm bài (phút)"
//                             type="number"
//                             fullWidth
//                             size="small"
//                             value={totalTime}
//                             onChange={(e) => setTotalTime(Number(e.target.value))}
//                             variant="outlined"
//                             sx={{
//                                 "& .MuiOutlinedInput-root": {
//                                     borderRadius: 1.25,
//                                     "& fieldset": { borderColor: "rgba(38,198,218,0.35)" },
//                                     "&:hover fieldset": { borderColor: "#00bcd4" },
//                                     "&.Mui-focused fieldset": { borderColor: "#00bcd4", borderWidth: 1.5 },
//                                 },
//                             }}
//                         />
//                     </Grid>
//
//                     <Grid item xs={12} sm={6}>
//                         <TextField
//                             label="Số câu hỏi"
//                             type="number"
//                             fullWidth
//                             size="small"
//                             value={questionCount}
//                             onChange={(e) => {
//                                 const c = Math.max(1, Number(e.target.value || 1));
//                                 setQuestionCount(c);
//                                 setQuestionTypes((prev) => {
//                                     const copy = { ...prev };
//                                     for (let i = 1; i <= c; i++) if (!copy[i]) copy[i] = "single";
//                                     return copy;
//                                 });
//                             }}
//                             variant="outlined"
//                             sx={{
//                                 "& .MuiOutlinedInput-root": {
//                                     borderRadius: 1.25,
//                                     "& fieldset": { borderColor: "rgba(38,198,218,0.35)" },
//                                     "&:hover fieldset": { borderColor: "#00bcd4" },
//                                     "&.Mui-focused fieldset": { borderColor: "#00bcd4", borderWidth: 1.5 },
//                                 },
//                             }}
//                         />
//                     </Grid>
//
//                     <Grid item xs={12}>
//                         <TextField
//                             label="Mô tả"
//                             fullWidth
//                             multiline
//                             rows={2}
//                             size="small"
//                             value={description}
//                             onChange={(e) => setDescription(e.target.value)}
//                             variant="outlined"
//                             sx={{
//                                 "& .MuiOutlinedInput-root": {
//                                     borderRadius: 1.25,
//                                     "& fieldset": { borderColor: "rgba(38,198,218,0.15)" },
//                                     "&:hover fieldset": { borderColor: "#00bcd4" },
//                                 },
//                             }}
//                         />
//                     </Grid>
//
//                     {/* câu hỏi */}
//                     {Array.from({ length: questionCount }, (_, i) => (
//                         <Grid item xs={12} key={i}>
//                             <Typography fontWeight="bold" mt={2}>
//                                 Câu {i + 1}
//                             </Typography>
//
//                             <TextField
//                                 select
//                                 size="small"
//                                 fullWidth
//                                 value={questionTypes[i + 1] || "single"}
//                                 onChange={(e) => setQuestionTypes((prev) => ({ ...prev, [i + 1]: e.target.value }))}
//                                 sx={{
//                                     mb: 1,
//                                     "& .MuiOutlinedInput-root": {
//                                         borderRadius: 1.25,
//                                         "& fieldset": { borderColor: "rgba(38,198,218,0.35)" },
//                                         "&:hover fieldset": { borderColor: "#00bcd4" },
//                                         "&.Mui-focused fieldset": { borderColor: "#00bcd4", borderWidth: 1.5 },
//                                     },
//                                 }}
//                             >
//                                 <MenuItem value="single">Chọn 1 đáp án</MenuItem>
//                                 <MenuItem value="multi">Chọn nhiều đáp án</MenuItem>
//                                 <MenuItem value="fill">Điền vào chỗ trống</MenuItem>
//                             </TextField>
//
//                             {questionTypes[i + 1] === "single" && (
//                                 <RadioGroup
//                                     row
//                                     value={singleAnswers[i + 1] || ""}
//                                     onChange={(e) => setSingleAnswers((prev) => ({ ...prev, [i + 1]: e.target.value }))}
//                                 >
//                                     {["A", "B", "C", "D"].map((opt) => (
//                                         <FormControlLabel key={opt} value={opt} control={<Radio />} label={opt} />
//                                     ))}
//                                 </RadioGroup>
//                             )}
//
//                             {questionTypes[i + 1] === "multi" && (
//                                 <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
//                                     {["A", "B", "C", "D"].map((opt) => (
//                                         <FormControlLabel
//                                             key={opt}
//                                             control={
//                                                 <Checkbox
//                                                     checked={multiAnswers[i + 1]?.includes(opt) || false}
//                                                     onChange={(e) => {
//                                                         const checked = e.target.checked;
//                                                         setMultiAnswers((prev) => {
//                                                             const cur = prev[i + 1] || [];
//                                                             return {
//                                                                 ...prev,
//                                                                 [i + 1]: checked ? [...cur, opt] : cur.filter((a) => a !== opt),
//                                                             };
//                                                         });
//                                                     }}
//                                                 />
//                                             }
//                                             label={opt}
//                                         />
//                                     ))}
//                                 </Box>
//                             )}
//
//                             {questionTypes[i + 1] === "fill" && (
//                                 <TextField
//                                     fullWidth
//                                     size="small"
//                                     disabled
//                                     placeholder="Học sinh tự điền"
//                                     sx={{
//                                         mt: 1,
//                                         "& .MuiOutlinedInput-root": {
//                                             borderRadius: 1.25,
//                                             "& fieldset": { borderColor: "rgba(38,198,218,0.35)" },
//                                         },
//                                     }}
//                                 />
//                             )}
//                         </Grid>
//                     ))}
//
//                     <Grid item xs={12}>
//                         <Button variant="contained" color="primary" fullWidth onClick={handleSubmit} sx={{ mt: 1.5 }}>
//                             {mode === "edit" ? "Cập nhật đề thi" : "Tạo đề thi"}
//                         </Button>
//                     </Grid>
//                 </Grid>
//             </Paper>
//         </Box>
//     );
// }

import {
    Grid,
    Typography,
    TextField,
    Button,
    MenuItem,
    RadioGroup,
    Radio,
    FormControlLabel,
    Paper,
    Box,
    Checkbox,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {apiClient} from "@/api/axios.ts"
import { examApi } from "@/api/exam.api"; // dùng để lấy detail khi edit
import type { ExamItem } from "@/types";

interface Props {
    mode: "create" | "edit";
}

export default function CreatExamPage({ mode }: Props) {
    const { examGroupId, examDetailId } = useParams();
    const navigate = useNavigate();

    const groupId = Number(examGroupId);
    const examId = Number(examDetailId);

    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [totalTime, setTotalTime] = useState(0);
    const [description, setDescription] = useState("");
    const [questionCount, setQuestionCount] = useState(1);
    const [questionTypes, setQuestionTypes] = useState<{ [key: number]: string }>({});
    const [singleAnswers, setSingleAnswers] = useState<{ [key: number]: string }>({});
    const [multiAnswers, setMultiAnswers] = useState<{ [key: number]: string[] }>({});
    const [fillAnswers, setFillAnswers] = useState<{ [key: number]: string }>({});
    // unified file state (PDF file)
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [fileId, setFileId] = useState<number | null>(null);
    const [fileType, setFileType] = useState<string | null>(null); // lưu file_type giống bên teacher file
    const [originalQuestions, setOriginalQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // // Create axios instance with correct baseURL (prefer environment variable)
    // const api = axios.create({
    //     baseURL: (import.meta.env && import.meta.env.VITE_API_BASE) ? (import.meta.env.VITE_API_BASE as string) : "http://localhost:3000",
    //     // bạn có thể thêm headers mặc định ở đây nếu cần (eg. Authorization)
    //     // headers: { Accept: 'application/json' }
    // });
    //
    // // helper nếu cần chuyển sang base64 (nên tránh với file lớn)
    // const toBase64 = (file: File): Promise<string> =>
    //     new Promise((resolve, reject) => {
    //         const reader = new FileReader();
    //         reader.readAsDataURL(file);
    //         reader.onload = () => resolve((reader.result as string).split(",")[1]);
    //         reader.onerror = reject;
    //     });

    useEffect(() => {
        if (mode !== "edit" || !examId) return;
        const fetchExamDetail = async () => {
            try {
                const data: ExamItem = await examApi.getExamById(examId);
                setName(data.name);
                setCode(data.code);
                setTotalTime(Math.round((data.total_time ?? 0) / 60));
                setDescription(data.description ?? "");
                setQuestionCount(data.number_of_question ?? 1);
                setFileUrl(data.file?.url ?? null);
                setFileId(data.file?.id ?? null);
                setFileType(data.file?.file_type ?? null);
                setOriginalQuestions(data.questions ?? []);

                const qt: any = {};
                const s: any = {};
                const m: any = {};
                const f: any = {};
                (data.questions ?? []).forEach((q, i) => {
                    const idx = i + 1;
                    if (q.type === "single-choice") qt[idx] = "single";
                    else if (q.type === "multiple-choice") qt[idx] = "multi";
                    else qt[idx] = "fill";
                    if (qt[idx] === "single") s[idx] = q.correct_answer;
                    if (qt[idx] === "multi") m[idx] = q.correct_answer?.split(",") || [];
                    if (qt[idx] === "fill") f[idx] = q.correct_answer;
                });
                setQuestionTypes(qt);
                setSingleAnswers(s);
                setMultiAnswers(m);
                setFillAnswers(f);
            } catch (err) {
                console.error(err);
            }
        };
        fetchExamDetail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode, examId]);

    // handle selecting PDF file
    const handlePdfSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] ?? null;
        if (!f) return;
        if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
            alert("Vui lòng chọn file PDF");
            return;
        }

        // LƯU file thực để upload
        setSelectedFile(f);

        // preview local (blob:) để hiển thị trong client
        const preview = URL.createObjectURL(f);
        // nếu có preview trước đó, revoke để tránh leak
        if (fileUrl && fileUrl.startsWith("blob:")) {
            URL.revokeObjectURL(fileUrl);
        }
        setFileUrl(preview);

        setFileType(f.type.split("/")[1] ?? "pdf");
        console.log("preview blob url:", preview);
    };

    // release blob URL khi unmount / thay file để tránh memory leak
    useEffect(() => {
        return () => {
            if (fileUrl && fileUrl.startsWith("blob:")) URL.revokeObjectURL(fileUrl);
        };
    }, [fileUrl]);

    const buildQuestions = () =>
        Array.from({ length: questionCount }, (_, i) => {
            const idx = i + 1; // 1-based index used in your UI state
            const uiType = questionTypes[idx] || "single"; // 'single' | 'multi' | 'fill'
            const type =
                uiType === "single" ? "single-choice" : uiType === "multi" ? "multiple-choice" : "long-response";

            let correct_answer = "";
            if (uiType === "single") correct_answer = singleAnswers[idx] ?? "";
            else if (uiType === "multi") correct_answer = (multiAnswers[idx] ?? []).join(",");
            else correct_answer = fillAnswers[idx] ?? "";

            // keep id if editing existing question (so backend can update)
            const existing = originalQuestions?.[i]; // originalQuestions from useEffect when loading edit data
            if (existing && typeof existing.id !== "undefined") {
                return {
                    id: existing.id,
                    index: i,
                    type,
                    correct_answer,
                };
            }

            // new question (no id)
            return {
                index: i,
                type,
                correct_answer,
            };
        });

    const handleSubmit = async () => {
        if (!name.trim()) {
            alert("Vui lòng nhập tên đề");
            return;
        }
        if (!questionCount || questionCount < 1) {
            alert("Số câu phải >= 1");
            return;
        }

        const questions = buildQuestions();

        setLoading(true);
        try {
            // CHÚ Ý: endpoint path có thể khác trong project của bạn.
            // Mặc định mình dùng:
            //  - create: POST /api/exams
            //  - update: PUT /api/exams/:id
            const urlCreate = "/exams";
            const urlUpdate = `/exams/${examId}`;

            // Sử dụng FormData để gửi file + các field khác
            const form = new FormData();

            // append file nếu có
            if (selectedFile) {
                form.append("examFile", selectedFile); // key 'file' tuỳ backend; đổi nếu backend yêu cầu tên khác
            } else if (fileId) {
                // nếu không có selectedFile mới nhưng có fileId (edit case), bạn có thể gửi id để backend giữ liên kết
                form.append("file_id", String(fileId));
            }

            // các field cơ bản
            form.append("name", name);
            form.append("code", String(code ?? ""));
            form.append("exam_group_id", String(groupId));
            form.append("number_of_question", String(questionCount));
            form.append("total_time", String(Number(totalTime) * 60));
            form.append("description", description ?? "");

            // questions: backend thường muốn object/array => gửi JSON string
            form.append("questions", JSON.stringify(questions));

            // nếu backend mong muốn một field 'correct_answer' hoặc payload khác, append thêm tương ứng
            form.append("correct_answer", JSON.stringify({}));

            // gửi request (multipart/form-data) sử dụng instance `api` có baseURL đúng
            if (mode === "edit" && examId) {
                await apiClient.put(urlUpdate, form, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                alert("Cập nhật đề thành công!");
            } else {
                await apiClient.post(urlCreate, form, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                alert("Tạo đề thành công!");
            }

            navigate(-1);
        } catch (err: any) {
            console.error("Gửi payload lỗi:", err);
            const msg = err?.response?.data?.message || err?.message || "Lỗi khi gửi dữ liệu";
            alert(msg);
        } finally {
            setLoading(false);
        }
    };
    console.log('selectedFile', selectedFile);

    return (
        <Box p={2}>
            {/* upload area (PDF only) */}
            <Paper
                sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 2,
                    minHeight: 220,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "#fafcff",
                    border: "1px dashed rgba(38,198,218,0.6)",
                }}
            >
                <input type="file" hidden id="upload-pdf" accept="application/pdf" onChange={handlePdfSelect} />

                {!fileUrl ? (
                    <label htmlFor="upload-pdf" style={{ width: "100%", textAlign: "center" }}>
                        <Button
                            variant="outlined"
                            component="span"
                            sx={{
                                textTransform: "none",
                                borderColor: "rgba(0,188,212,0.9)",
                                color: "text.secondary",
                                bgcolor: "transparent",
                                "&:hover": { bgcolor: "rgba(3,169,244,0.06)" },
                            }}
                        >
                            <Box display="flex" alignItems="center" gap={1}>
                                <Box component="span" sx={{ fontSize: 18 }}>
                                    ⬆
                                </Box>
                                <Box component="span">Tải lên file PDF</Box>
                            </Box>
                        </Button>
                    </label>
                ) : (
                    <Box
                        mt={2}
                        sx={{
                            display: "flex",
                            gap: 2,
                            alignItems: "flex-start",
                            width: "100%",
                            justifyContent: "center",
                            flexDirection: { xs: "column", md: "row" },
                        }}
                    >
                        <Box sx={{ textAlign: "center", width: "100%" }}>
                            {/* PDF preview using embed/object */}
                            <Box
                                component="embed"
                                src={fileUrl as string}
                                type="application/pdf"
                                sx={{
                                    width: { xs: "100%", md: 800 },
                                    height: 420,
                                    borderRadius: 1,
                                    boxShadow: 1,
                                }}
                            />
                            <Box mt={1} display="flex" justifyContent="center" gap={2}>
                                <Button
                                    variant="text"
                                    color="error"
                                    onClick={() => {
                                        // revoke blob if present
                                        if (fileUrl && fileUrl.startsWith("blob:")) URL.revokeObjectURL(fileUrl);
                                        setSelectedFile(null);
                                        setFileUrl(null);
                                        setFileId(null);
                                        setFileType(null);
                                    }}
                                >
                                    Xóa file
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                )}
            </Paper>

            {/* form */}
            <Paper sx={{ p: 3, borderRadius: 2, bgcolor: "#fff", boxShadow: "none", border: "1px solid #f0f2f5" }}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            label="Tên đề"
                            fullWidth
                            size="small"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            // variant="outlined"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 1.25,
                                    "& fieldset": { borderColor: "rgba(38,198,218,0.35)" },
                                    "&:hover fieldset": { borderColor: "#00bcd4" },
                                    "&.Mui-focused fieldset": { borderColor: "#00bcd4", borderWidth: 1.5 },
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            label="Mã đề"
                            fullWidth
                            size="small"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            variant="outlined"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 1.25,
                                    "& fieldset": { borderColor: "rgba(38,198,218,0.35)" },
                                    "&:hover fieldset": { borderColor: "#00bcd4" },
                                    "&.Mui-focused fieldset": { borderColor: "#00bcd4", borderWidth: 1.5 },
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            label="Thời gian làm bài (phút)"
                            type="number"
                            fullWidth
                            size="small"
                            value={totalTime}
                            onChange={(e) => setTotalTime(Number(e.target.value))}
                            variant="outlined"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 1.25,
                                    "& fieldset": { borderColor: "rgba(38,198,218,0.35)" },
                                    "&:hover fieldset": { borderColor: "#00bcd4" },
                                    "&.Mui-focused fieldset": { borderColor: "#00bcd4", borderWidth: 1.5 },
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            label="Số câu hỏi"
                            type="number"
                            fullWidth
                            size="small"
                            value={questionCount}
                            onChange={(e) => {
                                const c = Math.max(1, Number(e.target.value || 1));
                                setQuestionCount(c);
                                setQuestionTypes((prev) => {
                                    const copy = { ...prev };
                                    for (let i = 1; i <= c; i++) if (!copy[i]) copy[i] = "single";
                                    return copy;
                                });
                            }}
                            variant="outlined"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 1.25,
                                    "& fieldset": { borderColor: "rgba(38,198,218,0.35)" },
                                    "&:hover fieldset": { borderColor: "#00bcd4" },
                                    "&.Mui-focused fieldset": { borderColor: "#00bcd4", borderWidth: 1.5 },
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <TextField
                            label="Mô tả"
                            fullWidth
                            multiline
                            rows={2}
                            size="small"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            variant="outlined"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 1.25,
                                    "& fieldset": { borderColor: "rgba(38,198,218,0.15)" },
                                    "&:hover fieldset": { borderColor: "#00bcd4" },
                                },
                            }}
                        />
                    </Grid>

                    {/* câu hỏi */}
                    {Array.from({ length: questionCount }, (_, i) => (
                        <Grid size={{ xs: 12 }} key={i}>
                            <Typography fontWeight="bold" mt={2}>
                                Câu {i + 1}
                            </Typography>

                            <TextField
                                select
                                size="small"
                                fullWidth
                                value={questionTypes[i + 1] || "single"}
                                onChange={(e) => setQuestionTypes((prev) => ({ ...prev, [i + 1]: e.target.value }))}
                                sx={{
                                    mb: 1,
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

                            {questionTypes[i + 1] === "single" && (
                                <RadioGroup
                                    row
                                    value={singleAnswers[i + 1] || ""}
                                    onChange={(e) => setSingleAnswers((prev) => ({ ...prev, [i + 1]: e.target.value }))}
                                >
                                    {["A", "B", "C", "D"].map((opt) => (
                                        <FormControlLabel key={opt} value={opt} control={<Radio />} label={opt} />
                                    ))}
                                </RadioGroup>
                            )}

                            {questionTypes[i + 1] === "multi" && (
                                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                    {["A", "B", "C", "D"].map((opt) => (
                                        <FormControlLabel
                                            key={opt}
                                            control={
                                                <Checkbox
                                                    checked={multiAnswers[i + 1]?.includes(opt) || false}
                                                    onChange={(e) => {
                                                        const checked = e.target.checked;
                                                        setMultiAnswers((prev) => {
                                                            const cur = prev[i + 1] || [];
                                                            return {
                                                                ...prev,
                                                                [i + 1]: checked ? [...cur, opt] : cur.filter((a) => a !== opt),
                                                            };
                                                        });
                                                    }}
                                                />
                                            }
                                            label={opt}
                                        />
                                    ))}
                                </Box>
                            )}

                            {questionTypes[i + 1] === "fill" && (
                                <TextField
                                    fullWidth
                                    size="small"
                                    disabled // Disable luôn input vì không cần nhập
                                    placeholder="Học sinh tự điền"
                                    sx={{
                                        mt: 1,
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 1.25,
                                            "& fieldset": { borderColor: "rgba(38,198,218,0.35)" },
                                        },
                                    }}
                                />
                            )}
                        </Grid>
                    ))}

                    <Grid size={{ xs: 12 }}>
                        <Button variant="contained" color="primary" fullWidth onClick={handleSubmit} sx={{ mt: 1.5 }}>
                            {mode === "edit" ? "Cập nhật đề thi" : "Tạo đề thi"}
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
}
