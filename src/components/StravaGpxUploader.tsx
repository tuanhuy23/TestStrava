import React, { useState } from 'react';

export default function StravaGpxUploader() {
    const [file, setFile] = useState<File | null>(null);
    const [token, setToken] = useState<string>('');
    const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState<string>('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            // Basic validation to ensure it's a GPX file
            if (!selectedFile.name.toLowerCase().endsWith('.gpx')) {
                setStatus('error');
                setMessage('Please select a valid .gpx file.');
                setFile(null);
                return;
            }
            setFile(selectedFile);
            setStatus('idle');
            setMessage('');
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file || !token) {
            setStatus('error');
            setMessage('Please provide both a GPX file and an Access Token.');
            return;
        }

        setStatus('uploading');
        setMessage('Uploading to Strava...');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('data_type', 'gpx');

        try {
            const response = await fetch('https://www.strava.com/api/v3/uploads', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                // Strava returns error details in the JSON response
                throw new Error(data.message || 'Upload failed due to an API error.');
            }

            setStatus('success');
            setMessage(`Success! Upload ID: ${data.id}. Strava is currently processing your file.`);

        } catch (error: any) {
            setStatus('error');
            setMessage(`Error: ${error.message || 'An unexpected error occurred.'}`);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '40px auto', fontFamily: 'sans-serif' }}>
            <h2>Strava GPX Uploader</h2>

            <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Your Access Token:
                    </label>
                    <input
                        type="text"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        placeholder="Paste token here..."
                        style={{ width: '100%', padding: '8px' }}
                        required
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Select GPX File:
                    </label>
                    <input
                        type="file"
                        accept=".gpx"
                        onChange={handleFileChange}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={status === 'uploading' || !file || !token}
                    style={{
                        padding: '10px',
                        backgroundColor: status === 'uploading' ? '#ccc' : '#fc4c02', // Strava Orange
                        color: 'white',
                        border: 'none',
                        cursor: status === 'uploading' ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    {status === 'uploading' ? 'Uploading...' : 'Upload to Strava'}
                </button>
            </form>

            {message && (
                <div style={{
                    marginTop: '20px',
                    padding: '10px',
                    backgroundColor: status === 'error' ? '#ffebee' : '#e8f5e9',
                    color: status === 'error' ? '#c62828' : '#2e7d32',
                    border: '1px solid',
                    borderRadius: '4px'
                }}>
                    {message}
                </div>
            )}
        </div>
    );
}