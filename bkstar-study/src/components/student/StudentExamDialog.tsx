import {Box, Button, Grid, Typography} from "@mui/material";

interface StudentExamDialogProps {
    timeLeft: number,
    isOpenDialog: boolean,
    setIsOpenDialog: (isOpenDialog: boolean) => void,
    onSubmit: () => void,
    handleBackToExamGroupDetail: () => void
}

export default function StudentExamDialog({
                                              timeLeft,
                                              isOpenDialog,
                                              setIsOpenDialog,
                                              onSubmit,
                                              handleBackToExamGroupDetail
                                          }: StudentExamDialogProps) {

    const onSubmitEarly = async ()=>{
        await onSubmit();
        handleBackToExamGroupDetail();
    }

    return (
        <>
            {/* Dark transparent overlay */}
            <Box sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(4px)',
                zIndex: 1000,

                display: isOpenDialog ? 'block' : 'none'
            }}/>

            {/* Dialog content */}
            {
                timeLeft > 0
                    ? ( // require user to confirm early submission
                        <Box sx={{
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '90%',
                            maxWidth: '450px',
                            backgroundColor: 'background.paper',
                            borderRadius: '10px',
                            zIndex: 1001,
                            p: 2,

                            display: isOpenDialog ? 'block' : 'none'
                        }}>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                <Typography variant="h5" component="h2" sx={{
                                    fontWeight: 600,
                                    mb: 1
                                }}>
                                    ⚠️ Xác nhận nộp bài
                                </Typography>
                            </Box>

                            <Typography variant="body1" component="p" sx={{mt: 3}}>
                                Chưa hết thời gian làm bài, bạn có muốn nộp bài sớm ?
                            </Typography>

                            {/* Buttons */}
                            <Grid container sx={{mt: 3, mb: 2}} spacing={2}>

                                <Grid size={{xs: 6}}>
                                    <Button
                                        fullWidth variant={'outlined'}
                                        color={'primary'}
                                        sx={{
                                            fontWeight: 600,
                                            borderRadius: '10px',
                                        }}
                                        onClick={() => setIsOpenDialog(false)}
                                    >
                                        Hủy
                                    </Button>
                                </Grid>

                                <Grid size={{xs: 6}}>
                                    <Button
                                        fullWidth variant={'contained'}
                                        color={'primary'}
                                        sx={{
                                            fontWeight: 600,
                                            borderRadius: '10px',
                                        }}
                                        onClick={onSubmitEarly}
                                    >
                                        Xác nhận
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    ) : ( // guide user to return to the exam group page
                        <Box sx={{
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '90%',
                            maxWidth: '450px',
                            backgroundColor: 'background.paper',
                            borderRadius: '10px',
                            zIndex: 1001,
                            p: 2,

                            display: isOpenDialog ? 'block' : 'none'
                        }}>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                <Typography variant="h5" component="h2" sx={{
                                    fontWeight: 600,
                                    mb: 1
                                }}>
                                    ⚠️ Đã hết thời gian làm bài!
                                </Typography>
                            </Box>

                            <Box sx={{textAlign: 'center'}}>
                                <Typography variant="h6" component="p">
                                    Đáp án đã được ghi lại.
                                </Typography>
                            </Box>

                            {/* Buttons */}
                            <Button
                                fullWidth variant={'contained'}
                                color={'primary'}
                                sx={{
                                    fontWeight: 600,
                                    borderRadius: '10px',
                                    mt: 3,
                                    mb: 1,
                                    width: '100%'
                                }}
                                onClick={handleBackToExamGroupDetail}
                            >
                                Tiếp tục
                            </Button>
                        </Box>
                    )
            }
        </>
    )
}