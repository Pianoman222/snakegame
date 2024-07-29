import React, { useState, useEffect, useCallback } from 'react';

const SnakeGame = () => {
  const [snake, setSnake] = useState([[4, 10], [4, 11]]);
  const [food, setFood] = useState([10, 10]);
  const [direction, setDirection] = useState([0, -1]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const moveSnake = useCallback(() => {
    const newSnake = [...snake];
    const head = newSnake[newSnake.length - 1];
    const newHead = [head[0] + direction[0], head[1] + direction[1]];

    newSnake.push(newHead);
    newSnake.shift();

    // Check for collision with food
    if (newHead[0] === food[0] && newHead[1] === food[1]) {
      newSnake.unshift([]); // Grow the snake
      setFood([Math.floor(Math.random() * 20), Math.floor(Math.random() * 20)]);
      setScore(score + 1);
    }

    // Check for collision with walls or itself
    if (
      newHead[0] < 0 ||
      newHead[0] >= 20 ||
      newHead[1] < 0 ||
      newHead[1] >= 20 ||
      newSnake.slice(0, -1).some(segment => segment[0] === newHead[0] && segment[1] === newHead[1])
    ) {
      setGameOver(true);
      return;
    }

    setSnake(newSnake);
  }, [snake, direction, food, score]);

  const changeDirection = useCallback((e) => {
    
    switch (e.key) {
      case 'ArrowUp':
        if (direction[1] !== 1) setDirection([0, -1]);
        break;
      case 'ArrowDown':
        if (direction[1] !== -1) setDirection([0, 1]);
        break;
      case 'ArrowLeft':
        if (direction[0] !== 1) setDirection([-1, 0]);
        break;
      case 'ArrowRight':
        if (direction[0] !== -1) setDirection([1, 0]);
        break;
      default:
        break;
    }
  }, [direction]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!gameOver) {
        moveSnake();
      }
    }, 200);

    document.addEventListener('keydown', changeDirection);

    return () => {
      clearInterval(interval);
      document.removeEventListener('keydown', changeDirection);
    };
  }, [moveSnake, changeDirection, gameOver]);

  const restartGame = () => {
    setSnake([[4, 10], [4, 11]]);
    setFood([10, 10]);
    setDirection([0, -1]);
    setGameOver(false);
    setScore(0);
  };

  return (
    <div style={styles.gameContainer}>
      {gameOver ? (
        <>
          <h1>Game Over</h1>
          <p>Score: {score}</p>
          <button onClick={restartGame}>Restart</button>
        </>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(20, 20px)', gridGap: '1px' }}>
          {[...Array(20)].map((_, row) =>
            [...Array(20)].map((_, col) => (
              <div
                key={`${row}-${col}`}
                style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: snake.some(segment => segment[0] === row && segment[1] === col)
                    ? 'black'
                    : food[0] === row && food[1] === col
                    ? 'red'
                    : 'white',
                }}
              />
            ))
          )}
        </div>
      )}
      <p>Score: {score}</p>
    </div>
  );
};

const styles = {
  gameContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  }
};

export default SnakeGame;