// Components/AchievementsGrid.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  FlatList,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { readAch, addAch, clearAch } from '../Components/achievementsStore';

const { width } = Dimensions.get('window');

/* ---- PALETTE ---- */
const SKY_BLUE     = '#4D96FF';  // чистый небесно-синий
const CORAL        = '#FF6B6B';  // насыщенный коралловый
const LEMON_YELLOW = '#FFE66D';  // солнечный лимонный
const WHITE        = '#FFFFFF';
const BLACK        = '#000000';

const ACHIEVEMENTS = [
  { id: 'full_moon',     title: 'FULL NIGHT SKY',    caption: 'You marked your first celestial object as observed. Welcome to the stars!', image: require('../assets/full_moon.webp') },
  { id: 'shooting_star', title: 'SHOOTING STAR',     caption: 'You’ve viewed 5 objects. The sky is opening up to you.',                     image: require('../assets/shooting_star.webp') },
  { id: 'first_read',    title: 'FIRST READ',        caption: 'You opened your first article. Knowledge is your telescope.',               image: require('../assets/first_read.webp') },
  { id: 'first_rating',  title: 'FIRST RATING',      caption: 'You rated your first object. Every opinion shapes the cosmos.',             image: require('../assets/first_rating.webp') },
  { id: 'telescope',     title: 'TELESCOPE',         caption: "You’ve observed 15+ objects. You're mapping the heavens.",                  image: require('../assets/telescope.webp') },
  { id: 'trophy',        title: 'SKY SEEKER TROPHY', caption: 'You’ve reached 100% completion in the celestial archive. A true sky seeker!',image: require('../assets/trophy.webp') },
  { id: 'rating_master', title: 'RATING MASTER',     caption: 'You’ve rated at least 10 objects. A connoisseur of the stars.',             image: require('../assets/rating_master.webp') },
  { id: 'quiz_whiz',     title: 'QUIZ WHIZ',         caption: 'You passed your first quiz. Your journey of understanding begins.',         image: require('../assets/quiz_whiz.webp') },
  { id: 'all_quizzes',   title: 'ALL QUIZZES DONE',  caption: 'You’ve completed all quizzes. You now read the sky like a story.',          image: require('../assets/all_quizzes.webp') },
];

const BOARD_MARGIN_H    = 10;
const BOARD_MARGIN_TOP  = 22;
const BOARD_BORDER      = 2;
const BOARD_PAD_H       = 12;

const CELL_GAP = 16;
const NUM_COLS = 3;
const innerWidth = width - 2 * (BOARD_MARGIN_H + BOARD_BORDER + BOARD_PAD_H);
const CARD_W = (innerWidth - (NUM_COLS - 1) * CELL_GAP) / NUM_COLS;
const CARD_H = CARD_W * 1.35;

const BACK_SIZE        = 42;
const BACK_TOP         = 10;
const BACK_LEFT        = 10;
const LIST_TOP_PADDING = BACK_TOP + BACK_SIZE + 6;

