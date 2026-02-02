import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  Dimensions,
} from "react-native";
import { useEffect, useRef, useState } from "react";

import { Screen } from "../../src/components/Screen";
import { useDay } from "../../src/context/DayContext";
import { loadAllDailyIbadat } from "../../src/storage/localStorage";
import { SALAH_LIST, IBADAT_LIST } from "../../src/constants/ibadat";
import { useLang } from "../../src/context/LanguageContext";

type ScoreMap = Record<number, number>;

const { width } = Dimensions.get("window");

// 🔥 Screen-fit math (tabs safe)
const H_PADDING = 32; // container padding * 2
const GAP = 12;
const COLUMNS = 4.5;

const BOX_SIZE =
  (width - H_PADDING - GAP * (COLUMNS - 1)) / COLUMNS;

export default function CalendarTab() {
  const { day: selectedDay, setDay } = useDay();
  const { lang } = useLang();
  const isRTL = lang === "ur";

  const [scores, setScores] = useState<ScoreMap>({});

  const scaleRefs = useRef(
    Array.from({ length: 30 }, () => new Animated.Value(1))
  ).current;

  // 🔹 Load scores
  useEffect(() => {
    (async () => {
      const all = await loadAllDailyIbadat();
      const map: ScoreMap = {};

      Object.keys(all).forEach(key => {
        const d = Number(key);
        if (!Number.isFinite(d)) return;

        let score = 0;
        [...SALAH_LIST, ...IBADAT_LIST].forEach(i => {
          if (all[d]?.[i.id]) score += i.score;
        });

        map[d] = score;
      });

      setScores(map);
    })();
  }, [selectedDay]);

  const animatePress = (i: number) => {
    Animated.sequence([
      Animated.spring(scaleRefs[i], {
        toValue: 0.92,
        useNativeDriver: true,
      }),
      Animated.spring(scaleRefs[i], {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const getDayStyle = (d: number) => {
    const score = scores[d] ?? 0;

    if (d === selectedDay) return styles.selected;
    if (score > 0) return styles.completed;
    if (d < selectedDay && score === 0) return styles.missed;

    return styles.neutral;
  };

  return (
    <Screen>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Text
          style={[
            styles.heading,
            { textAlign: isRTL ? "right" : "left" },
          ]}
        >
          Ramadan Days
        </Text>

        <View style={styles.grid}>
          {Array.from({ length: 30 }).map((_, i) => {
            const d = i + 1;
            const score = scores[d] ?? 0;

            return (
              <Pressable
                key={d}
                onPress={() => {
                  animatePress(i);
                  setDay(d);
                }}
              >
                <Animated.View
                  style={[
                    styles.dayBox,
                    getDayStyle(d),
                    { transform: [{ scale: scaleRefs[i] }] },
                  ]}
                >
                  <Text style={styles.dayNumber}>{d}</Text>
                  {score > 0 && (
                    <Text style={styles.scoreText}>{score}</Text>
                  )}
                </Animated.View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },

  heading: {
    color: "#F5F5DC",
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 16,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12, // RN >= 0.71
  },

  // ✅ PERFECT FIT
  dayBox: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  dayNumber: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 18, // balanced
  },

  scoreText: {
    color: "#F5F5DC",
    fontSize: 11,
    marginTop: 4,
  },

  selected: {
    borderWidth: 2,
    borderColor: "#4AA3DF",
    backgroundColor: "#162922",
  },

  completed: {
    backgroundColor: "#1F7A4D",
  },

  missed: {
    backgroundColor: "#7A1F1F",
  },

  neutral: {
    backgroundColor: "#2A2A2A",
  },
});
