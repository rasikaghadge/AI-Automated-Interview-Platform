import { useEffect, useRef } from "react";

const ProfileModel = ({ profile, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Modal background
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        ref={modalRef}
        style={{
          backgroundColor: "white",
          padding: "30px", // Increased padding for better content breathing room
          borderRadius: "10px",
          width: "80%",
          maxWidth: "500px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Increased shadow intensity
          fontFamily: "sans-serif", // Using a generic sans-serif font
        }}
      >
        <img
          src={`data:image/png;base64, ${profile?.profilePicture}`}
          alt="HR Profile"
          style={{
            width: "20%",
            height: "auto",
            borderRadius: "40px 40px 40px 40px", // Rounded corners for image
          }}
        />
        <div style={{ padding: "20px" }}>
          <h2 style={{ marginBottom: "10px" }}>{profile.user.firstName + " " + profile.user.lastName}</h2> {/* Added heading for name */}
          <p style={{ marginBottom: "5px" }}>
            <strong>Email:</strong> {profile.user.email}
          </p>
          <p style={{ marginBottom: "5px" }}>
            <strong>Country:</strong> {profile.country}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap" }}> {/* Wrap technical and soft skills */}
            <p style={{ marginRight: "10px", marginBottom: "5px" }}>
              <strong>Technical Skills:</strong> {profile.technicalSkills.join(", ")}
            </p>
            <p style={{ marginBottom: "5px" }}>
              <strong>Soft Skills:</strong> {profile.softSkills.join(", ")}
            </p>
          </div>
          <p style={{ marginBottom: "5px" }}>
            <strong>Strengths:</strong> {profile.strengths.join(", ")}
          </p>
          <p style={{ marginBottom: "5px" }}>
            <strong>Weaknesses:</strong> {profile.weaknesses.join(", ")}
          </p>
          <p style={{ marginBottom: "5px" }}>
            <strong>Education:</strong> {profile.education}
          </p>
          <p>
            <strong>Experience:</strong> {profile.experience} years
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileModel;