export default function AchievementsGrid() {
  const navigation = useNavigation();
  const route      = useRoute();
  const listRef    = useRef(null);

  const [unlocked, setUnlocked]         = useState(new Set());
  const [selectedId, setSelectedId]     = useState(null);
  const [showOnlyUnlocked, setFilterOn] = useState(false);

  const isUnlocked = id => unlocked.has(id);

  // При новом разблокировании
  useEffect(() => {
    const justId = route.params?.justUnlockedId;
    if (!justId) return;
    (async () => {
      const stored = await addAch(justId);
      setUnlocked(stored);
      const idx = ACHIEVEMENTS.findIndex(a => a.id === justId);
      if (idx >= 0) {
        requestAnimationFrame(() => {
          setSelectedId(justId);
          listRef.current?.scrollToIndex({ index: idx, viewPosition: 0.5, animated: true });
        });
      }
      navigation.setParams({ justUnlockedId: undefined });
    })();
  }, [route.params?.justUnlockedId, navigation]);

  // Обновлять при возврате на экран
  useFocusEffect(useCallback(() => {
    let alive = true;
    (async () => {
      const stored = await readAch();
      if (alive) setUnlocked(stored);
    })();
    return () => { alive = false; };
  }, []));

  // Сброс всех достижений
  const resetAll = async () => {
    await clearAch();
    setUnlocked(new Set());
    setSelectedId(null);
  };

  // Применяем фильтр
  const data = showOnlyUnlocked
    ? ACHIEVEMENTS.filter(a => isUnlocked(a.id))
    : ACHIEVEMENTS;

  const renderItem = ({ item }) => {
    const opened = isUnlocked(item.id);
    const imgSrc = opened
      ? item.image
      : require('../assets/back_card.webp');

    return (
      <TouchableOpacity
        style={styles.cell}
        activeOpacity={0.9}
        onPress={() => opened && setSelectedId(id => id === item.id ? null : item.id)}
      >
        <View style={styles.card}>
          <Image source={imgSrc} style={styles.cardImage} />

          {!opened && (
            <View style={styles.lockWrap}>
              <Image
                source={require('../assets/ic_lock.webp')}
                style={styles.lockIcon}
              />
            </View>
          )}

          {opened && selectedId === item.id && (
            <View style={styles.overlay}>
              <Text style={styles.overlayText}>{item.caption}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ImageBackground
        source={require('../assets/splash_background.webp')}
        style={styles.background}
      >
        <View style={styles.board}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            activeOpacity={0.85}
          >
            <Image
              source={require('../assets/ic_back.webp')}
              style={styles.backIcon}
            />
          </TouchableOpacity>

          <Image
            source={require('../assets/logo.webp')}
            style={styles.logo}
          />

          {/* Шапка: счетчик, фильтр и сброс */}
          <View style={styles.headerInfo}>
            <Text style={styles.countText}>
              {showOnlyUnlocked
                ? `Unlocked ${unlocked.size}`
                : `Unlocked ${unlocked.size} of ${ACHIEVEMENTS.length}`}
            </Text>
            <TouchableOpacity
              onPress={() => setFilterOn(f => !f)}
              style={styles.filterBtn}
            >
              <Text style={styles.filterText}>
                {showOnlyUnlocked ? 'Show All' : 'Show Unlocked'}
              </Text>
            </TouchableOpacity>
           
          </View>

          <FlatList
            ref={listRef}
            data={data}
            numColumns={NUM_COLS}
            keyExtractor={it => it.id}
            renderItem={renderItem}
            contentContainerStyle={[
              styles.listContent,
              { paddingTop: LIST_TOP_PADDING },
            ]}
            columnWrapperStyle={{
              justifyContent: 'space-between',
              marginBottom: CELL_GAP,
            }}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root:       { flex: 1, backgroundColor: SKY_BLUE },
  background: { flex: 1, width, paddingTop: (StatusBar.currentHeight || 30) + 6 },

  board: {
    flex: 1,
    marginTop: BOARD_MARGIN_TOP,
    marginHorizontal: BOARD_MARGIN_H,
    backgroundColor: SKY_BLUE,
    borderWidth: BOARD_BORDER,
    borderColor: CORAL,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: BOARD_PAD_H,
  },

  backBtn: {
    position: 'absolute',
    top: BACK_TOP,
    left: BACK_LEFT,
    width: BACK_SIZE,
    height: BACK_SIZE,
    borderRadius: BACK_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 2,
    borderColor: WHITE,
  },
  backIcon: { width: 60, height: 60,  },

  logo: {
    position: 'absolute',
    top: -1,
    alignSelf: 'center',
    width: 120,
    height: 130,
    zIndex: 5,
    resizeMode:'contain',
  
  },

  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 120,
    marginBottom: -42,
    paddingHorizontal: 16,
  },
  countText: { color: LEMON_YELLOW, fontSize: 16, fontWeight: '600' },
  filterBtn: { padding: 6, backgroundColor: CORAL, borderRadius: 6  , zIndex:2,},
  filterText:{ color: WHITE, fontWeight: '700' },
  resetBtn:  { padding: 6, backgroundColor: BLACK, borderRadius: 6 },
  resetText: { color: WHITE, fontWeight: '700' },

  listContent: { paddingBottom: 28 },
  cell:        { width: CARD_W, height: CARD_H },

  card: {
    flex: 1,
    borderWidth: 2,
    borderColor: CORAL,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: BLACK,
  },

  cardImage: { width: '100%', height: '100%' },

  lockWrap: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  lockIcon: { width: 68, height: 68, tintColor: LEMON_YELLOW },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  overlayText: {
    color: LEMON_YELLOW,
    fontSize: 14,
    lineHeight: 18,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
