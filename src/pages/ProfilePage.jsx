import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, arrayUnion, increment, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

// Reusable Button Component
const LinkButton = ({ onClick, style, icon, iconType, showIcon, children, ariaLabel }) => {
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

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center py-3 px-4 font-medium transition-transform hover:scale-[102.5%] shadow-sm"
      style={style}
      aria-label={ariaLabel}
    >
      {renderIcon()}
      {children}
    </button>
  );
};

// Social Icon Component
const SocialIcon = ({ link, color, ariaLabel }) => (
  <a
    onClick={(e) => {
      e.preventDefault();
      link.onClick();
    }}
    href={link.url}
    title={link.displayName || link.platform}
    className="p-2 transition-transform hover:scale-[107.5%]"
    aria-label={ariaLabel}
  >
    {link.showIcon !== false && link.icon ? (
      <img src={link.icon} alt="" className="w-7 h-7" aria-hidden="true" />
    ) : (
      <svg
        className="w-7 h-7"
        viewBox="0 0 24 24"
        style={{ color }}
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M21.938,7.71a7.329,7.329,0,0,0-.456-2.394,4.615,4.615,0,0,0-1.1-1.694,4.61,4.61,0,0,0-1.7-1.1,7.318,7.318,0,0,0-2.393-.456C15.185,2.012,14.817,2,12,2s-3.185.012-4.29.062a7.329,7.329,0,0,0-2.394.456,4.615,4.615,0,0,0-1.694,1.1,4.61,4.61,0,0,0-1.1,1.7A7.318,7.318,0,0,0,2.062,7.71C2.012,8.814,2,9.182,2,12s.012,3.186.062,4.29a7.329,7.329,0,0,0,.456,2.394,4.615,4.615,0,0,0,1.1,1.694,4.61,4.61,0,0,0,1.7,1.1,7.318,7.318,0,0,0,2.393.456c1.1.05,1.472.062,4.29.062s3.186-.012,4.29-.062a7.329,7.329,0,0,0,2.394-.456,4.9,4.9,0,0,0,2.8-2.8,7.318,7.318,0,0,0,.456-2.393c.05-1.1.062-1.472.062-4.29S21.988,8.814,21.938,7.71Z" />
      </svg>
    )}
    {link.showIcon === false && (
      <span className="block text-center mt-1" style={{ color }}>
        {link.displayName || link.platform}
      </span>
    )}
  </a>
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

  const trackLinkClick = async (linkType, linkIndex) => {
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

      // Add to analytics array (limited to last 100 events to prevent document size issues)
      // Note: This still appends, but we should periodically clean old events
      // In production, consider moving to a subcollection for scalability
      updates.analytics = arrayUnion({
        linkType,
        linkIndex,
        timestamp: serverTimestamp(),
      });

      // Single atomic update instead of two separate calls
      await updateDoc(placeRef, updates);
    } catch (error) {
      console.error("Error tracking link click:", error);
      // Silent fail - don't block user experience for analytics issues
    }
  };

  const handleLinkClick = (linkType, index, url) => {
    trackLinkClick(linkType, index);
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

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse text-gray-500">Loading place information...</div>
      </div>
    );
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
  const systemFontStack = `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`;

  // Filter active links by type
  const activeBookingLinks = place.bookingLinks?.filter(link => link.isActive) || [];
  const activeSupportLinks = place.supportLinks?.filter(link => link.isActive) || [];
  const activeSocialLinks = place.socialLinks?.filter(link => link.isActive) || [];

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
            onClick={() => handleLinkClick("location", 0, place.locationMapUrl)}
            style={getLinkStyle("location")}
            icon={null}
            iconType="location"
            showIcon={true}
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
              onClick={() => handleLinkClick("booking", index, link.url)}
              style={getLinkStyle("booking")}
              icon={link.icon}
              showIcon={link.showIcon}
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
              onClick={() => handleLinkClick("support", index, link.url)}
              style={getLinkStyle("support")}
              icon={link.icon}
              showIcon={link.showIcon}
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
                onClick: () => handleLinkClick("social", index, link.url)
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

  return (
    <div style={{ backgroundColor, color: fontColor, fontFamily: systemFontStack }} className="min-h-screen">
      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-3xl font-bold text-center" style={{ color: fontColor }}>{place.name}</h1>
          {place.bio && <p className="text-center mt-4 max-w-md" style={{ color: fontColor }}>{place.bio}</p>}
        </div>

        {/* Sections - Only render what exists */}
        {sections.map((section, index) => 
          index === sections.length - 1 ? section : section
        )}
      </div>

      {/* Footer */}
      <div className="py-6 text-center text-sm border-t" style={{ backgroundColor, color: fontColor, borderColor: 'rgba(0,0,0,0.1)' }}>
        <p>
          <a href="/" className="hover:underline transition-colors" style={{ color: place.color || "#3B82F6" }}>
            Powered by Booking Bridge Link
          </a>
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;