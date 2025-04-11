import { useLocalSearchParams, usePathname, router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { View, Text, Image, TextInput, TouchableOpacity, Modal, SafeAreaView, ScrollView } from 'react-native'
import { useDebouncedCallback } from "use-debounce"

import icons from '@/constants/icons'
import { categories } from '@/constants/data'
import images from '@/constants/images'
import CounterFilter from './CounterFilter'
import Slider from './Slider'
import SliderFilter from './Slider'

const Search = () => {
    const path = usePathname();

    const DEFAULT_FILTERS = {
        query: '',
        filter: 'All',
        rooms: '1',
        bathrooms: '1',
        minSurface: '40',
        maxSurface: '3500',
        minPrice: '0',
        maxPrice: '8000'
      };

    const params = useLocalSearchParams<{
        query?: string;
        filter?: string;
        rooms?: string;
        bathrooms?: string;
        minSurface?: string;
        maxSurface?: string;
        minPrice?: string;
        maxPrice?: string;
    }>();
    const [search, setSearch] = useState(params.query) || ''; 


    const [selectedCategory, setSelectedCategory] = useState(params.filter || 'All');

    const updateParams = (newParams: Record<string, string>) => {
        router.setParams({
            ...params,
            ...newParams
        });
    };


    const [filters, setFilters] = useState({
        rooms: 1,
        bathrooms: 1,
        params,
        surfaceRange: [40, 3500] as [number, number],
        priceRange: [0, 8000] as [number, number]
      });


    const handleCategoryPress = (category: string) => {
        if(selectedCategory === category){
            setSelectedCategory('All');

            router.setParams({filter:'All'})  
            return;          
        }
        setSelectedCategory(category);
        router.setParams({filter: category})
    }

    const debouncedSearch = useDebouncedCallback((text: string) => updateParams({ query : text }), 500)

    const handleSearch = (text: string) => {
        setSearch(text);
        debouncedSearch(text )
    }

    const handleReset = () => {
       
          setSearch('');
          setSelectedCategory('All');

        
          // Réinitialisation des params
          router.setParams({
            query: '',
            filter: 'All', // <-- Ajout spécifique pour la catégorie
            rooms: '1',
            bathrooms: '1',
            minSurface: '40',
            maxSurface: '3500',
            minPrice: '0',
            maxPrice: '8000'
          });
    }
      

    const [modalVisible, setModalVisible] = useState(false);

    const handleFilterPress = () => {
        console.log(params)
        updateParams({
            rooms: filters.rooms.toString(),
            bathrooms: filters.bathrooms.toString(),
            minSurface: filters.surfaceRange[0].toString(),
            maxSurface: filters.surfaceRange[1].toString(),
            minPrice: filters.priceRange[0].toString(),
            maxPrice: filters.priceRange[1].toString()
        });
        setModalVisible(false);
    };

    const updateFilter = <K extends keyof typeof filters>(
        key: K, 
        value: typeof filters[K]
    ) => {
        setFilters(prev => {
            const newFilters = { ...prev, [key]: value };
            // Mise à jour immédiate pour certains filtres
            if (key === 'rooms' || key === 'bathrooms') {
                router.setParams({ 
                    ...params,
                    [key]: value.toString() 
                });
            }
            return newFilters;
        });
    };
        

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
                <ScrollView className='pb-20'>
                <View className="px-10">
                    <View className="flex flex-row items-center justify-between mt-5">
                        <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}
                        className="flex flex-row bg-primary-200 rounded-full size-11 items-center justify-center">
                            <Image source={icons.backArrow} className='size-5' />
                        </TouchableOpacity>
                        <Text className="text-base mr-2 text-center font-rubik-medium text-balck-300">Filter</Text>
        
                        <TouchableOpacity onPress={()=> handleReset}>
                            <Text className="text-base font-rubik-bold text-primary-300" 
                            >Reset</Text>
                        </TouchableOpacity>
                    </View>
                    <View className="mt-5 flex-1">
                        <Text className="text-xl font-rubik-bold text-black-300">Price Range</Text>
                        <View className="relative h-40 w-full mt-4"> 
                        <Image 
                            source={images.barChart} 
                            className="absolute w-full top-0  bottom-0 px-2 " 
                            resizeMode='contain'
                        />
                        
                        <View className="absolute top-11 w-full left-1">
                            <SliderFilter
                                label="Price Range"
                                initialValues={filters.priceRange}
                                minValue={0}
                                maxValue={10000}
                                step={100}
                                unit="$"
                                onValuesChange={(range) => updateFilter('priceRange', range)}
                            />
                        </View>
                    </View>
    
                    </View>
                    <View className="mt-2">
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
                    <View className="mt-5">
                        <Text className="text-xl font-rubik-bold text-black-300">Home Details</Text>
                        <CounterFilter   label="Bedrooms" 
                        initialValue={filters.rooms} 
                        minValue={0}
                        onChange={(rooms) => setFilters({...filters, rooms})} 
                        />
                        <CounterFilter   label="Bathrooms" 
                        initialValue={filters.rooms} 
                        minValue={1}
                        onChange={(rooms) => setFilters({...filters, rooms})} 
                        />

                        <View className="mt-10 mb-20 pb-10">
                            <Text className="text-xl font-rubik-bold text-black-300">Building Size</Text>
                            <View>
                                <SliderFilter
                                label='Surface'
                                initialValues={filters.surfaceRange}
                                minValue={42}
                                maxValue={3500}
                                step={10}
                                unit="sqft"
                                onValuesChange={(range) => updateFilter('surfaceRange', range)}
                                 />
                            </View>
                            
                        </View>
                    
                            
                    </View>
                </View>
            </ScrollView>
            <View className="absolute bg-white bottom-0 w-full rounded-t-2xl border-t border-r border-l border-primary-200 p-5 mt-20">
                <View className="flex flex-row items-center justify-between gap-10">
                    
                    <TouchableOpacity className="flex-1 flex flex-row items-center justify-center bg-primary-300 py-3
                     rounded-full shadow-md shadow-zinc-400"
                     onPress={()=>handleFilterPress()}
                    >
                    <Text className="text-white text-lg text-center font-rubik-bold">
                        Set Filter
                    </Text>
                    </TouchableOpacity>
                </View>
            </View>
        
            </Modal>
            <TouchableOpacity onPress={() =>setModalVisible(true)}>
                <Image source={icons.filter} className="size-5"/>
            </TouchableOpacity>

        </View>
    )
}

export default Search
