import React, { useState } from "react";
import { usePlaceEditor } from "./PlaceEditorContext";
import { BOOKING_PLATFORMS, SOCIAL_PLATFORMS, SUPPORT_EXPERIENCE_PLATFORMS } from "./PlaceEditorContext";

const LinksManagementSection = () => {
  const {
    formData,
    linkType,
    setLinkType,
    newLinkPlatform,
    setNewLinkPlatform,
    newLinkUrl,
    setNewLinkUrl,
    templatePlatform,
    setTemplatePlatform,
    addBookingLink,
    toggleLinkActive,
    removeLink,
    toggleGlobalIconVisibility,
    toggleLinkIconVisibility,
    updateLinkDisplayName,
    updateSectionLabel,
    toggleSectionVisibility
  } = usePlaceEditor();

  // State for tracking which links are being edited
  const [editingDisplayName, setEditingDisplayName] = useState(null); // { type, index }
  const [displayNameValue, setDisplayNameValue] = useState("");
  const [showSectionSettings, setShowSectionSettings] = useState(false);
  const [editingSectionLabel, setEditingSectionLabel] = useState(null); // sectionType
  const [sectionLabelValue, setSectionLabelValue] = useState("");

  // Configuration objects for labels and suggestions
  const linkConfig = {
    booking: {
      label: "Booking Platform",
      addLabel: "Add a Booking Platform",
      placeholder: "Platform (e.g., Airbnb, VRBO, Direct Booking)",
      emptyState: "No booking platforms added yet.",
      tips: [
        'Add "Direct Booking" for your own booking system',
        "Add all platforms where your place is listed",
        "Links can be activated/deactivated seasonally"
      ]
    },
    social: {
      label: "Social Media Links",
      addLabel: "Add a Social Media Profile",
      placeholder: "Platform (e.g., Twitter, LinkedIn)",
      emptyState: "No social media links added yet."
    },
    support: {
      label: "Services & Experiences",
      addLabel: "Add a Service or Experience",
      placeholder: "Service (e.g., Travel Agent, Local Experiences)",
      emptyState: "No support or experience links added yet.",
      suggestions: [
        "Travel agent contact information",
        "Local experiences and tours",
        "Transportation services",
        "FAQ or support pages"
      ]
    }
  };

  // Get platforms based on the current link type
  const getCurrentPlatforms = () => {
    const platformMap = {
      booking: BOOKING_PLATFORMS,
      social: SOCIAL_PLATFORMS,
      support: SUPPORT_EXPERIENCE_PLATFORMS
    };
    return platformMap[linkType] || [];
  };

  // Get links based on the current link type
  const getCurrentLinks = () => {
    const linkMap = {
      booking: formData.bookingLinks || [],
      social: formData.socialLinks || [],
      support: formData.supportLinks || []
    };
    return linkMap[linkType] || [];
  };

  // Tab navigation component
  const TabNav = () => (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex overflow-x-auto pb-2 scrollbar-hide" aria-label="Tabs">
        {Object.entries({
          booking: linkConfig.booking.label,
          social: "Social Media",
          support: linkConfig.support.label
        }).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setLinkType(key)}
            className={`flex-shrink-0 py-3 px-4 border-b-2 font-medium text-sm whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              linkType === key
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>
    </div>
  );

  // Start editing display name for a link
  const startEditingDisplayName = (type, index, currentName) => {
    setEditingDisplayName({ type, index });
    setDisplayNameValue(currentName);
  };

  // Save the edited display name
  const saveDisplayName = () => {
    if (editingDisplayName) {
      updateLinkDisplayName(
        editingDisplayName.type, 
        editingDisplayName.index, 
        displayNameValue
      );
      setEditingDisplayName(null);
    }
  };

  // Start editing section label
  const startEditingSectionLabel = (sectionType) => {
    setEditingSectionLabel(sectionType);
    setSectionLabelValue(formData.sectionLabels[sectionType] || "");
  };

  // Save the edited section label
  const saveSectionLabel = () => {
    if (editingSectionLabel) {
      updateSectionLabel(editingSectionLabel, sectionLabelValue);
      setEditingSectionLabel(null);
    }
  };

  // Link item component with enhanced features
  const LinkItem = ({ link, index }) => (
    <div className="flex flex-col border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 flex-shrink-0">
          {link.showIcon !== false && link.icon ? (
            typeof link.icon === "string" ? (
              <img src={link.icon} alt={link.platform} className="w-full h-full object-contain" />
            ) : (
              React.createElement(link.icon, { className: "w-8 h-8 text-gray-600" })
            )
          ) : (
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0">
          {editingDisplayName && 
           editingDisplayName.type === linkType && 
           editingDisplayName.index === index ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={displayNameValue}
                onChange={(e) => setDisplayNameValue(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                autoFocus
              />
              <button
                onClick={saveDisplayName}
                className="p-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                title="Save display name"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <div 
              className="font-medium text-gray-900 cursor-pointer hover:text-blue-600 flex items-center gap-2"
              onClick={() => startEditingDisplayName(linkType, index, link.displayName || link.platform)}
            >
              {link.displayName || link.platform}
              <svg className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </div>
          )}
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <span className="font-medium">Platform:</span> {link.platform}
          </div>
          <div className="text-sm text-gray-500 truncate">{link.url}</div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Only show icon visibility toggle for booking and support links, not for social links */}
          {linkType !== "social" && (
            <button
              type="button"
              onClick={() => toggleLinkIconVisibility(linkType, index)}
              className={`p-1.5 rounded-full hover:bg-gray-100 transition-colors ${
                link.showIcon !== false ? "text-blue-600" : "text-gray-400"
              }`}
              title={link.showIcon !== false ? "Hide icon" : "Show icon"}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={link.showIcon !== false 
                    ? "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
                    : "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  }
                />
              </svg>
            </button>
          )}
          <button
            type="button"
            onClick={() => toggleLinkActive(linkType, index)}
            className={`p-1.5 rounded-full hover:bg-gray-100 transition-colors ${
              link.isActive ? "text-green-600" : "text-gray-400"
            }`}
            title={link.isActive ? "Deactivate link" : "Activate link"}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={link.isActive ? "M5 13l4 4L19 7" : "M18.364 18.364A9 9 0 005.636 5.636"}
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => removeLink(linkType, index)}
            className="p-1.5 rounded-full hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors"
            title="Delete link"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      
        {/* Additional instructions */}
        <div className="mt-2 text-xs text-gray-500 italic">
          Click on the name to edit how it appears on your page • 
          {link.platform !== (link.displayName || link.platform) && 
            <span className="text-blue-600 font-medium"> Custom display name set</span>
          }
        </div>
      </div>
    </div>
  );

  // Section settings component
  const SectionSettings = () => (
    <div className={`mt-6 mb-8 bg-gray-50 rounded-lg p-4 transition-all duration-300 ${showSectionSettings ? 'opacity-100' : 'opacity-0'}`}
         style={{ display: showSectionSettings ? 'block' : 'none' }}>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Section Settings</h3>
      
      <div className="space-y-4">
        {/* Booking Links Section Settings */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 border border-gray-200 rounded-md bg-white">
          <div className="flex-1">
            {editingSectionLabel === "bookingLinks" ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={sectionLabelValue}
                  onChange={(e) => setSectionLabelValue(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                  autoFocus
                />
                <button
                  onClick={saveSectionLabel}
                  className="p-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  title="Save section label"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">Booking Links Label:</span>
                <span className="text-gray-700">{formData.sectionLabels?.bookingLinks}</span>
                <button
                  onClick={() => startEditingSectionLabel("bookingLinks")}
                  className="ml-2 p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={formData.sectionVisibility?.bookingLinks !== false}
              onChange={() => toggleSectionVisibility("bookingLinks")}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span className="ml-2 text-sm text-gray-600">Show Label</span>
          </label>
        </div>

        {/* Support Links Section Settings */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 border border-gray-200 rounded-md bg-white">
          <div className="flex-1">
            {editingSectionLabel === "supportLinks" ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={sectionLabelValue}
                  onChange={(e) => setSectionLabelValue(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                  autoFocus
                />
                <button
                  onClick={saveSectionLabel}
                  className="p-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  title="Save section label"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">Support Links Label:</span>
                <span className="text-gray-700">{formData.sectionLabels?.supportLinks}</span>
                <button
                  onClick={() => startEditingSectionLabel("supportLinks")}
                  className="ml-2 p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={formData.sectionVisibility?.supportLinks !== false}
              onChange={() => toggleSectionVisibility("supportLinks")}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span className="ml-2 text-sm text-gray-600">Show Label</span>
          </label>
        </div>

        {/* Social Media Links Section Settings */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 border border-gray-200 rounded-md bg-white">
          <div className="flex-1">
            {editingSectionLabel === "socialLinks" ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={sectionLabelValue}
                  onChange={(e) => setSectionLabelValue(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                  autoFocus
                />
                <button
                  onClick={saveSectionLabel}
                  className="p-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  title="Save section label"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">Social Links Label:</span>
                <span className="text-gray-700">{formData.sectionLabels?.socialLinks}</span>
                <button
                  onClick={() => startEditingSectionLabel("socialLinks")}
                  className="ml-2 p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={formData.sectionVisibility?.socialLinks !== false}
              onChange={() => toggleSectionVisibility("socialLinks")}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span className="ml-2 text-sm text-gray-600">Show Label</span>
          </label>
        </div>
      </div>
    </div>
  );

  // Add link form component
  const AddLinkForm = () => {
    const config = linkConfig[linkType];
    
    return (
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{config.addLabel}</h3>
  
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select from templates
              </label>
              <select
                value={templatePlatform}
                onChange={(e) => setTemplatePlatform(e.target.value)}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">Select a platform</option>
                {getCurrentPlatforms().map((platform) => (
                  <option key={platform.name} value={platform.name}>
                    {platform.name}
                  </option>
                ))}
              </select>
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Or enter custom platform
              </label>
              <input
                type="text"
                placeholder={config.placeholder}
                value={newLinkPlatform}
                onChange={(e) => setNewLinkPlatform(e.target.value)}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
  
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="url"
              placeholder="https://example.com"
              value={newLinkUrl}
              onChange={(e) => setNewLinkUrl(e.target.value)}
              className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={addBookingLink}
              className="w-full sm:w-auto px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Add Link
            </button>
          </div>
  
          {/* Contextual tips and suggestions */}
          {(config.tips || config.suggestions) && (
            <div className="mt-3 p-3 bg-gray-50 rounded-md">
              <p className="text-sm font-medium text-gray-700 mb-1">
                {config.suggestions ? "Ideas:" : "💡 Tips:"}
              </p>
              <ul className="text-sm text-gray-600 list-disc pl-4 space-y-0.5">
                {(config.tips || config.suggestions)?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 sm:p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Manage Links</h2>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowSectionSettings(!showSectionSettings);
            return false; // Ensure no default action
          }}
          className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {showSectionSettings ? "Hide Section Settings" : "Section Settings"}
        </button>
      </div>

      <SectionSettings />
      
      {/* Global Toggle for Icons */}
      <div className="flex items-center justify-between mb-6 p-3 bg-gray-50 rounded-lg">
        <div>
          <h3 className="font-medium text-gray-900">Show Icons</h3>
          <p className="text-sm text-gray-500">Toggle visibility of all icons in your buttons</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            checked={formData.showIcons !== false}
            onChange={toggleGlobalIconVisibility}
            className="sr-only peer" 
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      <TabNav />

      <div className="space-y-6">
        {/* Display Links */}
        <div className="space-y-3">
          {getCurrentLinks().length > 0 ? (
            getCurrentLinks().map((link, index) => (
              <LinkItem key={index} link={link} index={index} />
            ))
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <p className="mt-2 text-sm text-gray-500">{linkConfig[linkType].emptyState}</p>
            </div>
          )}
        </div>

        <AddLinkForm />
      </div>
    </div>
  );
};

export default LinksManagementSection;