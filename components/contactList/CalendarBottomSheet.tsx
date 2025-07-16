import BottomSheet from '@gorhom/bottom-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useMemo, useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
    handleSelect: (date: Date) => void;
    sheetRef: any;
};

const CalendarBottomSheet = ({ handleSelect, sheetRef }: Props) => {

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    
    const snapPoints = useMemo(() => ['1%', '50%'], []);
    
    const onDateChange = async (event: any, date?: Date) => {
        setShowDatePicker(Platform.OS === 'ios'); // On Android, picker closes automatically
      
        if (date) {
            setSelectedDate(date);
            handleSelect(date);
            sheetRef.current?.close();
        }
      };

    const goBack = () => {
        sheetRef.current?.close();
    }

    return (
        <BottomSheet ref={sheetRef} index={-1} snapPoints={snapPoints}>
            <View style={styles.container}>
                <DateTimePicker
                value={selectedDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={onDateChange}
                />
                <TouchableOpacity onPress={goBack}>
                    <Text style={styles.backButton}>Back</Text>
                </TouchableOpacity>
            </View>
            
        </BottomSheet>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    backButton: {
        fontSize: 20,
        color: 'white',
        backgroundColor: '#f74036',
        paddingVertical: 6,
        paddingHorizontal: 20,
        borderRadius: 20,
    }
})

export default CalendarBottomSheet;