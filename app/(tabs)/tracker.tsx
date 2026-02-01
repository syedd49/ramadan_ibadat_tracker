import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";

import { SALAH_LIST, IBADAT_LIST } from "../../src/constants/ibadat";
import {
  loadDailyIbadat,
  saveDailyIbadat,
  DailyIbadatState,
} from "../../src/storage/localStorage";
import { useDay } from "../../src/context/DayContext";

export default function TrackerTab() {
  const { selectedDay, setSelectedDay } = useDay();

  const [state, setState] = useState<DailyIbadatState>({});
  const [score, setScore] = useState(0);

  const buildInitialState = (): DailyIbadatState => {
    const obj: DailyIbadatState = {};
    [...SALAH_LIST, ...IBADAT_LIST].forEach(i => {
      obj[i.id] = false;
    });
    return obj;
  };

  // 🔄 Reload state whenever day changes
  useEffect(() => {
    (async () => {
      const saved = await loadDailyIbadat(selectedDay);
      const merged = saved
        ? { ...buildInitialState(), ...saved }
        : buildInitialState();

      setState(merged);
      calculateScore(merged);
    })();
  }, [selectedDay]);

  const calculateScore = (data: DailyIbadatState) => {
    let total = 0;
    [...SALAH_LIST, ...IBADAT_LIST].forEach(i => {
      if (data[i.id]) total += i.score;
    });
    setScore(total);
  };

  const toggle = (id: string) => {
    setState(prev => {
      const updated = { ...prev, [id]: !prev[id] };
      calculateScore(updated);
      return updated;
    });
  };

  const saveProgress = async () => {
    await saveDailyIbadat(selectedDay, state);
    Alert.alert("Saved", `Day ${selectedDay} saved`);
  };

  const markDayComplete = () => {
    Alert.alert(
      "Complete Day?",
      `Day ${selectedDay} will be marked complete.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            await saveDailyIbadat(selectedDay, state);
            setSelectedDay(selectedDay + 1);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 200 }}
      >
        <Text style={styles.heading}>Day {selectedDay}</Text>
        <Text style={styles.score}>Score: {score}</Text>

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

      {/* 🔽 ACTION BAR */}
      <View style={styles.bottomBar}>
        <Pressable style={styles.saveBtn} onPress={saveProgress}>
          <Text style={styles.btnText}>Save</Text>
        </Pressable>

        <Pressable style={styles.completeBtn} onPress={markDayComplete}>
          <Text style={styles.btnText}>Complete Day</Text>
        </Pressable>

        <View style={styles.dayNav}>
          <Pressable
            onPress={() => selectedDay > 1 && setSelectedDay(selectedDay - 1)}
          >
            <Text style={styles.link}>◀ Previous</Text>
          </Pressable>

          <Pressable onPress={() => setSelectedDay(selectedDay + 1)}>
            <Text style={styles.link}>Next ▶</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0E1A14" },
  container: { padding: 20 },
  heading: { color: "#F5F5DC", fontSize: 22, fontWeight: "bold" },
  score: { color: "#1F7A4D", fontSize: 18 },
  section: { color: "#C7D2CC", fontSize: 16, marginTop: 16 },
  card: {
    backgroundColor: "#162922",
    padding: 14,
    borderRadius: 12,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: { color: "#FFFFFF", fontSize: 16 },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#0E1A14",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#1F7A4D",
  },
  saveBtn: {
    backgroundColor: "#162922",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 8,
  },
  completeBtn: {
    backgroundColor: "#1F7A4D",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
  dayNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  link: { color: "#1F7A4D", fontSize: 16 },
});
