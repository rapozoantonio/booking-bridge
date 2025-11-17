import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../firebase";
import DOMPurify from 'dompurify';
// Still import these for UI rendering, but we won't store them in Firestore
import {
  Luggage,
  MapPin,
  Compass,
  UtensilsCrossed,
  Car,
  Headphones,
  HelpCircle
} from 'lucide-react'

// Platform templates with icons - kept outside component to prevent recreation on renders
export const BOOKING_PLATFORMS = [
  { name: "Direct Booking", icon: "https://cdn-icons-png.flaticon.com/512/2721/2721985.png" }, // Calendar icon
  { name: "Airbnb", icon: "https://cdn.worldvectorlogo.com/logos/airbnb.svg" }, // ✓ Valid
  { name: "Booking.com", icon: "https://cdn.worldvectorlogo.com/logos/bookingcom-1.svg" }, // ✓ Valid  
  { name: "Vrbo", icon: "https://cdn-icons-png.flaticon.com/512/2942/2942988.png" }, // House icon
  { name: "Expedia", icon: "https://cdn.worldvectorlogo.com/logos/expedia.svg" }, // ✓ Valid
  { name: "TripAdvisor", icon: "https://cdn.worldvectorlogo.com/logos/tripadvisor-logo.svg" }, // Use this URL
  { name: "OpenTable", icon: "https://cdn-icons-png.flaticon.com/512/1998/1998541.png" }, // Restaurant table
  { name: "Yelp", icon: "https://cdn.worldvectorlogo.com/logos/yelp-icon.svg" }, // ✓ Valid
  { name: "Grubhub", icon: "https://cdn.worldvectorlogo.com/logos/grubhub-1.svg" }, // ✓ Valid
  { name: "DoorDash", icon: "https://cdn.worldvectorlogo.com/logos/doordash-logo.svg" }, // ✓ Valid
  { name: "UberEats", icon: "https://cdn.worldvectorlogo.com/logos/uber-eats-1.svg" }, // ✓ Valid
];

export const SOCIAL_PLATFORMS = [
  { name: "Instagram", icon: "https://cdn.worldvectorlogo.com/logos/instagram-2016-5.svg" },
  { name: "Facebook", icon: "https://cdn.worldvectorlogo.com/logos/facebook-3-2.svg" },
  { name: "X", icon: "https://cdn.worldvectorlogo.com/logos/x-2.svg" }, // Replacing Twitter with X
  { name: "YouTube", icon: "https://cdn.worldvectorlogo.com/logos/youtube-6.svg" }, // Updated YouTube icon
  { name: "Pinterest", icon: "https://cdn.worldvectorlogo.com/logos/pinterest-3.svg" }, // Updated Pinterest icon
  { name: "TikTok", icon: "https://cdn.worldvectorlogo.com/logos/tiktok-1.svg" }, // Updated TikTok icon
  { name: "LinkedIn", icon: "https://cdn.worldvectorlogo.com/logos/linkedin-icon-2.svg" },
];

// Modified to use string-based icon names instead of React components
export const SUPPORT_EXPERIENCE_PLATFORMS = [
  { name: "Travel Agent", icon: "https://cdn-icons-png.flaticon.com/512/3169/3169832.png" }, // Luggage icon
  { name: "Local Guide", icon: "https://cdn-icons-png.flaticon.com/512/484/484167.png" }, // Map location
  { name: "Experiences", icon: "https://cdn-icons-png.flaticon.com/512/2335/2335330.png" }, // Adventure icon
  { name: "Gastronomy Tours", icon: "https://cdn-icons-png.flaticon.com/512/1077/1077047.png" }, // Chef hat
  { name: "Transportation", icon: "https://cdn-icons-png.flaticon.com/512/741/741407.png" }, // Car icon
  { name: "Customer Support", icon: "https://cdn-icons-png.flaticon.com/512/2706/2706962.png" }, // Headset
  { name: "FAQ", icon: "https://cdn-icons-png.flaticon.com/512/189/189665.png" }, // Question mark
];

// Utility functions for validation and sanitization
const isValidURL = (string) => {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  // Remove any HTML tags and scripts
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  }).trim();
};

const isValidHexColor = (color) => {
  return /^#([0-9A-F]{3}){1,2}$/i.test(color);
};

