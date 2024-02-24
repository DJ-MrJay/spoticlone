// Import necessary dependencies and components
import React from "react";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { usePlayerContext } from "@/providers/PlayerProvider";
import { AVPlaybackStatus, Audio } from "expo-av";
import { Sound } from "expo-av/build/Audio";

const Player = () => {
  // State variables to manage audio playback and player UI
  const [sound, setSound] = useState<Sound>();
  const [isPlaying, setIsPlaying] = useState(false);

  // Accessing the current track from the player context
  const { track } = usePlayerContext();

  // Effect to handle changes in the track
  useEffect(() => {
    // If a track is present, play it
    if (track) {
      playTrack();
    } else {
      // Unload sound when no track is present
      if (sound) {
        sound.unloadAsync();
      }
    }
  }, [track]);

  // Effect for cleaning up resources when the component unmounts or when sound changes
  useEffect(() => {
    return sound ? sound.unloadAsync : undefined;
  }, [sound]);

  // Function to play the selected track
  const playTrack = async () => {
    // Unload the existing sound (if any)
    if (sound) {
      await sound.unloadAsync();
    }

    // Check if the selected track has a preview URL
    if (!track?.preview_url) {
      // Change to play icon if no preview is available
      return;
    }

    // Create a new audio player for the track
    const { sound: audioPlayer } = await Audio.Sound.createAsync({
      uri: track.preview_url,
    });

    // Set the new audio player in the state
    setSound(audioPlayer);

    // Set up a callback for playback status updates
    audioPlayer.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);

    // Start playing the track
    await audioPlayer.playAsync();
  };

  // Callback for handling updates to the playback status
  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    console.log(status);

    // Check if the audio is loaded
    if (status.isLoaded) {
      // Update the state with the current playback status
      setIsPlaying(status.isPlaying);
    }
  };

  // Function to handle play/pause button press
  const onPlayPause = async () => {
    // Check if a sound is present
    if (!sound) {
      return;
    }

    // Toggle play/pause based on the current state
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  };

  // Render the player UI
  // If no track is present, do not render the player
  if (!track) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.player}>
        {/* Display the album image if available */}
        {track.album.images?.[0] && (
          <Image
            source={{ uri: track.album.images[0].url }}
            style={styles.image}
          />
        )}

        <View style={{ flex: 1 }}>
          {/* Display the track name and artist */}
          <Text style={styles.title}>{track.name}</Text>
          <Text style={styles.subtitle}>{track.artists[0]?.name}</Text>
        </View>

        {/* Display a heart icon and play/pause button */}
        <Ionicons
          name={"heart-outline"}
          size={20}
          color={"white"}
          style={{ marginHorizontal: 10 }}
        />
        <Ionicons
          onPress={onPlayPause}
          disabled={!track.preview_url}
          name={!track.preview_url ? "play" : isPlaying ? "pause" : "play"}
          size={22}
          color={track.preview_url ? "white" : "gray"}
        />
      </View>
    </View>
  );
};

// Styles for the player component
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    top: -80,
    height: 80,
    padding: 8,
  },
  player: {
    backgroundColor: "#555",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 5,
    padding: 6,
    paddingRight: 15,
  },
  title: {
    color: "white",
  },
  subtitle: {
    color: "lightgray",
    fontSize: 12,
  },
  image: {
    height: "100%",
    aspectRatio: 1,
    marginRight: 10,
    borderRadius: 5,
  },
});

// Export the Player component
export default Player;
