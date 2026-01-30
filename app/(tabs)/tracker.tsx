import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
} from "react-native";
import { useEffect, useRef, useState } from "react";

import { SALAH_LIST, IBADAT_LIST } from "../../src/constants/ibadat";
import { getRamadanDay } from "../../src/logic/date";
import {
  loadDailyIbadat,
  saveDailyIbadat,
  DailyIbadatState,
} from "../../src/storage/localStorage";

export default function TrackerTab() {
  const day = getRamadanDay();

  const [state, setState] = useState<DailyIbadatState>({});
  const [score, setScore] = useState(0);

  // prevent reloading state again and again
  const initializedForDay = useRef<number | null>(null);

  const buildInitialState = (): DailyIbadatState => {
    const obj: DailyIbadatState = {};
    [...SALAH_LIST, ...IBADAT_LIST].forEach(i => {
      obj[i.id] = false;
    });
    return obj;
  };

  // 🔒 INITIAL LOAD (ONLY ONCE PER DAY)
  useEffect(() => {
    if (!day) return;
    if (initializedForDay.current === day) return;

    initializedForDay.current = day;

    (async () => {
      const saved = await loadDailyIbadat(day);
      const merged = { ...buildInitialState(), ...saved };
      setState(merged);
      calculateScore(merged);
    })();
  }, [day]);

  const calculateScore = (data: DailyIbadatState) => {
    let total = 0;
    [...SALAH_LIST, ...IBADAT_LIST].forEach(i => {
      if (data[i.id] === true) total += i.score;
    });
    setScore(total);
  };

  const toggle = (id: string) => {
    if (!day) return;

    setState(prev => {
      const updated = { ...prev, [id]: !prev[id] };
      calculateScore(updated);

      // save AFTER state update
      saveDailyIbadat(day, updated);

      return updated;
    });
  };

  if (!day) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Outside Ramadan</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Ramadan Day {day}</Text>
      <Text style={styles.score}>Score: {score} / 100</Text>

      <Text style={styles.section}>Salah</Text>
      {SALAH_LIST.map(item => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.label}>{item.label}</Text>
          <Switch
            value={state[item.id] === true}
            onValueChange={() => toggle(item.id)}
          />
        </View>
      ))}

      <Text style={styles.section}>Other Ibadat</Text>
      {IBADAT_LIST.map(item => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.label}>{item.label}</Text>
          <Switch
            value={state[item.id] === true}
            onValueChange={() => toggle(item.id)}
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E1A14",
    padding: 20,
  },
  heading: {
    color: "#F5F5DC",
    fontSize: 22,
    fontWeight: "bold",
  },
  score: {
    color: "#1F7A4D",
    fontSize: 18,
    marginBottom: 12,
  },
  section: {
    color: "#C7D2CC",
    fontSize: 16,
    marginTop: 16,
    marginBottom: 4,
  },
  card: {
    backgroundColor: "#162922",
    padding: 14,
    borderRadius: 12,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  text: {
    color: "#C7D2CC",
  },
});
