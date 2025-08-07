// Components/SettingsScreen.js
import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  StatusBar,
  Share,
  Alert,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SettingsContext } from './SettingsContext';

const { width, height } = Dimensions.get('window');

/* ---- PALETTE ---- */
const SKY_BLUE     = '#4D96FF';  // clean sky blue
const CORAL        = '#FF6B6B';  // vibrant coral
const LEMON_YELLOW = '#FFE66D';  // sunny lemon
const WHITE        = '#FFFFFF';
const BLACK        = '#000000';

/* ---- ASSETS ---- */
const BG           = require('../assets/splash_background.webp');
const ICON_BACK    = require('../assets/ic_back.webp');
const ICON_CROWN   = require('../assets/logo.webp');
const STAR_FILLED  = require('../assets/star_filled.webp');
const STAR_OUTLINE = require('../assets/star_outline.webp');

const TIPS = [
  'Did you know? Polaris is not the brightest star in the sky, but it’s famous for marking north.',
  'Fun fact: Jupiter’s Great Red Spot is a storm larger than Earth.',
  'Tip: Look for the “W” shape of Cassiopeia just north of the North Star.',
];

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { musicOn, toggleMusic } = useContext(SettingsContext);
  const [rating, setRating] = useState(0);

  const handleShare = async () => {
    try {
      await Share.share({
        message:
          'Explore the night sky with me! 🌌 Download “Under the Silent Sky” app now.',
      });
    } catch (e) {
      console.warn('Share error', e);
    }
  };

  const showTip = () => {
    const tip = TIPS[Math.floor(Math.random() * TIPS.length)];
    Alert.alert('Astronomy Tip', tip, [{ text: 'Cool!', style: 'default' }]);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <ImageBackground
        source={BG}
        style={styles.background}
        resizeMode="cover"
      >
        {/* TOP BAR */}
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.navBtn}
            activeOpacity={0.85}
          >
            <Image
              source={ICON_BACK}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Image
            source={ICON_CROWN}
            style={styles.crown}
            resizeMode="contain"
          />
          <View style={styles.navBtn} />
        </View>

        {/* CONTENT */}
        <View style={styles.content}>
          {/* Music Toggle */}
          <TouchableOpacity
            style={[
              styles.btn,
              musicOn ? styles.btnOn : styles.btnOff,
            ]}
            activeOpacity={0.8}
            onPress={toggleMusic}
          >
            <Text style={styles.btnText}>
              Music {musicOn ? 'ON' : 'OFF'}
            </Text>
          </TouchableOpacity>

          {/* Show Random Tip */}
          <TouchableOpacity
            style={[styles.btn, styles.btnOn]}
            activeOpacity={0.8}
            onPress={showTip}
          >
            <Text style={styles.btnText}>Show Astronomy Tip</Text>
          </TouchableOpacity>

          {/* Share App */}
          <TouchableOpacity
            style={[styles.btn, styles.btnOn]}
            activeOpacity={0.85}
            onPress={handleShare}
          >
            <Text style={styles.btnText}>Share App</Text>
          </TouchableOpacity>

          {/* Rating */}
          <View style={styles.ratingWrap}>
            <Text style={styles.ratingLabel}>Rate the App</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map(i => (
                <TouchableOpacity
                  key={i}
                  onPress={() => setRating(i)}
                  activeOpacity={0.7}
                >
                  <Image
                    source={i <= rating ? STAR_FILLED : STAR_OUTLINE}
                    style={[
                      styles.star,
                      {
                        tintColor:
                          i <= rating ? CORAL : WHITE,
                      },
                    ]}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: SKY_BLUE },
  background: {
    flex: 1,
    width,
    height,
    paddingTop: (StatusBar.currentHeight || 30) + 6,
  },

  /* TOP BAR */
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 8,
  },
  navBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,

    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: { width: 50, height: 50,  },
  crown: { width: 120, height: 120 },

  /* CONTENT */
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  btn: {
    width: '88%',
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: BLACK,
    marginVertical: 8,
  },
  btnOn: { backgroundColor: CORAL },
  btnOff: { backgroundColor: LEMON_YELLOW },
  btnText: {
    color: BLACK,
    fontSize: 20,
    fontWeight: '700',
  },

  /* RATING */
  ratingWrap: {
    alignItems: 'center',
    marginTop: 24,
  },
  ratingLabel: {
    color: WHITE,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  starsRow: {
    flexDirection: 'row',
  },
  star: {
    width: 28,
    height: 28,
    marginHorizontal: 6,
  },
});
