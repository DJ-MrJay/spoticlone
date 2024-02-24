// Importing necessary components and modules from React Native
import { Text, View, StyleSheet, Image, Pressable } from "react-native";

// Importing types and context provider related to the music track
import { Track } from "../types";
import { usePlayerContext } from "@/providers/PlayerProvider";

// Defining the properties expected by the TrackListItem component
type TrackListItemProps = {
  track: Track;
};

// Defining the TrackListItem component
export default function TrackListItem({ track }: TrackListItemProps) {
  // Accessing the setTrack function from the player context provider
  const { setTrack } = usePlayerContext();

  // Rendering the track list item with an onPress event to set the selected track
  return (
    <Pressable onPress={() => setTrack(track)} style={styles.container}>
      {/* Displaying the album image of the track */}
      <Image
        source={{ uri: track.album.images[0]?.url }}
        style={styles.image}
      />
      {/* Displaying the text information of the track */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{track.name}</Text>
        <Text style={styles.subtitle}>{track.artists[0]?.name}</Text>
      </View>
    </Pressable>
  );
}

// Styles for the TrackListItem component
const styles = StyleSheet.create({
  // Styling for the container of the track list item
  container: {
    marginVertical: 5,
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  // Styling for the container of the text information
  textContainer: {
    flex: 1,
  },

  // Styling for the title text (track name)
  title: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },

  // Styling for the subtitle text (artist name)
  subtitle: {
    color: "lightblue",
  },

  // Styling for the album image
  image: {
    width: 60,
    aspectRatio: 1,
    borderRadius: 5,
  },
});
