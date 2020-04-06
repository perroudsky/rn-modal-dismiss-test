import React, { useState, useEffect } from "react";
import { View, Text, Image, SafeAreaView, Dimensions } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Pager from "../components/Pager";

import { PanGestureHandler, State } from "react-native-gesture-handler";
import Animated, {
  Extrapolate,
  and,
  block,
  call,
  cond,
  eq,
  not,
  interpolate,
  set,
  useCode,
} from "react-native-reanimated";
import {
  onGestureEvent,
  snapPoint,
  timing,
  useValues,
} from "react-native-redash";
import { useMemoOne } from "use-memo-one";

const { width, height } = Dimensions.get("window");

const SNAP_BACK = height / 2;

function DetailsScreen(props) {
  const [scrollDistance, setScrollDistance] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const item = props.navigation.getParam("item");
  const handleScroll = (event) => {
    console.log("scrolling");
    setScrollDistance(event.nativeEvent.contentOffset.y);
  };

  const [
    translationX,
    translationY,
    velocityY,
    state,
    translateX,
    translateY,
    shouldSnapBack,
  ] = useValues([0, 0, 0, State.UNDETERMINED, 0, 0, 0], []);

  const snapTo = snapPoint(translateY, velocityY, [0, SNAP_BACK]);

  const scale = interpolate(translateY, {
    inputRange: [0, SNAP_BACK],
    outputRange: [1, 0.7],
    extrapolate: Extrapolate.CLAMP,
  });

  const gestureHandler = useMemoOne(
    () =>
      onGestureEvent({
        translationX,
        translationY,
        velocityY,
        state,
      }),
    []
  );

  useCode(
    () =>
      block([
        cond(
          and(
            not(shouldSnapBack),
            eq(snapTo, SNAP_BACK),
            eq(state, State.END),
            set(shouldSnapBack, 1)
          )
        ),
        cond(
          shouldSnapBack,
          call([], () => props.navigation.goBack()),
          cond(
            eq(state, State.END),
            [
              set(translateX, timing({ from: translateX, to: 0 })),
              set(translateY, timing({ from: translateY, to: 0 })),
            ],
            [set(translateX, translationX), set(translateY, translationY)]
          )
        ),
      ]),
    []
  );

  return (
    <PanGestureHandler {...gestureHandler}>
      <Animated.View
        style={{
          flex: 1,
          transform: [
            // { translateX },
            { translateY },
            // { scale }
          ],
          backgroundColor: "white",
        }}
      >
        <ScrollView
          scrollEnabled={true}
          style={{ flex: 1 }}
          // onScroll={handleScroll}

          bounces={false}
          pinchGestureEnabled={false}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ height: 500, width: "100%" }}>
            <Pager images={[item.mainImage, ...item.otherImages]} />
          </View>

          {Array.from(50, () => {
            console.log("he");
          })}

          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </Text>
          <Text>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
            quae ab illo inventore veritatis et quasi architecto beatae vitae
            dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
            aspernatur aut odit aut fugit, sed quia consequuntur magni dolores
            eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est,
            qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit,
            sed quia non numquam eius modi tempora incidunt ut labore et dolore
            magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis
            nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut
            aliquid ex ea commodi consequatur? Quis autem vel eum iure
            reprehenderit qui in ea voluptate velit esse quam nihil molestiae
            consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla
            pariatur?
          </Text>
          <Text>
            At vero eos et accusamus et iusto odio dignissimos ducimus qui
            blanditiis praesentium voluptatum deleniti atque corrupti quos
            dolores et quas molestias excepturi sint occaecati cupiditate non
            provident, similique sunt in culpa qui officia deserunt mollitia
            animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis
            est et expedita distinctio. Nam libero tempore, cum soluta nobis est
            eligendi optio cumque nihil impedit quo minus id quod maxime placeat
            facere possimus, omnis voluptas assumenda est, omnis dolor
            repellendus. Temporibus autem quibusdam et aut officiis debitis aut
            rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint
            et molestiae non recusandae. Itaque earum rerum hic tenetur a
            sapiente delectus, ut aut reiciendis voluptatibus maiores alias
            consequatur aut perferendis doloribus asperiores repellat.
          </Text>
        </ScrollView>
      </Animated.View>
    </PanGestureHandler>
  );
}

DetailsScreen.sharedElements = (navigation, otherNavigation, showing) => {
  console.log("hey");
  const item = navigation.getParam("item");
  return [
    {
      id: item.productName,
      resize: "none",
      animation: "move",
    },
  ];
};

export default DetailsScreen;
