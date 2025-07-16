// components/camera/CameraComponent.tsx
import { Ionicons } from '@expo/vector-icons';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import React, { useRef, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CameraComponentProps {
    onPhotoTaken: (uri: string) => void;
    onClose: () => void;
}

export default function CameraComponent({ onPhotoTaken, onClose }: CameraComponentProps) {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
                <TouchableOpacity onPress={requestPermission} style={styles.button}>
                    <Text>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePictureAsync();
                if (photo?.uri) {
                    onPhotoTaken(photo.uri);
                }
            } catch (error) {
                Alert.alert('Error', 'Failed to take picture');
                console.error('Camera error:', error);
            }
        }
    };

    return (
        <View style={styles.container}>
            <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Ionicons name="close" size={30} color="white" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                        <View style={styles.captureButtonInner} />
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
                        <Ionicons name="camera-reverse" size={30} color="white" />
                    </TouchableOpacity>
                </View>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 10,
        margin: 10,
    },
    closeButton: {
        alignSelf: 'flex-end',
        padding: 10,
    },
    captureButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'white',
    },
    captureButtonInner: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'white',
    },
    flipButton: {
        alignSelf: 'flex-end',
        padding: 10,
    },
});