import { ReactNode } from "react";



function CollectionHeader({ children, onClick }){
  return (
    <button
      type="button"
      className="collection-card__bar"
      onClick={onClick}
      aria-label={`Open ${
        typeof children === "string" ? children : "collection"
      }`}
    >
      <div className="collection-card__title">
        <span className="collection-card__avatar" aria-hidden="true" />
        <h3>{children}</h3>
      </div>
      <span className="collection-card__cta">View all →</span>
    </button>
  );
}

export default CollectionHeader;
