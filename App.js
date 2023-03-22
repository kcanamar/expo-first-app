import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Platform } from 'react-native';
import { useRef, useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Button from "./components/Button";
import ImageViewer from './components/ImageViewer';
import * as ImagePicker from 'expo-image-picker'
import IconButton from './components/IconButton';
import CircleButton from './components/CircleButton';
import EmojiPicker from './components/EmojiPicker';
import EmojiList from './components/EmojiList';
import EmojiSticker from './components/EmojiSticker';
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';
import domtoimage from 'dom-to-image';
import * as SplashScreen from 'expo-splash-screen'

SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 4000);

const PlaceholderImage = require("./assets/images/background-image.png")

export default function App() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [isModalVisable, setIsModalVisible] = useState(false)
  const [showAppOptions, setShowAppOptions] = useState(false);
  const [pickedEmoji, setPickedEmoji] = useState(null)
  
  const [status, requestPremission] = MediaLibrary.usePermissions()
  const imageRef = useRef();

  if (status === null) {
    requestPremission();
  }

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    })

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri)
      setShowAppOptions(true);
    } else {
      alert('You need to select an image.')
    }
  }

  const onReset = () => {
    setShowAppOptions(false)
  }

  const onAddSticker = () => {
    setIsModalVisible(true)
  }

  const onModalclose = () => {
    setIsModalVisible(false)
  }

  const onSaveImageAsync = async () => {
    if ( Platform.OS !== 'web') {
      try {
        const localUri = await captureRef(imageRef, {
          height: 440,
          quality: 1,
        })

        await MediaLibrary.saveToLibraryAsync(localUri);

        if(localUri) {
          alert("Saved!")
        }

      } catch (error) {
        console.log(error)
      }
    } else {
      domtoimage
        .toJpeg(imageRef.current, {
          quality: 0.95,
          width: 320,
          height: 440,
        })
        .then((dataUrl) => {
          let link = document.createElement('a');
          link.download = 'first-app.jpeg';
          link.href = dataUrl;
          link.click()
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }


  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.imageContainer}>
        <View ref={imageRef} collapsable={false}>
          <ImageViewer placeholderImageSource={PlaceholderImage} selectedImage={selectedImage}/>
          {pickedEmoji !== null ? <EmojiSticker imageSize={40} stickerSource={pickedEmoji} /> : null}
        </View>
        {showAppOptions ? (
          <View style={styles.optionsContainer}>
            <View style={styles.optionsRow}>
              <IconButton icon='refresh' label='Reset' onPress={onReset}/>
              <CircleButton onPress={onAddSticker}/>
              <IconButton icon='save-alt' label='Save' onPress={onSaveImageAsync}/>
            </View>
          </View>
          ) : (
          <View style={styles.footerContainer}>
            <Button theme="primary" label="Choose a photo" onPress={pickImageAsync}/>
            <Button label="Use this photo" onPress={() => setShowAppOptions(true)}/>
          </View>
        )}
        <EmojiPicker isVisible={isModalVisable} onClose={onModalclose}>
            <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalclose} />
        </EmojiPicker>
        <StatusBar style="light" />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  imageContainer: {
    flex:1, 
    paddingTop: 58,
    alignItems: 'center',
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },  
});
