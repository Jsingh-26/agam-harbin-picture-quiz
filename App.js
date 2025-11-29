import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const QUESTIONS = [
  {
    player: 'Agam',
    difficulty: 'easy',
    image:
      'https://pub-b70cb36a6853407fa468c5d6dec16633.r2.dev/204660/gemini/generate_image/response/2e27d8b3b971424dc5beebe058c38e87',
    question: 'What is this?',
    correctAnswer: 'TIGER',
    options: ['TIGER', 'LION', 'CAT'],
  },
  {
    player: 'Harbin',
    difficulty: 'hard',
    image:
      'https://pub-b70cb36a6853407fa468c5d6dec16633.r2.dev/204660/gemini/generate_image/response/9c90820911034a4536cd6f9313cff836',
    question: 'What is this?',
    correctAnswer: 'LION',
    options: ['LION', 'TIGER', 'BEAR'],
  },
  {
    player: 'Agam',
    difficulty: 'easy',
    image:
      'https://pub-b70cb36a6853407fa468c5d6dec16633.r2.dev/204660/gemini/generate_image/response/0104a5660349abefd86b492c745008f1',
    question: 'What is this?',
    correctAnswer: 'ELEPHANT',
    options: ['ELEPHANT', 'RHINO', 'HIPPO'],
  },
  {
    player: 'Harbin',
    difficulty: 'hard',
    image:
      'https://pub-b70cb36a6853407fa468c5d6dec16633.r2.dev/204660/gemini/generate_image/response/f4222079531e520f1bc95e60927c891b',
    question: 'What is this?',
    correctAnswer: 'GIRAFFE',
    options: ['GIRAFFE', 'DEER', 'HORSE'],
  },
  {
    player: 'Agam',
    difficulty: 'easy',
    image:
      'https://pub-b70cb36a6853407fa468c5d6dec16633.r2.dev/204660/gemini/generate_image/response/715262141a19ad71d13ce95d58a50400',
    question: 'What is this?',
    correctAnswer: 'APPLE',
    options: ['APPLE', 'ORANGE', 'BALL'],
  },
  {
    player: 'Harbin',
    difficulty: 'hard',
    image:
      'https://pub-b70cb36a6853407fa468c5d6dec16633.r2.dev/204660/gemini/generate_image/response/a7ec7f75ab1bf8f85a79c7d443ed0fe9',
    question: 'What is this?',
    correctAnswer: 'ORANGE',
    options: ['ORANGE', 'LEMON', 'GRAPEFRUIT'],
  },
  {
    player: 'Agam',
    difficulty: 'easy',
    image:
      'https://pub-b70cb36a6853407fa468c5d6dec16633.r2.dev/204660/gemini/generate_image/response/6468ba77be33052e6e856455e05303e6',
    question: 'What is this?',
    correctAnswer: 'DOG',
    options: ['DOG', 'CAT', 'FOX'],
  },
  {
    player: 'Harbin',
    difficulty: 'hard',
    image:
      'https://pub-b70cb36a6853407fa468c5d6dec16633.r2.dev/204660/gemini/generate_image/response/ff5098a463ab36a3b0b190ce5b20fa56',
    question: 'What is this?',
    correctAnswer: 'BIRD',
    options: ['BIRD', 'BAT', 'PLANE'],
  },
  {
    player: 'Agam',
    difficulty: 'easy',
    image:
      'https://pub-b70cb36a6853407fa468c5d6dec16633.r2.dev/204660/gemini/generate_image/response/12be572d6cced456a5145385d8bb997e',
    question: 'What is this?',
    correctAnswer: 'CAR',
    options: ['CAR', 'BUS', 'TRUCK'],
  },
  {
    player: 'Harbin',
    difficulty: 'hard',
    image:
      'https://pub-b70cb36a6853407fa468c5d6dec16633.r2.dev/204660/gemini/generate_image/response/53ed020fdf185299d07bc644a28ea032',
    question: 'What is this?',
    correctAnswer: 'BICYCLE',
    options: ['BICYCLE', 'MOTORCYCLE', 'SCOOTER'],
  },
];

