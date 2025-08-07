// Components/Loader.js
import React, { useEffect, useRef, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Animated,
  Easing,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const NAV_DELAY_MS = 5000;
const STAR       = require('../assets/star.webp');
const BACKGROUND = require('../assets/splash_background.webp');
const LOGO       = require('../assets/logo_text.webp');

export default function Loader() {
  const navigation = useNavigation();

  // пульсация 5 звёзд
  const anims = useRef(Array.from({ length: 5 }).map(() => new Animated.Value(0))).current;
  // вращение всей группы
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // радиус круга для звёзд
  const RADIUS = width * 0.3;
  // углы для звёзд (равномерно по кругу)
  const angles = useMemo(
    () => anims.map((_, i) => (2 * Math.PI * i) / anims.length),
    [anims.length]
  );
  const positions = useMemo(
    () => angles.map(a => ({ x: RADIUS * Math.cos(a), y: RADIUS * Math.sin(a) })),
    [angles]
  );
  const sizes = [40, 32, 24, 16, 28];

  useEffect(() => {
    // через NAV_DELAY_MS переходим дальше
    const timer = setTimeout(() => navigation.replace('Onboarding'), NAV_DELAY_MS);

    // пульсация звёзд
    anims.forEach((anim, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 200),
          Animated.timing(anim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    });

    // непрерывное вращение
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    return () => clearTimeout(timer);
  }, [navigation, anims, rotateAnim]);

  // стиль пульсации каждой звезды
  const starStyle = anim => ({
    opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }),
    transform: [
      { scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1.4] }) },
    ],
  });

  // interpolation для вращения
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ImageBackground source={BACKGROUND} style={styles.background}>
        <View style={styles.content}>
          {/* круговая анимация звёзд */}
          <Animated.View style={[styles.starsCircle, { transform: [{ rotate }] }]}>
            {anims.map((anim, i) => (
              <Animated.Image
                key={i}
                source={STAR}
                style={[
                  {
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    marginLeft: positions[i].x - sizes[i] / 2,
                    marginTop: positions[i].y - sizes[i] / 2,
                    width: sizes[i],
                    height: sizes[i],
                  },
                  starStyle(anim),
                ]}
              />
            ))}
          </Animated.View>

          {/* увеличенный логотип */}
          <Image source={LOGO} style={styles.logo} resizeMode="contain" />
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  background: { flex: 1 },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  starsCircle: {
    position: 'absolute',
    top: -50,
    left: 0,
    right: 0,
    bottom: 10,
  },
  logo: {
    width: width * 0.8,      // чуть уже, но выше
    height: width * 0.7,     // увеличенная высота для текста
    marginBottom: 40,
  },
});
