import React, { useState, useEffect, useRef } from 'react';
import { Upload, File, Download, Trash2, Eye, Image, FileText, Archive } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Progress } from '@/Components/ui/progress';
import { Alert, AlertDescription } from '@/Components/ui/alert';

export default function TaskAttachments({ task, canEdit = false }) {
    const [attachments, setAttachments] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        loadAttachments();
    }, [task.id]);

    const loadAttachments = async () => {
        try {
            const response = await window.axios.get(route('user.tasks.attachments.index', task.id));
            setAttachments(response.data.attachments);
        } catch (error) {
            console.error('Failed to load attachments:', error);
            setError('Failed to load attachments');
        }
    };

    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files);
        files.forEach(uploadFile);
    };

    const uploadFile = async (file) => {
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            setError('File size must be less than 10MB');
            return;
        }

        setUploading(true);
        setUploadProgress(0);
        setError('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await window.axios.post(
                route('user.tasks.attachments.store', task.id),
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    onUploadProgress: (progressEvent) => {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(progress);
                    }
                }
            );

            setAttachments(prev => [...prev, response.data.attachment]);
            setSuccess('File uploaded successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            console.error('Upload failed:', error);
            setError(error.response?.data?.message || 'Failed to upload file');
        } finally {
            setUploading(false);
            setUploadProgress(0);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleDelete = async (attachmentId) => {
        if (!confirm('Are you sure you want to delete this attachment?')) {
            return;
        }

        try {
            await window.axios.delete(route('user.tasks.attachments.destroy', [task.id, attachmentId]));
            setAttachments(prev => prev.filter(a => a.id !== attachmentId));
            setSuccess('Attachment deleted successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            console.error('Delete failed:', error);
            setError(error.response?.data?.message || 'Failed to delete attachment');
        }
    };

    const handleDownload = (attachment) => {
        window.open(route('user.tasks.attachments.download', [task.id, attachment.id]), '_blank');
    };

    const handlePreview = (attachment) => {
        window.open(route('user.tasks.attachments.preview', [task.id, attachment.id]), '_blank');
    };

    const getFileIcon = (mimeType) => {
        if (mimeType.startsWith('image/')) {
            return <Image className="h-5 w-5 text-blue-500" />;
        } else if (mimeType === 'application/pdf') {
            return <FileText className="h-5 w-5 text-red-500" />;
        } else if (mimeType.includes('zip') || mimeType.includes('rar')) {
            return <Archive className="h-5 w-5 text-yellow-500" />;
        } else {
            return <File className="h-5 w-5 text-gray-500" />;
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <File className="h-5 w-5" />
                    Attachments
                    <Badge variant="secondary">{attachments.length}</Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Upload Area */}
                {canEdit && (
                    <div className="space-y-4">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="mt-4">
                                <Button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                    variant="outline"
                                >
                                    {uploading ? 'Uploading...' : 'Choose files'}
                                </Button>
                                <p className="mt-2 text-sm text-gray-500">
                                    or drag and drop files here
                                </p>
                                <p className="text-xs text-gray-400">
                                    Maximum file size: 10MB
                                </p>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                onChange={handleFileSelect}
                                className="hidden"
                                accept="image/*,.pdf,.doc,.docx,.txt,.zip,.rar"
                            />
                        </div>

                        {uploading && (
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Uploading...</span>
                                    <span>{uploadProgress}%</span>
                                </div>
                                <Progress value={uploadProgress} className="w-full" />
                            </div>
                        )}
                    </div>
                )}

                {/* Alerts */}
                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {success && (
                    <Alert>
                        <AlertDescription>{success}</AlertDescription>
                    </Alert>
                )}

                {/* Attachments List */}
                {attachments.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No attachments yet</p>
                ) : (
                    <div className="space-y-3">
                        {attachments.map((attachment) => (
                            <div
                                key={attachment.id}
                                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    {getFileIcon(attachment.mime_type)}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{attachment.name}</p>
                                        <p className="text-sm text-gray-500">
                                            {formatFileSize(attachment.size)} • {attachment.uploaded_at}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {attachment.is_image && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handlePreview(attachment)}
                                            title="Preview"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    )}
                                    
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDownload(attachment)}
                                        title="Download"
                                    >
                                        <Download className="h-4 w-4" />
                                    </Button>

                                    {canEdit && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(attachment.id)}
                                            title="Delete"
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 