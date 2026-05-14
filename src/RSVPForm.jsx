import { useState } from 'react';
import { supabase } from './supabaseClient';

export default function RSVPForm() {
    // 1. Keep these keys consistent with your DB columns
    const initialFormState = {
        full_name: '',
        email: '',
        total_guests: 1,
        num_kids: 0,
        notes: ''
    };

    const [formData, setFormData] = useState(initialFormState);
    const [showKidsInput, setShowKidsInput] = useState(false);
    const [status, setStatus] = useState({ type: '', msg: '' }); // Changed to object

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: 'sending', msg: 'Sending Magic...' });

        try {
            const { data, error } = await supabase
                .from('rsvps')
                .upsert(
                    [{
                        full_name: formData.full_name,
                        email: formData.email,
                        total_guests: formData.total_guests,
                        num_kids: formData.num_kids,
                        notes: formData.notes
                    }],
                    { onConflict: 'email' } // This tells Postgres to match by email
                );

            if (error) throw error;

            setStatus({ type: 'success', msg: '✨ Your scroll has been sent!' });
            setFormData(initialFormState); // Reset with the full object
            setShowKidsInput(false);

        } catch (err) {
            console.error(err);
            setStatus({ type: 'error', msg: '❌ Magic failed. Please try again.' });
        }
    };

    return (
        <div style={formContainerStyle}>
            <form onSubmit={handleSubmit} style={formStyle}>
                <input
                    type="text"
                    placeholder="Your Full Name"
                    required
                    style={inputStyle}
                    value={formData.full_name} // Added value for controlled component
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />

                <input
                    type="email"
                    placeholder="Email Address"
                    required
                    style={inputStyle}
                    value={formData.email} // Added value
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />

                <div style={rowStyle}>
                    <label>Total Guests:</label>
                    <input
                        type="number" min="1"
                        style={numberInputStyle}
                        value={formData.total_guests}
                        onChange={(e) => setFormData({ ...formData, total_guests: parseInt(e.target.value) || 1 })}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            style={{ width: '18px', height: '18px' }}
                            checked={showKidsInput}
                            onChange={(e) => {
                                const checked = e.target.checked;
                                setShowKidsInput(checked);
                                if (!checked) setFormData({ ...formData, num_kids: 0 });
                            }}
                        />
                        <span style={{ fontSize: '0.95rem' }}>Bringing any babies or toddlers?</span>
                    </label>

                    {showKidsInput && (
                        <div style={kidsInputContainerStyle}>
                            <span style={{ fontSize: '0.9rem', color: '#555' }}>How many highchairs?</span>
                            <input
                                type="number"
                                min="1"
                                max="5"
                                value={formData.num_kids}
                                onChange={(e) => setFormData({ ...formData, num_kids: parseInt(e.target.value) || 0 })}
                                style={kidsNumberInputStyle}
                            />
                        </div>
                    )}
                </div>

                <textarea
                    placeholder="Any allergies or notes?"
                    style={inputStyle}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />

                <button type="submit" style={buttonStyle} disabled={status.type === 'sending'}>
                    {status.type === 'sending' ? 'Sending...' : 'Confirm RSVP'}
                </button>

                {status.msg && (
                    <p style={{ color: status.type === 'error' ? '#ff4d4d' : '#2e7d32', textAlign: 'center', fontWeight: 'bold' }}>
                        {status.msg}
                    </p>
                )}
            </form>
        </div>
    );
}

// Added missing styles for completeness
const kidsInputContainerStyle = { marginTop: '10px', padding: '10px', background: '#fff0f3', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const kidsNumberInputStyle = { width: '50px', padding: '5px', borderRadius: '4px', border: '1px solid #ddd' };
// (Keep your other existing styles here)
// Simple inline styles to get you started
const formContainerStyle = { background: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '15px' };
const inputStyle = { padding: '10px', borderRadius: '5px', border: '1px solid #ddd' };
const rowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const numberInputStyle = { width: '50px', padding: '5px' };
const buttonStyle = { padding: '12px', background: '#FFB6C1', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' };