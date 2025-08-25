export default function VillagerList({ villagers }) {
    return (
      <ul className="villager-list">
        {villagers.map((villager, idx) => (
          <li key={idx} className="villager-item">
            <img src={villager.image_url} alt={villager.name} />
            <h2>{villager.name}</h2>
          </li>
        ))}
      </ul>
    );
  }
  