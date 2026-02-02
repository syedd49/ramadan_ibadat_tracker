import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Pressable,
  Alert,
} from "react-native";
import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";

import { useLang } from "../../src/context/LanguageContext";
import { useDay } from "../../src/context/DayContext";
import {
  loadAllDailyIbadat,
  saveAllDailyIbadat,
} from "../../src/storage/localStorage";
import { SALAH_LIST, IBADAT_LIST } from "../../src/constants/ibadat";
import { Screen } from "../../src/components/Screen";

type DayState = Record<string, boolean>;

export default function TrackerTab() {
  const { t, lang } = useLang();
  const { day, nextDay, prevDay } = useDay();
  const isRTL = lang === "ur";

  const [state, setState] = useState<DayState>({});

  // 🔹 Load data whenever day changes
  useFocusEffect(
    useCallback(() => {
      (async () => {
        const all = await loadAllDailyIbadat();
        setState(all[day] || {});
      })();
    }, [day])
  );

  const toggle = (id: string) => {
    setState(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const save = async () => {
    const all = await loadAllDailyIbadat();
    all[day] = state;
    await saveAllDailyIbadat(all);

    Alert.alert("Saved ✅", "Aaj ki ibadat save ho gayi");
  };

  const completeDay = async () => {
    const all = await loadAllDailyIbadat();
    all[day] = state;
    await saveAllDailyIbadat(all);

    setState({});
    nextDay();

    Alert.alert(
      "Day Completed 🌙",
      "Aaj ka din complete ho gaya. Agla din shuru ho gaya."
    );
  };

  const goPrev = () => {
    setState({});
    prevDay();
    Alert.alert("Previous Day", "Pichhle din par shift ho gaye");
  };

  const goNext = () => {
    setState({});
    nextDay();
    Alert.alert("Next Day", "Agla din shuru ho gaya");
  };

  return (
    <Screen>
      {/* 🔹 SCROLLABLE CONTENT */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingTop: 24, paddingBottom: 120 }}
      >
        <Text
          style={[
            styles.heading,
            { textAlign: isRTL ? "right" : "left" },
          ]}
        >
          {t("tracker_heading")} – Day {day}
        </Text>

        {/* SALAH */}
        <Text
          style={[
            styles.sectionTitle,
            { textAlign: isRTL ? "right" : "left" },
          ]}
        >
          {t("tracker_salah")}
        </Text>

        {SALAH_LIST.map(s => (
          <Row
            key={s.id}
            label={t(`salah_${s.id}`)}
            value={!!state[s.id]}
            onToggle={() => toggle(s.id)}
            rtl={isRTL}
          />
        ))}

        {/* IBADAT */}
        <Text
          style={[
            styles.sectionTitle,
            { textAlign: isRTL ? "right" : "left" },
          ]}
        >
          {t("tracker_ibadat")}
        </Text>

        {IBADAT_LIST.map(i => (
          <Row
            key={i.id}
            label={t(`ibadat_${i.id}`)}
            value={!!state[i.id]}
            onToggle={() => toggle(i.id)}
            rtl={isRTL}
          />
        ))}
      </ScrollView>

      {/* 🔹 FIXED FOOTER ACTIONS */}
      <View
        style={[
          styles.footer,
          { flexDirection: isRTL ? "row-reverse" : "row" },
        ]}
      >
        <Btn label={t("prev")} onPress={goPrev} />
        <Btn label={t("save")} onPress={save} />
        <Btn
          label={t("complete_day")}
          onPress={completeDay}
          primary
        />
        <Btn label={t("next")} onPress={goNext} />
      </View>
    </Screen>
  );
}

function Row({
  label,
  value,
  onToggle,
  rtl,
}: {
  label: string;
  value: boolean;
  onToggle: () => void;
  rtl: boolean;
}) {
  return (
    <View
      style={[
        styles.row,
        { flexDirection: rtl ? "row-reverse" : "row" },
      ]}
    >
      <Text style={[styles.label, { textAlign: rtl ? "right" : "left" }]}>
        {label}
      </Text>
      <Switch value={value} onValueChange={onToggle} />
    </View>
  );
}

function Btn({
  label,
  onPress,
  primary,
}: {
  label: string;
  onPress: () => void;
  primary?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.btn, primary && styles.btnPrimary]}
    >
      <Text style={styles.btnText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    padding: 20,
  },

  heading: {
    color: "#F5F5DC",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },

  sectionTitle: {
    color: "#1F7A4D",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 10,
  },

  row: {
    backgroundColor: "#162922",
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "space-between",
  },

  label: {
    color: "#F5F5DC",
    fontSize: 14,
    flex: 1,
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: "#0E1A14",
    borderTopWidth: 1,
    borderColor: "#1F7A4D",
    justifyContent: "space-between",
  },

  btn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "#162922",
    borderRadius: 10,
    marginHorizontal: 4,
  },

  btnPrimary: {
    backgroundColor: "#1F7A4D",
  },

  btnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
});
