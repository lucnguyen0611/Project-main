import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import type { ExamGroup, ExamWithStatus, Exam, ApiExamResult } from "@/types";
import { useAuth } from "@/contexts";
import { examGroupApi, examResultApi, examApi } from "@/api";

interface ExamFlowContextType {
    isLoading: boolean;
    examsWithStatus: ExamWithStatus[];
    examGroupDetail?: ExamGroup;
    awaitingTime: number;
    isUnlocking: boolean;
    startUnlockTimer: (completedExamId: number) => void;
    initializeExamData: (examGroupId: number) => Promise<void>;
}

const ExamFlowContext = createContext<ExamFlowContextType | undefined>(undefined);

export function ExamFlowProvider({ children }: { children: ReactNode }) {
    const navigate = useNavigate();
    const { user, accessToken } = useAuth();

    const [isLoading, setIsLoading] = useState(true);
    const [examGroupDetail, setExamGroupDetail] = useState<ExamGroup>();
    const [examsWithStatus, setExamsWithStatus] = useState<ExamWithStatus[]>([]);
    const [awaitingTime, setAwaitingTime] = useState(-1);
    const [isUnlocking, setIsUnlocking] = useState(false);
    const [activeExamGroupId, setActiveExamGroupId] = useState<number | null>(null);

    // Tạo key lưu trong localStorage để quản lý thời gian mở khóa
    const getUnlockStorageKey = (userId: number, examGroupId: number) =>
        `unlock-${userId}-${examGroupId}`;

    // Áp dụng trạng thái locked/unlocked/unlocking cho danh sách đề
    const applyUnlockLogic = (
        exams: Exam[],
        examResults: ApiExamResult[],
        examGroup: ExamGroup,
        userId: number,
        examGroupId: number
    ): ExamWithStatus[] => {
        // Đánh dấu các đề là completed nếu tồn tại examResults cho exam.id, ngược lại locked
        let processed = exams.map((exam) => ({
            ...exam,
            status: examResults.some((r) => r.exam === exam.id) ? "completed" : "locked",
        }));

        // 2. Kiểm tra xem có đề nào đang mở khóa theo localStorage không
        const unlockKey = getUnlockStorageKey(userId, examGroupId);
        const unlockData = JSON.parse(localStorage.getItem(unlockKey) || "null");

        // Lấy unlockData từ localStorage — parse JSON: { examId, start } (start là timestamp).
        if (unlockData) {
            const elapsed = Math.floor((Date.now() - unlockData.start) / 1000);
            const remaining = examGroup.await_time - elapsed;

            // Mở khóa sau remaining giây "unlocking"
            if (remaining > 0) {
                processed = processed.map((exam) =>
                    exam.id === unlockData.examId ? { ...exam, status: "unlocking" } : exam
                );
                setIsUnlocking(true);
                setAwaitingTime(remaining);
            } else {
                // Mở khóa "unlocked"
                processed = processed.map((exam) =>
                    exam.id === unlockData.examId ? { ...exam, status: "unlocked" } : exam
                );
                localStorage.removeItem(unlockKey);
            }
        } else {
            // 3. Nếu không có unlockData thì mở khóa bài đầu tiên chưa làm
            const firstLockedIndex = processed.findIndex((e) => e.status === "locked");
            if (firstLockedIndex !== -1) processed[firstLockedIndex].status = "unlocked";
        }

        return processed;
    };

    //  Hàm khởi tạo dữ liệu Exam Group + Danh sách đề + Kết quả bài thi
    const initializeExamData = useCallback(
        async (examGroupId: number) => {
            // if (!examGroupId) return;
            // if (!accessToken) {
            //     navigate("/login");
            //     return;
            // }

            setIsLoading(true);
            setActiveExamGroupId(examGroupId);

            try {
                const currentUserId = Number(user?.id);

                const [groupData, examList, examResults] = await Promise.all([
                    examGroupApi.getExamGroup(examGroupId),
                    examApi.getExams(examGroupId),
                    examResultApi.getByStudentAndExamGroup(currentUserId, examGroupId),
                ]);

                setExamGroupDetail(groupData);

                const processed = applyUnlockLogic(
                    examList,
                    examResults,
                    groupData,
                    currentUserId,
                    examGroupId
                );

                setExamsWithStatus(processed);
            } catch (error) {
                console.error("❌ Error loading exam flow:", error);
            } finally {
                setIsLoading(false);
            }
        },
        [accessToken, user, navigate]
    );

    // Hàm bắt đầu đếm ngược để mở khóa bài tiếp theo sau khi hoàn thành một bài
    const startUnlockTimer = useCallback(
        (completedExamId: number) => {
            if (!examGroupDetail || !user || !activeExamGroupId) return;

            const userId = user.id;
            const unlockKey = getUnlockStorageKey(userId, activeExamGroupId);

            setExamsWithStatus((prev) => {
                const nextLockedExam = prev.find((e) => e.status === "locked");

                if (nextLockedExam) {
                    // Lưu thời điểm bắt đầu mở khóa
                    localStorage.setItem(
                        unlockKey,
                        JSON.stringify({ examId: nextLockedExam.id, start: Date.now() })
                    );
                    setIsUnlocking(true);
                    setAwaitingTime(examGroupDetail.await_time);
                }

                return prev.map((exam) =>
                    exam.id === completedExamId
                        ? { ...exam, status: "completed" }
                        : nextLockedExam && exam.id === nextLockedExam.id
                            ? { ...exam, status: "unlocking" }
                            : exam
                );
            });
        },
        [examGroupDetail, user, activeExamGroupId]
    );

    // Đếm ngược thời gian mở khóa
    useEffect(() => {
        if (!isUnlocking || awaitingTime <= 0) return;

        const timer = setInterval(() => {
            setAwaitingTime((t) => {
                if (t <= 1) {
                    // time up -> finalize unlock
                    setExamsWithStatus((prev) => {
                        // tìm exam đang unlocking dựa trên prev
                        const unlockingExam = prev.find((e) => e.status === "unlocking");
                        if (!unlockingExam) return prev;

                        // remove localStorage key
                        if (user && activeExamGroupId) {
                            localStorage.removeItem(getUnlockStorageKey(user.id, activeExamGroupId));
                        }

                        // chuyển trạng thái
                        const next = prev.map((ex) =>
                            ex.id === unlockingExam.id ? { ...ex, status: "unlocked" } : ex
                        );

                        // tắt unlocking flag
                        setIsUnlocking(false);
                        return next;
                    });

                    return 0;
                }
                return t - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isUnlocking, awaitingTime, user, activeExamGroupId]);

    const value: ExamFlowContextType = {
        isLoading,
        examsWithStatus,
        examGroupDetail,
        awaitingTime,
        isUnlocking,
        startUnlockTimer,
        initializeExamData,
    };

    return <ExamFlowContext.Provider value={value}>{children}</ExamFlowContext.Provider>;
}

// Custom hook để dùng context
export const useExamFlow = () => {
    const context = useContext(ExamFlowContext);
    if (!context) {
        throw new Error("useExamFlow must be used inside an ExamFlowProvider");
    }
    return context;
};
