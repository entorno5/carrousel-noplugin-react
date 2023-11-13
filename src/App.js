import "./App.scss";
import Slider from "./components/Slider";
const images = [
  {
    id: 1,
    src: "https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/1040x760/1629052.png",
    alt: "Oshae Brissett",
  },
  {
    id: 2,
    src: "https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/1040x760/201933.png",
    alt: "Blake Griffin",
  },
  {
    id: 3,
    src: "https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/1040x760/1628369.png",
    alt: "Jayson Tatum",
  },
  {
    id: 4,
    src: "https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/1040x760/1627759.png",
    alt: "Jaylen Brown",
  },
];
function App() {
  return (
    <div className="App">
      <Slider images={images} id="1" />
    </div>
  );
}

export default App;
