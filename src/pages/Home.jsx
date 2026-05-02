import { FaPlay, FaHistory, FaCog } from "react-icons/fa";
import { MdSportsEsports } from "react-icons/md";
import "../pages/Home.css";

function Home({ onStart, onHistory }) {
  return (
    <main className="home-main">
      <div className="home-container">
        <MdSportsEsports className="home-icon-joy" />
        <h1 className="home-title">XO GAME</h1>
        <h3 className="home-desc">Ultimate Tic-Tac-Toe Experience</h3>

        <div className="home-btn-group">
          <button className="home-start-btn" onClick={onStart}>
            <FaPlay className="icon icon-start" />
            START GAME
          </button>

          <button className="home-history-btn" onClick={onHistory}>
            <FaHistory className="icon" />
            HISTORY
          </button>

          <button className="home-settings-btn">
            <FaCog className="icon" />
            SETTING
          </button>
        </div>
      </div>
    </main>
  );
}

export default Home;