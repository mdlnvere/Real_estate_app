import { useLocalSearchParams, usePathname, router } from 'expo-router'
import React, { useState } from 'react'
import { View, Text, Image, TextInput, TouchableOpacity, Modal, SafeAreaView, ScrollView } from 'react-native'
import { useDebouncedCallback } from "use-debounce"

import icons from '@/constants/icons'
import { categories } from '@/constants/data'
import images from '@/constants/images'

const Search = () => {
    const path = usePathname();

    const params = useLocalSearchParams<{ query?: string }>();
    const [search, setSearch] = useState(params.query); 

    const paramsFilter = useLocalSearchParams<{filter?: string}>();
    const [selectedCategory, setSelectedCategory] = useState(paramsFilter.filter || 'All');

    const handleCategoryPress = (category: string) => {
        if(selectedCategory === category){
            setSelectedCategory('All');

            router.setParams({filter:'All'})  
            return;          
        }
        setSelectedCategory(category);
        router.setParams({filter: category})
    }


    const debouncedSearch = useDebouncedCallback((text: string) => router.setParams({ query : text }), 500)

    const handleSearch = (text: string) => {
        setSearch(text);
        debouncedSearch(text )
    }

    const [modalVisible, setModalVisible] = useState(false);
    const handleFilterPress = () => {
        setModalVisible(!modalVisible);
    }

        

    return (
        <View className='flex flex-row items-center justify-between w-full px-4 rounded-lg bg-accent-100 border border-primary-100 mt-5 py-2'>
            <View className='flex-1 flex flex-row items-center justify-start z-50'>
                <Image source={icons.search} className='size-5' />
                <TextInput 
                    value={search}
                    onChangeText={handleSearch}
                    placeholder="Search for anything"
                    className="text-sm font-rubik text-black-300 ml-2 flex-1"
                />

            </View>
            
                <Modal
            animationType="slide"
            transparent={false}
            visible={modalVisible}
            presentationStyle='pageSheet'
            >
                <ScrollView className=''>
                <View className="px-5">
                    <View className="flex flex-row items-center justify-between mt-5">
                        <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}
                        className="flex flex-row bg-primary-200 rounded-full size-11 items-center justify-center">
                            <Image source={icons.backArrow} className='size-5' />
                        </TouchableOpacity>
                        <Text className="text-base mr-2 text-center font-rubik-medium text-balck-300">Filter</Text>
        
                        <TouchableOpacity>
                            <Text className="text-base font-rubik-bold text-primary-300">Reset</Text>
                        </TouchableOpacity>
                    </View>
                    <Search />
                    <View className="mt-5">
                    <Text className="text-xl font-rubik-bold text-black-300">Price Range</Text>
                    <Image source={images.barChart}/>
                    </View>
                    <View className="mt-10">
                        <Text className="text-xl font-rubik-bold text-black-300">Property Type</Text>
                            <View className='flex flex-row flex-wrap items-center mt-2 '>
                                        {categories.map((item, index) => (
                                    <TouchableOpacity key={index} onPress={()=> handleCategoryPress(item.category)} 
                                    className={` items-start mr-2 px-4 py-2 mt-4
                                    rounded-full ${selectedCategory == item.category ? 'bg-primary-300' : 'bg-primary-100 border border-primary-200'}`}>
                                        <Text className={`text-small ${selectedCategory == item.category ? 'text-white font-rubik-bold mt-0.5' : 'text-black-300 font-rubik'}`}>{item.title}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                    </View>
                    <View className="mt-10">
                        <Text className="text-xl font-rubik-bold text-black-300">Home Details</Text>
                        <View className='mt-7 flex flex-row items-center justify-between'>
                            <Text className='font-rubik-bold text-base text-gray-500 '>Bedrooms</Text>
                            <View className='flex flex-row items-center gap-4'>
                                <TouchableOpacity className='rounded-full' >
                                    <Image source={icons.minus} className="size-5"  />
                                </TouchableOpacity>
                                <Text>1</Text>
                                <TouchableOpacity>
                                    <Image  source={icons.plus} className="size-5" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View className='mt-10 flex flex-row items-center justify-between'>
                            <Text className='font-rubik-bold text-base text-gray-500 '>Bathrooms</Text>
                            <View className='flex flex-row items-center gap-4'>
                                <TouchableOpacity className='rounded-full' >
                                    <Image source={icons.minus} className="size-5"  />
                                </TouchableOpacity>
                                <Text>1</Text>
                                <TouchableOpacity>
                                    <Image  source={icons.plus} className="size-5" />
                                </TouchableOpacity>
                            
                            </View>
                        </View>
                        <View className="mt-10 mb-20">
                            <Text className="text-xl font-rubik-bold text-black-300">Building Size</Text>
                            <View>
                                <Image className='m-10 w-80' source={images.underline} />
                            </View>
                            
                        </View>
                    
                            
                    </View>
                </View>
            </ScrollView>
            <View className="absolute bg-white bottom-0 w-full rounded-t-2xl border-t border-r border-l border-primary-200 p-7 mt-15">
                <View className="flex flex-row items-center justify-between gap-10">
                    
                    <TouchableOpacity className="flex-1 flex flex-row items-center justify-center bg-primary-300 py-3 rounded-full shadow-md shadow-zinc-400"
                    >
                    <Text className="text-white text-lg text-center font-rubik-bold">
                        Set Filter
                    </Text>
                    </TouchableOpacity>
                </View>
            </View>
        
            </Modal>
            <TouchableOpacity onPress={() =>handleFilterPress()}>
                <Image source={icons.filter} className="size-5"/>
            </TouchableOpacity>

        </View>
    )
}

export default Search
