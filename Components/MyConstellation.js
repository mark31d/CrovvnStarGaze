// Components/NotesScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  FlatList,
  TextInput,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

/* ---- PALETTE ---- */
const SKY_BLUE     = '#4D96FF';
const CORAL        = '#FF6B6B';
const LEMON_YELLOW = '#FFE66D';
const WHITE        = '#FFFFFF';
const BLACK        = '#000000';

/* ---- ASSETS ---- */
const BG        = require('../assets/splash_background.webp');
const ICON_BACK = require('../assets/ic_back.webp');
const LOGO      = require('../assets/logo.webp');

export default function NotesScreen() {
  const navigation = useNavigation();
  const [notes, setNotes]           = useState([]);
  const [editingId, setEditingId]   = useState(null); // 'new' or existing id
  const [draftText, setDraftText]   = useState('');
  const [draftImage, setDraftImage] = useState(null);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('@notes');
      setNotes(saved ? JSON.parse(saved) : []);
    })();
  }, []);

  const saveAll = async list => {
    setNotes(list);
    await AsyncStorage.setItem('@notes', JSON.stringify(list));
  };

  const startEdit = note => {
    if (note) {
      setEditingId(note.id);
      setDraftText(note.text);
      setDraftImage(note.imageUri);
    } else {
      setEditingId('new');
      setDraftText('');
      setDraftImage(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraftText('');
    setDraftImage(null);
  };

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, res => {
      if (res.didCancel) return;
      const uri = res.assets?.[0]?.uri;
      if (uri) setDraftImage(uri);
    });
  };

  const deleteNote = id => {
    Alert.alert('Delete note?', '', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => saveAll(notes.filter(n => n.id !== id)),
      },
    ]);
  };

  const saveNote = () => {
    if (!draftText.trim()) {
      Alert.alert('Please enter some text');
      return;
    }
    let updated;
    if (editingId === 'new') {
      updated = [
        ...notes,
        { id: Date.now().toString(), text: draftText, imageUri: draftImage },
      ];
    } else {
      updated = notes.map(n =>
        n.id === editingId
          ? { ...n, text: draftText, imageUri: draftImage }
          : n
      );
    }
    saveAll(updated);
    cancelEdit();
  };

  const renderNote = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => startEdit(item)}
      activeOpacity={0.8}
    >
      {item.imageUri && (
        <Image source={{ uri: item.imageUri }} style={styles.cardImage} />
      )}
      <Text style={styles.cardText} numberOfLines={3}>
        {item.text}
      </Text>
    </TouchableOpacity>
  );

  // Edit / New screen
  if (editingId) {
    const isNew = editingId === 'new';
    return (
      <View style={styles.container}>
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        <ImageBackground source={BG} style={styles.background}>
          {/* Корона над заголовком */}
          <Image source={LOGO} style={styles.logo} resizeMode="contain" />

          <View style={styles.topBar}>
            <TouchableOpacity onPress={cancelEdit} style={styles.navBtn1}>
              <Image source={ICON_BACK} style={styles.navIcon} />
            </TouchableOpacity>
            <Text style={styles.title}>
              {isNew ? 'New Note' : 'Edit Note'}
            </Text>
            {!isNew && (
              <TouchableOpacity onPress={() => deleteNote(editingId)}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            )}
          </View>

          <ScrollView contentContainerStyle={styles.form}>
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              {draftImage ? (
                <Image source={{ uri: draftImage }} style={styles.preview} />
              ) : (
                <Text style={styles.pickText}>Tap to pick photo</Text>
              )}
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Note text"
              placeholderTextColor="rgba(255,255,255,0.6)"
              multiline
              value={draftText}
              onChangeText={setDraftText}
            />
            <TouchableOpacity style={styles.submitBtn} onPress={saveNote}>
              <Text style={styles.submitText}>Save</Text>
            </TouchableOpacity>
          </ScrollView>
        </ImageBackground>
      </View>
    );
  }

  // Main list screen
  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ImageBackground source={BG} style={styles.background}>
        {/* Корона над заголовком */}
        <Image source={LOGO} style={styles.logo} resizeMode="contain" />

        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.navBtn1}>
            <Image source={ICON_BACK} style={styles.navIcon} />
          </TouchableOpacity>
          <Text style={styles.title}>Your Notes</Text>
          <TouchableOpacity onPress={() => startEdit(null)} style={styles.navBtn}>
            <Text style={styles.addText}>＋</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={notes}
          keyExtractor={n => n.id}
          renderItem={renderNote}
          numColumns={2}
          contentContainerStyle={styles.list}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          ListEmptyComponent={() => (
            <Text style={styles.empty}>
              No notes yet. Tap "+" to add one.
            </Text>
          )}
        />
      </ImageBackground>
    </View>
  );
}

const PAD = 16;
const CARD_W = (width - PAD * 2 - 12) / 2;

const styles = StyleSheet.create({
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  container: { flex: 1, backgroundColor: SKY_BLUE },
  background: {
    flex: 1,
    width,
    paddingTop: (StatusBar.currentHeight || 30) + 16,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: PAD,
    marginBottom: 12,
  },
  navBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: CORAL,
  },
  navBtn1: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: CORAL,
  },
  navIcon: { width: 50, height: 50, },
  title: {
    flex: 1,
    textAlign: 'center',
    color: WHITE,
    fontSize: 20,
    fontWeight: '700',
  },
  addText: {
    color: CORAL,
    fontSize: 28,
    lineHeight: 28,
  },
  list: {
    paddingHorizontal: PAD,
    paddingBottom: 28,
  },
  card: {
    backgroundColor: '#4D96FF',
    borderRadius: 12,
    marginBottom: 16,
    width: CARD_W,
    padding: 8,
  },
  cardImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  cardText: {
    color: WHITE,
    fontSize: 14,
    lineHeight: 18,
  },
  empty: {
    color: WHITE,
    textAlign: 'center',
    marginTop: 40,
    opacity: 0.7,
  },
  form: {
    paddingHorizontal: PAD,
    paddingBottom: 40,
  },
  imagePicker: {
    height: 150,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: CORAL,
  },
  pickText: {
    color: 'rgba(255,255,255,0.9)',
  },
  preview: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  input: {
    minHeight: 100,
    borderWidth: 2,
    borderColor: CORAL,
    borderRadius: 12,
    padding: 12,
    color: WHITE,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  submitBtn: {
    backgroundColor: LEMON_YELLOW,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitText: {
    color: BLACK,
    fontSize: 16,
    fontWeight: '700',
  },
  deleteText: {
    color: CORAL,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 25,
    borderColor: CORAL,
    borderWidth: 2,
    fontSize: 14,
    fontWeight: '700',
  },
});
