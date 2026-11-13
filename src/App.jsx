import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Volume2, VolumeX } from 'lucide-react';
import { invitation } from './invitation.js';

const invitationBackground = '/invitation-background.jpg';
const plainInvitationBackground = '/invitation-background-plain.jpg';
const decorativeFrame = '/frame.png';
const weddingTime = new Date(invitation.date).getTime();

function OrnateFrame({ className, children }) {
  return (
    <div className={`ornate-frame ${className}`}>
      {children}
      <img className="ornate-frame-art" src={decorativeFrame} alt="" aria-hidden="true" />
    </div>
  );
}

function getTimeLeft() {
  const difference = weddingTime - Date.now();
  if (difference <= 0) return null;

  return {
    days: Math.floor(difference / 86400000),
    hours: Math.floor((difference / 3600000) % 24),
    minutes: Math.floor((difference / 60000) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

function SectionHeading({ eyebrow, title, children }) {
  return (
    <div className="section-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {children}
    </div>
  );
}

function Countdown() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);

  useEffect(() => {
    const timer = window.setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="photo-content countdown-content">
      <SectionHeading eyebrow={invitation.countdownEyebrow} title={invitation.countdownTitle}>
        <p>{invitation.countdownMessage}</p>
      </SectionHeading>
      {timeLeft ? (
        <div className="countdown-grid" aria-label="Time remaining">
          {Object.entries(timeLeft).map(([unit, value]) => (
            <div className="countdown-unit" key={unit}>
              <span className="countdown-number">{String(value).padStart(2, '0')}</span>
              <span className="countdown-label">{invitation.countdownUnits[unit]}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="memory-note">
          <p>{invitation.countdownFinished.replace('{date}', invitation.dateLabel)}</p>
        </div>
      )}
    </div>
  );
}

function Gallery() {
  return (
    <div className="gallery-card">
      <OrnateFrame className="couple-photo-frame">
        <div
          className="couple-photo-window"
          style={{ '--couple-photo': invitation.couplePhoto ? `url("${invitation.couplePhoto}")` : 'none' }}
        >
          {invitation.couplePhoto ? (
            <img className="couple-photo" src={invitation.couplePhoto} alt={`${invitation.bride} and ${invitation.groom}`} />
          ) : (
            <span className="couple-photo-placeholder">Add your photo</span>
          )}
        </div>
      </OrnateFrame>
      <div className="gallery-copy">
        <span className="eyebrow">{invitation.galleryEyebrow}</span>
        <h2>{invitation.message}</h2>
        <p>{invitation.galleryMessage}</p>
        <div className="signature">{invitation.bride} <span>&</span> {invitation.groom}</div>
      </div>
    </div>
  );
}

function RSVP() {
  const [guestName, setGuestName] = useState('');
  const [guestMessage, setGuestMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    const reply = `Name: ${guestName}\nMessage: ${guestMessage}`;
    if (invitation.rsvpWhatsApp) {
      window.open(`https://wa.me/${invitation.rsvpWhatsApp}?text=${encodeURIComponent(reply)}`, '_blank', 'noopener,noreferrer');
    }
    setSubmitted(true);
  }

  return (
    <div className="photo-content rsvp-panel">
      <span className="eyebrow">{invitation.rsvpEyebrow} {invitation.replyBy}</span>
      <h2>{invitation.rsvpTitle}</h2>
      <p className="rsvp-intro">{invitation.rsvpMessage}</p>
      {submitted ? (
        <div className="success-message" role="status">
          <span>Thank you!</span>
        </div>
      ) : (
        <form className="rsvp-form" onSubmit={handleSubmit}>
          <label>
            {invitation.rsvpNameLabel}
            <input value={guestName} onChange={(event) => setGuestName(event.target.value)} placeholder={invitation.rsvpNamePlaceholder} required />
          </label>
          <label>
            {invitation.rsvpMessageLabel}
            <textarea value={guestMessage} onChange={(event) => setGuestMessage(event.target.value)} placeholder={invitation.rsvpMessagePlaceholder} rows={3} required />
          </label>
          <button className="submit-button" type="submit">{invitation.rsvpButtonLabel}</button>
        </form>
      )}
    </div>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState(0);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Try autoplay immediately
    const startAudio = () => {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Autoplay policy prevented immediate playback; wait for first user gesture
        setIsPlaying(false);
      });
    };

    startAudio();

    const handleFirstGesture = () => {
      if (audio.paused) {
        audio.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {});
      }
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };

    window.addEventListener('click', handleFirstGesture, { once: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
  }, []);

  function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {});
    }
  }

  const pages = [
    // 0: Cover / Home
    {
      id: 'home',
      bg: invitationBackground,
      isArtboard: true,
      content: (
        <>
          <div className="reference-text cover-names">
            <h1>{invitation.bride} <i>{invitation.nameConnector}</i> {invitation.groom}</h1>
          </div>
          <div className="reference-text cover-date">{invitation.dateLabel}</div>
          <div className="cover-greeting">
            <span>{invitation.welcomeLabel}</span>
            <p>{invitation.welcomeMessage}</p>
          </div>
        </>
      ),
      nextText: 'Save the date',
    },
    // 1: Details / Date
    {
      id: 'details',
      bg: plainInvitationBackground,
      isArtboard: true,
      content: (
        <div className="date-copy">
          <span className="date-heading">{invitation.dateSectionLabel}</span>
          <OrnateFrame className="date-frame">
            <div className="date-medallion-text">
              <span className="date-day">{invitation.dateDay}</span>
              <span className="date-month">{invitation.dateMonth}</span>
              <span className="date-year">{invitation.dateYear}</span>
            </div>
            <div className="date-pair">
              <span>{invitation.weekday}</span>
              <span>{invitation.timeLabel}</span>
            </div>
          </OrnateFrame>
        </div>
      ),
      nextText: 'Countdown',
    },
    // 2: Countdown
    {
      id: 'countdown',
      bg: plainInvitationBackground,
      isArtboard: false,
      content: <Countdown />,
      nextText: 'Location',
    },
    // 3: Location
    {
      id: 'location',
      bg: plainInvitationBackground,
      isArtboard: true,
      content: (
        <div className="location-copy">
          <span className="location-heading">{invitation.locationHeading}</span>
          <a className="map-frame-link" href={invitation.mapUrl} target="_blank" rel="noreferrer" aria-label={`${invitation.mapDirectionsLabel}: ${invitation.venue}`}>
            <OrnateFrame className="map-frame">
              <div className="illustrated-map" aria-label={`${invitation.venue}, ${invitation.address}`}>
                <span className="map-water">{invitation.mapWaterLabel}</span>
                <span className="map-road map-road--one" />
                <span className="map-road map-road--two" />
                <span className="map-road map-road--three" />
                <span className="map-map-label map-area">{invitation.mapAreaLabel}</span>
                <span className="map-map-label map-street">{invitation.mapRoadLabel}</span>
                <MapPin className="map-pin" size={30} fill="currentColor" strokeWidth={1.3} />
              </div>
            </OrnateFrame>
          </a>
          <h2 className="venue-name">{invitation.venue}</h2>
          <p className="venue-address">{invitation.address}</p>
          <a className="venue-directions" href={invitation.mapUrl} target="_blank" rel="noreferrer">{invitation.mapDirectionsLabel}</a>
        </div>
      ),
      nextText: 'RSVP',
    },
    // 4: RSVP
    {
      id: 'rsvp',
      bg: plainInvitationBackground,
      isArtboard: false,
      content: <RSVP />,
      nextText: 'Our Story',
    },
    // 5: Our Story / Gallery
    {
      id: 'our-story',
      bg: plainInvitationBackground,
      isArtboard: false,
      content: <Gallery />,
    },
  ];

  const page = pages[currentPage];

  function goToPage(index) {
    if (index >= 0 && index < pages.length) {
      setCurrentPage(index);
    }
  }

  return (
    <main className="page-wrapper">
      <audio
        ref={audioRef}
        src={invitation.music || '/music.mp3'}
        loop
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <button
        type="button"
        className={`music-toggle ${isPlaying ? 'is-playing' : ''}`}
        onClick={toggleMusic}
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
        title={isPlaying ? 'Pause music' : 'Play music'}
      >
        {isPlaying ? <Volume2 size={17} strokeWidth={1.75} /> : <VolumeX size={17} strokeWidth={1.75} />}
      </button>

      <section
        key={page.id}
        className={`section page-transition ${page.isArtboard ? 'reference-section' : 'common-photo-section'}`}
        id={page.id}
        style={{ '--reference-image': `url("${page.bg}")` }}
      >
        {page.isArtboard ? (
          <div className="reference-artboard">
            {page.content}
          </div>
        ) : (
          page.content
        )}

        <div className="page-nav-controls">
          {page.nextText && (
            <button
              type="button"
              className="page-next-button"
              onClick={() => goToPage(currentPage + 1)}
            >
              {page.nextText}
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
