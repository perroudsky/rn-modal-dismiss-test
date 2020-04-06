import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import ViewPager from "@react-native-community/viewpager";
import ImageView from "./ImageView";

const Slider = ({ images }) => {
  return (
    <ViewPager style={styles.viewPager} initialPage={0}>
      {images.map((image) => (
        <ImageView img={image} key={image}></ImageView>
      ))}
    </ViewPager>
  );
};

const styles = StyleSheet.create({
  viewPager: {
    flex: 1,
  },
});

export default Slider;
