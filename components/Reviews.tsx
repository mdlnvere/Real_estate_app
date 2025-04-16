import icons from '@/constants/icons';
import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { Models } from 'react-native-appwrite';

interface Reviews {
    item: Models.Document;
    
}


const Reviews = ({item} : Reviews) => {

    const getDaysSince = (dateString: string | Date) => {
        const creationDate = new Date(dateString);
        const utcCreation = Date.UTC(
            creationDate.getFullYear(),
            creationDate.getMonth(),
            creationDate.getDate()
        );
        
        const now = new Date();
        const utcNow = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  
        return Math.floor((utcNow - utcCreation) / (1000 * 60 * 60 * 24));
      };
      const daysAgo = getDaysSince(item.$createdAt);
   
    
    return (
        <View className='mt-5'>
            <View className="flex flex-row gap-3 mb-3 ">
              <Image
                source={{ uri: item.avatar }}
                className=" rounded-full size-14"
              />
             <View>
                <Text className="text-2xl font-rubik-bold mt-2">{item.name}</Text>
                <View className='flex flex-row  gap-1' >
                    <Text >{item.rating} / 5</Text>
                    <Image source={icons.star} className='size-4' />
                    
                </View>
             </View>
              
            </View>
            <Text>
                {item.review}
            </Text>
            <View className='flex flex-row justify-between mt-5'>
                <View className='flex flex-row items-center'>
                    <Image source={icons.heart} className="size-5"   tintColor={"#0061FF"} />
                    <Text className="text-black-300 text-sm font-rubik-medium ml-2">
                       120
                    </Text>
                </View>
                <Text className='text-base font-rubik-light '>
                    {daysAgo === 0 ? "Today" : ` ${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`}
                </Text> 
            </View>
            
        </View>
      
            
        
    )
    
}

export default Reviews

