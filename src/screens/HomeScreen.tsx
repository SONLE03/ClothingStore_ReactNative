import React, { useState } from 'react';
import { FlatList, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useStore } from '../store/store';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme';
import HeaderBar from '../components/Headerbar';
import MaterialComunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { TextInput } from 'react-native';
import Spacing from '../consts/Spacing';
import ClothesCard from '../components/ClothesCard';

const getCategoriesFromData = (data: any) => {
  let temp: any = {};
  for (let i = 0; i < data.length; i++) {
    if (temp[data[i].name] == undefined) {
      temp[data[i].name] = 1;
    } else {
      temp[data[i].name]++;
    }
  }

  let categories = Object.keys(temp);
  categories.unshift('All');
  return categories;
};

const getClothesList = (category: string, data: any) => {
  if(category == 'All') {
    return data;
  } else {
    let clotheslist = data.filter((item: any) => item.name == category);
    return clotheslist;
  }
}

const HomeScreen = () => {

  const ClothesList = useStore((state: any) => state.ClothesList);
  //console.log("Clothes = ", ClothesList.length);
  const BeanList = useStore((state: any) => state.BeanList);
  const [categories, setCategories] = useState(
    getCategoriesFromData(ClothesList),
  );
  const [searchText, setSearchText] = useState('');
  const [categoryIndex, setCategoryIndex] = useState({
    index:0,
    category: categories[0],
  });
  const [sortedClothes, setSortedClothes] = useState(
    getClothesList(categoryIndex.category, ClothesList),
  );

  const tabBarHeight = useBottomTabBarHeight();

  //console.log('categories = ', categories);
  console.log('sorted clothes: ', sortedClothes);

  return (
    <View style={styles.ScreenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex}/>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.ScrollViewFlex}>
        {/*Header bar*/}
        <HeaderBar title={'Home Screen'} />
        <Text style={styles.ScreenSlogan}>Easy and quickly{'\n'}to buy fashion clothes you need here!</Text>

        {/*Search bar*/}

        <View style={styles.InputContainerComponent}>
          <TouchableOpacity  
          onPress={() => {}}>
            <MaterialComunityIcons
                  name="home-search"
                  size={25}
                  color={searchText.length > 0 ? COLORS.primaryOrangeHex : COLORS.primaryLightGreyHex}
                  style={styles.InputIcon}
                  />
          </TouchableOpacity>

          <TextInput placeholder='Find your clothes here...' 
            value={searchText}
            onChangeText={text => setSearchText(text)}
            placeholderTextColor={COLORS.primaryLightGreyHex}
            style={styles.TextInputContainer}

           />
        </View>

        {/* Category scroller */}

        <ScrollView horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.CategoryScrollViewStyle}
        >
          {categories.map((data, index) => (
            <View key={index.toString()} style={styles.CategoryScrollViewContainer} >
              <TouchableOpacity 
                style={styles.CategoryScrollViewItem}
                onPress={() => {
                setCategoryIndex({index: index, category: categories[index]});
                setSortedClothes(
                  [...getClothesList(categories[index], ClothesList),]
                )
              }}>
                <Text 
                  style={[
                    styles.TextCategory, 
                    categoryIndex.index == index 
                      ? {color:COLORS.primaryOrangeHex} 
                      : {},
                    ]}> 
                    {data} 
                </Text>

                {categoryIndex.index == index ? (
                  <View style={styles.ActiveCategory} />
                  ) : (
                    <></>
                  )}

              </TouchableOpacity>
            </View>
          ))}

        </ScrollView>

        {/* Clothes Flatlist */}

        <FlatList horizontal
          showsHorizontalScrollIndicator={false}
          data={sortedClothes}
          contentContainerStyle={[styles.FlatListContainer, {marginBottom: tabBarHeight},]}
          keyExtractor={item => item.id}
          renderItem={({item}) => {
            return <TouchableOpacity onPress={() => {}}>
              <ClothesCard 
                id={item.id}
                index={item.index}
                type={item.type}
                roasted={item.roasted}
                imagelink_square={item.imagelink_square}
                name={item.name}
                special_ingredient={item.special_ingredient}
                average_rating={item.average_rating}
                price={item.prices[2]}
                buttonPressHandler={() => {}}
              
              />
            </TouchableOpacity>
          }}
        />

      </ScrollView>
    </View>

  )
}

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.primaryBlackHex,
  },

  ScrollViewFlex: {
    flexGrow: 1,
  },

  ScreenSlogan: {
    fontSize: FONTSIZE.size_24,
    fontFamily: FONTFAMILY.poppins_semibold,
    color: COLORS.primaryWhiteHex,
    paddingLeft: SPACING.space_30,
  },

  TextInputContainer: {
    flex: 1,
    height: SPACING.space_20 * 3,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryWhiteHex,
  },

  InputContainerComponent: {
    flexDirection: 'row',
    margin: SPACING.space_30,
    borderRadius: BORDERRADIUS.radius_20,
    backgroundColor: COLORS.primaryDarkGreyHex,
    alignItems: 'center',
  },

  InputIcon: {
    marginHorizontal: SPACING.space_20,
  },

  CategoryScrollViewStyle: {
    paddingHorizontal: SPACING.space_20,
    marginBottom: SPACING.space_20,
  },

  ActiveCategory: {
    height: SPACING.space_10,
    width: SPACING.space_10,
    borderRadius: BORDERRADIUS.radius_10,
    backgroundColor: COLORS.primaryOrangeHex,

  },

  TextCategory: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryLightGreyHex,
    marginBottom: SPACING.space_4,
  },

  CategoryScrollViewContainer: {
    paddingHorizontal: SPACING.space_15,
  },

  CategoryScrollViewItem: {
    alignItems: 'center',
  },

  FlatListContainer: {
    gap: SPACING.space_20,
    paddingVertical: SPACING.space_20,
    paddingHorizontal: SPACING.space_30,

  },
})

export default HomeScreen;
