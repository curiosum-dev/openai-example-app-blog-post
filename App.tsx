/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { OpenAIApi, Configuration } from 'openai';
import { setupURLPolyfill } from 'react-native-url-polyfill';
import DietComponent from './components/DietComponent';

const OPENAI_API_KEY = 'xxx'; // your openai token should be added here

const config = new Configuration({
  apiKey: OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

const iterate = (obj: any) => {
  Object.keys(obj).forEach(key => {

  console.log('key ', key, 'value ', obj[key])

  if (typeof obj[key] === 'object' && obj[key] !== null) {
        iterate(obj[key])
      }
  })
}

const createCompletionBMI = async (
  setAiResponse: any, 
  bodyMass: string, 
  height: string, 
  limitations: string,
  sex: string,
  gain: string
  ) => {
  setupURLPolyfill();
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 0.1,
      max_tokens: 300,
      messages: [
        {"role": "system", "content": `You are a dietitian, and you are recommending proper diet to clients for the best BMI level which you also should provide`},
        {"role": "user", "content": `Set up diet for me where my weight is ${bodyMass} kg, my height is ${height} cm and I'm a ${limitations} I'm ${sex} and I want to ${gain}.`}
      ]
    });
    setAiResponse(response.data.choices[0].message?.content)    
  } catch (error) {
    console.log('error', error)
  }
}

const createCompletionDiet = async (
  setAiResponse: any, 
  bodyMass: string, 
  height: string, 
  limitations: string, 
  sex: string, 
  gain: string
  ) => {
    setupURLPolyfill();
    try {
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        temperature: 0.1,
        max_tokens: 700,
        messages: [
          {"role": "user", "content": `Please make for me one day diet with breakfast, lunch and dinner. I need this in JSON format. I need only one JSON object nothing else so you can't provide me any other content then this JSON. This JSON can be inside string. Info about me: mass-${bodyMass}, height-${height}, sex-${sex}, diet-${limitations} and I want to ${gain} weight. My parser can not parse an array of multiple objects.`}
        ]
      });
      if(response.data.choices[0].message?.content) {
        const dietObject = JSON.parse(response.data.choices[0].message?.content)
        setAiResponse(dietObject)
      }
    } catch (error) {
      console.log('error', error)
    }
}

function App(): JSX.Element {
  const [response, setResponse] = useState()
  const [bodyMass, setBodyMass] = useState<string>()
  const [height, setHeight] = useState<string>()
  const [dietType, setDietType] = useState<string>()
  const [gain, setGain] = useState<string>()
  const [sex, setSex] = useState<string>()

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.inputsContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.text}>
              Body mass in kg
            </Text>
            <TextInput
              style={styles.input}
              onChangeText={setBodyMass}
              value={bodyMass}
              placeholder="Body Mass"
              keyboardType='numeric'
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.text}>
              Height in cm
            </Text>
            <TextInput
              style={styles.input}
              onChangeText={setHeight}
              value={height}
              placeholder="Height"
              keyboardType='numeric'
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.text}>
              Sex
            </Text>
            <TextInput
              style={styles.input}
              onChangeText={setSex}
              value={sex}
              placeholder="Sex"
              keyboardType='default'
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.text}>
              Gain
            </Text>
            <TextInput
              style={styles.input}
              onChangeText={setGain}
              value={gain}
              placeholder="gain"
              keyboardType='default'
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.text}>
              Diet types
            </Text>
            <TextInput
              style={styles.input}
              onChangeText={setDietType}
              value={dietType}
              placeholder="Diet type"
              keyboardType='default'
            />
          </View>
        </View>
        <DietComponent data={response} />
        </ScrollView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => {
              createCompletionBMI(setResponse, bodyMass, height, dietType)
            }}
            style={styles.button}>
              <Text style={styles.buttonText}>SEND REQUEST BMI</Text>
          </TouchableOpacity>
          <TouchableOpacity
              onPress={() => {
                createCompletionDiet(setResponse, bodyMass, height, dietType, sex, gain)
              }}
              style={styles.button}>
                <Text style={styles.buttonText}>SEND REQUEST TOMMOROW DIET</Text>
          </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },
  input: {
    fontSize: 20
  },
  inputContainer: {
    paddingHorizontal: 32,
  },
  text: {
    fontSize: 20
  },
  inputsContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  response: {
    fontSize: 16,
    color: 'black'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: 'lightyellow',
    borderRadius: 32,
    margin: 8
  },
  buttonText: {
    fontSize: 32,
    paddingHorizontal: 64,
    paddingVertical: 16,
  },
});

export default App;
