import React, { useState } from 'react';
import { CheckCircle, Circle, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DocumentChecklist = ({ compact = false }) => {
    const navigate = useNavigate();
    // Static list of expected documents
    const documents = [
        { id: 1, name: 'Passport Copy' },
        { id: 2, name: 'Academic Transcripts' },
        { id: 3, name: 'Statement of Purpose' },
        { id: 4, name: 'Letters of Recommendation' },
        { id: 5, name: 'IELTS/TOEFL Score' },
        { id: 6, name: 'CV / Resume' },
        { id: 7, name: 'Financial Proof' },
    ];

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
                        className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-default"
                    >
                        <div className="flex items-center gap-3">
                            <Circle className="text-slate-300" size={20} />
                            <span className="text-slate-700 font-medium">
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
