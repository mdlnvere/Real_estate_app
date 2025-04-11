import icons from '@/constants/icons';
import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'

const CounterFilter = ( {label, initialValue, minValue, onChange }: {label : string; initialValue: number; minValue: number; onChange: (value: number)=> void}) => {

    const [value, setValue] = useState(initialValue);

    const handleIncrement = () => {
        const newValue = value + 1;
        setValue(newValue);
        onChange?.(newValue);
      };
    
      const handleDecrement = () => {
        const newValue = Math.max(minValue, value - 1);
        setValue(newValue);
        onChange?.(newValue);
      };
    

    return (
        <View className='mt-5 flex flex-row items-center justify-between'>
                            <Text className='font-rubik-bold text-base text-gray-500 '>{label}</Text>
                            <View className='flex flex-row items-center gap-4'>
                                <TouchableOpacity className='rounded-full' 
                                onPress={handleDecrement} 
                                disabled={value <= minValue}>
                                    <Image source={icons.minus} className="size-5"  />
                                </TouchableOpacity>
                                <Text>{value}</Text>
                                <TouchableOpacity 
                                onPress={handleIncrement} 
                                >
                                    <Image  source={icons.plus} className="size-5" />
                                </TouchableOpacity>
                            
                            </View>
                        </View>
    )
}

export default CounterFilter
