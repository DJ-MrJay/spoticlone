// Import necessary components and libraries from React Native
import React, { useState } from "react";
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
import { gql, useQuery } from "@apollo/client";

// GraphQL query for searching tracks
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

// Main functional component for the Search Screen
export default function SearchScreen() {
  // State for managing the search input
  const [search, setSearch] = useState("");

  // Use GraphQL query to fetch data based on the search term
  const { data, loading, error } = useQuery(query, {
    variables: { q: search },
  });

  // Extract tracks from the fetched data
  const tracks = data?.search?.tracks?.items || [];

  return (
    <SafeAreaView>
      {/* Header section with search input and cancel button */}
      <View style={styles.header}>
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

      {/* Display loading indicator while fetching data */}
      {loading && <ActivityIndicator />}
      {/* Display error message if fetching data fails */}
      {error && <Text>Failed to fetch tracks</Text>}

      {/* Display the list of tracks using FlatList */}
      <FlatList
        data={tracks}
        renderItem={({ item }) => <TrackListItem track={item} />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

// Styles for the components in the Search Screen
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
