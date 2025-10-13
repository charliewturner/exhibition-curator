import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClick?: () => void; // you can wire this up later
};

function CollectionHeader({ children, onClick }: Props): React.JSX.Element {
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
