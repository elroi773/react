import "./Card.css";

export const Card = ({
  image,
  title,
  subtitle,
  description,
  onProfile,
  onFollow,
}) => (
  <div className="card">
    <img src={image} alt={title} />
    <div>
      <h2>{title}</h2>
      <h3>{subtitle}</h3>
      <p>{description}</p>
      <div className="buttons">
        <button onClick={onProfile}>Profile</button>
        <button onClick={onFollow} className="primary">
          Follow
        </button>
      </div>
    </div>
  </div>
);
