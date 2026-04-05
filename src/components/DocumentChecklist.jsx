import React, { useState } from 'react';
import { CheckCircle, Circle, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DocumentChecklist = ({ compact = false }) => {
    const navigate = useNavigate();
    const [documents, setDocuments] = useState([
        { id: 1, name: 'Passport Copy', status: 'completed' },
        { id: 2, name: 'Academic Transcripts', status: 'completed' },
        { id: 3, name: 'Statement of Purpose', status: 'pending' },
        { id: 4, name: 'Letters of Recommendation', status: 'pending' },
        { id: 5, name: 'IELTS/TOEFL Score', status: 'completed' },
        { id: 6, name: 'CV / Resume', status: 'completed' },
        { id: 7, name: 'Financial Proof', status: 'pending' },
    ]);

    const toggleStatus = (id) => {
        setDocuments(documents.map(doc =>
            doc.id === id
                ? { ...doc, status: doc.status === 'completed' ? 'pending' : 'completed' }
                : doc
        ));
    };

    const displayDocs = compact ? documents.slice(0, 4) : documents;

    return (
        <div className={`bg-white rounded-xl shadow-sm border border-slate-200 ${compact ? 'p-4' : 'p-6'}`}>
            <h3 className={`font-bold text-slate-900 mb-4 flex items-center gap-2 ${compact ? 'text-lg' : 'text-xl'}`}>
                <FileText className="text-primary" size={compact ? 20 : 24} />
                Document Checklist
            </h3>
            <div className="space-y-3">
                {displayDocs.map((doc) => (
                    <div
                        key={doc.id}
                        className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                        onClick={() => toggleStatus(doc.id)}
                    >
                        <div className="flex items-center gap-3">
                            {doc.status === 'completed'
                                ? <CheckCircle className="text-green-500" size={20} />
                                : <Circle className="text-slate-300" size={20} />
                            }
                            <span className={`${doc.status === 'completed' ? 'text-slate-500 line-through' : 'text-slate-700 font-medium'}`}>
                                {doc.name}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            {compact && (
                <div className="mt-4 pt-3 border-t border-slate-100 text-center">
                    <span
                        onClick={() => navigate('/student/documents')}
                        className="text-sm text-primary font-medium hover:underline cursor-pointer"
                    >
                        View all documents
                    </span>
                </div>
            )}
        </div>
    );
};

export default DocumentChecklist;
