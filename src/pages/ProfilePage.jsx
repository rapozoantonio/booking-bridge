import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, increment, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { trackLinkClick as trackLinkClickAnalytics, trackProfileView } from "../utils/analytics";
import EmailCollectionWidget from "../components/EmailCollectionWidget";
import { Share2, Copy, Check } from "lucide-react";

// Enhanced Button Component with 2025 Effects
const LinkButton = ({ onClick, style, icon, iconType, showIcon, children, ariaLabel, buttonEffect }) => {
  const [isHovered, setIsHovered] = useState(false);

  const renderIcon = () => {
    if (showIcon === false) return null;

    if (icon) {
      return <img src={icon} alt="" className="w-5 h-5 mr-3" aria-hidden="true" />;
    }

    return (
      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={iconType === 'location'
            ? "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
            : "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          }
        />
      </svg>
    );
  };

  // Enhanced hover effects based on button style
  const getEnhancedClassName = () => {
    const baseClasses = "w-full flex items-center justify-center py-3.5 px-5 font-medium transition-all duration-300 relative overflow-hidden group";

    if (buttonEffect === 'glass') {
      return `${baseClasses} backdrop-blur-lg hover:backdrop-blur-xl hover:scale-[103%] hover:shadow-2xl`;
    }
    if (buttonEffect === 'neumorphic') {
      return `${baseClasses} hover:scale-[101%]`;
    }
    if (buttonEffect === 'gradient') {
      return `${baseClasses} hover:scale-[103%] hover:shadow-2xl hover:brightness-110`;
    }

    return `${baseClasses} hover:scale-[103%] hover:shadow-xl`;
  };

  const enhancedStyle = { ...style };

  // Add glassmorphism effect
  if (buttonEffect === 'glass') {
    enhancedStyle.backdropFilter = 'blur(12px) saturate(180%)';
    enhancedStyle.WebkitBackdropFilter = 'blur(12px) saturate(180%)';
    enhancedStyle.border = '1px solid rgba(255, 255, 255, 0.2)';
  }

  // Add neumorphic shadows
  if (buttonEffect === 'neumorphic') {
    enhancedStyle.boxShadow = isHovered
      ? 'inset 8px 8px 16px rgba(163, 177, 198, 0.6), inset -8px -8px 16px rgba(255, 255, 255, 0.5)'
      : '8px 8px 16px rgba(163, 177, 198, 0.6), -8px -8px 16px rgba(255, 255, 255, 0.5)';
  }

  return (
    <button
      onClick={onClick}
      className={getEnhancedClassName()}
      style={enhancedStyle}
      aria-label={ariaLabel}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Ripple effect overlay */}
      <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>

      <span className="relative flex items-center">
        {renderIcon()}
        {children}
      </span>
    </button>
  );
};

// Enhanced Social Icon Component
const SocialIcon = ({ link, color, ariaLabel }) => (
  <a
    onClick={(e) => {
      e.preventDefault();
      link.onClick();
    }}
    href={link.url}
    title={link.displayName || link.platform}
    className="p-3 transition-all duration-300 hover:scale-[115%] hover:-translate-y-1 rounded-full"
    style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(8px)',
    }}
    aria-label={ariaLabel}
  >
    {link.showIcon !== false && link.icon ? (
      <img src={link.icon} alt="" className="w-6 h-6" aria-hidden="true" />
    ) : (
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        style={{ color }}
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M21.938,7.71a7.329,7.329,0,0,0-.456-2.394,4.615,4.615,0,0,0-1.1-1.694,4.61,4.61,0,0,0-1.7-1.1,7.318,7.318,0,0,0-2.393-.456C15.185,2.012,14.817,2,12,2s-3.185.012-4.29.062a7.329,7.329,0,0,0-2.394.456,4.615,4.615,0,0,0-1.694,1.1,4.61,4.61,0,0,0-1.1,1.7A7.318,7.318,0,0,0,2.062,7.71C2.012,8.814,2,9.182,2,12s.012,3.186.062,4.29a7.329,7.329,0,0,0,.456,2.394,4.615,4.615,0,0,0,1.1,1.694,4.61,4.61,0,0,0,1.7,1.1,7.318,7.318,0,0,0,2.393.456c1.1.05,1.472.062,4.29.062s3.186-.012,4.29-.062a7.329,7.329,0,0,0,2.394-.456,4.9,4.9,0,0,0,2.8-2.8,7.318,7.318,0,0,0,.456-2.393c.05-1.1.062-1.472.062-4.29S21.988,8.814,21.938,7.71Z" />
      </svg>
    )}
    {link.showIcon === false && (
      <span className="block text-center mt-1 text-sm font-medium" style={{ color }}>
        {link.displayName || link.platform}
      </span>
    )}
  </a>
);

