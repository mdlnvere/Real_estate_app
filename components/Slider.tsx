import React, { useState } from 'react'
import { View, Text, Dimensions } from 'react-native'
import MultiSlider from '@ptomasroos/react-native-multi-slider';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SLIDER_WIDTH = SCREEN_WIDTH - 80; // 32 = padding horizontal (16*2)


const SliderFilter = ({label,initialValues, minValue, maxValue, step, unit, onValuesChange}: 
    {label : string;
    initialValues: [number, number]; 
    minValue: number; 
    maxValue: number;
    step?: number;
    unit: string;
    onValuesChange?: (values: [number, number]) => void}) => {

        const [values, setValues] = useState<[number, number]>(initialValues);

        const handleValuesChange = (newValues: number[]) => {
          const formattedValues = [newValues[0], newValues[1]] as [number, number];
          setValues(formattedValues);
          onValuesChange?.(formattedValues);
        };
         // Calcul des positions en pourcentage
  const minPosition = ((values[0] - minValue) / (maxValue - minValue)) * 100;
  const maxPosition = ((values[1] - minValue) / (maxValue - minValue)) * 100;
      


    return (
        <View className=" items-center  mb-8 mt-5">

      {/* Conteneur principal */}
      <View className="w-full" style={{ height: 60 }}>
        {/* Slider */}
        <MultiSlider
          values={[values[0], values[1]]}
          sliderLength={SLIDER_WIDTH}
          onValuesChange={handleValuesChange}
          min={minValue}
          max={maxValue}
          step={step}
          allowOverlap={false}
          minMarkerOverlapDistance={10}
          customMarker={() => (
            <View className="w-8 h-8 rounded-full bg-white border-2 border-primary-300 shadow-sm shadow-black/20" />
          )}
          selectedStyle={{
            backgroundColor: '#0061FF',
            height: 4,
          }}
          trackStyle={{
            backgroundColor: '#d1d5db',
            height: 4,
            borderRadius: 2,
          }}
        />

        {/* Labels sous les poignées */}
        <View className="absolute top-12 w-full flex-row justify-between">
          <View 
            style={{ 
              left: `${minPosition}%`,
              transform: [{ translateX: -((minPosition / 100) * 70) }] // Compensation pour centrage
            }}
            className="absolute"
          >
            <Text className="text-xs font-medium text-blue-500 bg-white px-1 rounded">
              {values[0]} {unit}
            </Text>
          </View>

          <View 
            style={{ 
              left: `${maxPosition}%`,
              transform: [{ translateX: 12 - ((maxPosition / 100) * 40) }] // Compensation différente pour le max
            }}
            className="absolute"
          >
            <Text className="text-xs font-medium text-blue-500 bg-white px-1 rounded">
              {values[1]} {unit}
            </Text>
          </View>
        </View>
      </View>

    </View>
    )
}

export default SliderFilter
