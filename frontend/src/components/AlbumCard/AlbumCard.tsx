import { useHistory } from 'react-router';
import './AlbumCard.css';

interface Props {
  albumData: any;
}

const AlbumCard: React.FC<Props> = ({ albumData }) => {
  const history = useHistory();

  return (
    <div
      className="albumCard"
      onClick={() => history.push(`/my/albums/${albumData.id}`)}
    >
      <div
        className="albumCard__colorCircle"
        style={{
          backgroundColor: `${albumData.color}`,
        }}
      >
        <h1 style={{ fontSize: '1rem' }}>{albumData.title[0].toUpperCase()}</h1>
      </div>

      <p>{albumData.title}</p>
    </div>
  );
};

export default AlbumCard;
