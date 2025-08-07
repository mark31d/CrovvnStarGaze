// Components/Onboarding.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    title: 'Welcome to the Silent Sky',
    text:
      'Join me on a celestial journey where each star tells a story. We’ll explore the night sky like never before.',
    button: 'Next',
  },
  {
    title: 'Your Telescope Guide',
    text:
      'I’ll share what to watch, when to look, and how to spot planets, stars, and constellations with your telescope.',
    button: 'Got it',
  },
  {
    title: 'Earn Achievements',
    text:
      'Read articles, observe the sky, and track your discoveries — every step brings you closer to becoming a true skywatcher.',
    button: 'Begin',
  },
];

export default function Onboarding() {
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);
  const slide = slides[index];

  const handlePress = () => {
    if (index < slides.length - 1) setIndex(index + 1);
    else navigation.replace('Home');
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <ImageBackground
        source={require('../assets/splash_background.webp')}
        style={styles.background}
      >
        {/* HERO */}
        <View style={styles.heroWrapper}>
          <Image
            source={require('../assets/hero.webp')}
            style={styles.hero}
            resizeMode="contain"
          />
        </View>

        {/* CARD */}
        <View style={styles.card}>
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.text}>{slide.text}</Text>

          {/* Индикатор */}
          <View style={styles.dots}>
            {slides.map((_, i) => (
              <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
            ))}
          </View>

        
        </View>

        {/* BUTTON */}
        <TouchableOpacity style={styles.button} activeOpacity={0.85} onPress={handlePress}>
          <Image
            source={require('../assets/ornament_corner.webp')}
            style={[styles.btnCorner, styles.btnCornerTL]}
            resizeMode="contain"
            pointerEvents="none"
          />
          <Image
            source={require('../assets/ornament_corner.webp')}
            style={[styles.btnCorner, styles.btnCornerBR, { transform: [{ rotate: '180deg' }] }]}
            resizeMode="contain"
            pointerEvents="none"
          />
          <Text style={styles.buttonText}>{slide.button}</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}

// Новая яркая палитра
const SKY_BLUE    = '#4D96FF';  // чистый небесно-синий — фон карточки
const CORAL       = '#FF6B6B';  // насыщенный коралловый — рамки и активные доты
const LEMON_YELLOW= '#FFE66D';  // солнечный лимонный — заголовки и кнопки
const WHITE       = '#FFFFFF';

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: {
    flex: 1,
    width,
    height,
    alignItems: 'center',
  },

  /* HERO */
  heroWrapper: {
    flex: 1.05,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: StatusBar.currentHeight || 40,
  },
  hero: {
    width: width * 0.78,
    height: height * 0.64,
    marginBottom: -150,
  },

  /* CARD */
  card: {
    width: width * 0.9,
    backgroundColor: SKY_BLUE,
    borderWidth: 2,
    borderColor: CORAL,
    borderRadius: 14,
    paddingVertical: 24,
    paddingHorizontal: 18,
    marginBottom: 18,
    shadowColor: CORAL,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    alignItems: 'center',
  },
  title: {
    color: LEMON_YELLOW,
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
  },
  text: {
    color: WHITE,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 16,
  },
  skv: {
    width: 54,
    height: 24,
    tintColor: CORAL,
    marginTop: 8,
  },
  appName: {
    color: WHITE,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
    opacity: 0.8,
  },

  /* dots */
  dots: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 5,
  },
  dotActive: {
    backgroundColor: CORAL,
    shadowColor: LEMON_YELLOW,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },

  /* BUTTON */
  button: {
    width: width * 0.72,
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: CORAL,
    borderRadius: 12,
    marginBottom: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SKY_BLUE,
  },
  buttonText: {
    color: LEMON_YELLOW,
    fontSize: 20,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
    zIndex: 1,
  },

  /* ornament inside button */
  btnCorner: {
    position: 'absolute',
    width: 120,
    height: 50,
    tintColor: LEMON_YELLOW,
  },
  btnCornerTL: { top: -7, left: -19 },
  btnCornerBR: { bottom: -9, right: -19 },
});
