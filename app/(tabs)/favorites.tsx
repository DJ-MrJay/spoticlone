// Import necessary components and libraries from React Native and Apollo Client
import { FlatList, ActivityIndicator } from "react-native";
import TrackListItem from "@/components/TrackListItem";
import { gql, useQuery } from "@apollo/client";

// Define the GraphQL query to fetch favorite tracks for a user
const query = gql`
  query getFavorites($userId: String!) {
    favoritesByUserid(userid: $userId) {
      id
      trackid
      userid
      track {
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
            url
            width
            height
          }
        }
      }
    }
  }
`;

// Define the main component for the Favorites screen
export default function FavoritesScreen() {
  // Use the useQuery hook to execute the GraphQL query and get data, loading, and error status
  const { data, loading, error } = useQuery(query, {
    variables: { userId: "snoop" }, // Specify the user ID for the query
  });

  // If data is still loading, display an ActivityIndicator
  if (loading) {
    return <ActivityIndicator />;
  }

  // If there is an error, log it to the console
  if (error) {
    console.log(error);
  }

  // Log the fetched data to the console (for debugging purposes)
  console.log(data);

  // Extract the favorite tracks from the data or set it to an empty array if undefined
  const tracks = (data?.favoritesByUserid || []).map((fav) => fav.track);

  // Render a FlatList component to display the favorite tracks
  return (
    <FlatList
      data={tracks}
      renderItem={({ item }) => <TrackListItem track={item} />} // Render each track using the TrackListItem component
      showsVerticalScrollIndicator={false} // Hide the vertical scroll indicator
    />
  );
}
