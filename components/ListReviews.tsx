import Filters from '@/components/Filters';
import Search from '@/components/search';
import icons from '@/constants/icons';
import { getReviewsByPropertyId } from '@/lib/appwrite';
import { useAppwrite } from '@/lib/useAppwrite';
import { router } from 'expo-router';
import React from 'react'
import { View , Text, FlatList, SafeAreaView, TouchableOpacity, Image} from 'react-native'
import Reviews from './Reviews';

const ListReviews = ({id}: {id: string}) => {    

    const { data: reviews } = useAppwrite({
        fn: getReviewsByPropertyId,
        params: {
            id: id,
          }
      });
   


    return (

      <SafeAreaView className="bg-white h-full m-5">
         <FlatList 
        data={reviews} 
        renderItem={({item}) =>  <View className='mb-2'>
          <Reviews item={item}  />
          </View>} 
        keyExtractor={(item)=>item.$id}
        numColumns={1}
        contentContainerClassName="pb-32"
        showsVerticalScrollIndicator={false}
       
        ListHeaderComponent={
          <View className="px-5">
               <View className="flex flex-row items-center justify-between mt-5">
                   <TouchableOpacity onPress={() => router.back()} 
                   className="flex flex-row bg-primary-200 rounded-full size-11 items-center justify-center">
                       <Image source={icons.backArrow} className='size-5' />
                   </TouchableOpacity>
                   <Text className="text-base mr-2  text-center font-rubik-medium text-balck-300">See what the others thought</Text>
                   <Image source={icons.bell} className="h-6 w-6"/>          
               </View>

             
          </View>
         }

        />

      </SafeAreaView>
       
       
       
        

       
    )
}

export default ListReviews
