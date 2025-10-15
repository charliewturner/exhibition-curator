

function CollectionListItem({
  src,
  alt = "",
  label,
}){
  return (
    <div className="collection-tile">
      <img className="collection-thumb" src={src} alt={alt} />
      {label && <div className="collection-tile__label">{label}</div>}
    </div>
  );
}

export default CollectionListItem;
