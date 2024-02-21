import { FlatList, TextInput, View, Text, StyleSheet } from "react-native";
import { tracks } from "../../assets/data/tracks";
import TrackListItem from "@/components/TrackListItem";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";

export default function SearchScreen() {
  const [search, setSearch] = useState("");

  return (
    <SafeAreaView>
      <View style={styles.header}>
        {}
        <FontAwesome name="search" size={16} color="gray" />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="What do you want to listen to?"
          placeholderTextColor="gray"
          style={styles.input}
        />
        <Text onPress={() => setSearch("")} style={{ color: "gray" }}>
          Cancel
        </Text>
      </View>

      <FlatList
        data={tracks}
        renderItem={({ item }) => <TrackListItem track={item} />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 15,
    padding: 10,
  },

  input: {
    flex: 1,
    backgroundColor: "#121314",
    paddingVertical: 5,
    paddingHorizontal: 10,
    color: "white",
    borderRadius: 5,
  },
});
