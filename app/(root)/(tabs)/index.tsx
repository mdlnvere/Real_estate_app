import { Link, Redirect, router, useLocalSearchParams } from "expo-router";
import { SafeAreaView, Text, View, Image, TouchableOpacity, FlatList, Button, ActivityIndicator } from "react-native";

import images from '@/constants/images'
import icons from '@/constants/icons'
import Search from "@/components/search";
import { Card, FeaturedCard } from "@/components/Cards";
import Filters from "@/components/Filters";
import { useGlobalContext } from "@/lib/global-provider";
import seed from "@/lib/seed";
import { useAppwrite } from "@/lib/useAppwrite";
import { getLatestProperties, getPropoerties } from "@/lib/appwrite";
import { useEffect } from "react";
import NoResults from "@/components/NoResults";


export default function Index() {
  const {user} = useGlobalContext();

  const params = useLocalSearchParams<{
    query?: string;
    filter?: string;
    rooms?: string;
    bathrooms?: string;
    minSurface?: string;
    maxSurface?: string;
    minPrice?: string;
    maxPrice?: string;}>();

  const { data: latestProperties, loading: latestPropertiesLoading } = useAppwrite({
    fn : getLatestProperties
  })

  const {data: properties, loading, refetch} = useAppwrite({
    fn : getPropoerties,
    params: {
      filter: params.filter!,
      query: params.query!,
      room: parseInt(params.rooms!),
      bathroom: parseInt(params.bathrooms!),
      surfaceMin: parseInt(params.minSurface!),
      surfaceMax: parseInt(params.maxSurface!),
      priceMin: parseInt(params.minPrice!),
      priceMax: parseInt(params.maxPrice!),
      limit: 6
    },
    skip: true,
  })

  useEffect(() => {
    refetch({
      filter: params.filter!,
      query: params.query!,
      room: parseInt(params.rooms!),
      bathroom: parseInt(params.bathrooms!),
      surfaceMin: parseInt(params.minSurface!),
      surfaceMax: parseInt(params.maxSurface!),
      priceMin: parseInt(params.minPrice!),
      priceMax: parseInt(params.maxPrice!),
      limit: 6
    })
  }, [params.filter, params.query] )

  const handleCardPress = (id: string) => router.push(`/properties/${id}`)


  return (
    <SafeAreaView className="bg-white h-full">
      <FlatList 
      data={properties} 
      renderItem={({item}) =>  <Card item={item} onPress={() =>handleCardPress(item.$id)} /> } 
      keyExtractor={(item)=>item.$id}
      numColumns={2}
      contentContainerClassName="pb-32"
      columnWrapperClassName="flex  px-5"
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        loading ? (
          <ActivityIndicator size="large" className="text-primary-300 mt-5" />
        ) : <NoResults />
      }
      ListHeaderComponent={
        <View className="px-5">
        <View className="flex flex-row items-center justify-between mt-5">
            <View className="flex flex-row items-center">
              <Image source={{uri: user?.avatar}} className="size-12 rounded-full" />
              <View className="flex flex-col items-start ml-2 justify-center">
                <Text className="text-xs font-rubik text-black-100"> Good morning</Text>
                <Text className="text-base font-rubik-medium text-black-300">{user?.name}</Text>
              </View>
            </View>
            <Image source={icons.bell} className='size-6' />
            
        </View>
        <Search />
        <View className="my-5">
          <View className="flex flex-row items-center justify-between">
            <Text className="text-xl font-rubik-bold text-black-300">Featured</Text>
            <TouchableOpacity>
              <Text className="text-base font-rubik-bold text-primary-300" >See all</Text>
            </TouchableOpacity>
          </View>
          {latestPropertiesLoading ? 
            <ActivityIndicator size='large' className="text-primary-300" />
           : !latestProperties || latestProperties.length === 0 ? <NoResults /> : (

            <FlatList data={latestProperties} renderItem={({item}) => <FeaturedCard item={item} onPress={() =>handleCardPress(item.$id)}  />}
            keyExtractor={(item) => item.$id}
            horizontal bounces={false}
  
            showsHorizontalScrollIndicator={false}
            contentContainerClassName='flex gap-5 mt-5'
            />

           )   }
         
        </View>

        <View className="my-5">
          <View className="flex flex-row items-center justify-between">
            <Text className="text-xl font-rubik-bold text-black-300">Our recommandation</Text>
            <TouchableOpacity>
              <Text className="text-base font-rubik-bold text-primary-300" >See all</Text>
            </TouchableOpacity>
          </View>
          

        </View>
    
        
        <Filters filter={params.filter? params.filter : 'All'}/>



      </View>
      }
      />
     
      
    </SafeAreaView>
  );
}
