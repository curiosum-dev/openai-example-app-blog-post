import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  object: {
    backgroundColor: 'lightblue',
    padding: 4,
    marginBottom: 4,
    borderRadious: 8,
  },
  array: {
    backgroundColor: 'lightgrey',
    padding: 4,
    borderRadious: 8,
    marginBottom: 4,
  },
  text: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  innerText: {
    fontSize: 12,
  },
  upperText: {
    fontSize: 14,
  }
});

const DietComponent = ({ data }: any) => {
  const renderData = (data: any) => {
    if (Array.isArray(data)) {
      return (
        <View style={styles.array}>
          {data.map((item, index) => (
            <Text style={styles.innerText} key={index}>{item}</Text>
          ))}
        </View>
      );
    } else if (typeof data === 'object') {
      return (
        <View style={styles.object}>
          {Object.entries(data).map(([key, value]) => (
            <View key={key}>
              <Text style={styles.text}>{key}: </Text>
              {renderData(value)}
            </View>
          ))}
        </View>
      );
    } else {
      return <Text style={styles.upperText}>{data}</Text>;
    }
  };

  return <View>{renderData(data)}</View>;
};

export default DietComponent;