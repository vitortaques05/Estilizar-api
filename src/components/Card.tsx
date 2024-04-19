import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, ActivityIndicator } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Comment, Post } from "../types/Post";
import { useState } from "react";
import axios from "axios";
import { baseUrl } from "../utils/constants";

const screenWidth = Dimensions.get('window').width;

interface Props {
  post: Post;
}

const Card = ({ post }: Props) => {
  const [openComment, setOpenComments] = useState<boolean>(false);
  const [commentsList, setCommentsList] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const getComments = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get<Comment[]>(
        `${baseUrl}/comments?postId=${post.id}`
      );
      setCommentsList(response.data);
    } catch (error) {
      setError("Failed to fetch comments. Please try again later.");
    }
    setLoading(false);
  };

  const handleOpen = async () => {
    if (!openComment) {
      await getComments();
    }
    setOpenComments(!openComment);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.body}>{post.body}</Text>
      <TouchableOpacity onPress={handleOpen}>
        <AntDesign
          name={openComment ? "message1" : "message1"}
          size={screenWidth * 0.08}
          color="#333"
          style={{ marginBottom: screenWidth * 0.03 }}
        />
      </TouchableOpacity>
      {loading && <ActivityIndicator size="small" color="#333" />}
      {error !== "" && <Text style={styles.error}>{error}</Text>}
      {openComment && !loading && (
        <FlatList
          data={commentsList}
          renderItem={({ item }) => (
            <View style={styles.commentContainer}>
              <Text style={styles.commentName}>{item.name}</Text>
              <Text style={styles.commentEmail}>{item.email}</Text>
              <Text style={styles.commentBody}>{item.body}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    width: "90%",
    alignSelf: "center",
  },
  title: {
    fontSize: screenWidth * 0.045,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  body: {
    fontSize: screenWidth * 0.04,
    marginBottom: 10,
    color: "#666",
  },
  commentContainer: {
    marginBottom: 10,
  },
  commentName: {
    fontWeight: "bold",
    marginBottom: 2,
    color: "#333",
  },
  commentEmail: {
    fontStyle: "italic",
    color: "#555",
    marginBottom: 2,
  },
  commentBody: {
    color: "#333",
  },
  error: {
    color: "red",
    marginTop: 10,
  },
});

export default Card;