// Share Button Component
const ShareButton = ({ profileId, placeName }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = window.location.href;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: placeName,
          text: `Check out ${placeName} on Booking Bridge`,
          url: shareUrl,
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    } else {
      handleCopy();
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="flex gap-2 justify-center mb-6">
      <button
        onClick={handleShare}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 text-sm font-medium border border-white/20 hover:scale-105"
        aria-label="Share profile"
      >
        <Share2 className="w-4 h-4" />
        Share
      </button>
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 text-sm font-medium border border-white/20 hover:scale-105"
        aria-label="Copy link"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
};

// Skeleton Loader Component
const SkeletonLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
    <div className="max-w-lg w-full mx-auto px-4 py-8 space-y-6 animate-pulse">
      {/* Avatar skeleton */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-24 rounded-full bg-gray-300 mb-4"></div>
        <div className="h-8 w-48 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 w-64 bg-gray-300 rounded"></div>
      </div>

      {/* Link skeletons */}
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-14 bg-gray-300 rounded-xl"></div>
      ))}
    </div>
  </div>
);

const ProfilePage = () => {
  const { profileId } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlace = async () => {
      setLoading(true);
      try {
        const placeRef = doc(db, "places", profileId);
        const placeSnap = await getDoc(placeRef);

        if (placeSnap.exists()) {
          const placeData = placeSnap.data();

          // Only display active places
          if (placeData.isActive === false) {
            setError("This place profile is currently unavailable.");
          } else {
            setPlace({
              id: placeSnap.id,
              ...placeData,
            });

            // Track profile view
            trackProfileView(profileId, navigator.userAgent, document.referrer);
          }
        } else {
          setError("Place not found");
        }
      } catch (err) {
        console.error("Error fetching place:", err);
        setError("Failed to load place data");
      } finally {
        setLoading(false);
      }
    };

    fetchPlace();
  }, [profileId]);

  const trackLinkClick = async (linkType, linkIndex, linkPlatform, linkUrl) => {
    try {
      const placeRef = doc(db, "places", profileId);

      // Create a single atomic update with all changes
      const updates = {};

      // Update the click count and timestamp for this link
      if (linkType === "booking") {
        updates[`bookingLinks.${linkIndex}.clicks`] = increment(1);
        updates[`bookingLinks.${linkIndex}.lastClicked`] = serverTimestamp();
      } else if (linkType === "social") {
        updates[`socialLinks.${linkIndex}.clicks`] = increment(1);
        updates[`socialLinks.${linkIndex}.lastClicked`] = serverTimestamp();
      } else if (linkType === "support") {
        updates[`supportLinks.${linkIndex}.clicks`] = increment(1);
        updates[`supportLinks.${linkIndex}.lastClicked`] = serverTimestamp();
      }

      // Single atomic update
      await updateDoc(placeRef, updates);

      // Track in analytics subcollection (scalable solution)
      await trackLinkClickAnalytics(profileId, linkType, linkIndex, linkPlatform, linkUrl);
    } catch (error) {
      console.error("Error tracking link click:", error);
      // Silent fail - don't block user experience for analytics issues
    }
  };

  const handleLinkClick = (linkType, index, url, platform) => {
    trackLinkClick(linkType, index, platform, url);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Style calculations
  const getTextColor = (bgColor) => {
    if (!bgColor) return "#000000";
    const brightness = getBrightness(bgColor);
    return brightness > 180 ? "#000000" : "#FFFFFF";
  };

  const getBrightness = (hexColor) => {
    if (!hexColor) return 255;
    const hex = hexColor.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return 0.299 * r + 0.587 * g + 0.114 * b;
  };

  const getLinkStyle = (linkType) => {
    if (!place) return {};

    const baseColor = place.color || "#3B82F6";
    const isSecondary = linkType !== "booking" && linkType !== "support" && linkType !== "location";
    const bgColor = isSecondary ? "#1F2937" : baseColor;
    const textColor = place.buttonTextColor || getTextColor(bgColor);

    const borderRadius = {
      pill: "9999px",
      square: "0",
      outline: "0.375rem",
      rounded: "0.375rem",
    }[place.linkStyle] || "0.375rem";

    const style = {
      backgroundColor: place.linkStyle === "outline" ? "transparent" : bgColor,
      color: place.linkStyle === "outline" ? (isSecondary ? "#1F2937" : baseColor) : textColor,
      borderRadius,
    };

    if (place.linkStyle === "outline") {
      style.border = `2px solid ${isSecondary ? "#1F2937" : baseColor}`;
    }

    return style;
  };

  // Section labels based on place type
  const getSectionLabel = (sectionType) => {
    const labelMaps = {
      bookingLinks: {
        accommodation: "Book this property on:",
        restaurant: "Make a reservation on:",
        retail: "Shop this store on:",
        service: "Book this service on:",
        event: "Get tickets on:",
        default: "Available on:",
      },
      supportLinks: {
        accommodation: "Experiences & Support:",
        restaurant: "Additional Services:",
        retail: "Customer Services:",
        service: "Support Services:",
        event: "Event Services:",
        default: "Support Links:",
      },
      socialLinks: {
        default: "Social Media"
      }
    };

    const labels = labelMaps[sectionType];
    return place?.sectionLabels?.[sectionType] || labels[place?.placeType] || labels.default;
  };

  // Loading state - Use modern skeleton loader
  if (loading) {
    return <SkeletonLoader />;
  }

  // Error state
  if (error || !place) {
    const bgColor = error.includes("not found") ? "bg-yellow-50" : "bg-red-50";
    const borderColor = error.includes("not found") ? "border-yellow-400" : "border-red-400";
    const textColor = error.includes("not found") ? "text-yellow-700" : "text-red-700";

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className={`${bgColor} border-l-4 ${borderColor} p-4 rounded-r-lg`}>
          <div className="flex items-center">
            <svg className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className={`text-lg ${textColor}`}>{error || "Place not found"}</p>
          </div>
        </div>
      </div>
    );
  }

  // Styles
  const backgroundColor = place.backgroundColor || "#FFFFFF";
  const fontColor = place.fontColor || "#000000";
  const modernFontStack = `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;
  const buttonEffect = place.buttonEffect || 'solid';

  // Background pattern generator
  const getBackgroundStyle = () => {
    const pattern = place.backgroundPattern;

    if (!pattern || pattern === 'none') {
      return { background: backgroundColor };
    }

    if (pattern === 'gradient') {
      return {
        background: backgroundColor.includes('gradient') ? backgroundColor : `linear-gradient(135deg, ${backgroundColor} 0%, ${place.color || '#3B82F6'} 100%)`
      };
    }

    if (pattern === 'mesh') {
      return {
        background: 'radial-gradient(at 40% 20%, hsla(28,100%,74%,0.3) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,0.3) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,0.3) 0px, transparent 50%), radial-gradient(at 80% 50%, hsla(340,100%,76%,0.3) 0px, transparent 50%)',
        backgroundColor
      };
    }

    if (pattern === 'stars') {
      return {
        background: backgroundColor,
        backgroundImage: `radial-gradient(2px 2px at 20px 30px, white, transparent),
                          radial-gradient(2px 2px at 60px 70px, white, transparent),
                          radial-gradient(1px 1px at 50px 50px, white, transparent),
                          radial-gradient(1px 1px at 130px 80px, white, transparent),
                          radial-gradient(2px 2px at 90px 10px, white, transparent)`,
        backgroundRepeat: 'repeat',
        backgroundSize: '200px 200px'
      };
    }

    if (pattern === 'subtle-grid') {
      return {
        background: backgroundColor,
        backgroundImage: `linear-gradient(${fontColor}11 1px, transparent 1px), linear-gradient(90deg, ${fontColor}11 1px, transparent 1px)`,
        backgroundSize: '20px 20px'
      };
    }

    if (pattern === 'aurora') {
      return {
        background: backgroundColor.includes('gradient') ? backgroundColor : `linear-gradient(135deg, ${backgroundColor} 0%, ${place.color || '#3B82F6'} 100%)`
      };
    }

    return { background: backgroundColor };
  };

  // Helper function to check if a link is currently scheduled
  const isLinkScheduled = (link) => {
    if (!link.startDate && !link.endDate) return true; // No scheduling, always show

    const now = new Date();
    const startDate = link.startDate ? new Date(link.startDate) : null;
    const endDate = link.endDate ? new Date(link.endDate) : null;

    if (startDate && now < startDate) return false; // Not started yet
    if (endDate && now > endDate) return false; // Already ended

    return true; // Within schedule
  };

  // Filter active links by type and schedule
  const activeBookingLinks = place.bookingLinks?.filter(link => link.isActive && isLinkScheduled(link)) || [];
  const activeSupportLinks = place.supportLinks?.filter(link => link.isActive && isLinkScheduled(link)) || [];
  const activeSocialLinks = place.socialLinks?.filter(link => link.isActive && isLinkScheduled(link)) || [];

  // Determine section visibility
  const showBookingSection = activeBookingLinks.length > 0;
  const showSupportSection = activeSupportLinks.length > 0;
  const showSocialSection = activeSocialLinks.length > 0;
  const showLocationSection = place.location;
  const showDescriptionSection = place.description;

  // Collect all visible sections
  const sections = [];

  if (showLocationSection) {
    sections.push(
      <div key="location" className="mb-3">
        {place.locationMapUrl ? (
          <LinkButton
            onClick={() => handleLinkClick("location", 0, place.locationMapUrl, "Location")}
            style={getLinkStyle("location")}
            icon={null}
            iconType="location"
            showIcon={true}
            buttonEffect={buttonEffect}
            ariaLabel={`View location on map: ${place.location}`}
          >
            {place.location}
          </LinkButton>
        ) : (
          <p className="text-center flex items-center justify-center" style={{ color: fontColor }}>
            <svg className="h-4 w-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {place.location}
          </p>
        )}
      </div>
    );
  }

  if (showBookingSection) {
    sections.push(
      <div key="booking" className="mb-3">
        {place.sectionVisibility?.bookingLinks !== false && (
          <h2 className="text-lg font-semibold mb-4 text-center" style={{ color: fontColor }}>
            {getSectionLabel("bookingLinks")}
          </h2>
        )}
        <div className="space-y-3">
          {activeBookingLinks.map((link, index) => (
            <LinkButton
              key={`booking-${index}`}
              onClick={() => handleLinkClick("booking", index, link.url, link.displayName || link.platform)}
              style={getLinkStyle("booking")}
              icon={link.icon}
              showIcon={link.showIcon}
              buttonEffect={buttonEffect}
              ariaLabel={`Book with ${link.displayName || link.platform}`}
            >
              {link.displayName || link.platform}
            </LinkButton>
          ))}
        </div>
      </div>
    );
  }

  if (showSupportSection) {
    sections.push(
      <div key="support" className="mb-3">
        {place.sectionVisibility?.supportLinks !== false && (
          <h2 className="text-lg font-semibold mb-4 text-center" style={{ color: fontColor }}>
            {getSectionLabel("supportLinks")}
          </h2>
        )}
        <div className="space-y-3">
          {activeSupportLinks.map((link, index) => (
            <LinkButton
              key={`support-${index}`}
              onClick={() => handleLinkClick("support", index, link.url, link.displayName || link.platform)}
              style={getLinkStyle("support")}
              icon={link.icon}
              showIcon={link.showIcon}
              buttonEffect={buttonEffect}
              ariaLabel={`Support: ${link.displayName || link.platform}`}
            >
              {link.displayName || link.platform}
            </LinkButton>
          ))}
        </div>
      </div>
    );
  }

  if (showSocialSection) {
    sections.push(
      <div key="social" className="mb-3">
        {place.sectionVisibility?.socialLinks !== false && (
          <h2 className="text-lg font-semibold mb-4 text-center" style={{ color: fontColor }}>
            {getSectionLabel("socialLinks")}
          </h2>
        )}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {activeSocialLinks.map((link, index) => (
            <SocialIcon
              key={`social-${index}`}
              link={{
                ...link,
                onClick: () => handleLinkClick("social", index, link.url, link.displayName || link.platform)
              }}
              color={place.color || "#3B82F6"}
              ariaLabel={`Visit ${link.displayName || link.platform}`}
            />
          ))}
        </div>
      </div>
    );
  }

  if (showDescriptionSection) {
    sections.push(
      <div key="description" className="p-5 shadow-sm" style={{
        backgroundColor: place.color || "#3B82F6",
        borderRadius: place.linkStyle === 'pill' ? '9999px' :
                     place.linkStyle === 'square' ? '0' :
                     '0.375rem',
      }}>
        <h2 className="text-lg font-semibold mb-2" style={{ color: place.buttonTextColor || "#FFFFFF" }}>About</h2>
        <p className="whitespace-pre-line" style={{ color: place.buttonTextColor || "#FFFFFF" }}>{place.description}</p>
      </div>
    );
  }

  // Email collection widget (if enabled)
  if (place.emailCollectionEnabled) {
    sections.push(
      <div key="email-collection" className="mb-3">
        <EmailCollectionWidget
          placeId={profileId}
          placeName={place.name}
          widgetSettings={place.emailWidgetSettings}
        />
      </div>
    );
  }

  return (
    <div style={{ ...getBackgroundStyle(), color: fontColor, fontFamily: modernFontStack }} className="min-h-screen">
      <div className="max-w-lg mx-auto px-4 py-10">
        {/* Profile Header with Avatar */}
        <div className="flex flex-col items-center mb-8">
          {/* Avatar (if provided) */}
          {place.avatarUrl && (
            <div className="mb-5 relative animate-fade-in">
              <div
                className="absolute inset-0 rounded-full blur-lg opacity-50"
                style={{
                  background: place.color?.includes('gradient') ? place.color : `linear-gradient(135deg, ${place.color || '#3B82F6'} 0%, ${place.color || '#8B5CF6'} 100%)`
                }}
              ></div>
              <img
                src={place.avatarUrl}
                alt={place.name}
                className="relative w-28 h-28 rounded-full object-cover border-4 border-white shadow-2xl"
                style={{
                  borderColor: place.buttonEffect === 'glass' ? 'rgba(255, 255, 255, 0.3)' : 'white'
                }}
              />
              {place.verified && (
                <div
                  className="absolute bottom-1 right-1 w-8 h-8 rounded-full flex items-center justify-center border-3 border-white shadow-lg"
                  style={{ background: place.color || '#3B82F6' }}
                  title="Verified"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          )}

          {/* Name with fluid typography */}
          <h1
            className="text-4xl font-bold text-center mb-3 animate-fade-in"
            style={{
              color: fontColor,
              fontSize: 'clamp(2rem, 5vw, 2.5rem)',
              letterSpacing: '-0.02em'
            }}
          >
            {place.name}
          </h1>

          {/* Bio */}
          {place.bio && (
            <p
              className="text-center max-w-md mb-5 leading-relaxed animate-fade-in"
              style={{
                color: fontColor,
                opacity: 0.9,
                fontSize: 'clamp(0.95rem, 2vw, 1.05rem)'
              }}
            >
              {place.bio}
            </p>
          )}

          {/* Share Buttons */}
          <div style={{ color: fontColor }}>
            <ShareButton profileId={profileId} placeName={place.name} />
          </div>
        </div>

        {/* Sections - Only render what exists */}
        <div className="space-y-4 animate-fade-in">
          {sections.map((section, index) =>
            index === sections.length - 1 ? section : section
          )}
        </div>
      </div>

      {/* Enhanced Footer */}
      <div className="py-8 text-center text-sm mt-12" style={{ color: fontColor, opacity: 0.6 }}>
        <p>
          <a
            href="/"
            className="hover:underline transition-all duration-300 inline-flex items-center gap-1 hover:gap-2"
            style={{ color: fontColor }}
          >
            <span>Powered by</span>
            <span className="font-semibold" style={{ color: place.color || "#3B82F6" }}>Booking Bridge</span>
          </a>
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;