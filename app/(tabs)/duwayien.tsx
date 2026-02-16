import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Screen } from "../../src/components/Screen";
import { useLang } from "../../src/context/LanguageContext";

/* 🤲 61 MASNOON DUAS */
/* Roman English + Urdu */

const DUAS_ROMAN = [
"Aye Allah! Rabbul izzat, saari kainaat ke shehensha, saari makhlooq ke paalne wale...",
"Aye Allah! Hum tere gunahgar bande hain, humein maaf farma.",
"Aye Allah! Hamare chhote bade sab gunahon ko maaf farma aur hamari tauba qubool farma.",
"Aye Allah! Humein Laylatul Qadr naseeb farma.",
"Aye Allah! Humein kaamil imaan aur poori hidayat naseeb farma.",
"Aye Allah! Humein poore Ramzan ki barkaat se maal a maal farma.",
"Aye Allah! Hamare dil deen ki taraf pher de.",
"Aye Allah! Apni khaas rehmat naazil farma aur apne ghazab se bacha.",
"Aye Allah! Hamare sagheera aur kabeera gunah maaf farma.",
"Aye Allah! Ek lamhe ke liye bhi hame dunya ke hawale na kar.",
"Aye Allah! Hamein tangdasti aur karz se bacha.",
"Aye Allah! Hamein Dajjal, Shaytan, maut ki sakhti aur Jahannam se bacha.",
"Aye Allah! Hashr ki ruswayi se bacha.",
"Aye Allah! Pul Siraat aasaan farma.",
"Aye Allah! Jannatul Firdaus mein daakhila farma.",
"Aye Allah! Naam-e-aamaal dahine haath mein de.",
"Aye Allah! Maqbool Hajj naseeb farma.",
"Aye Allah! Arsh ke saaye mein jagah de.",
"Aye Allah! Qabar ke sawal aasaan farma.",
"Aye Allah! Humein halaal rizq de.",
"Aye Allah! Qayamat ke din apna deedaar de.",
"Aye Allah! Hamein apni bandagi ka mohtaaj bana.",
"Aye Allah! Auraton ko pardah ki taufeeq de.",
"Aye Allah! Ummat ko beemariyon se bacha.",
"Aye Allah! Humein taqwa de.",
"Aye Allah! Humein Siraat e Mustaqeem par qaayam rakh.",
"Aye Allah! Nabi ﷺ ki sunnat sikha.",
"Aye Allah! Shafa’at naseeb farma.",
"Aye Allah! Jam e Kausar peena naseeb farma.",
"Aye Allah! Rasool ﷺ ki muhabbat ata farma.",
"Aye Allah! Nabi ﷺ ki duaen hamare haq mein qubool farma.",
"Aye Allah! Walidayn ki maghfirat farma.",
"Aye Allah! Humein halaal kamaane wala bana.",
"Aye Allah! Humein shirk aur bida’at se bacha.",
"Aye Allah! Beemar ko sehat de.",
"Aye Allah! Humein panj waqta namaazi bana.",
"Aye Allah! Dunya aur aakhirat mein kaamyabi de.",
"Aye Allah! Hamari dunya mein barkat de.",
"Aye Allah! Hamari naaqis ibaadat qubool farma.",
"Aye Allah! Hamari jaayaz duaen qubool farma.",
"Aye Allah! Humein sehat aur aafiyat de.",
"Aye Allah! Hamare gunah maaf farma.",
"Aye Allah! Hamari khataen maaf farma.",
"Aye Allah! Hamari tauba qubool farma.",
"Aye Allah! Apni rehmat se maaf kar de.",
"Aye Allah! Humein Siraat e Mustaqeem par chala.",
"Aye Allah! Aisi namaz de jis se tu raazi ho.",
"Aye Allah! Aise aamaal de jin se tu raazi ho.",
"Aye Allah! Aisi zindagi de jis se tu raazi ho.",
"Aye Allah! Imaan par zinda rakh aur imaan par maut de.",
"Aye Allah! Aakhri waqt mein kalma naseeb farma.",
"Aye Allah! Humein farmabardaar bana.",
"Aye Allah! Beemaron ko shifa de.",
"Aye Allah! Karz mein dabe huye logon ki madad kar.",
"Aye Allah! Hamein Shaytan se bacha.",
"Aye Allah! Islam ke dushmanon ko nakaam kar.",
"Aye Allah! Jo maanga aur jo reh gaya sab ata farma.",
"Aye Allah! Sunnat par chalne wala bana.",
"Aye Allah! Is dua ko qubool farma.",
"Aye Allah! Ameen kehne walon ki dua qubool farma.",
"Aye Allah! Mushkilein door kar aur kaamyabi ata farma."
];

