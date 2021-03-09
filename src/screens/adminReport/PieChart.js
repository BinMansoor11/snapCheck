import React from 'react';
import { PieChart } from 'react-native-svg-charts';
import {
  ScreenSize,
  Pic,
  FontSize,
  FontColor,
  Fonts,
} from '../../components/theme';
import { View, Text, StyleSheet } from 'react-native';

export default function PieChartExample() {
  const data = [10, 10, 10, 70];

  const totalData = data.reduce((a, b) => a + b);

  const options = [
    {
      title: 'Present',
      color: '#C8E6C9',
      percent: Math.abs((data[3] / totalData) * 100).toFixed(0),
    },
    {
      title: 'Absent',
      color: '#ffcdd2',
      percent: Math.abs((data[2] / totalData) * 100).toFixed(0),
    },
    {
      title: 'Late Comers',
      color: '#2196f3',
      percent: Math.abs((data[1] / totalData) * 100).toFixed(0),
    },
    {
      title: 'Early Leavers',
      color: '#03bbd6',
      percent: Math.abs((data[0] / totalData) * 100).toFixed(0),
    },
  ];

  const pieData = data
    .filter((value) => value > 0)
    .map((value, index) => ({
      value,
      svg: {
        fill:
          index == 0
            ? '#03bbd6'
            : index == 1
            ? '#2196f3'
            : index == 2
            ? '#ffcdd2'
            : '#C8E6C9',
        onPress: () => console.log('press', index),
      },
      key: `pie-${index}`,
    }));

  return (
    <PieChart
      innerRadius="5%"
      outerRadius="100%"
      animate={true}
      animationDuration={300}
      style={{
        height: ScreenSize.hp2,
        marginVertical: '5%',
        marginLeft: '-20%',
        // backgroundColor: 'red',
      }}
      data={pieData}
      // onPress={() => alert('dfd')}
    >
      <View
        style={{
          alignItems: 'flex-end',
        }}>
        <View style={styles.optMain}>
          {options.map((v, i) => {
            return (
              <View style={styles.optView}>
                <View
                  style={[
                    styles.colorView,
                    { backgroundColor: v.color },
                  ]}></View>
                <Text
                  style={{
                    fontSize: FontSize.font17,
                    fontFamily: Fonts.Regular,
                    marginVertical: '1%',
                    paddingTop: '1%',
                  }}>
                  {v.title + ' ' + `( ${v.percent}% )`}
                </Text>
              </View>
            );
          })}
        </View>

        {/* <View>
          <Text>d</Text>
          <Text>d</Text>
        </View>
        <View>
          <Text>d</Text>
          <Text>d</Text>
        </View> */}
      </View>
    </PieChart>
  );
}

const styles = StyleSheet.create({
  optMain: {
    height: '100%',
    justifyContent: 'center',
    // alignItems:'center'
  },
  optView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: '5%',
  },
  colorView: { height: 15, width: 15, borderRadius: 15, marginRight: '2%' },
});
