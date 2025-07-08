import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';

const profileImages = [
  require('../../assets/profile_img/img_1.webp'),
  require('../../assets/profile_img/img_2.webp'),
  require('../../assets/profile_img/img_3.webp'),
  require('../../assets/profile_img/img_4.webp'),
  require('../../assets/profile_img/img_5.webp'),
  require('../../assets/profile_img/img_6.webp'),
  require('../../assets/profile_img/img_7.webp'),
  require('../../assets/profile_img/img_8.webp'),
  require('../../assets/profile_img/img_9.webp'),
];

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (username: string, myGoal: string, profileImage: string) => void;
  initialUsername: string;
  initialMyGoal: string;
  initialProfileImage?: string;
  modalHeight?: number;
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  visible,
  onClose,
  onSave,
  initialUsername,
  initialMyGoal,
  initialProfileImage,
  modalHeight,
}) => {
  const [username, setUsername] = useState(initialUsername);
  const [myGoal, setMyGoal] = useState(initialMyGoal);
  const [selectedImage, setSelectedImage] = useState(initialProfileImage);

  useEffect(() => {
    setUsername(initialUsername);
    setMyGoal(initialMyGoal);
    setSelectedImage(initialProfileImage);
  }, [visible, initialUsername, initialMyGoal, initialProfileImage]);

  const handleSave = () => {
    if (selectedImage) {
      onSave(username, myGoal, selectedImage);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={[styles.modalView, modalHeight ? { height: modalHeight } : {}]}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <Text style={styles.modalText}>프로필 수정</Text>

            <Text style={styles.label}>프로필 이미지</Text>
          <View style={styles.imageGridContainer}>
            {profileImages.map((img, index) => {
              const imgPath = `../../assets/profile_img/img_${index + 1}.webp`;
              return (
                <TouchableOpacity key={index} onPress={() => setSelectedImage(imgPath)}>
                  <Image
                    source={img}
                    style={[
                      styles.profileImage,
                      selectedImage === imgPath && styles.selectedImage,
                    ]}
                  />
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.label}>이름</Text>
          <TextInput
            style={styles.input}
            onChangeText={setUsername}
            value={username}
            placeholder="이름을 입력하세요"
          />

          <Text style={styles.label}>나의 다짐</Text>
          <TextInput
            style={styles.input}
            onChangeText={setMyGoal}
            value={myGoal}
            placeholder="다짐을 입력하세요"
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={onClose}
            >
              <Text style={styles.textStyleClose}>닫기</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonSave]}
              onPress={handleSave}
            >
              <Text style={styles.textStyleSave}>완료</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
  },
  scrollViewContent: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  imageGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 40,
    margin: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedImage: {
    borderColor: '#8285FB',
  },
  input: {
    height: 40,
    width: 250,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    flex: 1,
    marginTop: 15,
  },
  buttonSave: {
    backgroundColor: '#8285FB',
  },
  buttonClose: {
    backgroundColor: '#d9d9d9',
  },
  textStyleSave: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
  },
  textStyleClose: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
    color: 'black',
  }
});

export default ProfileModal;
