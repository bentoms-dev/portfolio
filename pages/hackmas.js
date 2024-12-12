import React, { useState, useEffect } from "react";
import Snowfall from "react-snowfall";

const Hackmas = () => {
  const [name, setName] = useState("");
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = () => {
    if (name.trim()) {
      setGameStarted(true);
    } else {
      alert("Please enter your name to start!");
    }
  };

  return (
    <div style={styles.container}>
      {!gameStarted ? (
        <div style={styles.intro}>
          <h1>Welcome to Hackmas 🎄</h1>
          <p>Enter your name to start hacking and reveal your Christmas message!</p>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />
          <button onClick={startGame} style={styles.button}>
            Start Hackmas
          </button>
        </div>
      ) : (
        <Game name={name} />
      )}
    </div>
  );
};

const Game = ({ name }) => {
  const [level, setLevel] = useState(1);
  const [output, setOutput] = useState([
    `Welcome to Hackmas, ${name}!`,
    "Level 1: Find the password to access the next level.",
  ]);
  const [input, setInput] = useState("");
  const [gameState, setGameState] = useState({ level3Unlocked: false });
  const [timer, setTimer] = useState(60);
  const [secretKey, setSecretKey] = useState("");
  const [showTryAgain, setShowTryAgain] = useState(false);

  useEffect(() => {
    let countdown;
    if (level === 3) {
        console.log(
          "%cI'm not of glass, but I hold reflections. Dare to inspect me, and find the right connections",
          "color: #0f0; font-size: 16px;"
        );

        window.hackmas = {};

        Object.defineProperty(window.hackmas, "getClue", {
          value: () => {
            console.log(
              "%cAh, so you dare to seek reflections? Perhaps you should ask for a little clarity: `askForClue('yes')`.",
              "color: #0f0; font-size: 16px;"
            );
            return "Hint: Seek clarity with `askForClue('yes')`.";
          },
          writable: false,
        });

        Object.defineProperty(window, "askForClue", {
          value: (response) => {
            if (response.toLowerCase() === "yes") {
              console.log(
                "%cThe reflection sharpens. Call upon `unlockNextLevel()` to uncover the truth.",
                "color: #0f0; font-size: 16px;"
              );
              return "Clue: Use `unlockNextLevel()`.";
            } else {
              console.log("%cSome reflections remain murky. Perhaps you'll see more when you're ready.", "color: #0f0; font-size: 16px;");
              return "No clarity granted.";
            }
          },
          writable: false,
          configurable: true,
        });

        Object.defineProperty(window, "unlockNextLevel", {
            value: () => {
              console.log("%c🎉 Level unlocked! Moving to the next level...", "color: #0f0; font-size: 16px;");
              setGameState((prev) => ({ ...prev, level3Unlocked: true }));

              // Update output and move to the next level
              setOutput((prev) => [
                ...prev,
                "🎉 Correct! Moving to the next level...",
                `Level ${level + 1}: ${challenges.find((c) => c.level === level + 1)?.prompt || ""}`,
              ]);
              setLevel((prev) => prev + 1); // Progress the game to the next level
            },
            writable: false,
            configurable: true,
         });
      } else if (level === 4) {
        setTimer(60);
        setOutput((prev) => [
          ...prev,
          "⏳ You have 60 seconds to find the key!",
        ]);

        // Generate and store the secret key
        const generatedKey = `secret-key-${Math.random().toString(36).substring(2, 8)}`;
        setSecretKey(generatedKey);
        const encodedKey = btoa(generatedKey);
        countdown = setInterval(() => {
            setTimer((prev) => {
              if (prev <= 1) {
                clearInterval(countdown);

                // Clear the console
                console.clear();

                // Display "ACCESS DENIED" flashing
                let isVisible = true;
                const accessDeniedInterval = setInterval(() => {
                  setOutput((prev) => [
                    ...prev,
                    isVisible ? "%cACCESS DENIED" : "%c              ", // Flashing text
                  ]);
                  console.clear(); // Clear the console on each toggle
                  console.log(isVisible ? "%cACCESS DENIED" : "", "color: red; font-size: 24px; font-weight: bold;");
                  isVisible = !isVisible;
                }, 500); // Flash every 500ms

                // Stop flashing after 5 seconds and show the Try Again button
                setTimeout(() => {
                  clearInterval(accessDeniedInterval);
                  setShowTryAgain(true); // Show the Try Again button
                }, 5000);

                return 0;
              }
              return prev - 1;
            });
          }, 1000);

        fetch("https://run.mocky.io/v3/cacc84eb-d86f-4d5c-8485-abbe9b8d86b1", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Hackmas-Key": encodedKey,
          },
          body: JSON.stringify({ hint: `Base64-encoded key: ${encodedKey}` }),
        })
          .then(() => {
            console.log("%cRequest sent! Can you find the key?", "color: #0f0; font-size: 16px;");
          })
          .catch((err) => console.error("Error simulating request:", err));
      }
      return () => clearInterval(countdown);
  }, [level]);

  const challenges = [
    {
      level: 1,
      prompt: "Find the password to access the next level.",
      validate: (answer) => answer === "rudolf2024",
    },
    {
      level: 2,
      prompt: "Decode this message: SSdtIG9uIHRoZSBuYXVnaHR5IGxpc3Q=",
      validate: (answer) => answer === "I'm on the naughty list",
    },
    {
      level: 3,
      prompt: "Modify the game's state to continue.",
      validate: (answer) => {
        if (answer === "unlock") {
          setGameState((prev) => ({ ...prev, level3Unlocked: true }));
          return true;
        }
        return false;
      },
    },
    {
        level: 4,
        prompt: "A hidden key was sent to the server. Intercept it to proceed!",
        validate: (answer) => {
          return answer === secretKey;
        },
      }
  ];

  const handleCommand = () => {
    const currentChallenge = challenges.find((c) => c.level === level);

    if (level === 3 && gameState.level3Unlocked) {
      setOutput((prev) => [
        ...prev,
        "🎉 Correct! Moving to the next level...",
        `Level ${level + 1}: ${challenges.find((c) => c.level === level + 1)?.prompt || ""}`,
      ]);
      setLevel((prev) => prev + 1);
      setInput("");
      return;
    }

    if (currentChallenge.validate(input)) {
      setOutput((prev) => [
        ...prev,
        "🎉 Correct! Moving to the next level...",
        `Level ${level + 1}: ${challenges.find((c) => c.level === level + 1)?.prompt || ""}`,
      ]);
      setLevel((prev) => prev + 1);
      setInput("");
    } else {
      setOutput((prev) => [
        ...prev,
        `Level ${level}: ${currentChallenge.prompt}`,
        "❌ Incorrect! Try again.",
      ]);
    }
  };

    // Final Game Screen
    if (level > challenges.length) {
        return (
        <div>
            <Snowfall /> {/* Adds the snowfall effect */}
            <h1>Congratulations, {name}!</h1>
            <p style={{ fontStyle: "italic", fontSize: "1.5em" }}>
              🎅 Merry Christmas, {name}! Thank you for your incredible dedication and contributions this year.
              Wishing you a joyful holiday season filled with laughter, warmth, and all the things you love.
              Here&#39;s to an amazing 2025 ahead! 🎄
            </p>
        </div>
        );
    }

  return (
    <div style={styles.container}>
      <div style={styles.terminal}>
        {output.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your answer..."
          style={styles.input}
        />
        <button onClick={handleCommand} style={styles.button}>
          Submit
        </button>
        {showTryAgain && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button
            onClick={() => {
                setTimer(60); // Reset the timer
                setShowTryAgain(false); // Hide the button
                setOutput((prev) => [
                ...prev,
                "🔄 Restarting Level 4... ⏳",
                "Level 4: A hidden key was sent to the server. Intercept it to proceed!",
                ]);
                // Regenerate the secret key
                const regeneratedKey = `secret-key-${Math.random().toString(36).substring(2, 8)}`;
                setSecretKey(regeneratedKey); // Store the new key
                const encodedKey = btoa(regeneratedKey); // Encode the new key
                console.log(`Encoded Key for Level 4: ${encodedKey}`);
            }}
            style={{
                padding: "10px 20px",
                fontSize: "18px",
                backgroundColor: "#f00",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
            }}
            >
            Try Again
            </button>
  </div>
)}
      </div>
      <div style={{ marginTop: "10px", fontSize: "1.2em", color: "#0f0", textAlign: "center" }}>
        {level === 4 && timer > 0 ? `⏳ Time left: ${timer}s` : null}
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    maxWidth: "1400px",
    margin: "0 auto"
  },
  terminal: {
    backgroundColor: "#222",
    padding: "1em",
    margin: "1em auto",
    borderRadius: "5px",
    maxWidth: "1400px",
    width: "100%",
    height: "300px",
    overflowY: "auto",
    color: "#0f0",
    fontFamily: "monospace",
    fontSize: "1em",
    border: "1px solid #0f0",
  },
  inputContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "1em",
  },
  input: {
    flex: "1",
    padding: "0.5em",
    margin: "0.5em",
    borderRadius: "5px",
    border: "1px solid #0f0",
    color: "#0f0",
    backgroundColor: "#000",
  },
  button: {
    padding: "0.5em 1em",
    borderRadius: "5px",
    backgroundColor: "#0f0",
    color: "#000",
    border: "none",
    cursor: "pointer",
  },
};

export default Hackmas;
