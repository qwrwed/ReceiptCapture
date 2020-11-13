//TODO: resize image to be smaller
//TODO: reimport pipeline serverside
//TODO: cleanup
//TODO: args

import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { Platform, StyleSheet, View, Image } from 'react-native';
import { DarkTheme, DefaultTheme, Provider as PaperProvider, Button, Text, TextInput } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Lightbox from 'react-native-lightbox-v2';

const App = () => {

  const [imageUri, setImageUri] = useState(null);
  const [receivedInfo, setReceivedInfo] = useState(null)
  const [receivedImage, setReceivedImage] = useState(null)
  const [formData, setFormData] = useState(null)
  const [loadingUpload, setLoadingUpload] = useState(false)
  const [loadingDownload, setLoadingDownload] = useState(false)

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  useEffect(() => {
    setLoadingUpload(false)
  }, [receivedInfo]);

  useEffect(() => {
    setLoadingDownload(false)
  }, [receivedImage]);

  const pickImage = async () => {
    getImage(ImagePicker.launchImageLibraryAsync)
  };

  const takeImage = async () => {
    getImage(ImagePicker.launchCameraAsync)
  };

  const getImage = async (launcherAsync) => {
    const result = await launcherAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (result.cancelled) {
      return;
    }
    const localUri = result.uri;
    setImageUri(localUri);
    const filename = localUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;
    Image.getSize(localUri, (width, height) => {console.log(`width=${width}, height=${height}, type=${type}`)})
    const formDataTemp = new FormData();
    formDataTemp.append('file', { uri: localUri, name: filename, type });
    setFormData(formDataTemp)
  };

  const uploadImage = async (formData, urlRoot) => {
    //console.log(formData)
    if (formData === null) {
      alert("No image attached!")
      return
    }
    console.log("uploading...")
    setLoadingUpload(true)
    var response = await fetch(urlRoot + '\\upload', {
      method: 'POST',
      body: formData,
      headers: {
        'content-type': 'multipart/form-data',
      },
    })
    let json = await response.json();
    console.log(json.info)
    //console.log(Object.keys(json))
    setReceivedInfo(json.info);
    setReceivedImage(json.image);
  }

  /*
  const downloadImage = async (urlRoot) => {
    console.log("downloading...")
    setLoadingDownload(true)
    var response = await fetch(urlRoot + '\\download', {
      method: 'GET',
    })
    let json = await response.json();
    console.log()
    //const base64Image = json.image["py/b64"]
    //console.log(base64Image)
    //const test = 'iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg=='
    //const info = json.info
    //console.log(typeof(base64Image))
    setReceivedImage(json.image)
    //setReceivedImage(base64Image)
    setLoadingDownload(false)
    //setReceivedInfo(json);
  }*/

  var theme
  if (useColorScheme() === "dark") {
    theme = DarkTheme
  } else {
    theme = DefaultTheme
  }
  const { colors } = theme;

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={[{ backgroundColor: colors.background }, styles.container]}>
        <StatusBar style="auto" />
        <View style={{flexDirection: 'row'}}>
        {imageUri && <Lightbox underlayColor="white">
          <Image
          source={{ uri: imageUri }}
          //resizeMode="contain"
          style={{
            //flex: 1,
            height: 200,
            width: 200,
          }}
          //style={{ width: 200, height: 200 }}
          />
        </Lightbox>}
        
        {receivedImage && <Image source={{ uri: `data:image/gif;base64,${receivedImage}` }} style={{ width: 200, height: 200 }} />}
        </View>
        
        <Text style={styles.text}>Received info:</Text>
        <Text style={styles.textMono}>{JSON.stringify(receivedInfo)}</Text>
        <Button style={styles.button} contentStyle={styles.buttonContent} labelStyle={styles.buttonLabel}
          icon="camera" mode="contained" onPress={takeImage}>
          Take Photo
        </Button>
        <Button style={styles.button} contentStyle={styles.buttonContent} labelStyle={styles.buttonLabel}
          icon="folder-image" mode="contained" onPress={pickImage}>
          Select Image
        </Button>
        <Button style={styles.button} contentStyle={styles.buttonContent} labelStyle={styles.buttonLabel}
          loading={loadingUpload}
          disabled={formData === null}
          icon="upload"  mode="contained" onPress={() => {
            uploadImage(formData, 'http://192.168.0.2:5000')
          }}>
          Upload Image
        </Button>
        {/*<Button style={styles.button} contentStyle={styles.buttonContent} labelStyle={styles.buttonLabel}
          loading={loadingDownload}
          icon="download"  mode="contained" onPress={() => {
            downloadImage('http://192.168.0.2:5000')
          }}>
          Test Download
        </Button>*/}
        <Button style={styles.button} contentStyle={styles.buttonContent} labelStyle={styles.buttonLabel}
          icon="eraser"  mode="contained" onPress={() => {
            setImageUri(null);
            setFormData(null)
            setReceivedImage(null);
            
          }}>
          Clear
        </Button>
      </SafeAreaView>
    </PaperProvider>
  );
}

const styleConstants = {

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  button: {
    alignSelf: 'stretch',
    height: '10%',
    marginVertical: 2,
  },
  buttonContent: {
    height: '100%',
  },
  buttonLabel: {
    fontSize: RFValue(21),
  },
  text: {
    fontSize: RFValue(20),
  },
  textMono: {
    fontSize: RFValue(18),
    textAlign: 'center',
    fontFamily: 'monospace',
  },
});

export default App