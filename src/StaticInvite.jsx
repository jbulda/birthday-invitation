import React from 'react';

const StaticInvite = () => {
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.96)',
      padding: '30px',
      borderRadius: '24px',
      boxShadow: '0 15px 35px rgba(131, 97, 151, 0.2)',
      maxWidth: '450px',
      width: '90%',
      textAlign: 'center',
      zIndex: 10,
      position: 'relative',
      border: '1px solid #e1bee7',
      fontFamily: "'Cinzel', serif"
    }}>
      {/* Event Details Section */}
      <div style={{ margin: '10px 0 25px 0', lineHeight: '2.2', color: '#4a3b52' }}>
        <p style={{ margin: 0 }}>✨ <strong>Sunday, May 24, 2026</strong></p>
        <p style={{ margin: 0 }}>✨ <strong>2:00 PM – 5:00 PM</strong></p>
        <p style={{ margin: 0 }}>✨ <strong>Secret Garden, Montreal</strong></p>
      </div>

      {/* Calendar Buttons Section - Flex centered to fix Screenshot 2026-05-14 at 2.35.53 PM.jpg alignment */}
      <div style={{ 
        marginTop: '25px', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '12px' 
      }}>
        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '5px' }}>
          ✨ Save the Date to your Calendar ✨
        </p>

        {/* Apple / iOS / Outlook: Direct File Intent */}
        <a 
          href="https://ics.agical.io/?subject=Aphie%27s+Fairy+Garden+1st+Birthday&location=Montreal,+QC&start=2026-05-24+14:00&end=2026-05-24+17:00&description=Join+us+to+celebrate+Aphie%27s+first+trip+around+the+sun!" 
          target="_blank"
          rel="noopener noreferrer"
          style={{ 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'center',
            background: '#000000', 
            color: '#ffffff', 
            padding: '12px 22px', 
            textDecoration: 'none', 
            borderRadius: '30px', 
            fontWeight: 'bold', 
            fontSize: '14px',
            width: '240px',
            transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
           Add to Apple Calendar
        </a>

        {/* Google / Samsung / Android: Web Intent */}
        <a 
          href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Aphie%27s+Fairy+Garden+1st+Birthday&dates=20260524T180000Z/20260524T210000Z&details=Join+us+to+celebrate+Aphie%27s+first+trip+around+the+sun!&location=Montreal,+QC" 
          target="_blank"
          rel="noopener noreferrer"
          style={{ 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'center',
            background: '#4285F4', 
            color: '#ffffff', 
            padding: '12px 22px', 
            textDecoration: 'none', 
            borderRadius: '30px', 
            fontWeight: 'bold', 
            fontSize: '14px',
            width: '240px',
            transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          G+ Add to Google/Samsung
        </a>
      </div>

      {/* RSVP Footer */}
      <div style={{ 
        marginTop: '30px', 
        paddingTop: '20px', 
        borderTop: '1px solid #eee',
        color: '#4a3b52'
      }}>
        <p style={{ marginBottom: '5px', fontSize: '0.9rem' }}>
          RSVP via Text or Call:
        </p>
        <a href="tel:5140000000" style={{ 
          fontSize: '1.4rem', 
          color: '#836197', 
          fontWeight: 'bold', 
          textDecoration: 'none' 
        }}>
          (514) 000-0000
        </a>
      </div>
    </div>
  );
};

export default StaticInvite;