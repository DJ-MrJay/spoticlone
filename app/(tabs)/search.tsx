import {
  FlatList,
  TextInput,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import TrackListItem from "@/components/TrackListItem";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import { gql, useQuery } from "@apollo/client";

const query = gql`
  query MyQuery($q: String) {
    search(q: $q) {
      tracks {
        items {
          id
          name
          preview_url
          artists {
            id
            name
          }
          album {
            id
            name
            images {
              height
              url
              width
            }
          }
        }
      }
    }
  }
`;

export default function SearchScreen() {
  const [search, setSearch] = useState("");

  const { data, loading, error } = useQuery(query, {
    variables: { q: search },
  });

  const tracks = data?.search?.tracks?.items || [];

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

      {loading && <ActivityIndicator />}
      {error && <Text>Failed to fetch tracks</Text>}
      
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
