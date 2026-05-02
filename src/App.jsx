import { useState } from "react";
import Home from "./pages/Home";
import GameSetup from "./pages/GameSetup";
import GamePlay from "./pages/GamePlay";
import History from "./pages/History";
import Replay from "./pages/Replay";
import "./App.css";

function App() {
  const [page, setPage] = useState("home");
  const [gameConfig, setGameConfig] = useState({
    boardSize: 3,
    winCondition: 3,
    mode: "ai",
  });
  const [replayGame, setReplayGame] = useState(null);
  const handleStartGame = (config) => {
    setGameConfig(config);
    setPage("play");
  };

  const handleReplay = (game) => {
    setReplayGame(game);
    setPage("replay");
  };

  return (
    <>
      {page === "home" && (
        <Home
          onStart={() => setPage("setup")}
          onHistory={() => setPage("history")}
        />
      )}
      {page === "setup" && (
        <GameSetup
          onBack={() => setPage("home")}
          onStartGame={handleStartGame}
        />
      )}
      {page === "play" && (
        <GamePlay
          boardSize={gameConfig.boardSize}
          winCondition={gameConfig.winCondition}
          mode={gameConfig.mode}
          onBack={() => setPage("setup")}
          onHome={() => setPage("home")}
        />
      )}
      {page === "history" && (
        <History onBack={() => setPage("home")} onReplay={handleReplay} />
      )}
      {page === "replay" && (
        <Replay game={replayGame} onBack={() => setPage("history")} />
      )}
    </>
  );
}

export default App;
