type Props = {
  src: string;
  alt?: string;
  label?: string;
};

function CollectionListItem({
  src,
  alt = "",
  label,
}: Props): React.JSX.Element {
  return (
    <div className="collection-tile">
      <img className="collection-thumb" src={src} alt={alt} />
      {label && <div className="collection-tile__label">{label}</div>}
    </div>
  );
}

export default CollectionListItem;
