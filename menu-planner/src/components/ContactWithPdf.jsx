// src/components/ContactWithPdf.jsx
import React from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// FIXED: Use reliable CDN (cdnjs) – unpkg is flaky
//pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
import worker from '../pdf-worker.js';
pdfjs.GlobalWorkerOptions.workerSrc = worker;

// Simple PDF viewer
const SimplePdfViewer = ({ file, title = 'Document' }) => (
  <div style={{ marginTop: '2rem', border: '1px solid #ddd', background: '#fff' }}>
    <div style={{ padding  : '0.5rem 1rem', background: '#f0f0f0', fontWeight: 'bold' }}>
      {title}
    </div>
    <Document
      file={file}
      loading={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading PDF…</div>}
      error={<div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
        Failed to load PDF.<br />
        <small>Check: <code>{file}</code> exists in <code>public/</code></small>
      </div>}
    >
      <Page pageNumber={1} width={Math.min(800, window.innerWidth - 40)} />
    </Document>
  </div>
);

const ContactWithPdf = () => {
  // CORRECT PATH: Root of public folder
  const pdfFile = '/dmansmann_resume_2025.pdf';

  return (
    <div className="content-block">
      <h2>Douglas J. Mansmann</h2>
      <h3>Senior Software Engineer | Systems Architect | Data Architect</h3>
      <h3><a href="tel:+15027974585">502-797-4585</a>| <a href="mailto:djmansmann@bellsouth.net">djmansmann@bellsouth.net</a> | <a href="https://www.linkedin.com/in/doug-mansmann/" target="_blank" rel="noopener noreferrer">LinkedIn</a></h3>

    
      <SimplePdfViewer 
        file={pdfFile} 
        title=""
        // Add this to see raw URL
        onLoadSuccess={() => console.log('PDF loaded:', pdfFile)}
        onLoadError={(err) => console.error('PDF load failed:', err, pdfFile)}
      />
    </div>
  );
};

export default ContactWithPdf;