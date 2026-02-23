import React, { useRef } from 'react';
import { FaCloudUploadAlt, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { Alert } from 'react-bootstrap';
import styles from './FileUpload.module.css';

const FileUpload = ({ onFileSelect, fileInfo, label, icon: Icon = FaCloudUploadAlt }) => {
    const fileInputRef = useRef(null);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className={styles.formGroup}>
            <label className={styles.label}>
                <Icon className={styles.labelIcon} /> {label}
            </label>
            
            <div className={styles.fileUpload} onClick={handleClick}>
                <FaCloudUploadAlt className={styles.uploadIcon} />
                <p className={styles.uploadText}>Cliquez pour télécharger le logo</p>
                <p className={styles.uploadHint}>Format: PNG, JPG (Max 2Mo)</p>
                <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/png,image/jpeg"
                    style={{ display: 'none' }}
                    onChange={onFileSelect}
                />
            </div>
            
            {fileInfo?.message && (
                <Alert 
                    variant={fileInfo.type === 'success' ? 'success' : 'danger'}
                    className={styles.fileInfo}
                >
                    {fileInfo.type === 'success' ? <FaCheckCircle /> : <FaExclamationTriangle />}
                    <span>{fileInfo.message}</span>
                </Alert>
            )}
        </div>
    );
};

export default FileUpload;