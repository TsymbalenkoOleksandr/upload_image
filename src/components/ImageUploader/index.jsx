import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import {
    Box,
    Typography,
    Button,
    Dialog,
    DialogContent,
    IconButton,
    CircularProgress,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CloudQueueRoundedIcon from '@mui/icons-material/CloudQueueRounded';

const URL_1 = 'https://your-api-endpoint.com/upload'; // replace this

export default function ImageUploadDialog({ onClose }) {
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    const onDrop = useCallback((acceptedFiles) => {
        setFile(acceptedFiles[0]);
        setPreviewUrl(null);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
    });

    const handleUpload = async () => {
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);
        try {
            const response = await axios.post(URL_1, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                responseType: 'blob',
            });

            const blob = new Blob([response.data], { type: 'image/png' });
            const imgUrl = URL.createObjectURL(blob);
            setPreviewUrl(imgUrl);
        } catch (e) {
            alert('Upload failed!', e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open onClose={onClose} fullWidth maxWidth="sm">
            <DialogContent
                sx={{
                    bgcolor: '#fff',
                    p: 4,
                    position: 'relative',
                    borderRadius: 2,
                }}
            >
                <IconButton
                    onClick={onClose}
                    sx={{ position: 'absolute', top: 16, right: 16 }}
                >
                    <CloseRoundedIcon />
                </IconButton>

                <Typography variant="h6" mb={3}>
                    Upload shot
                </Typography>

                <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography variant="body2">
                        <strong>Images</strong>
                        <br /> PNG, JPG, GIF
                    </Typography>
                    <Typography variant="body2">
                        <strong>GIFs</strong>
                        <br /> 800x600 or 400x300
                    </Typography>
                    <Typography variant="body2">
                        <strong>Videos</strong>
                        <br /> MP4, 4:3, up to 24 sec
                    </Typography>
                </Box>

                <Box
                    {...getRootProps()}
                    sx={{
                        border: '2px dashed #e91e63',
                        borderRadius: 2,
                        p: 5,
                        textAlign: 'center',
                        color: isDragActive ? '#e91e63' : 'text.secondary',
                        cursor: 'pointer',
                    }}
                >
                    <input {...getInputProps()} />
                    <CloudQueueRoundedIcon sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="body1">
                        Drag & drop to upload <br />
                        <Typography
                            component="span"
                            sx={{ color: '#e91e63', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                            or browse
                        </Typography>
                    </Typography>
                </Box>

                <Box mt={3} display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" color="text.secondary">
                        48 shots remaining this month. Please read our{' '}
                        <a href="#" style={{ color: '#e91e63' }}>Community Guidelines</a>.
                    </Typography>

                    <Button
                        variant="contained"
                        disabled={!file || loading}
                        onClick={handleUpload}
                        sx={{
                            bgcolor: '#e91e63',
                            color: '#fff',
                            '&:hover': { bgcolor: '#d81b60' },
                            borderRadius: 8,
                            minWidth: 100,
                        }}
                    >
                        {loading ? <CircularProgress size={20} color="inherit" /> : 'Upload'}
                    </Button>
                </Box>

                {previewUrl && (
                    <Box mt={4} textAlign="center">
                        <Typography variant="subtitle2" mb={1}>
                            Processed Image:
                        </Typography>
                        <img
                            src={previewUrl}
                            alt="Result"
                            style={{ maxWidth: '100%', borderRadius: 8 }}
                        />
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
}