// Default form data - kept outside component to avoid recreation on each render
const DEFAULT_FORM_DATA = {
  name: "",
  description: "",
  location: "",
  isActive: true,
  customDomain: "",
  color: "#3B82F6", // Default blue color
  backgroundColor: "#FFFFFF", // Default white background
  fontColor: "#000000", // Default black text color
  buttonTextColor: "#FFFFFF", // Default white button text color
  linkStyle: "rounded", // Default rounded style
  bio: "",
  bookingLinks: [],
  socialLinks: [],
  supportLinks: [], // Add support links array
  showIcons: true, // Default to showing icons
  sectionLabels: {
    bookingLinks: "Book this property on:",
    supportLinks: "Experiences & Support:",
    socialLinks: "Follow on social media:"
  },
  sectionVisibility: {
    bookingLinks: true,
    supportLinks: true,
    socialLinks: true
  }
};

// Create context
const PlaceEditorContext = createContext(null);

export const PlaceEditorProvider = ({ children }) => {
  const { placeId } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(placeId);

  // State
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newLinkPlatform, setNewLinkPlatform] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [linkType, setLinkType] = useState("booking");
  const [templatePlatform, setTemplatePlatform] = useState("");

  // Use ref to track data fetch state
  const dataFetchedRef = React.useRef(false);
  
  // Fetch place data if in edit mode
  useEffect(() => {
    const fetchPlace = async () => {
      // Skip if not in edit mode, missing placeId, or already fetched data
      if (!isEditMode || !placeId || dataFetchedRef.current) {
        return;
      }

      setLoading(true);
      try {
        const placeRef = doc(db, "places", placeId);
        const placeSnap = await getDoc(placeRef);

        if (placeSnap.exists()) {
          const placeData = placeSnap.data();
          setFormData({
            name: placeData.name || "",
            description: placeData.description || "",
            location: placeData.location || "",
            isActive: placeData.isActive !== false,
            customDomain: placeData.customDomain || "",
            color: placeData.color || "#3B82F6",
            backgroundColor: placeData.backgroundColor || "#FFFFFF",
            fontColor: placeData.fontColor || "#000000",
            buttonTextColor: placeData.buttonTextColor || "#FFFFFF",
            linkStyle: placeData.linkStyle || "rounded",
            bio: placeData.bio || "",
            bookingLinks: placeData.bookingLinks || [],
            socialLinks: placeData.socialLinks || [],
            supportLinks: placeData.supportLinks || [], // Load support links or empty array
            showIcons: placeData.showIcons !== false, // Import showIcons setting (default to true if not present)
            sectionLabels: placeData.sectionLabels || {
              bookingLinks: "Book this property on:",
              supportLinks: "Experiences & Support:",
              socialLinks: "Follow on social media:"
            },
            sectionVisibility: placeData.sectionVisibility || {
              bookingLinks: true,
              supportLinks: true,
              socialLinks: true
            }
          });
          
          // Mark that we've fetched the data
          dataFetchedRef.current = true;
        } else {
          setError("Place not found");
          navigate("/dashboard");
        }
      } catch (err) {
        setError("Failed to load place data");
      } finally {
        setLoading(false);
      }
    };

    fetchPlace();
    
    // Reset the ref when placeId changes
    return () => {
      dataFetchedRef.current = false;
    };
  }, [placeId, isEditMode, navigate]);

  // Form handlers
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  // Link management - optimized with useCallback
  const addBookingLink = useCallback(() => {
    if ((!newLinkPlatform && !templatePlatform) || !newLinkUrl) {
      setError("Please provide both platform name and URL");
      return;
    }

    // Validate URL
    if (!isValidURL(newLinkUrl)) {
      setError("Please provide a valid URL (must start with http:// or https://)");
      return;
    }

    const platformName = sanitizeInput(templatePlatform || newLinkPlatform);

    let iconSource;
    let linkArray;
    
    // Determine which array and icon to use
    if (linkType === "booking") {
      const platformTemplate = BOOKING_PLATFORMS.find((p) => p.name.toLowerCase() === platformName.toLowerCase());
      iconSource = platformTemplate ? platformTemplate.icon : "";
      linkArray = "bookingLinks";
    } else if (linkType === "social") {
      const platformTemplate = SOCIAL_PLATFORMS.find((p) => p.name.toLowerCase() === platformName.toLowerCase());
      iconSource = platformTemplate ? platformTemplate.icon : "";
      linkArray = "socialLinks";
    } else if (linkType === "support") {
      const platformTemplate = SUPPORT_EXPERIENCE_PLATFORMS.find((p) => p.name.toLowerCase() === platformName.toLowerCase());
      iconSource = platformTemplate ? platformTemplate.icon : "";
      linkArray = "supportLinks";
    }

    // Add the new link to the appropriate array
    setFormData((prev) => ({
      ...prev,
      [linkArray]: [
        ...prev[linkArray],
        {
          platform: platformName,
          displayName: platformName, // Default display name is the platform name
          url: newLinkUrl,
          isActive: true,
          icon: iconSource,
          showIcon: prev.showIcons !== false, // Use the global setting as default for this link
        },
      ],
    }));

    setNewLinkPlatform("");
    setNewLinkUrl("");
    setTemplatePlatform("");
  }, [linkType, newLinkPlatform, newLinkUrl, templatePlatform, setError]);

  const toggleLinkActive = useCallback((type, index) => {
    setFormData((prev) => {
      if (type === "booking") {
        const newLinks = [...prev.bookingLinks];
        newLinks[index].isActive = !newLinks[index].isActive;
        return { ...prev, bookingLinks: newLinks };
      } else if (type === "social") {
        const newLinks = [...prev.socialLinks];
        newLinks[index].isActive = !newLinks[index].isActive;
        return { ...prev, socialLinks: newLinks };
      } else if (type === "support") {
        const newLinks = [...prev.supportLinks];
        newLinks[index].isActive = !newLinks[index].isActive;
        return { ...prev, supportLinks: newLinks };
      }
      return prev;
    });
  }, []);

  const removeLink = useCallback((type, index) => {
    setFormData((prev) => {
      if (type === "booking") {
        const newLinks = [...prev.bookingLinks];
        newLinks.splice(index, 1);
        return { ...prev, bookingLinks: newLinks };
      } else if (type === "social") {
        const newLinks = [...prev.socialLinks];
        newLinks.splice(index, 1);
        return { ...prev, socialLinks: newLinks };
      } else if (type === "support") {
        const newLinks = [...prev.supportLinks];
        newLinks.splice(index, 1);
        return { ...prev, supportLinks: newLinks };
      }
      return prev;
    });
  }, []);

  // Toggle global icon visibility
  const toggleGlobalIconVisibility = useCallback(() => {
    setFormData((prev) => {
      // Toggle the global setting
      const newShowIcons = !prev.showIcons;
      
      // Update booking and support links' showIcon property to match the global setting
      const updatedBookingLinks = prev.bookingLinks.map(link => ({
        ...link,
        showIcon: newShowIcons
      }));
      
      // For social links, we always preserve the icons (never hide them)
      const updatedSocialLinks = prev.socialLinks.map(link => ({
        ...link,
        showIcon: true // Always keep social media icons visible
      }));
      
      const updatedSupportLinks = prev.supportLinks.map(link => ({
        ...link,
        showIcon: newShowIcons
      }));
      
      // Return updated form data with new global setting and updated links
      return {
        ...prev,
        showIcons: newShowIcons,
        bookingLinks: updatedBookingLinks,
        socialLinks: updatedSocialLinks,
        supportLinks: updatedSupportLinks
      };
    });
  }, []);

  // Toggle icon visibility for a specific link
  const toggleLinkIconVisibility = useCallback((type, index) => {
    setFormData((prev) => {
      if (type === "booking") {
        const newLinks = [...prev.bookingLinks];
        newLinks[index].showIcon = !newLinks[index].showIcon;
        return { ...prev, bookingLinks: newLinks };
      } else if (type === "social") {
        const newLinks = [...prev.socialLinks];
        newLinks[index].showIcon = !newLinks[index].showIcon;
        return { ...prev, socialLinks: newLinks };
      } else if (type === "support") {
        const newLinks = [...prev.supportLinks];
        newLinks[index].showIcon = !newLinks[index].showIcon;
        return { ...prev, supportLinks: newLinks };
      }
      return prev;
    });
  }, []);

  // Update display name for a link
  const updateLinkDisplayName = useCallback((type, index, displayName) => {
    setFormData((prev) => {
      if (type === "booking") {
        const newLinks = [...prev.bookingLinks];
        newLinks[index].displayName = displayName;
        return { ...prev, bookingLinks: newLinks };
      } else if (type === "social") {
        const newLinks = [...prev.socialLinks];
        newLinks[index].displayName = displayName;
        return { ...prev, socialLinks: newLinks };
      } else if (type === "support") {
        const newLinks = [...prev.supportLinks];
        newLinks[index].displayName = displayName;
        return { ...prev, supportLinks: newLinks };
      }
      return prev;
    });
  }, []);

  // Update section label
  const updateSectionLabel = useCallback((sectionType, label) => {
    setFormData((prev) => ({
      ...prev,
      sectionLabels: {
        ...prev.sectionLabels,
        [sectionType]: label
      }
    }));
  }, []);

  // Toggle section visibility
  const toggleSectionVisibility = useCallback((sectionType) => {
    setFormData((prev) => ({
      ...prev,
      sectionVisibility: {
        ...prev.sectionVisibility,
        [sectionType]: !prev.sectionVisibility[sectionType]
      }
    }));
  }, []);

  // Handle form submission without image uploads
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!formData.name) {
        throw new Error("Place name is required");
      }

      // Check if user is authenticated
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated. Please log in again.");
      }

      // Validate and sanitize colors
      if (formData.color && !isValidHexColor(formData.color)) {
        throw new Error("Invalid button color format. Please use hex color (e.g., #3B82F6)");
      }
      if (formData.backgroundColor && !isValidHexColor(formData.backgroundColor)) {
        throw new Error("Invalid background color format. Please use hex color (e.g., #FFFFFF)");
      }
      if (formData.fontColor && !isValidHexColor(formData.fontColor)) {
        throw new Error("Invalid font color format. Please use hex color (e.g., #000000)");
      }
      if (formData.buttonTextColor && !isValidHexColor(formData.buttonTextColor)) {
        throw new Error("Invalid button text color format. Please use hex color (e.g., #FFFFFF)");
      }

      // Validate location map URL if provided
      if (formData.locationMapUrl && !isValidURL(formData.locationMapUrl)) {
        throw new Error("Invalid location map URL. Please provide a valid URL.");
      }

      // Prepare place data with sanitized inputs
      const placeData = {
        ...formData,
        // Sanitize text inputs
        name: sanitizeInput(formData.name),
        description: sanitizeInput(formData.description),
        location: sanitizeInput(formData.location),
        bio: sanitizeInput(formData.bio),
        customDomain: sanitizeInput(formData.customDomain),
        userId: user.uid,
        updatedAt: serverTimestamp(),
      };

      // Save to Firestore
      if (isEditMode) {
        // Update existing place
        await setDoc(doc(db, "places", placeId), placeData, { merge: true });
      } else {
        // Create new place
        placeData.createdAt = serverTimestamp();
        // Ensure arrays are always arrays
        placeData.bookingLinks = Array.isArray(placeData.bookingLinks) ? placeData.bookingLinks : [];
        placeData.socialLinks = Array.isArray(placeData.socialLinks) ? placeData.socialLinks : [];
        placeData.supportLinks = Array.isArray(placeData.supportLinks) ? placeData.supportLinks : [];
        await addDoc(collection(db, "places"), placeData);
      }

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to save place. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [formData, isEditMode, placeId, navigate]);

  // Memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    placeId,
    isEditMode,
    formData,
    loading,
    error,
    newLinkPlatform,
    newLinkUrl,
    linkType,
    templatePlatform,
    handleChange,
    addBookingLink,
    toggleLinkActive,
    removeLink,
    setNewLinkPlatform,
    setNewLinkUrl,
    setTemplatePlatform,
    setLinkType,
    setError,
    handleSubmit,
    toggleGlobalIconVisibility,
    toggleLinkIconVisibility,
    updateLinkDisplayName,
    updateSectionLabel,
    toggleSectionVisibility,
  }), [
    placeId,
    isEditMode,
    formData,
    loading,
    error,
    newLinkPlatform,
    newLinkUrl,
    linkType,
    templatePlatform,
    handleChange,
    addBookingLink,
    toggleLinkActive,
    removeLink,
    setNewLinkPlatform,
    setNewLinkUrl,
    setTemplatePlatform,
    setLinkType,
    handleSubmit,
    toggleGlobalIconVisibility,
    toggleLinkIconVisibility,
    updateLinkDisplayName,
    updateSectionLabel,
    toggleSectionVisibility
  ]);

  return <PlaceEditorContext.Provider value={contextValue}>{children}</PlaceEditorContext.Provider>;
};

// Custom hook for accessing the context
export const usePlaceEditor = () => {
  const context = useContext(PlaceEditorContext);
  if (!context) {
    throw new Error("usePlaceEditor must be used within a PlaceEditorProvider");
  }
  return context;
};
