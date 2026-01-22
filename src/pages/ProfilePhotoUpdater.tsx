import React, { useState } from "react";
import { updateProfilePhoto } from "../api/UtilisateurApi";
import toast from "react-hot-toast";

// export default ProfilePhotoUpdater;
type ProfilePhotoUpdaterProps = {
  currentPhoto: string;
  onPhotoUpdated: (newPhotoUrl: string) => void;
};

const ProfilePhotoUpdater = ({
  currentPhoto,
  onPhotoUpdated,
}: ProfilePhotoUpdaterProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    if (!selectedFile) return;
    setLoading(true);

    try {
      // Appel API pour mettre à jour la photo
      const updatedUser = await updateProfilePhoto(selectedFile);
      onPhotoUpdated(updatedUser.photoProfil ?? currentPhoto);

      // Réinitialiser le composant
      setPreview(null);
      setSelectedFile(null);
    } catch (err) {
      console.error("Erreur lors de la mise à jour de la photo", err);
      toast.error("Erreur lors de la mise à jour de la photo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-photo-updater">
      <label style={{ cursor: "pointer" }}>
        <img
          src={preview || currentPhoto}
          alt="Photo de profil"
          className="profile-pic"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          hidden
        />
      </label>

      {selectedFile && (
        <button
          className="update-button"
          onClick={handleUpdate}
          disabled={loading}
        >
          {loading ? "Mise à jour..." : "Mettre à jour"}
        </button>
      )}
    </div>
  );
};

export default ProfilePhotoUpdater;
