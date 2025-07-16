
import BottomSheet from '@gorhom/bottom-sheet';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
    onSelectFilter: (filterKey: string) => void;
    sheetRef: any;
};

const FiltersBottomSheet = ({ onSelectFilter, sheetRef }: Props) => {
    const snapPoints = useMemo(() => ['10%', '50%'], []);

    const handleSelect = (key: string) => {
        onSelectFilter(key);
        sheetRef.current?.close();
    };

    return (
        <BottomSheet ref={sheetRef} index={-1} snapPoints={snapPoints}>
          <View style={styles.container}>
            <Text style={styles.title}>Select a Filter</Text>

            <View style={styles.filterGrid}>
              <TouchableOpacity style={styles.filterButton} onPress={() => handleSelect('lastContactFirst')}>
                <Text style={styles.option}>Least Recent</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterButton} onPress={() => handleSelect('recentContactFirst')}>
                <Text style={styles.option}>Most Recent</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterButton} onPress={() => handleSelect('leastContactedFirst')}>
                <Text style={styles.option}>Least Contacted</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterButton} onPress={() => handleSelect('mostContactedFirst')}>
                <Text style={styles.option}>Most Contacted</Text>
              </TouchableOpacity>
            </View>

      </View>
    </BottomSheet>
    );
};

const styles = StyleSheet.create({
    container: {
      padding: 24,
    },
    title: {
      fontSize: 18,
      marginBottom: 12,
      fontWeight: 'bold',
    },
    option: {
      fontSize: 16,
      paddingVertical: 8,
    },
    filterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2, // Optional spacing (React Native 0.71+), or use margin
  },
  filterButton: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 24,
    paddingVertical: 2,
    paddingHorizontal: 12,
    margin: 4, // fallback if 'gap' not supported
  }
  });

  export default FiltersBottomSheet;