export default function App() {
  const [started, setStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [agamScore, setAgamScore] = useState(0);
  const [harbinScore, setHarbinScore] = useState(0);
  const [turn, setTurn] = useState('Agam');
  const [feedback, setFeedback] = useState(''); // '' | 'correct' | 'wrong'
  const [orientation, setOrientation] = useState(
    Dimensions.get('window').width > Dimensions.get('window').height
      ? 'landscape'
      : 'portrait'
  );

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const feedbackScale = useRef(new Animated.Value(0)).current;

  // orientation listener
  useEffect(() => {
    const sub = Dimensions.addEventListener('change', ({ window }) => {
      setOrientation(window.width > window.height ? 'landscape' : 'portrait');
    });
    return () => sub?.remove?.();
  }, []);

  const resetGame = () => {
    setStarted(false);
    setCurrentIdx(0);
    setAgamScore(0);
    setHarbinScore(0);
    setTurn('Agam');
    setFeedback('');
  };

  const startGame = () => {
    resetGame();
    setStarted(true);
  };

  const handleAnswer = (selected) => {
    const q = QUESTIONS[currentIdx];
    if (selected === q.correctAnswer) {
      // correct
      setFeedback('correct');
      Animated.timing(feedbackScale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      if (turn === 'Agam') setAgamScore((s) => s + 10);
      else setHarbinScore((s) => s + 10);

      setTimeout(() => {
        Animated.timing(feedbackScale, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          setFeedback('');
          goToNext();
        });
      }, 2000);
    } else {
      // wrong
      setFeedback('wrong');
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 6,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -6,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start(() => setFeedback(''));
    }
  };

  const goToNext = () => {
    if (currentIdx + 1 >= QUESTIONS.length) {
      // game over
      setStarted(false);
    } else {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      setTurn(QUESTIONS[nextIdx].player);
    }
  };

  // ---------- UI Components ----------
  const StartScreen = () => (
    <LinearGradient colors={['#ff9a9e', '#fad0c4']} style={styles.full}>
      <Text style={styles.title}>Agam &amp; Harbin's Picture Quiz</Text>
      <TouchableOpacity style={styles.startBtn} onPress={startGame}>
        <Text style={styles.startBtnText}>Start Game</Text>
      </TouchableOpacity>
    </LinearGradient>
  );

  const GameOverScreen = () => (
    <LinearGradient colors={['#a1c4fd', '#c2e9fb']} style={styles.full}>
      <Text style={styles.gameOverTitle}>Game Over!</Text>
      <Text style={styles.finalScore}>
        Agam: {agamScore} | Harbin: {harbinScore}
      </Text>
      <TouchableOpacity style={styles.startBtn} onPress={startGame}>
        <Text style={styles.startBtnText}>Play Again</Text>
      </TouchableOpacity>
    </LinearGradient>
  );

  const GameScreen = () => {
    const q = QUESTIONS[currentIdx];
    const isLandscape = orientation === 'landscape';

    return (
      <LinearGradient colors={['#ffecd2', '#fcb69f']} style={styles.full}>
        {/* Scores */}
        <View style={styles.scoreBar}>
          <Text style={styles.scoreText}>
            Agam: {agamScore} | Harbin: {harbinScore}
          </Text>
        </View>

        {/* Turn Header */}
        <View style={styles.turnHeader}>
          <Text style={styles.turnText}>{turn}'s Turn</Text>
        </View>

        {/* Main Content */}
        <View
          style={[
            styles.mainContainer,
            isLandscape ? styles.row : styles.column,
          ]}
        >
          <Image source={{ uri: q.image }} style={styles.image} />

          <View style={styles.optionsWrapper}>
            {q.options.map((opt) => (
              <Animated.View
                key={opt}
                style={{
                  transform: [{ translateX: shakeAnim }],
                }}
              >
                <TouchableOpacity
                  style={styles.optionBtn}
                  onPress={() => handleAnswer(opt)}
                >
                  <Text style={styles.optionText}>{opt}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Feedback */}
        {feedback === 'correct' && (
          <Animated.View
            style={[
              styles.feedbackBox,
              { transform: [{ scale: feedbackScale }] },
            ]}
          >
            <Text style={styles.feedbackText}>✓ CORRECT!</Text>
          </Animated.View>
        )}
        {feedback === 'wrong' && (
          <View style={styles.feedbackBox}>
            <Text style={styles.feedbackText}>Try Again!</Text>
          </View>
        )}
      </LinearGradient>
    );
  };

  // ---------- Render ----------
  if (!started) {
    return currentIdx >= QUESTIONS.length ? (
      <GameOverScreen />
    ) : (
      <StartScreen />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <GameScreen />
    </SafeAreaView>
  );
}

// ---------- Styles ----------
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  full: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
  },
  startBtn: {
    backgroundColor: '#4caf50',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  startBtnText: { color: '#fff', fontSize: 20, fontWeight: '600' },

  gameOverTitle: {
    fontSize: 38,
    color: '#fff',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  finalScore: { fontSize: 24, color: '#fff', marginBottom: 30 },

  scoreBar: {
    width: '100%',
    paddingVertical: 8,
    backgroundColor: '#fff8e1',
    alignItems: 'center',
  },
  scoreText: { fontSize: 20, fontWeight: '600', color: '#333' },

  turnHeader: {
    width: '100%',
    paddingVertical: 10,
    backgroundColor: '#ffecb3',
    alignItems: 'center',
    marginBottom: 10,
  },
  turnText: { fontSize: 28, fontWeight: '700', color: '#d84315' },

  mainContainer: { flex: 1, width: '100%', padding: 10 },
  row: { flexDirection: 'row' },
  column: { flexDirection: 'column' },

  image: {
    flex: 1,
    width: '100%',
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: '#e0e0e0',
  },

  optionsWrapper: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },

  optionBtn: {
    backgroundColor: '#ff8a65',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: '70%',
    alignItems: 'center',
    marginVertical: 6,
  },
  optionText: { color: '#fff', fontSize: 22, fontWeight: '600' },

  feedbackBox: {
    position: 'absolute',
    bottom: 30,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  feedbackText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
});
