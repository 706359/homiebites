import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import "./Gallery.css";

const Gallery = () => {
  const { t } = useLanguage();

  const galleryItems = [
    {
      id: 1,
      src: "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg",
      alt: "Freshly prepared Indian thali",
      caption: t("gallery.fullTiffin"),
    },
    {
      id: 2,
      src: "https://images.pexels.com/photos/1117862/pexels-photo-1117862.jpeg",
      alt: "Homemade rotis and curry",
      caption: t("gallery.rotiSabji"),
    },
    {
      id: 3,
      src: "https://images.pexels.com/photos/7625056/pexels-photo-7625056.jpeg",
      alt: "Stuffed parathas with curd",
      caption: t("gallery.stuffedParatha"),
    },
    {
      id: 4,
      src: "https://images.pexels.com/photos/674574/pexels-photo-674574.jpeg",
      alt: "Khichdi with vegetables",
      caption: t("gallery.khichdi"),
    },
  ];

  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = (item) => setSelectedImage(item);
  const closeModal = () => setSelectedImage(null);

  return (
    <section id="gallery" className="gallery-section">
      <div className="section-container">
        <h2 className="section-heading">{t("gallery.title")}</h2>
        <p className="section-subtitle">{t("gallery.subtitle")}</p>

        <div className="gallery-grid">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className="gallery-item"
              onClick={() => openModal(item)}
              role="button"
              tabIndex={0}
              aria-label={`View ${item.caption}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openModal(item);
                }
              }}
            >
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <div className="gallery-caption">{item.caption}</div>
            </div>
          ))}
        </div>

        <div className="gallery-cta">
          <Link to="/menu" className="btn btn-ghost btn-large">
            {t("gallery.viewFullMenu")}
          </Link>
        </div>

        {selectedImage && (
          <div className="gallery-modal" onClick={closeModal}>
            <div
              className="gallery-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="gallery-modal-close"
                onClick={closeModal}
                aria-label="Close gallery modal"
              >
                &times;
              </button>
              <img src={selectedImage.src} alt={selectedImage.alt} />
              <div className="gallery-modal-caption">
                {selectedImage.caption}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;
