import React from "react";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { usePlayerContext } from "@/providers/PlayerProvider";
import { AVPlaybackStatus, Audio } from "expo-av";
import { Sound } from "expo-av/build/Audio";
import { gql, useMutation, useQuery } from "@apollo/client";

const insertFavoriteMutation = gql`
  mutation MyMutation($userId: String!, $trackId: String!) {
    insertFavorites(trackid: $trackId, userid: $userId) {
      id
      trackid
      userid
    }
  }
`;

const isFavoriteQuery = gql`
  query MyQuery($trackId: String!, $userId: String!) {
    favoritesByTrackidAndUserid(trackid: $trackId, userid: $userId) {
      id
      trackid
      userid
    }
  }
`;

const removeFavoriteMutation = gql`
  mutation MyMutation($trackId: String!, $userId: String!) {
    deleteFavorites(trackid: $trackId, userid: $userId) {
      id
    }
  }
`;

const Player = () => {
  const [sound, setSound] = useState<Sound>();
  const [isPlaying, setIsPlaying] = useState(false);

  const { track } = usePlayerContext();

  const [insertFavorite] = useMutation(insertFavoriteMutation);
  const [removeFavorite] = useMutation(removeFavoriteMutation);
  const { data, refetch } = useQuery(isFavoriteQuery, {
    variables: { userId: "snoop", trackId: track?.id || "" },
  });

  console.log(data);

  const isLiked = data?.favoritesByTrackidAndUserid?.length > 0;

  useEffect(() => {
    if (track) {
      playTrack();
    } else {
      if (sound) {
        sound.unloadAsync();
      }
    }
  }, [track]);

  useEffect(() => {
    return sound ? sound.unloadAsync : undefined;
  }, [sound]);

  const playTrack = async () => {
    if (sound) {
      await sound.unloadAsync();
    }

    if (!track?.preview_url) {
      return;
    }

    const { sound: audioPlayer } = await Audio.Sound.createAsync({
      uri: track.preview_url,
    });

    setSound(audioPlayer);

    audioPlayer.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);

    await audioPlayer.playAsync();
  };

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    console.log(status);

    if (status.isLoaded) {
      setIsPlaying(status.isPlaying);
    }
  };

  const onPlayPause = async () => {
    if (!sound) {
      return;
    }

    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  };

  const onLike = async () => {
    if (!track) return;
    if (isLiked) {
      await removeFavorite({
        variables: { userId: "snoop", trackId: track.id },
      });
    } else {
      await insertFavorite({
        variables: { userId: "snoop", trackId: track.id },
      });
    }
    refetch();
  };

  if (!track) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.player}>
        {track.album.images?.[0] && (
          <Image
            source={{ uri: track.album.images[0].url }}
            style={styles.image}
          />
        )}

        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{track.name}</Text>
          <Text style={styles.subtitle}>{track.artists[0]?.name}</Text>
        </View>

        <Ionicons
          onPress={onLike}
          name={isLiked ? "heart" : "heart-outline"}
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

export default Player;