const DUAS_UR = [
"اے اللہ! رب العزت، ساری کائنات کے شہنشاہ...",
"اے اللہ! ہم تیرے گنہگار بندے ہیں، ہمیں معاف فرما۔",
"اے اللہ! ہمارے چھوٹے بڑے سب گناہ معاف فرما۔",
"اے اللہ! ہمیں لیلۃ القدر نصیب فرما۔",
"اے اللہ! ہمیں کامل ایمان عطا فرما۔",
"اے اللہ! ہمیں رمضان کی برکتیں عطا فرما۔",
"اے اللہ! ہمارے دل دین کی طرف موڑ دے۔",
"اے اللہ! اپنی خاص رحمت نازل فرما۔",
"اے اللہ! ہمارے گناہ معاف فرما۔",
"اے اللہ! ہمیں دنیا کے حوالے نہ کر۔",
"اے اللہ! ہمیں تنگدستی سے بچا۔",
"اے اللہ! ہمیں دجال اور جہنم سے بچا۔",
"اے اللہ! حشر کی رسوائی سے بچا۔",
"اے اللہ! پل صراط آسان فرما۔",
"اے اللہ! جنت الفردوس عطا فرما۔",
"اے اللہ! نامہ اعمال دائیں ہاتھ میں دے۔",
"اے اللہ! مقبول حج نصیب فرما۔",
"اے اللہ! عرش کے سائے میں جگہ دے۔",
"اے اللہ! قبر کے سوال آسان فرما۔",
"اے اللہ! حلال رزق عطا فرما۔",
"اے اللہ! قیامت کے دن دیدار عطا فرما۔",
"اے اللہ! ہمیں عبادت گزار بنا۔",
"اے اللہ! پردے کی توفیق عطا فرما۔",
"اے اللہ! امت کو بیماریوں سے بچا۔",
"اے اللہ! تقویٰ عطا فرما۔",
"اے اللہ! ہمیں صراط مستقیم پر قائم رکھ۔",
"اے اللہ! سنت سکھا۔",
"اے اللہ! شفاعت نصیب فرما۔",
"اے اللہ! حوض کوثر نصیب فرما۔",
"اے اللہ! رسول ﷺ کی محبت عطا فرما۔",
"اے اللہ! نبی ﷺ کی دعائیں قبول فرما۔",
"اے اللہ! والدین کی مغفرت فرما۔",
"اے اللہ! حلال رزق عطا فرما۔",
"اے اللہ! شرک سے بچا۔",
"اے اللہ! بیماروں کو شفا دے۔",
"اے اللہ! پانچ وقت کا نمازی بنا۔",
"اے اللہ! دنیا و آخرت میں کامیابی دے۔",
"اے اللہ! برکت عطا فرما۔",
"اے اللہ! عبادات قبول فرما۔",
"اے اللہ! جائز دعائیں قبول فرما۔",
"اے اللہ! صحت عطا فرما۔",
"اے اللہ! گناہ معاف فرما۔",
"اے اللہ! خطائیں معاف فرما۔",
"اے اللہ! توبہ قبول فرما۔",
"اے اللہ! اپنی رحمت سے معاف فرما۔",
"اے اللہ! سیدھے راستے پر چلا۔",
"اے اللہ! ایسی نماز عطا فرما۔",
"اے اللہ! اچھے اعمال عطا فرما۔",
"اے اللہ! پسندیدہ زندگی عطا فرما۔",
"اے اللہ! ایمان پر موت دے۔",
"اے اللہ! کلمہ نصیب فرما۔",
"اے اللہ! فرمانبردار بنا۔",
"اے اللہ! شفا عطا فرما۔",
"اے اللہ! قرض ادا کروا۔",
"اے اللہ! شیطان سے بچا۔",
"اے اللہ! دشمنوں کو ناکام بنا۔",
"اے اللہ! سب عطا فرما۔",
"اے اللہ! سنت پر چلنے والا بنا۔",
"اے اللہ! دعا قبول فرما۔",
"اے اللہ! آمین کہنے والوں کی دعا قبول فرما۔",
"اے اللہ! مشکلات دور کر۔"
];

export default function IslamicTab() {
  const { lang } = useLang();
  const isUrdu = lang === "ur";
  const DUAS = isUrdu ? DUAS_UR : DUAS_ROMAN;

  return (
    <Screen>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
        <Text style={styles.sectionTitle}>
          🤲 {isUrdu ? "مسنون دعائیں" : "Masnoon Duas"}
        </Text>

        {DUAS.map((dua, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.duaNumber}>
              {isUrdu ? `دعا ${index + 1}` : `Dua ${index + 1}`}
            </Text>

            <Text
              style={[
                styles.text,
                isUrdu && { textAlign: "right" },
              ]}
            >
              {dua}
            </Text>
          </View>
        ))}

      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },

  sectionTitle: {
    color: "#FFD700",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    marginTop: 16,
  },

  card: {
    backgroundColor: "#1A2F26",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
  },

  duaNumber: {
    color: "#4AA3DF",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 6,
  },

  text: {
    color: "#F5F5DC",
    fontSize: 14,
    lineHeight: 22,
  },
});
