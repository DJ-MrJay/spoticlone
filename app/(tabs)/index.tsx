// Import necessary components and modules from React Native
import { ActivityIndicator, FlatList, Text } from "react-native";
import TrackListItem from "@/components/TrackListItem";
import { gql, useQuery } from "@apollo/client";

// Define the GraphQL query using gql template literal
const query = gql`
  query MyQuery($genres: String!) {
    recommendations(seed_genres: $genres) {
      tracks {
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
`;

// Define the HomeScreen functional component
export default function HomeScreen() {
  // Use Apollo Client's useQuery hook to fetch data
  const { data, loading, error } = useQuery(query, {
    variables: { genres: "punk" }, // Specify variables for the query
  });

  // Show loading indicator while data is being fetched
  if (loading) {
    return <ActivityIndicator />;
  }

  // Display an error message if fetching data fails
  if (error) {
    return <Text style={{ color: "white" }}>Failed to fetch</Text>;
  }

  // Extract tracks from the fetched data, default to an empty array if undefined
  const tracks = data?.recommendations?.tracks || [];

  // Render a FlatList with the extracted tracks
  return (
    <FlatList
      data={tracks}
      renderItem={({ item }) => <TrackListItem track={item} />} // Render TrackListItem for each track
      showsVerticalScrollIndicator={false} // Hide the vertical scroll indicator
    />
  );
}
