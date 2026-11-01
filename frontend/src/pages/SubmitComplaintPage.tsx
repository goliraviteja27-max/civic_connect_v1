import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Send, Sparkles, MapPin, Building2, AlertCircle, CheckCircle2, Image as ImageIcon, Info, ArrowRight } from 'lucide-react';
import { authService } from '../services/authService';
import { issueService } from '../services/issueService';
import { IssueCreateResponse, IssuePreviewResponse } from '../types';
import { Alert } from '../components/Alert';

const MUNICIPAL_CATEGORIES = [
  'Streetlight',
  'Garbage',
  'Pothole',
  'Drainage',
  'Water Supply',
  'Sewerage',
  'Animal Control',
  'Parks and Public Spaces',
  'Other',
];

export const SubmitComplaintPage: React.FC = () => {
  const navigate = useNavigate();
  const citizen = authService.getCurrentUser();

  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [location, setLocation] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Live Auto-Detection Preview State
  const [preview, setPreview] = useState<IssuePreviewResponse | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successResult, setSuccessResult] = useState<IssueCreateResponse | null>(null);

  const debounceTimer = useRef<any>(null);

  // Debounced call to /api/issues/preview as citizen types description
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setDescription(text);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (!text.trim()) {
      setPreview(null);
      return;
    }

    setIsDetecting(true);
    debounceTimer.current = setTimeout(async () => {
      try {
        const previewData = await issueService.previewIssue(text.trim());
        setPreview(previewData);
        // Automatically sync category dropdown if detected
        if (previewData.category && MUNICIPAL_CATEGORIES.includes(previewData.category)) {
          setSelectedCategory(previewData.category);
        }
      } catch (err) {
        console.error('Classification preview error:', err);
      } finally {
        setIsDetecting(false);
      }
    }, 300);
  };

  // Image selector handler (prepared UI for future storage)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessResult(null);

    if (!citizen) {
      setErrorMsg('You must be logged in as a citizen to submit a complaint.');
      return;
    }

    if (!description.trim()) {
      setErrorMsg('Please provide a description of the civic problem.');
      return;
    }

    if (!location.trim()) {
      setErrorMsg('Please specify the location or landmark of the issue.');
      return;
    }

    setSubmitting(true);
    try {
      // Automatic department routing is executed by the backend's DepartmentRouter
      const result = await issueService.submitComplaint({
        description: description.trim(),
        location: location.trim(),
        userId: citizen.userId,
      });

      setSuccessResult(result);
      setDescription('');
      setLocation('');
      setSelectedCategory('');
      setImageFile(null);
      setImagePreview(null);
      setPreview(null);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit complaint. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '820px', margin: '1.5rem auto' }}>
      <div className="card">
        <div className="card-header">
          <div>
            <h1 className="card-title">
              <Send size={22} color="#2563eb" /> Report a Civic Complaint
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>
              Submit local problems directly to municipal authorities. Our rule engine identifies priority and targets the correct department.
            </p>
          </div>
        </div>

        {errorMsg && <Alert type="error" message={errorMsg} onClose={() => setErrorMsg('')} />}

        {/* SUCCESS CONFIRMATION RECEIPT */}
        {successResult && (
          <div
            style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              padding: '1.5rem',
              borderRadius: '10px',
              marginBottom: '1.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#15803d', fontWeight: 800, fontSize: '1.2rem' }}>
              <CheckCircle2 size={24} /> Complaint Successfully Registered!
            </div>

            <div style={{ marginTop: '0.75rem', fontSize: '0.95rem', color: '#166534', lineHeight: 1.6 }}>
              Your complaint has been logged in the official municipal registry with ticket ID:
              <span
                style={{
                  display: 'inline-block',
                  background: '#dcfce7',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '6px',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  marginLeft: '0.4rem',
                  color: '#15803d',
                }}
              >
                #{successResult.issueId}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginTop: '1rem', background: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Detected Category</span>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>{successResult.category}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Assigned Priority</span>
                <div style={{ fontWeight: 700, color: successResult.priority === 'HIGH' ? '#dc2626' : '#2563eb' }}>
                  {successResult.priority}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Routed Department</span>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>{successResult.department}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Initial Status</span>
                <div style={{ fontWeight: 700, color: '#b91c1c' }}>{successResult.status}</div>
              </div>
            </div>

            <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem' }}>
              <Link to={`/issues/${successResult.issueId}`} className="btn btn-primary btn-sm">
                View Complaint Tracking Details &rarr;
              </Link>
              <Link to="/dashboard" className="btn btn-outline btn-sm">
                Go to Citizen Dashboard
              </Link>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* DESCRIPTION */}
          <div className="form-group">
            <label className="form-label">
              Issue Description <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <textarea
              required
              rows={4}
              className="form-textarea"
              placeholder="Provide a clear description of the problem (e.g. 'Street light lamp broken and blinking near Cheriyal crossroad' or 'Dangerous open manhole accident risk')"
              value={description}
              onChange={handleDescriptionChange}
            />

            {/* LIVE RULE-BASED DETECTION BOX */}
            <div className="live-detection-box">
              <div className="detection-title">
                <Sparkles size={14} color="#2563eb" /> Backend Rule Engine Classification (Live Preview):
                {isDetecting && <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Analyzing...</span>}
              </div>

              <div className="detection-items">
                <div>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Category: </span>
                  {preview?.category ? (
                    <span className="badge" style={{ background: '#dbeafe', color: '#1e40af' }}>
                      {preview.category}
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Start typing above...</span>
                  )}
                </div>

                <div>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Urgency: </span>
                  {preview?.priority ? (
                    <span className={`badge badge-priority-${preview.priority}`}>
                      {preview.priority} Priority
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>—</span>
                  )}
                </div>

                <div>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Auto-Routed Department: </span>
                  {preview?.department ? (
                    <strong style={{ fontSize: '0.85rem', color: '#0f172a' }}>{preview.department}</strong>
                  ) : (
                    <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>—</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* CATEGORY DROPDOWN */}
          <div className="form-group">
            <label className="form-label">
              Municipal Category
            </label>
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">-- Let Backend Auto-Detect from Description --</option>
              {MUNICIPAL_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <span style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.3rem', display: 'block' }}>
              💡 Department assignment is automatically determined by backend routing rules according to category and keywords.
            </span>
          </div>

          {/* LOCATION */}
          <div className="form-group">
            <label className="form-label">
              <MapPin size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Location / Landmark <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Opposite Cheriyal Government Hospital, Ward No. 3"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* IMAGE UPLOAD UI (PREPARED FOR FUTURE STORAGE) */}
          <div className="form-group">
            <label className="form-label">
              <ImageIcon size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Attach Photo Evidence (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              className="form-input"
              style={{ padding: '0.5rem' }}
              onChange={handleImageChange}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.35rem', color: '#64748b', fontSize: '0.78rem' }}>
              <Info size={13} />
              <span>
                Photo attachment UI prepared for future integration. Current backend registers complaint metadata and text details.
              </span>
            </div>

            {imagePreview && (
              <div style={{ marginTop: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.5rem', display: 'inline-block' }}>
                <img src={imagePreview} alt="Selected complaint evidence" style={{ maxWidth: '200px', maxHeight: '140px', borderRadius: '6px', objectFit: 'cover' }} />
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>Selected: {imageFile?.name}</div>
              </div>
            )}
          </div>

          {/* SUBMIT BUTTON WITH DUPLICATE PROTECTION */}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}
            disabled={submitting}
          >
            <Send size={18} /> {submitting ? 'Submitting to Municipal Authorities...' : 'Register Complaint'}
          </button>
        </form>
      </div>
    </div>
  );
};
