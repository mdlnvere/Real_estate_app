import { Link, router, useLocalSearchParams } from "expo-router";
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


export default function explore() {

  const params = useLocalSearchParams<{ query?: string; filter?:string;}>();



  const {data: properties, loading, refetch} = useAppwrite({
    fn : getPropoerties,
    params: {
      filter: params.filter!,
      query: params.query!,
      limit: 20
    },
    skip: true,
  })

  useEffect(() => {
    refetch({
      filter: params.filter!,
      query: params.query!,
      limit: 20
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
          <ActivityIndicator size="large" className="text=primary-300 mt-5" />
        ) : <NoResults />
      }
      ListHeaderComponent={
       <View className="px-5">
            <View className="flex flex-row items-center justify-between mt-5">
                <TouchableOpacity onPress={() => router.back()} 
                className="flex flex-row bg-primary-200 rounded-full size-11 items-center justify-center">
                    <Image source={icons.backArrow} className='size-5' />
                </TouchableOpacity>
                <Text className="text-base mr-2 text-center font-rubik-medium text-balck-300">Search for your Ideal Home</Text>
                <Image source={icons.bell} className="h-6 w-6"/>          
            </View>
            <Search />
            <View className="mt-5">
                <Filters />

                <Text className="text-xl font-rubik-bold text-black-300 mt-5">Found {properties?.length} Properties</Text>
            </View>
       </View>
      }
      />
     
      
    </SafeAreaView>
  );
}
